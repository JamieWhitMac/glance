var selectedMatch;
var playerList;
var heroList;
var teamList;

var heroDict;
var teamDict;

var movementsStored;
var maxQueryResponse;
var currentGameTime;

var loopingInterval;
var loopTime;

var radiantHeatmap;
var direHeatmap;
var radiantHeatmapConfig;
var direHeatmapConfig;

var canvas;
var ctx;

$( document ).ready(function() {

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
//ctx.moveTo(0,0);
//ctx.lineTo(200,100);
//ctx.stroke();
    currentGameTime = (-1000);

    playerList = [];
    heroList = [];
    teamList = [];

    heroDict = {};
    teamDict = {};

    movementsStored = 50;
    maxQueryResponse = 500;

    loopTime = 2000;

    radiantHeatmapConfig = {
        container: document.getElementById("radiantHeatmap"),
        gradient: {
    // enter n keys between 0 and 1 here
    // for gradient color customization
    ".5": "#1fafd3",
    ".8": "#42d1f4",
    ".95": "#96eaff"
        }
    }

    direHeatmapConfig = {
        container: document.getElementById("direHeatmap"),
        gradient: {
            ".5": "#d81145",
            ".8": "#bc3659",
            ".95": "#822e44"
        }
    }

    $("#databutton").on("click", function() {
        console.log("Hello there.");
        $.ajax({
            url:"/users/getpositiondata",
            contentType: "application/json",
            success: function(response) {
                console.log(response);
            }
        });
    });

        $("#namesbutton").on("click", function() {
        console.log("Hello there.");
        $.ajax({
            url:"/users/getnames",
            contentType: "application/json",
            success: function(response) {
                console.log(response);
                response.forEach(assignNames);
                heroList.forEach(readHeroes);
            }
        });
    });

           $("#teamsbutton").on("click", function() {
        console.log("Hello there.");
        $.ajax({
            url:"/users/getteams",
            contentType: "application/json",
            success: function(response) {
                console.log(response);
                response.forEach(assignTeams);
                teamList.forEach(readTeams);
            }
        });
    });

             $("#heroesbutton").on("click", function() {
        console.log("Hello there.");
        $.ajax({
            url:"/users/getheroes",
            contentType: "application/json",
            success: function(response) {
                console.log(response);
            }
        });
    });

        $("#playersbutton").on("click", function() {
        console.log("Hello there.");
        $.ajax({
            url:"/users/getplayers",
            contentType: "application/json",
            success: function(response) {
                console.log(response);
                response.forEach(createPlayers);
                playerList.forEach(readPlayers);
            }
        });
    });

        $("#getpositionsbutton").on("click", function() {
        console.log("Hello there.");
        getInitialHeroPositions();
      //  teamList.forEach(getPositions);
    });

          $("#updatebutton").on("click", function() {
        console.log("Hello there.");
        getHeroPositions();
      //  teamList.forEach(getPositions);
    });

    $("#heatmapbutton").on("click", function() {
        generateHeatmap();
    });

    $("#drawheroesbutton").on("click", function() {
        drawPlayers();
    });





$("#selector").change(function() {
    selectedMatch = this.value;
   // $("#selector").append('<option value="4">The 4th Option</option>');
   addNewMatch("Hello");
});


$(document).on("pagebeforehide","#matchSelector",function(){ // When leaving pagetwo
    setupMatch();
  //console.log(selectedMatch);
 // var optionSelected = $("#select-custom-21")
});

});

// End of event listeners

// First-time setup

function setupMatch() {
    getPlayers();
}

function getPlayers() {
           $.ajax({
            url:"/users/getplayers",
            contentType: "application/json",
            success: function(response) {
                console.log(response);
                response.forEach(createPlayers);
                playerList.forEach(readPlayers);

                // CHECK FOR ERRORS

                getNames();
            }
        });
}

function getNames() {
     $.ajax({
            url:"/users/getnames",
            contentType: "application/json",
            success: function(response) {
                console.log(response);
                response.forEach(assignNames);
                heroList.forEach(readHeroes);

                // CHECK FOR ERRORS

                getTeams();
            }
        });
}

