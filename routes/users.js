const express = require("express");
const router = express.Router();

const User = require("../models/user");

// Get position data
router.get("/getpositiondata", (req, res, next) => {
   // res.send("DATA");
    User.getData("Position", (err, data) => {
        if (err) throw err;
        if (data) {
          //  console.log(data.currentPropertyValue);
          //  var splitString = data.currentPropertyValue.split(",");
          //  var xPos = splitString[0];
          //  var yPos = splitString[1];
          //  console.log("xPos: "+xPos);
         //   console.log("yPos: "+yPos);
         console.log("data here");
         console.log(data);
         res.send(data);
           // res.send (data);
        }
        if (!data) {
            res.send("No data :(");
        }
    });
});

// Get names
router.get("/getnames", (req, res, next) => {
    User.getData("Name", (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Names here");
         console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No names");
        }
    });
});

// Get teams
router.get("/getteams", (req, res, next) => {
    User.getData("Team", (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Teams here");
         console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No teams");
        }
    });
});

// Get players
    router.get("/getplayers", (req, res, next) => {
    User.getData("Hero", (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Players here");
         console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No players");
        }
    });
});

// Get heroes
router.get("/getheroes", (req, res, next) => {
    User.getDistinct("currentPropertyValue", "Hero", (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Heroes here");
         console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No heroes");
        }
    });
});

// Get match IDs
router.get("/getmatches", (req, res, next) => {
    User.getMatches("Position", (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Matches here");
         console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No matches");
        }
    });
});






// Register
router.post("/register", (req, res, next) => {
    res.send("REGISTER");
});


// Authenticate
router.post("/authenticate", (req, res, next) => {
    res.send("AUTHENTICATE");
});



module.exports = router;