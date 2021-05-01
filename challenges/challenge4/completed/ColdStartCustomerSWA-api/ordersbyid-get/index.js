const data = require('../shared/order-cosmos-data');

module.exports = async function (context, req) {
  try {
    // Retrieve the order id from the url
    const orderId = req.params.Id;

    console.log(orderId);

    item = await data.getOrderById(orderId);
    context.res.status(200).json(item);

  } catch (error) {
    context.res.status(500).send(error);
  }

};
