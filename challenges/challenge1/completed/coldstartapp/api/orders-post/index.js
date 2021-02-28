const { getUser } = require('../shared/user-utils');
const { QueueServiceClient } = require('@azure/storage-queue');
const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
  // Get the user details from the request
  const user = getUser(req);

  // Get the pre-order from the request
  const order = {
    "Id": uuidv4(),
    "User": user.userDetails,
    "Date": new Date().toJSON(),
    "IcecreamId": req.body.IcecreamId,
    "Status": "New",
    "DriverId": null,
    "FullAddress": "1 Microsoft Way, Redmond, WA 98052, USA",
    "LastPosition": null
  }

  // --- Connect to queue, or create queue if not existing

  // Retrieve the connection from an environment variable called AZURE_STORAGE_CONNECTION_STRING
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

  // Instantiate a QueueServiceClient which will be used to create a QueueClient and to list all the queues
  const queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);
  
  // Create a unique name for the queue
  const queueName = "coldstartorders";
  console.log("Checking if queue exists: ", queueName);

  //Get queue, and create if not exists
  const queueClient = queueServiceClient.getQueueClient(queueName);
  await queueClient.createIfNotExists();


  // --- Add order to queue
  messageText = JSON.stringify(order)

  console.log("Adding message to the queue: ", messageText);
  await queueClient.sendMessage(messageText);


  // Return order body to output
  context.res.status(201);
  context.res.body = order;
};
