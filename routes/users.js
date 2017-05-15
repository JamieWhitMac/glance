const express = require("express");
const router = express.Router();

const User = require("../models/user");

// Get position data
router.get("/getpositiondata", (req, res, next) => {
   // res.send("DATA");
   var matchID = req.query.matchid;
    User.getData("Position", matchID, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("data here");
 //        console.log(data);
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
    var matchID = req.query.matchid;
    User.getData("Name", matchID, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Names here");
 //        console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No names");
        }
    });
});

// Get teams
router.get("/getteams", (req, res, next) => {
    var matchID = req.query.matchid;
    User.getData("Team", matchID, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Teams here");
 //        console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No teams");
        }
    });
});

// Get players
    router.get("/getplayers", (req, res, next) => {
        var matchID = req.query.matchid;
    User.getData("Hero", matchID, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Players here");
   //      console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No players");
        }
    });
});

// Get heroes
router.get("/getheroes", (req, res, next) => {
    var matchID = req.query.matchid;
    User.getDistinct("currentPropertyValue", "Hero", matchID, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Heroes here");
    //     console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No heroes");
        }
    });
});

// Get initial positions
router.get("/getinitialpositions", (req, res, next) => {
    var matchID = req.query.matchid;
        User.getLatestDataAboutEntity(req.query.hero, "Position", req.query.limit, 0, matchID, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Positions here");
     //    console.log(data);
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

    // console.log(heroArray);

    var matchID = req.query.matchid;

    User.getLatestDataAboutEntity(heroArray, "Position", req.query.limit, req.query.time, matchID, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Positions here");
       //  console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No positions");
        }
    });
});

// Get gold data
router.get("/getlatestgoldevents", (req, res, next) => {
    var playerArray = [];

    playerArray.push(req.query.player1);
    playerArray.push(req.query.player2);
    playerArray.push(req.query.player3);
    playerArray.push(req.query.player4);
    playerArray.push(req.query.player5);
    playerArray.push(req.query.player6);
    playerArray.push(req.query.player7);
    playerArray.push(req.query.player8);
    playerArray.push(req.query.player9);
    playerArray.push(req.query.player10);

   // console.log(heroArray);

    var matchID = req.query.matchid;

    User.getLatestDataAboutEntity(playerArray, "GoldEarnedEvent", req.query.limit, req.query.time, matchID, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Gold here");
        // console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No gold");
        }
    });
});

// Get observer data

    router.get("/getobserverdata", (req, res, next) => {
        var matchID = req.query.matchid;
    User.getByEntityType("Nucleus.DataSources.Dota2.ObserverWardEntity", matchID, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Observers here");
  //       console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No observers");
        }
    });
});

// Get Health data

router.get("/gethealthdata", (req, res, next) => {
    var matchID = req.query.matchid;
    User.getByProperties("propertyName", "propertyName", "CurrentHealth", "CurrentMaxHealth", matchID, (err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Health data here");
   //      console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No health data");
        }
    });
});









// Get match IDs
router.get("/getmatches", (req, res, next) => {
    var matchID = req.query.matchid;
    User.getMatches((err, data) => {
        if (err) throw err;
        if (data) {
         console.log("Matches here");
 //        console.log(data);
         res.send(data);
        }
        if (!data) {
            res.send("No matches");
        }
    });
});



module.exports = router;