// @ts-check
const process = require("process");

const config = {
    azure_storage_connectionstring: process.env.AZURE_STORAGE_CONNECTIONSTRING
};

// Create connection to database
const sqlConfig = {
    authentication: {
        options: {
            userName: process.env.SQL_USERNAME,
            password: process.env.SQL_PASSWORD,
        },
        type: "default"
    },
    server: process.env.SQL_SERVERNAME,
    options: {
        database: process.env.SQL_DB,
        encrypt: true
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
