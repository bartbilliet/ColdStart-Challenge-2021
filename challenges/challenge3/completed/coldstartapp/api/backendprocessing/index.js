const data = require('../shared/catalog-data');

module.exports = async function (context) {

  console.log("Getting ice cream data");
  const iceCreamData = await data.getCatalogById(context.bindings.myQueueItem.IcecreamId); 

  console.log("Writing transformed object to CosmosDb");
  context.bindings.orderDocument = JSON.stringify({

    "id": context.bindings.myQueueItem.Id,
    "user": context.bindings.myQueueItem.User,
    "date": context.bindings.myQueueItem.Date,
    "icecream": {
        "icecreamId": context.bindings.myQueueItem.IcecreamId,
        "name": iceCreamData.Name,
        "description": iceCreamData.Description,
        "imageUrl": iceCreamData.ImageUrl
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
