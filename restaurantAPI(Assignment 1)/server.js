/*********************************************************************************
 *  WEB422 – Assignment 1
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Md Rafi Al Arabi Bhuiyan    Student ID: 147307193      Date: 2021-05-28
 *  Heroku Link: https://fathomless-sea-80652.herokuapp.com/
 *
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

//to support JSON entities and CORS
app.use(bodyParser.json());
app.use(cors());

const HTTP_PORT = process.env.PORT || 8080;

//Database credentials
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB(
  "mongodb+srv://galaxy:fourtytwo@webas.ikxpf.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
);


app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});


//get all the restaurants
// ie: /api/restaurants?page=1&perPage=5&borough=Bronx
app.get("/api/restaurants", (req, res) => {
  db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then((restaurants) => {
      res.status(201).json(restaurants);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

//get restaurants by id
app.get("/api/restaurants/:id", (req, res) => {
  db.getRestaurantById(req.params.id)
    .then((restaurant) => {
      res.status(201).json(restaurant);
      console.log("Restaurant found!");
    })
    .catch(() => {
      res
        .status(500)
        .send(`No restaurant has been found using id ${req.params.id}`);
    });
});

//add a new restaurant
app.post("/api/restaurants", (req, res) => {
  db.addNewRestaurant(req.body)
    .then((msg) => {
      res.status(201).send(msg);
      console.log("Successfully added!");
    })
    .catch(() => {
      res.status(500).send("Unable to add!");
      console.log("Failed!");
    });
});

// update restaurant
app.put("/api/restaurants/:id", (req, res) => {
  db.updateRestaurantById(req.body, req.params.id)
    .then((msg) => {
      res.status(201).send(msg);
      console.log("Updated successfully!");
    })
    .catch(() => {
      res.status(500).send("Unable to update!");
      console.log("Failed!");
    });
});

// Delete restaurant
app.delete("/api/restaurants/:id", (req, res) => {
  db.deleteRestaurantById(req.params.id)
    .then((msg) => {
      res.status(201).send(msg);
      console.log("Deleted successfully!");
    })
    .catch(() => {
      res.status(500).send("Unable to delete!");
      console.log("Failed!");
    });
});

//initialization
db.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
