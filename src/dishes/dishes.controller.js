const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

function create(req, res) {
  const { data: {name, description, image_url, price } = {} } = req.body;
  const newDish = {id: nextId(), name, description, image_url, price};
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
};


function hasName (req, res, next){
  const {data: {name} = {}} = req.body;
  if (name){
    return next();
  }
  next({
    status: 400,
    message: 'A name is required'
  });
};

function hasDescription (req, res, next){
  const {data: {description} = {}} = req.body;
  if (description){
    return next();
  }
  next({
    status: 400,
    message: 'A description is required'
  });
};

function hasUrl (req, res, next){
  const {data: {image_url} = {}} = req.body;
  if (image_url){
    return next();
  }
  next({
    status: 400,
    message: 'An image_url is required'
  });
};

function hasPrice (req, res, next){
  const {data: {price} = {}} = req.body;
  if (price){
    
    return next();
  }
  next({
    status: 400,
    message: 'A price is required'
  });
};

function priceIsNumber (req, res, next){
  const {data: {price} = {}} = req.body;
  if(price > 0 && Number.isInteger(price) === true ){
    return next();
  }
   next({
    status: 400,
    message: 'A price is required that is greater than zero'
  });
};

function dataIdMatch(req, res, next){
  const {dishId} = req.params;
  const {data: {id} = {}} = req.body;
    if(id === dishId || !id){
        return next();
    }
    next({
        status: 400, 
        message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
    })
}

function list(req, res) {
  res.json({ data: dishes });
}

function dishExists(req, res, next){
  const {dishId} = req.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  
  if(foundDish === undefined){
    return next({
      status: 404,
      message: `Dish id not found: ${dishId}`,
    })
  }
  res.locals.dish = foundDish;
  return next();
};

function read(req, res, next) {
  res.json({ data: res.locals.dish})
};

function update(req, res){
  dish = res.locals.dish;
  const { data: {name, description, image_url, price } = {} } = req.body;
  
  dish.name = name;
  dish.description = description;
  dish.image_url = image_url;
  dish.price = price;
  
  res.json({data: dish})
};

module.exports = {
  create: [hasName, hasDescription, hasUrl, hasPrice, priceIsNumber, create],
  list,
  read: [dishExists, read],
  update: [dishExists, hasName, hasDescription, hasUrl, hasPrice, priceIsNumber, dataIdMatch, update]
};