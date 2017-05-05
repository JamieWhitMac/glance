const express = require("express");
const router = express.Router();

const User = require("../models/user");

// Get data
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

// Register
router.post("/register", (req, res, next) => {
    res.send("REGISTER");
});


// Authenticate
router.post("/authenticate", (req, res, next) => {
    res.send("AUTHENTICATE");
});



module.exports = router;