const express = require("express");
const router = express.Router();

const User = require("../models/user");

// Get position data
router.get("/getpositiondata", (req, res, next) => {
   // res.send("DATA");
    User.getData("Position", (err, data) => {
        if (err) throw err;
        if (data) {
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

// Get initial positions
router.get("/getinitialpositions", (req, res, next) => {
        User.getLatestDataAboutEntity(req.query.hero, "Position", req.query.limit, 0, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Positions here");
         console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No positions");
        }
    });
});

// Get latest positions
router.get("/getlatestpositions", (req, res, next) => {
    var heroArray = [];

    heroArray.push(req.query.hero1);
    heroArray.push(req.query.hero2);
    heroArray.push(req.query.hero3);
    heroArray.push(req.query.hero4);
    heroArray.push(req.query.hero5);
    heroArray.push(req.query.hero6);
    heroArray.push(req.query.hero7);
    heroArray.push(req.query.hero8);
    heroArray.push(req.query.hero9);
    heroArray.push(req.query.hero10);

    console.log(heroArray);

    User.getLatestDataAboutEntity(heroArray, "Position", req.query.limit, req.query.time, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Positions here");
         console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No positions");
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



module.exports = router;