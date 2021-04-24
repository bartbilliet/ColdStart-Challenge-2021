// @ts-check
const process = require("process");

const config = {
    azure_storage_connectionstring: process.env.AZURE_STORAGE_CONNECTIONSTRING
};

const sqlConfig = {
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVERNAME,
    database: process.env.SQL_DB,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };

const cosmosConfig = {
    cosmosdb_endpoint: process.env.COSMOSDB_ENDPOINT,
    cosmosdb_key: process.env.COSMOSDB_KEY,
    cosmosdb_databaseId: process.env.COSMOSDB_DATABASEID,
    cosmosdb_ordersContainerId: process.env.COSMOSDB_CONTAINERID,
    cosmosdb_ordersPartitionKey: "id",
};

module.exports = { config, sqlConfig, cosmosConfig };
