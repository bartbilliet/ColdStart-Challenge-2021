//const CosmosClient = require("@azure/cosmos").CosmosClient;
//const config = require("../shared/config");
//const dbContext = require("../shared/cosmosDbContext");


const data = require('../shared/catalog-data');

module.exports = async function (context) {

  const iceCreamData = await data.getCatalogById(context.bindings.myQueueItem.IcecreamId); 

  console.log("output");
  console.log(iceCreamData[0]);

  context.bindings.orderDocument = JSON.stringify({

    "id": context.bindings.myQueueItem.Id,
    "user": context.bindings.myQueueItem.User,
    "date": context.bindings.myQueueItem.Date,
    "icecream": {
        "icecreamId": context.bindings.myQueueItem.IcecreamId,
        "name": iceCreamData[0].Name,
        "description": iceCreamData[0].Description,
        "imageUrl": iceCreamData[0].ImageUrl
    },
    "status": "Accepted",
    "driver": {
        "driverId": null,
        "name": null,
        "imageUrl": null
    },
    "fullAddress": context.bindings.myQueueItem.FullAddress,
    "deliveryPosition": null,
    "lastPosition": null
  });

  context.done();
};

/*
module.exports = async function (context, message) {

  context.log('Node.js queue trigger function processed work item', message);

  //  <DefineNewItem>
  const newItem = {
    "id": message.Id,
    "user": message.User,
    "date": message.Date,
    "icecream": {
        "icecreamId": message.IcecreamId,
        "name": "Blue Lagoon",
        "description": "Blueberry and melon ice cream bar.",
        "imageUrl": "https://coldstartsa.blob.core.windows.net/web/assets/Icecream5.png"
    },
    "status": "Accepted",
    "driver": {
        "driverId": null,
        "name": null,
        "imageUrl": null
    },
    "fullAddress": message.FullAddress,
    "deliveryPosition": null,
    "lastPosition": null
  };
  //  </DefineNewItem>

  
  // <CreateClientObjectDatabaseContainer>
  //const { endpoint, key, databaseId, containerId } = config;
  endpoint = process.env.COSMOS_ENDPOINT;
  key = process.env.COSMOS_KEY;
  databaseId = process.env.COSMOS_DATABASEID;
  containerId = process.env.COSMOS_CONTAINERID;

  console.log(endpoint);
  console.log(key);

  const client = new CosmosClient({ endpoint, key });

  const database = client.database(databaseId);
  const container = database.container(containerId);

  // Make sure Tasks database is already setup. If not, create it.
  await dbContext.create(client, databaseId, containerId);
  
  try {
    // Create new item
    const { resource: createdItem } = await container.items.create(newItem);
    console.log(`\r\nCreated new item: ${createdItem.id}\r\n`);

    // Update item
    const { id } = createdItem;
    createdItem.isComplete = true;

    const { resource: updatedItem } = await container
      .item(id)
      .replace(createdItem);

    console.log(`Updated item: ${updatedItem.id} - ${updatedItem.description}`); 
  } catch (err) {
    console.log(err.message);
  }

};
*/