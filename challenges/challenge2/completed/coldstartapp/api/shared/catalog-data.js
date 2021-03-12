//imports
//const fs = require('fs').promises;

//Tedious to connect to SQL DB
const { Connection, Request } = require("tedious");

//Read from environment variables
const dotenv = require('dotenv');
const result = dotenv.config();

// DB Config - to be moved to appsettings.json
const config = {
  authentication: {
    options: {
      userName: process.env.DBUSER, 
      password: process.env.DBPASS 
    },
    type: "default"
  },
  server: process.env.DBSERVER,
  options: {
    database: process.env.DBNAME, 
    encrypt: true
  } 
};

async function getCatalog() {
  
  console.log("Reading data from DB");

  return new Promise((resolve, reject) => {

    const connection = new Connection(config);
    var result = "";

    // Read all rows from Icecreams table
    const request = new Request(
      `SELECT * FROM [dbo].[Icecreams] FOR JSON AUTO`,
      (err, rowCount, rows) => {
        if (err) {
          console.error(err.message);
        } 
        else {
          console.log(`${rowCount} row(s) returned`);

          console.log(result);        

          resolve(result);
        }
      }
    );

    // Handle result set sent back from Azure SQL
    request.on('row', columns => {
      columns.forEach(column => {
          result += column.value;                
      });
    });

    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", err => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("connected to db");
        connection.execSql(request);
      }
    });

    connection.connect();

  });

  //STATIC original sample from JSON text file - to be replaced by SQL statement
  //console.log('using static data.');
  //var stringData = await fs.readFile('./shared/catalog.json', 'utf8');
  //const data = JSON.parse(stringData);
  //return data.icecreams;

}

module.exports = { getCatalog };