function getTeams() {
            $.ajax({
            url:"/users/getteams",
            contentType: "application/json",
            success: function(response) {
                console.log(response);
                response.forEach(assignTeams);
                teamList.forEach(readTeams);

                // CHECK FOR ERRORS

                getInitialHeroPositions();
            }
        });
}

function getHeroPositions() {
        requrl = "/users/getlatestpositions?"
        if (heroList.length == 10) {
            var heroNumber = 1;
            heroList.forEach(function(hero){
                if (heroNumber == 1){
                   var newurl = requrl+"hero"+heroNumber+"="+hero.heroID;
                   requrl = newurl;
                }
                else {
                var newurl =  requrl+"&hero"+heroNumber+"="+hero.heroID;
                requrl = newurl;
            }
            console.log(requrl);
            heroNumber++;
            });
        }
        else {
            console.log ("Wrong number of heroes: "+heroList.length);
        }
            var newurl = requrl+"&time="+currentGameTime+"&limit="+maxQueryResponse;
            requrl = newurl;
        $.ajax({
            url:requrl,
            contentType: "application/json",
            success: function(response) {
                response.reverse();
                response.forEach(function(movement) {
                logMovement(movement);
            });
            generateHeatmap();
            }
        });
}


function getInitialHeroPositions() {
    teamList.forEach(function(teamObject) {
    teamObject.heroes.forEach(function(hero){
        console.log("getting positions");
        $.ajax({
            url:"/users/getinitialpositions?hero="+hero.heroID+"&limit="+movementsStored,
            contentType: "application/json",
            //data: {id: "SomeID"},
            success: function(response) {
                response.reverse();
                console.log(response);
                response.forEach(function(movement) {
            logMovement(movement);
            });
            generateHeatmap();
            loopingInterval = setInterval(getHeroPositions, loopTime);
            }
        });
    });
    });
}

function logMovement(movementData) {
    var gameTime = movementData.gameTime;
    if (gameTime>currentGameTime){
        currentGameTime = gameTime;
    }
    var splitString = movementData.currentPropertyValue.split(",");
    var xPos = parseInt(splitString[0]);
    var yPos = parseInt(splitString[1]);
    var movementObject = {
        gameTime: gameTime,
        xPos: xPos,
        yPos: yPos
     }
     heroDict[movementData.entityID].positions.push(movementObject);
     if (heroDict[movementData.entityID].positions.length>movementsStored){
        heroDict[movementData.entityID].positions.shift();
     }
     console.log("logged");
}




function addNewMatch(matchID) {
    $("#selector").append('<option value="'+matchID+'">'+matchID+'</option>');
}

function createPlayers(playerObject){
    var player = new Player(playerObject.entityID);
    var hero = new Hero(playerObject.currentPropertyValue, player);
    playerList.push(player);
    heroList.push(hero);
    heroDict[playerObject.currentPropertyValue] = hero;
}


function assignNames (nameObject) {
    if (nameObject.entityType=="Nucleus.DataSources.Dota2.HeroEntity") {
        console.log(nameObject.entityType);
        heroList.forEach(function heroName(hero){
            if (nameObject.entityID == hero.heroID) {
                hero.name = nameObject.currentPropertyValue;
            }
        });
    }
    else if (nameObject.entityType=="Nucleus.DataSources.Dota2.PlayerEntity") {
        playerList.forEach(function playerName(player){
            if (nameObject.entityID == player.playerID) {
                player.name = nameObject.currentPropertyValue;
            }
        });
    }
    else { 
        team = new Team(nameObject.entityID, nameObject.currentPropertyValue);
        teamList.push(team);
        teamDict[team.name]=team;
    } 
}

function assignTeams (teamObject) {
    teamObjID = teamObject.currentPropertyValue;
    var selectedTeam;
    teamList.forEach(function selectTeam(team) {
        if (team.teamID == teamObject.currentPropertyValue) {
            selectedTeam = team;
        }
    });
    heroList.forEach(function heroTeamAssignment(hero) {
        if (teamObject.entityID==hero.player.playerID) {
            selectedTeam.heroes.push(hero);
        }
    });
}

