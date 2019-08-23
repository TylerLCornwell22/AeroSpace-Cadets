// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================
var db = require("../models");
var Op = require("sequelize").Op;
var passport = require("../config/passport");
var seedUtility = require("../database/seeds-utility.js");
var isAuthenticated = require("../config/middleware/isAuthenticated");
// Routes
// =============================================================

  
const fs = require("fs");
const path = require("path");
const fse = require('fs-extra');



module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/members");
  });
  app.post("/api/superpotato", async function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    try {
      await seedUtility();
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      fName: req.body.fName,
      lName: req.body.lName
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // NEw CODING FOR RONNIE PROJECT

  app.post("/api/submit", isAuthenticated, function(req, res) {
    console.log(req.body);
    console.log("post submitted");
    db.PlaneInput.create({
        serial: req.body.serial,
        make: req.body.make,
        model: req.body.model,
        UserId: req.user.id
      }).then(function() {
        res.json("/memberData");
      }).catch(function(err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
      });

      var dirName = `${req.body.make} ${req.body.model} ${req.body.serial} `
      
      fs.mkdir(dirName, { recursive: true }, (err) => {
        if (err) throw err;
      });

    const create = (dir, structure, cb = null) => {
        cb = (cb => (...a) => setTimeout(() => cb.apply(null, a)))(cb);
        const subdirs = Reflect.ownKeys(structure);
      
        console.log(subdirs);

        if (subdirs.length) {
          const sub = subdirs[0];
          const pth = path.join(dir, sub);
          const subsub = structure[sub];
          const copy = Object.assign({}, structure);
          delete copy[sub];
      
          fs.mkdir(pth, err => {
            if (err) return cb(err);
            create(pth, subsub, err => {
              if (err) return cb(err);
              create(dir, copy, cb);
            });
          });
        } else {
          cb(null);
        }
      };
      console.log (create)

      const structure = {
        "8110-3": {},
        "CAD FILES": {},
        PDFs: {
          SHEETS: {},
          OBSOLETE: {}
        },
        MANUALS: {},
        "P.Os": {},
        "CUSTOMER PRINTS": {},
        NOTES: {},
        PICTURES: {
          "COMPLETED INSTALLS": {},
          "PRE INSTALLS": {},
          "IN PROGRESS INSTALLS": {},
          MISC: {}
        }
      };
      // var dirName = `${req.body.make} ${req.body.model} ${req.body.serial} `
        // var dirName = 'Bell429 3299238749'
      var desktopPath="C:\Users\tyler\Desktop"  

    create(dirName, structure, err => {
      if (err) console.log(err);
      else console.log("Success");
    });

 
  });

  app.get("/api/allPlaneData", isAuthenticated, function(req, res) {
    db.PlaneInput.findAll({

    }).then(function(results) {
      res.json(results);
    });
  });

  app.get("/api/userPlane", isAuthenticated, function(req, res) {
    db.PlaneInput.findAll({
      where: {
        UserId: req.user.id
      }
    }).then(function(results) {
      res.json(results);
    });
  });




  // ajax routes for all makes
  app.get("/api/allmakes", function(req, res) {
    db.make.findAll({}).then(function(results) {
      res.json(results);
    });
  });


    // ajax routes for all models
    app.get("/api/allmodels", function(req, res) {
      db.model.findAll({}).then(function(results) {
        res.json(results);
      });
    });

  // Get a specific make
  app.get("/api/:make", function(req, res) {
    db.make.findAll({
      where: {
        name: req.params.make
      }
    }).then(function(results) {
      res.json(results);
    });
  });



  // Get all models of a specific make
  app.get("/api/model/:model", function(req, res) {
    db.model.findAll({
      where: {
        name: req.params.model
      }
    }).then(function(results) {
      res.json(results);
    });
  });



  // Get all models of a specific make
  app.get("/api/model/make/:make", function(req, res) {
    db.model.findAll({
      where: {
        makeId: req.params.make
      }
    }).then(function(results) {
      res.json(results);
    });
  });


};
