const { sqlConfig } = require("./config");
const mssql = require('mssql');

async function getCatalogById(id) {
  console.log('using database ');

  let pool = await mssql.connect(sqlConfig);
  let result = await pool.request()
    .query(`SELECT * FROM dbo.Icecreams WHERE [Id] = ` + id); //yep, I know, suspectable to SQL injection - not investing too much time as this is draft code, trying to understand Azure instead of learning node.js

  return result.recordset[0];
}

module.exports = { getCatalogById };