function getPositions (teamObject) {
    var heroNumber = 1;
    teamObject.heroes.forEach(function(hero){
        console.log("getting positions");
        $.ajax({
            url:"/users/getlatestpositions?hero="+hero.heroID,
            contentType: "application/json",
            //data: {id: "SomeID"},
            success: function(response) {
                console.log(response);
                response.forEach(function(movement) {
                    hero.positions.push(movement);
                });
                heroNumber++;
                console.log(heroNumber);
                if (heroNumber == 9) {
                    generateHeatmap();
                }
            }
        });
    });
}

function generateHeatmap() {

if (radiantHeatmap == null){
radiantHeatmap = h337.create(radiantHeatmapConfig);
}
    var team = teamDict["radiant"];
    console.log(team.name);
    var positionDataArray = [];
    team.heroes.forEach(function(hero){
        hero.positions.forEach(function(position){
            var xPos = convertToRange(position.xPos, [(-7500), 7500], [0, 500]);
            var yPos = convertToRange(position.yPos, [(-7500), 7500], [0, 500]);
            var weightVal = 1;
            var point = {
                x: xPos,
                y: 500-yPos,
                value: weightVal
            };
            positionDataArray.push(point);
        });
    });

    var data = {
        min: 0,
        max: 10,
        data: positionDataArray
    };

    radiantHeatmap.setData(data);
    console.log(data);
    console.log("Heatmap created.");
    generateDireHeatmap();
    drawPlayers();
}

function generateDireHeatmap() {
    if (direHeatmap == null) {
        direHeatmap = h337.create(direHeatmapConfig);
    }

    var team = teamDict["dire"];
    console.log(team.name);
    var positionDataArray = [];
    team.heroes.forEach(function(hero){
        hero.positions.forEach(function(position){
            var xPos = convertToRange(position.xPos, [(-7500), 7500], [0, 500]);
            var yPos = convertToRange(position.yPos, [(-7500), 7500], [0, 500]);
            var weightVal = 1;
            var point = {
                x: xPos,
                y: 500-yPos,
                value: weightVal
            };
            positionDataArray.push(point);
        });
    });

    var data = {
        min: 0,
        max: 10,
        data: positionDataArray
    };

    direHeatmap.setData(data);
    console.log(data);
    console.log("Heatmap created.");
}

function drawPlayers () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    teamList.forEach(function(team){
        team.heroes.forEach(function(hero){
            var xPos = convertToRange(hero.positions[hero.positions.length-1].xPos, [(-7500), 7500], [0, 500]);
            var yPos = convertToRange(hero.positions[hero.positions.length-1].yPos, [(-7500), 7500], [0, 500]);
            if (team.name=="dire") {
                ctx.fillStyle = "#FF0000";
            }
            else {
                ctx.fillStyle = "blue";
            }
            //ctx.strokeStyle = "#000000";            
            ctx.beginPath();
            ctx.arc(xPos,500-yPos,10,0,2*Math.PI);
            //ctx.stroke();
            ctx.fill();
        });
    });
}

// Object constructors

function Player(playerID) {
    this.playerID = playerID;
}

function Hero(heroID, player) {
    this.heroID = heroID;
    this.player = player;
    this.positions = [];
}

function Team(teamID, name) {
    this.teamID = teamID;
    this.name = name;
    this.heroes = [];
}

// Helper functions


// http://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
function convertToRange(value, srcRange, dstRange){
  if (value < srcRange[0] || value > srcRange[1]){
    return NaN; 
  }

  var srcMax = srcRange[1] - srcRange[0],
      dstMax = dstRange[1] - dstRange[0],
      adjValue = value - srcRange[0];

  return (adjValue * dstMax / srcMax) + dstRange[0];
}
//

// Reading functions

function readPlayers (playerObj) {
    console.log(playerObj.playerID);
}

function readHeroes (heroObj) {
    console.log(heroObj.heroID+" corresponds to "+heroObj.player.playerID+" "+heroObj.name+" "+heroObj.player.name);
}

function readTeams (teamObj) {
    var name = teamObj.name;
    var list = teamObj.heroes;
    console.log("Team "+name+" consists of...");
    list.forEach(function(hero) {
        console.log(hero.player.name+", aka "+hero.heroID);
    });
}