const uuid = require('uuid');
const Personalizer = require('@azure/cognitiveservices-personalizer');
const data = require('../shared/catalog-data');
const { getUser } = require('../shared/user-utils');
const CognitiveServicesCredentials = require('@azure/ms-rest-azure-js').CognitiveServicesCredentials;

//Read from environment variables
const dotenv = require('dotenv');
const result = dotenv.config();

// The key specific to your personalization service instance; e.g. "0123456789abcdef0123456789ABCDEF"
const serviceKey = process.env.PERSONALIZERSERVICEKEY;

// The endpoint specific to your personalization service instance; e.g. https://<your-resource-name>.cognitiveservices.azure.com
const baseUri = "https://" + process.env.PERSONALIZERBASEURI + ".cognitiveservices.azure.com";


//Context for personalizer to make decisions on
function getContextFeaturesList(req) {

    const browserType = req.headers["user-agent"]
    
    const date = new Date();
    let hours = date.getHours();
    const timeOfDay = (hours < 12)? "morning" : ((hours <= 18 && hours >= 12 ) ? "afternoon" : "night");
    const dayOfWeek = date.getDay();
    
    const loggedInStatus = getUser(req).userDetails == "John Doe" ? 0 : 1;

    console.log("Selected features:\n");
    console.log("Browser type: " + browserType);
    console.log("Time of day: " + timeOfDay);
    console.log("Day of week: " + dayOfWeek);
    console.log("Logged in status: " + loggedInStatus);

    return [
        {
            "browserType": browserType
        },
        {
            "timeOfDay": timeOfDay
        }, 
        {
            "dayOfWeek": dayOfWeek
        }, 
        {
            "loggedInStatus": loggedInStatus
        }
    ];
}

//Actions represent the content choices from which you want Personalizer to select the best content item. 
async function getActionsList() {

    //TODO: replace with IceCream array
    var iceCreams = JSON.parse(await data.getCatalog());

    const iceCreamActions = iceCreams.map(v => {
        return {
          id: v.Id.toString(),
          features: [
            {
              name: v.Name,
              Description: v.Description,
              ImageUrl: v.ImageUrl
            },
          ],
        };
      });

    return iceCreamActions;
}


module.exports = async function (context, req) {

    try {

        // Initialize Personalization client
        const credentials = new CognitiveServicesCredentials(serviceKey);
        const personalizerClient = new Personalizer.PersonalizerClient(credentials, baseUri);

        let rankRequest = {}

        // Generate an ID to associate with the request.
        rankRequest.eventId = uuid.v4();

        // Get context information from the user.
        rankRequest.contextFeatures = getContextFeaturesList(req);

        // Get the actions list to choose from personalization with their features.
        rankRequest.actions = await getActionsList();

        // Exclude an action for personalization ranking. This action will be held at its current position.
        //rankRequest.excludedActions = getExcludedActionsList();

        rankRequest.deferActivation = false;

        // Rank the actions
        const rankResponse = await personalizerClient.rank(rankRequest);

        console.log("\nPersonalization service thinks you would like to have:\n")
        console.log(rankResponse.rewardActionId);

        var recommendedResult = 
        {
            iceCreamId: rankResponse.rewardActionId
        }

        context.res.status(200).send(recommendedResult);

    } 
    catch (error) {
        context.res.status(500).send(error);
    }

    //TODO: implement this part in the orders API, to reward when a recommended order has been placed
    // Display top choice to user, user agrees or disagrees with top choice
    // const reward = getReward();

    // console.log("\nPersonalization service ranked the actions with the probabilities as below:\n");
    // for (let i = 0; i < rankResponse.ranking.length; i++) {
    //     console.log(JSON.stringify(rankResponse.ranking[i]) + "\n");
    // }

    // // Send the reward for the action based on user response.
    // const rewardRequest = {
    //     value: reward
    // }

    // await personalizerClient.events.reward(rankRequest.eventId, rewardRequest);
}