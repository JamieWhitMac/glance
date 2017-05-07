var selectedMatch;
var playerList;
var heroList;
var teamList;

$( document ).ready(function() {

    // minimal heatmap instance configuration
//var heatmapInstance = h337.create({
  // only container is required, the rest will be defaults
//  container: document.querySelector('.heatmap')
//});

// now generate some random data
var points = [];
var max = 0;
var width = 500;
var height = 500;
var len = 200;

while (len--) {
  var val = Math.floor(Math.random()*100);
  max = Math.max(max, val);
  var point = {
    x: Math.floor(Math.random()*width),
    y: Math.floor(Math.random()*height),
    value: val
  };
  points.push(point);
}
// heatmap data format
//var data = { 
//  max: max, 
//  data: points 
//};
// if you have a set of datapoints always use setData instead of addData
// for data initialization
// heatmapInstance.setData(data);

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
       // console.log("Hello there.");
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
            xPos = parseInt(splitString[0])*(-1)/30;
            yPos = parseInt(splitString[1])*(-1)/30;
            weightVal = 1;
            var point = {
                x: xPos,
                y: yPos,
                value: weightVal
            };
            positionDataArray.push(point);
        });
    });

    var data = {
        max: 80,
        data: positionDataArray
    };

    heatmapInstance.setData(data);
    console.log(data);
    console.log("Heatmap created, apparently");
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