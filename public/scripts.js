var selectedMatch;
var playerList;
var heroList;
var teamList;

$( document ).ready(function() {

    playerList = [];
    heroList = [];
    teamList = [];

    // Get data
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

function addNewMatch(matchID) {
    $("#selector").append('<option value="'+matchID+'">'+matchID+'</option>');
}

function createPlayers(playerObject, index){
    var player = new Player(playerObject.entityID);
    var hero = new Hero(playerObject.currentPropertyValue, player);
    playerList.push(player);
    heroList.push(hero);
}

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

   // console.log(teamObj.teamID+" "+teamObj.name);
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

function Player(playerID) {
    this.playerID = playerID;
}

function Hero(heroID, player) {
    this.heroID = heroID;
    this.player = player;
}

function Team(teamID, name) {
    this.teamID = teamID;
    this.name = name;
    this.heroes = [];
}
