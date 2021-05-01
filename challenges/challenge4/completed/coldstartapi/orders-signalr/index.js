module.exports = function (context, updatedOrders) {
    context.bindings.signalRMessages =
    updatedOrders.map(order => ({
        target: 'orderUpdated', //method to be invoked on the client
        arguments: [order]
      }));
    context.done();
  };