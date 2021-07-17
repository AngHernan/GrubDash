const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes} = {} } = req.body;
  const newOrder = {id: nextId(), deliverTo, mobileNumber, status, dishes};
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
};


function hasDeliverTo (req, res, next){
  const {data: {deliverTo} = {}} = req.body;
  if (deliverTo){
    return next();
  }
  next({
    status: 400,
    message: 'A deliverTo is required'
  });
};

function hasMobile(req, res, next){
  const {data: {mobileNumber} = {}} = req.body;
  if (mobileNumber){
    return next();
  }
  next({
    status: 400,
    message: 'A mobileNumber is required'
  });
};

function hasStatus(req, res, next){
  const {data: {status} = {}} = req.body;
  if (status){
    return next();
  }
  next({
    status: 400,
    message: 'A status is required'
  });
};

function statusNotInvalid(req, res, next){
  const {data: {status} = {}} = req.body;
  if (status != 'invalid'){
    return next();
  }
  next({
    status: 400,
    message: 'A status is Invalid'
  });
};

function statusDelivered(req, res, next) {
    const {data: {status} = {}} = req.body;
    if (status === "delivered") {
      next({
        status: 400,
        message: 'Status is delivered',
      });
    }
    return next();
  }



function hasDishes (req, res, next){
  const {data: {dishes} = {}} = req.body;
  if (dishes && Array.isArray(dishes) && dishes.length != 0){
    return next();
  }
  next({
    status: 400,
    message: 'An dishes list is required'
  });
};

function hasQuantity (req, res, next){
  const {data: {dishes} = {}} = req.body;
  const noQuantity = dishes.find((dish) => !dish.quantity);
  if (!noQuantity){
    return next();
  }
  const index = dishes.indexOf(noQuantity);
  next({
    status: 400,
    message: `Dish ${index} must have integer quantity greater than 0`
  });
};


function quantityNotZero(req, res, next){
  const {data: {dishes} = {}} = req.body;
  const zeroQuantity = dishes.find((dish) => dish.quantity === 0);
  if (!zeroQuantity){
    return next();
  }
  const index = dishes.indexOf(zeroQuantity);
  next({
    status: 400,
    message: `Dish ${index} must have integer quantity greater than 0`
  });
}


function quantityIsNumber(req, res, next){
  const {data: {dishes} = {}} = req.body;
  const notNumber = dishes.find((dish) => Number.isInteger(dish.quantity) === false);
  if (!notNumber){
    return next();
  }
  const index = dishes.indexOf(notNumber)
  next({
    status: 400,
    message: `Dish ${index} must have a quantity greater than 0`
  });
}

function dataIdMatch(req, res, next){
  const {orderId} = req.params;
  const {data: {id} = {}} = req.body;
    if(id === orderId || !id){
        return next();
    }
    next({
        status: 400, 
        message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`
    })
}

function list(req, res) {
  res.json({ data: orders });
}

function orderExists(req, res, next){
  const {orderId} = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  
  if(foundOrder){
    res.locals.order = foundOrder
    next();
    }
    return next({
      status: 404,
      message: `Order id not found: ${orderId}`,
    })
};

function read(req, res, next) {
  res.json({ data: res.locals.order })
};

function update(req, res){
  order = res.locals.order;
  const { data: { deliverTo, mobileNumber, status, dishes} = {} } = req.body;
  
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  
  res.json({data: order})
};

function destroy(req, res, next){
  foundOrder = res.locals.order;
  if (foundOrder.status === 'pending'){
    const index = orders.findIndex((order) => order.id === foundOrder.Id);
  orders.splice(index, 1);
  
  res.sendStatus(204);
  }
  return next({
    status: 400,
    message: 'Status is pending'
  })
}


module.exports = {
  create: [
    hasDeliverTo, 
    hasMobile, 
    hasDishes, 
    statusNotInvalid, 
    statusDelivered, 
    hasQuantity, 
    quantityIsNumber, 
    quantityNotZero, 
    create],
  list,
  read: [
    orderExists, 
    read],
  update: [
    orderExists, 
    hasDeliverTo, 
    hasMobile, 
    hasDishes, 
    statusDelivered, 
    statusNotInvalid, 
    dataIdMatch, 
    hasStatus, 
    hasQuantity, 
    quantityIsNumber, 
    quantityNotZero, 
    update],
  delete: [
    orderExists, 
    destroy]
  
};