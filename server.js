const express = require('require');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const exphbs  = require('express-handlebars');

var PORT = process.env || 3000;

var app = express();
var router = express.Router();

// bring in the models
var db = require("./models");

// var routes = require("./controllers/....");

// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));


app.use(routes);

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
  });  



