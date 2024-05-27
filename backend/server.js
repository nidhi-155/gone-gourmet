// Import the express module, which is a web application framework for Node.js
const express = require('express');
const cors = require('cors');

//DB Connection
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

let restaurants = [];


// Create an instance of an Express application
const app = express();

// Enable CORS for all routes
app.use(cors());

// // Mock data representing restaurants with their brands, locations, and unavailable items
// const restaurants = [
//   { brand: 'Brand1', location: 'Location1', unavailableItems: [{name:'horseradish dumplings and Black pepper toastie', reason: 'Reason'}, {name:'Item2', reason: 'Reason'}] },
//   { brand: 'Brand2', location: 'Location2', unavailableItems: [{name:'Item3', reason: 'Reason'}, {name:'Item4', reason: 'Reason'}] },
//   { brand: 'Brand3', location: 'Location2', unavailableItems: [{name:'Item5', reason: 'Reason'}, {name:'Item2', reason: 'Reason'}] },
//   { brand: 'Brand2', location: 'Location1', unavailableItems: [{name:'Item5', reason: 'Reason'}, {name:'Item4', reason: 'Reason'}] },
//   { brand: 'Brand1', location: 'Location2', unavailableItems: [{name:'Item1', reason: 'Reason'}, {name:'Item2', reason: 'Reason'}] },
//   { brand: 'Brand3', location: 'Location3', unavailableItems: [{name:'Item5', reason: 'Reason'}, {name:'Item5', reason: 'Reason'}] },
//   { brand: 'Brand5', location: 'Location4', unavailableItems: [{name:'Item1', reason: 'Reason'}, {name:'Item5', reason: 'Reason'}] },
//   { brand: 'Brand4', location: 'Location1', unavailableItems: [{name:'Item3', reason: 'Reason'}, {name:'Item4', reason: 'Reason'}] },
//   { brand: 'Brand5', location: 'Location2', unavailableItems: [{name:'Item3', reason: 'Reason'}, {name:'Item4', reason: 'Reason'}] },
//   { brand: 'Brand6', location: 'Location1', unavailableItems: [{name:'Item3', reason: 'Reason'}, {name:'Item4', reason: 'Reason'}] },
//   // Add more data as needed
// ];

getDataFromDB();

// Define an API endpoint for getting unique restaurant brands
app.get('/restaurants', (req, res) => {
  //check if restaurants has data, else call the db
  if (restaurants.length == 0) {
    getDataFromDB();
  }
  // Extract the location from the query parameters of the request
  const location = req.query.location;
  // If a location is provided, filter the restaurants to only those in the specified location
  if (location) {
    const filteredRestaurants = restaurants.filter(r => location.includes(r.location));
    // Respond with the unique brands of the filtered restaurants
    res.json([...new Set(filteredRestaurants.map(r => r.brand))]);
  } else {
    // If no location is provided, respond with the unique brands of all restaurants
    res.json([...new Set(restaurants.map(r => r.brand))]);
  }
});

// Define an API endpoint for getting unique locations
app.get('/locations', (req, res) => {
  //check if restaurants has data, else call the db
  if (restaurants.length == 0) {
    getDataFromDB();
  }
  // Extract the brands from the query parameters of the request
  const brand = req.query.brand;
  // If brand is provided, filter the restaurants to only those with the specified brand
  if (brand) {
    const filteredRestaurants = restaurants.filter(r => brand.includes(r.brand));
    // Respond with the unique locations of the filtered restaurants
    res.json([...new Set(filteredRestaurants.map(r => r.location))]);
  } else {
    // If no brand is provided, respond with the unique locations of all restaurants
    res.json([...new Set(restaurants.map(r => r.location))]);
  }
});

// Define an API endpoint for getting unavailable items
app.get('/unavailable-items', (req, res) => {
  //check if restaurants has data, else call the db
  if (restaurants.length == 0) {
    getDataFromDB();
  }
  // Extract the brand and location from the query parameters of the request
  const { brand, location } = req.query;
  // If both brand and location are provided, find the items that are unavailable at the specified restaurant
  if (brand && location) {
    const restaurant = restaurants.filter(r => r.brand === brand && r.location === location);
    if (restaurant && restaurant.length > 0) {
      // If the restaurant is found, respond with its unavailable items
      res.json(restaurant.map(_ => { return { name: _.item, reason: _.reason }; }));
    } else {
      // If the restaurant is not found, respond with a 404 status code and an error message
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } else {
    // If either brand or location is not provided, respond with a 400 status code and an error message
    res.status(400).json({ message: 'Brand and location are required' });
  }
});

// Define the port the server will listen on
const port = 3000;
// Start the server and have it listen on the defined port
app.listen(port, () => {
  // Log a message to the console once the server starts listening
  console.log(`Server running at http://localhost:${port}/`);
});

function getDataFromDB() {
  restaurants = [];
  pool.query('SELECT * FROM UnavailableItems', (error, results) => {
    console.log('calling postgres');
    if (error) {
      // throw error;
      console.error("cannot connect to DB, using mocked data!");
      restaurants = [
          { brand: 'Brand1', location: 'Location1', unavailableItems: [{name:'Item1', reason: 'Reason'}, {name:'Item2', reason: 'Reason'}] },
          { brand: 'Brand2', location: 'Location2', unavailableItems: [{name:'Item3', reason: 'Reason'}, {name:'Item4', reason: 'Reason'}] },
          { brand: 'Brand3', location: 'Location2', unavailableItems: [{name:'Item5', reason: 'Reason'}, {name:'Item2', reason: 'Reason'}] },
          { brand: 'Brand2', location: 'Location1', unavailableItems: [{name:'Item5', reason: 'Reason'}, {name:'Item4', reason: 'Reason'}] },
          { brand: 'Brand1', location: 'Location2', unavailableItems: [{name:'Item1', reason: 'Reason'}, {name:'Item2', reason: 'Reason'}] },
          { brand: 'Brand3', location: 'Location3', unavailableItems: [{name:'Item5', reason: 'Reason'}, {name:'Item5', reason: 'Reason'}] },
          { brand: 'Brand5', location: 'Location4', unavailableItems: [{name:'Item1', reason: 'Reason'}, {name:'Item5', reason: 'Reason'}] },
          { brand: 'Brand4', location: 'Location1', unavailableItems: [{name:'Item3', reason: 'Reason'}, {name:'Item4', reason: 'Reason'}] },
          { brand: 'Brand5', location: 'Location2', unavailableItems: [{name:'Item3', reason: 'Reason'}, {name:'Item4', reason: 'Reason'}] },
          { brand: 'Brand6', location: 'Location1', unavailableItems: [{name:'Item3', reason: 'Reason'}, {name:'Item4', reason: 'Reason'}] },
          // Add more data as needed
        ];
    }
    //check if data is coming
    if (results.rows && results.rows.length > 0) {
      restaurants.push(...results.rows);
    }
    console.log(results.rows && results.rows.length);
  });

  pool.end();

}