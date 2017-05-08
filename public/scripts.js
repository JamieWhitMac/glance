var selectedMatch;
var playerList;
var heroList;
var teamList;

var canvas;
var ctx;

$( document ).ready(function() {

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
//ctx.moveTo(0,0);
//ctx.lineTo(200,100);
//ctx.stroke();

    playerList = [];
    heroList = [];
    teamList = [];

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
        teamList.forEach(getPositions);
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
  console.log(selectedMatch);
 // var optionSelected = $("#select-custom-21")
});

});

// End of event listeners


function addNewMatch(matchID) {
    $("#selector").append('<option value="'+matchID+'">'+matchID+'</option>');
}

function createPlayers(playerObject){
    var player = new Player(playerObject.entityID);
    var hero = new Hero(playerObject.currentPropertyValue, player);
    playerList.push(player);
    heroList.push(hero);
}

function assignNames (nameObject) {
    if (nameObject.entityType=="Nucleus.DataSources.Dota2.HeroEntity") {
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
    teamObject.heroes.forEach(function(hero){
        $.ajax({
            url:"/users/getlatestpositions?hero="+hero.heroID,
            contentType: "application/json",
            //data: {id: "SomeID"},
            success: function(response) {
                response.forEach(function(movement) {
                    hero.positions.push(movement);
                });
            }
        });
    });
}

function generateHeatmap() {

var heatmapInstance = h337.create({
  // only container is required, the rest will be defaults
  container: document.querySelector('.heatmap')
});

    var team = teamList[1];
    console.log(team.name);
    var positionDataArray = [];
    team.heroes.forEach(function(hero){
        hero.positions.forEach(function(position){
            var xPos;
            var yPos;
            var weightVal;

            var splitString = position.currentPropertyValue.split(",");
            xPos = convertToRange(parseInt(splitString[0]), [(-7500), 7500], [0, 500]);
            yPos = convertToRange(parseInt(splitString[1]), [(-7500), 7500], [0, 500]);
            weightVal = 1;
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
        max: 20,
        data: positionDataArray
    };

    heatmapInstance.setData(data);
    console.log(data);
    console.log("Heatmap created, apparently");
}

function drawPlayers () {
    teamList.forEach(function(team){
        team.heroes.forEach(function(hero){
            var splitString = hero.positions[0].currentPropertyValue.split(",");
            console.log(splitString);
            var xPos = convertToRange(parseInt(splitString[0]), [(-7500), 7500], [0, 500]);
            var yPos = convertToRange(parseInt(splitString[1]), [(-7500), 7500], [0, 500]);
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