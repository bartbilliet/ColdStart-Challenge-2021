//Requires
const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../shared/config");
const dbContext = require("../shared/cosmosDbContext");
const NodeGeocoder = require('node-geocoder');

//Config
const GeoCoderOptions = {
  provider: 'openstreetmap',
};

module.exports = async function (context) {

  context.log('Node timer trigger function ran!');   

  // Read items with status 'accepted' from CosmosDB
  endpoint = process.env.COSMOS_ENDPOINT;
  key = process.env.COSMOS_KEY;
  databaseId = process.env.COSMOS_DATABASEID;
  containerId = process.env.COSMOS_CONTAINERID;

  // Creating Cosmos client
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);
  
  // Make sure database is already setup. If not, create it.
  await dbContext.create(client, databaseId, containerId);
  
  //Create instance of geocoder for address to GPS conversion
  const geocoder = NodeGeocoder(GeoCoderOptions);

  try {
    console.log("Querying container");

    // Query to see if there are any items to be treated
    const querySpec = {
      query: "SELECT * from c WHERE c.status = 'Accepted'"
    };

    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();

    // Loop over all items with status 'accepted'
    for(const item of items) {

      console.log("Processing item: " + item.id);

      // Update the item
      item.status = "Ready";

      //Calculate delivery GPS coordinates
      const res = await geocoder.geocode(item.fullAddress);
      if(res) {
        const formattedGPS = res[0].latitude + ", " + res[0].longitude;
        console.log(formattedGPS);
        item.deliveryPosition = formattedGPS;
      }

      // Replace the document in CosmosDB
      const updatedItem = await container
        .item(item.id)
        .replace(item);

      console.log("wrote updated object to CosmosDB");

    }
  } catch (err) {
    console.log(err.message);
  }

  context.done();
};