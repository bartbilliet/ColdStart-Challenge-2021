const { getUser } = require('../shared/user-utils');
var uuid = require('uuid');

const Personalizer = require('@azure/cognitiveservices-personalizer');
const CognitiveServicesCredentials = require('@azure/ms-rest-azure-js').CognitiveServicesCredentials;

//Read from environment variables
const dotenv = require('dotenv');
const result = dotenv.config();

// The key specific to your personalization service instance; e.g. "0123456789abcdef0123456789ABCDEF"
const serviceKey = process.env.PERSONALIZERSERVICEKEY;

// The endpoint specific to your personalization service instance; e.g. https://<your-resource-name>.cognitiveservices.azure.com
const baseUri = "https://" + process.env.PERSONALIZERBASEURI + ".cognitiveservices.azure.com";


// Function to assign rewards to products that were ordered from the recommendations
async function giveReward(wasRecommendedEvent) {
  console.log("Giving reward for:");
  console.log(wasRecommendedEvent);
  
  // Initialize Personalization client
  const credentials = new CognitiveServicesCredentials(serviceKey);
  const personalizerClient = new Personalizer.PersonalizerClient(credentials, baseUri);

  // Send the reward for the action based on user response.
  // Non-recommended articles will automatically get default reward 0 assigned by the cognitive services after reward time expires
  const rewardRequest = {
    value: 1
  }

  // Reward the previously generated event
  await personalizerClient.events.reward(wasRecommendedEvent.EventId, rewardRequest);
  
}


module.exports = async function (context, req) {
  // Get the user details from the request
  const user = getUser(req);

  // Build the pre-order JSON from the request
  const order = {
    Id: uuid.v4(),
    User: user.userDetails,
    FullAddress: req.body.ShippingAddress,
    Date: new Date().toISOString(),
    IcecreamId: req.body.Id,
    Status: "New",
    DriverId: null,
    LastPosition: null
  };

  try {
    // Add the pre-order JSON document in a queue
    console.log('Queueing order');
    context.bindings.myQueueItem = order;

    // Give reward if item was recommended
    const wasRecommendedEvent = req.body.recommendedResults.filter((y) => (y.Id === order.IcecreamId))[0];
    if (wasRecommendedEvent) {
      giveReward(wasRecommendedEvent);
    } 

    context.res.status(201).json(order);
    context.done();
  } catch (error) {
    console.error(error);
    context.res.status(500).send(error);
  }
};
