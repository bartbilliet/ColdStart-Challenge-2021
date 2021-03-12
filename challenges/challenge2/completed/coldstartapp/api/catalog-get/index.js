const data = require('../shared/catalog-data');

module.exports = async function (context, req) {
  try {
    const items = await data.getCatalog();
    
    console.log("returned in main function");
    context.res.status(200).send(items);
  } 
  catch (error) {
    context.res.status(500).send(error);
  }
};
