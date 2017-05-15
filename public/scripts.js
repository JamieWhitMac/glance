var matchDict;

var selectedMatch;
var playerList;
var heroList;
var teamList;

var heroDict;
var teamDict;
var observerDict;
var heroIconDict;

var deadObserverDict;

var eventBuffer;

var movementsStored;
var maxQueryResponse;
var currentGameTime;

var visualisationLoopingInterval;
var visualisationLoopTime;

var matchSelectUpdateInterval;
var matchSelectLoopTime;

var radiantControlHeatmap;
var direControlHeatmap;

var radiantControlHeatmapConfig;
var direControlHeatmapConfig;

var radiantGoldHeatmap;
var direGoldHeatmap;

var radiantGoldHeatmapConfig;
var direGoldHeatmapConfig;

var canvas;
var ctx;
var fps;

var visualisationSize;

var wardRadius;

var eventFeed;

var heatmapFunctionsDict;

$( document ).ready(function() {

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

    currentGameTime = (-1000);

    playerList = [];
    heroList = [];
    teamList = [];

    eventBuffer = [];

    matchDict = {};

    heroDict = {};
    teamDict = {};
    observerDict = {};
    deadObserverDict = {};

    heroIconDict = {};

    movementsStored = 125;
    maxQueryResponse = 500;

    visualisationLoopTime = 2000;
    matchSelectLoopTime = 3000;

    radiantGoldHeatmapConfig = {
        container: document.getElementById("radiantGoldHeatmap"),
        gradient: {
    ".5": "#46b72d",
    ".8": "#b1e04c",
    ".95": "#f2d530"
        }
    }

    direGoldHeatmapConfig = {
        container: document.getElementById("direGoldHeatmap"),
        gradient: {
            ".5": "#b72d2d",
            ".8": "#f2a73e",
            ".95": "#f2d530"
        }
    }

    radiantControlHeatmapConfig = {
        container: document.getElementById("radiantHeatmap"),
        gradient: {
    ".5": "#61a57a",
    ".8": "#48c977",
    ".95": "#26f271"
        }
    }

        direControlHeatmapConfig = {
        container: document.getElementById("direHeatmap"),
        gradient: {
            ".5": "#d81145",
            ".8": "#bc3659",
            ".95": "#822e44"
        }
    }

    visualisationSize = $("#visualisationDiv").height();

    var v = 1600;

    wardRadius = convertFromGameUnits(v);

    eventFeed = $("#eventBuffer");

    // Debugging buttons

    $("#databutton").on("click", function() {
        console.log("Hello there.");
        $.ajax({
            url:"/users/getpositiondata?matchid="+selectedMatch,
            contentType: "application/json",
            success: function(response) {
                console.log(response);
            }
        });
    });

        $("#namesbutton").on("click", function() {
        console.log("Hello there.");
        $.ajax({
            url:"/users/getnames?matchid="+selectedMatch,
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
            url:"/users/getteams?matchid="+selectedMatch,
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
            url:"/users/getheroes?matchid="+selectedMatch,
            contentType: "application/json",
            success: function(response) {
                console.log(response);
            }
        });
    });

        $("#playersbutton").on("click", function() {
        console.log("Hello there.");
        $.ajax({
            url:"/users/getplayers?matchid="+selectedMatch,
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

    //

$("#matchSel").change(function() {
    selectedMatch = this.value;
   // $("#selector").append('<option value="4">The 4th Option</option>');
  // console.log(selectedMatch);
});

$("#heatmapSelector").change(function() {
    changeHeatmap(this.value);
   // $("#selector").append('<option value="4">The 4th Option</option>');
  // console.log(selectedMatch);
});

// When leaving the Match Selector page
$(document).on("pagebeforehide","#matchSelector",function(){
    setupMatch();
    clearInterval(matchSelectUpdateInterval);
  //console.log(selectedMatch);
 // var optionSelected = $("#select-custom-21")
});

// When leaving the Visualisation page
$(document).on("pagebeforehide","#glancevisualisation",function(){
    // Refresh everything
    matchSelectUpdateInterval = setInterval(selectMatchUpdateLoop, matchSelectLoopTime);
   // console.log("start interval");
//setupMatch();
  //console.log(selectedMatch);
 // var optionSelected = $("#select-custom-21")
});

// Start match selector loop
matchSelectUpdateInterval = setInterval(selectMatchUpdateLoop, matchSelectLoopTime);

});

// End of event listeners

// Check for avaialable matches

function selectMatchUpdateLoop() {
               $.ajax({
            url:"/users/getmatches",
            contentType: "application/json",
            success: function(response) {
               // console.log(response);
                response.forEach(sortMatches);
            }
        });
}

function sortMatches(matchObject) {
    var matchID = matchObject.matchID;
    var state = matchObject.currentPropertyValue;
    if (state == "DOTA_GAMERULES_STATE_POST_GAME" && matchDict[matchID]!=null) {
        removeMatch(matchID);
    }
    else {
    if (matchDict[matchID] != matchObject && state != "DOTA_GAMERULES_STATE_POST_GAME") {
        addNewMatch(matchObject);
    }
    }
}

function addNewMatch(matchObject) {
  //  console.log("adding match");
    var matchID = matchObject.matchID;
    if (matchDict[matchObject.matchID] == null) {
     //   console.log("adding to DOM");
        // Add to DOM
         $('#matchSel').append('<option id ="'+matchID+'"value="'+matchID+'">'+matchID+'</option>');
         //$("#matchSel").trigger("refresh");
         $("#matchSel").selectmenu('refresh', true);
         alert("New match available! "+matchID);
    }
    else {
        // Update DOM
    }
    matchDict[matchObject.matchID] = matchObject;
}

function removeMatch(matchID) {
    delete matchDict[matchID];
    $("#"+matchID).remove();
}

// First-time visualisation setup

function setupMatch() {
    getPlayers();
  //  getObserverData();
  //  getHealthData();
}

function getPlayers() {
           $.ajax({
            url:"/users/getplayers?matchid="+selectedMatch,
            contentType: "application/json",
            success: function(response) {
          //      console.log(response);
                response.forEach(createPlayers);
                playerList.forEach(readPlayers);

                // CHECK FOR ERRORS

                getNames();
            }
        });
}

function getNames() {
     $.ajax({
            url:"/users/getnames?matchid="+selectedMatch,
            contentType: "application/json",
            success: function(response) {
           //     console.log(response);
                response.forEach(assignNames);
                heroList.forEach(readHeroes);

                // CHECK FOR ERRORS

                getTeams();
            }
        });
}

function getTeams() {
            $.ajax({
            url:"/users/getteams?matchid="+selectedMatch,
            contentType: "application/json",
            success: function(response) {
           //     console.log(response);
                response.forEach(assignTeams);
                teamList.forEach(readTeams);

                // CHECK FOR ERRORS
                getGoldEvents();
                getInitialHeroPositions();
            }
        });
}

function getInitialHeroPositions() {
    teamList.forEach(function(teamObject) {
    teamObject.heroes.forEach(function(hero){
    //    console.log("getting positions");
        $.ajax({
            url:"/users/getinitialpositions?hero="+hero.heroID+"&limit="+movementsStored+"&matchid="+selectedMatch,
            contentType: "application/json",
            //data: {id: "SomeID"},
            success: function(response) {
                response.reverse();
           //     console.log(response);
                response.forEach(function(movement) {
            logMovement(movement);
            });
            }
        });
    });
});
            generateRadiantControlHeatmap();
            generateRadiantGoldHeatmap();
            generateDireGoldHeatmap();
            generateDireControlHeatmap();
            $("#radiantGoldHeatmap").hide();
            $("#direGoldHeatmap").hide();
            getObserverData();
            getHealthData();

            drawPlayers();
            visualisationLoopingInterval = setInterval(visualisationUpdateLoop, visualisationLoopTime);
}

function createPlayers(playerObject){
    if (playerObject.currentPropertyValue!="hero-1") {
    var player = new Player(playerObject.entityID);
    var hero = new Hero(playerObject.currentPropertyValue, player);
    playerList.push(player);
    heroList.push(hero);
    heroDict[playerObject.currentPropertyValue] = hero;
    }
}


function assignNames (nameObject) {
    if (nameObject.entityType=="Nucleus.DataSources.Dota2.HeroEntity") {
     //   console.log(nameObject.entityType);
        heroList.forEach(function heroName(hero){
            if (nameObject.entityID == hero.heroID) {
                hero.name = nameObject.currentPropertyValue;
                loadHeroIcon(hero.name);
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

function loadHeroIcon(heroName) {
    var iconObj = new Image();
    var heroImageSrc = heroName.replace("npc_dota_hero_", "");
    heroImageSrc+=".png";
 //   console.log(heroImageSrc);
    iconObj.src = "minimapicons/"+heroImageSrc;
    heroIconDict[heroName] = iconObj;
   // iconObj.src = ""
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
            hero.team = selectedTeam;
        }
    });
}

// End of first time setup

function visualisationUpdateLoop() {
    getGoldEvents();
    getHeroPositions();
    generateRadiantGoldHeatmap();
    generateDireGoldHeatmap();
    generateRadiantControlHeatmap();
    generateDireControlHeatmap();
    getObserverData();
    getHealthData();
    drawPlayers();
 //  console.log("loop!");
}

function getGoldEvents() {
       var requrl = "/users/getlatestgoldevents?";
        if (playerList.length == 10) {
            var playerNumber = 1;
            playerList.forEach(function(player){
                if (playerNumber == 1){
                   var newurl = requrl+"player"+playerNumber+"="+player.playerID;
                   requrl = newurl;
                }
                else {
                var newurl =  requrl+"&player"+playerNumber+"="+player.playerID;
                requrl = newurl;
            }
         //   console.log(requrl);
            playerNumber++;
            });
        }
        else {
            console.log ("Wrong number of players: "+playerList.length);
        }
            var newurl = requrl+"&time="+currentGameTime+"&limit="+maxQueryResponse+"&matchid="+selectedMatch;
            requrl = newurl;
        $.ajax({
            url:requrl,
            contentType: "application/json",
            success: function(response) {
                response.reverse();
                response.forEach(function(goldEvent) {
                logGoldEvent(goldEvent);
            });
            }
        });
}

function logGoldEvent(goldEvent){
    var splitString = goldEvent.currentPropertyValue.split(",");
    var xPos = splitString[0];
    var yPos = splitString[1];
    var goldEarned = splitString[2];

    var goldEarnedEvent = {
        xPos,
        yPos,
        goldEarned
    }

heroList.forEach(function(hero) {
    if (hero.player.playerID == goldEvent.entityID) {
        hero.goldEvents.push(goldEarnedEvent);
    }
});
}

function getHeroPositions() {
       var requrl = "/users/getlatestpositions?";
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
         //   console.log(requrl);
            heroNumber++;
            });
        }
        else {
        //    console.log ("Wrong number of heroes: "+heroList.length);
        }
            var newurl = requrl+"&time="+currentGameTime+"&limit="+maxQueryResponse+"&matchid="+selectedMatch;
            requrl = newurl;
        $.ajax({
            url:requrl,
            contentType: "application/json",
            success: function(response) {
                response.reverse();
                response.forEach(function(movement) {
                logMovement(movement);
            });
            }
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
 //    console.log("logged");
}

function getObserverData() {
    $.ajax({
        url:"/users/getobserverdata?matchid="+selectedMatch,
        contentType: "application/json",
        success: function(response) {
        //    console.log(response);
            updateObservers(response);
            }
        });
}

function updateObservers(observerData) {
    observerData.forEach(function(observerEntry) {
        if (observerEntry.propertyName == "WardPlacedEvent") {
            if (observerDict[observerEntry.entityID] == null && deadObserverDict[observerEntry.entityID] == null) {
                var splitString = observerEntry.currentPropertyValue.split(",");
                var placedBy = splitString[0];
                var xPos = parseInt(splitString[1]);
                var yPos = parseInt(splitString[2]);

                var newObserver = new Observer(observerEntry.entityID, heroDict[placedBy.toString()]);
        //        console.log(heroDict[placedBy.toString()]);
        //        console.log(newObserver.hero);
                newObserver.xPos = xPos;
                newObserver.yPos = yPos;
                observerDict[observerEntry.entityID] = newObserver;

                var observerPlacedEvent = new GameEvent (newObserver.hero, "observerPlaced", xPos, yPos, observerEntry.gameTime);
                console.log(observerPlacedEvent);
                eventBuffer.push(observerPlacedEvent);
                addToEventFeed(observerPlacedEvent);
            }
        }

        if (observerEntry.propertyName == "WardExpiredEvent") {
            if (observerDict[observerEntry.entityID] != null) {
                var observer = observerDict[observerEntry.entityID];
                var placedBy = observer.hero; 
                var observerExpiredEvent = new GameEvent(placedBy, "observerExpired", observer.xPos,observer.yPos, observerEntry.gameTime);
                console.log(observerExpiredEvent);
                eventBuffer.push(observerExpiredEvent);
                addToEventFeed(observerExpiredEvent);

                deadObserverDict[observer.observerID] = observerEntry.gameTime;
                delete observerDict[observerEntry.entityID];
            }
        }

        if (observerEntry.propertyName == "WardDestroyedEvent") {
            if (observerDict[observerEntry.entityID] != null) {
                var observer = observerDict[observerEntry.entityID];
                var placedBy = observer.hero; 
                var observerDestroyedEvent = new GameEvent(placedBy, "observerDestroyed", observer.xPos,observer.yPos, observerEntry.gameTime);
                observerDestroyedEvent.heroResponsible = heroDict[observerEntry.currentPropertyValue];
                console.log(observerDestroyedEvent);
                eventBuffer.push(observerDestroyedEvent);
                addToEventFeed(observerDestroyedEvent);

                deadObserverDict[observer.observerID] = observerEntry.gameTime;
                delete observerDict[observerEntry.entityID];
            }
        }
    });

  //  console.log(observerDict);
}

function getHealthData() {
    $.ajax({
        url:"/users/gethealthdata?matchid="+selectedMatch,
        contentType: "application/json",
        success: function(response) {
       //     console.log(response);
            assignHealthData(response);
            }
        });
}

function assignHealthData(data) {
    data.forEach(function (healthObject) {
        var splitString = healthObject.entityID.split(",");
        var heroID = splitString[0];
        var healthProperty = splitString[1];
        var healthValue = healthObject.currentPropertyValue;

        if (heroDict[heroID]!=null){
            var hero = (heroDict[heroID]);
        if(healthProperty == "CurrentMaxHealth") {
            hero.maxHealth = healthValue;
        }
        if(healthProperty == "CurrentHealth") {
            hero.health = healthValue;
            if (healthValue == 0 && hero.isAlive == true) {
                hero.isAlive = false;
               console.log(hero.name+ " is dead");
               var deathEvent = new GameEvent (hero, "death", hero.positions[hero.positions.length-1].xPos, hero.positions[hero.positions.length-1].yPos, currentGameTime);
               console.log(deathEvent);
               addToEventFeed(deathEvent);
               eventBuffer.push(deathEvent);
            }
            else {
                if (!hero.isAlive && healthValue != 0) {
                    hero.isAlive = true;
                    console.log(hero.name+ " is alive again");
                    var respawnEvent = new GameEvent (hero, "respawn", hero.positions[hero.positions.length-1].xPos, hero.positions[hero.positions.length-1].yPos, currentGameTime);
                    console.log(respawnEvent);
                    eventBuffer.push(respawnEvent);
                    addToEventFeed(respawnEvent);
                }
            }
        }
        }
    });
}


function generateRadiantControlHeatmap() {

if (radiantControlHeatmap == null){
radiantControlHeatmap = h337.create(radiantControlHeatmapConfig);
}
    var team = teamDict["radiant"];
    //console.log(team.name);
    var positionDataArray = [];
    team.heroes.forEach(function(hero){
        hero.positions.forEach(function(position){
            var xPos = convertToRange(position.xPos, [(-7500), 7500], [0, visualisationSize]);
            var yPos = convertToRange(position.yPos, [(-7500), 7500], [0, visualisationSize]);
            var weightVal = 1;
            var point = {
                x: xPos,
                y: visualisationSize-yPos,
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

    radiantControlHeatmap.setData(data);
}

function generateDireControlHeatmap() {
    if (direControlHeatmap == null) {
        direControlHeatmap = h337.create(direControlHeatmapConfig);
    }

    var team = teamDict["dire"];
   // console.log(team.name);
    var positionDataArray = [];
    team.heroes.forEach(function(hero){
        hero.positions.forEach(function(position){
            var xPos = convertToRange(position.xPos, [(-7500), 7500], [0, visualisationSize]);
            var yPos = convertToRange(position.yPos, [(-7500), 7500], [0, visualisationSize]);
            var weightVal = 1;
            var point = {
                x: xPos,
                y: visualisationSize-yPos,
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

    direControlHeatmap.setData(data);
  //  console.log(data);
  //  console.log("Heatmap created.");
}

function generateRadiantGoldHeatmap() {
if (radiantGoldHeatmap == null){
radiantGoldHeatmap = h337.create(radiantGoldHeatmapConfig);
}
    var team = teamDict["radiant"];
    //console.log(team.name);
    var goldDataArray = [];
    team.heroes.forEach(function(hero){
        hero.goldEvents.forEach(function(goldEvent){
            var xPos = convertToRange(goldEvent.xPos, [(-7500), 7500], [0, visualisationSize]);
            var yPos = convertToRange(goldEvent.yPos, [(-7500), 7500], [0, visualisationSize]);
            var weightVal = goldEvent.goldEarned;
            var point = {
                x: xPos,
                y: visualisationSize-yPos,
                value: weightVal
            };
            goldDataArray.push(point);
        });
    });

    var data = {
        min: 0,
        max: 300,
        data: goldDataArray
    };

    radiantGoldHeatmap.setData(data);
}

function generateDireGoldHeatmap() {
if (direGoldHeatmap == null){
direGoldHeatmap = h337.create(direGoldHeatmapConfig);
}
    var team = teamDict["dire"];
    //console.log(team.name);
    var goldDataArray = [];
    team.heroes.forEach(function(hero){
        hero.goldEvents.forEach(function(goldEvent){
            var xPos = convertToRange(goldEvent.xPos, [(-7500), 7500], [0, visualisationSize]);
            var yPos = convertToRange(goldEvent.yPos, [(-7500), 7500], [0, visualisationSize]);
            var weightVal = goldEvent.goldEarned;
            var point = {
                x: xPos,
                y: visualisationSize-yPos,
                value: weightVal
            };
            goldDataArray.push(point);
        });
    });

    var data = {
        min: 0,
        max: 300,
        data: goldDataArray
    };

    direGoldHeatmap.setData(data);
}

function changeHeatmap(value) {
    if (value == "control") {
        $("#radiantGoldHeatmap").hide();
        $("#direGoldHeatmap").hide();
        $("#radiantHeatmap").show();
        $("#direHeatmap").show();
        console.log("control");
    }
    if (value == "gold"){
             $("#radiantHeatmap").hide();
        $("#direHeatmap").hide();
        $("#radiantGoldHeatmap").show();
        $("#direGoldHeatmap").show(); 
        console.log("gold");
    }

    if (value == "off") {
        $("#radiantGoldHeatmap").hide();
        $("#direGoldHeatmap").hide();
        $("#radiantHeatmap").hide();
        $("#direHeatmap").hide();
        console.log("hide");
    }
}

function drawPlayers () {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
   // drawObservers();
    teamList.forEach(function(team){
        team.heroes.forEach(function(hero){
            if (hero.positions[hero.positions.length-1]!=null){
            var xPos = convertToRange(hero.positions[hero.positions.length-1].xPos, [(-7500), 7500], [0, canvas.width]);
            var yPos = convertToRange(hero.positions[hero.positions.length-1].yPos, [(-7500), 7500], [0, canvas.height]);
          //  console.log(xPos);
          //  console.log(yPos);
            if (team.name=="dire") {
                ctx.fillStyle = "#FF0000";
            }
            else {
                ctx.fillStyle = "#48f442";
            }

            var healthPortion = (hero.health/hero.maxHealth)*2;
            
            if(hero.health>0) {
            ctx.beginPath();
            ctx.arc(xPos,canvas.height-yPos,20,(-0.5)*Math.PI,(healthPortion-0.5)*Math.PI);
            ctx.lineTo(xPos, canvas.height-yPos);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(xPos,canvas.height-yPos,16,0,2*Math.PI);
            ctx.closePath();
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
            ctx.fill();

            var iconWidth = 35;
            var iconHeight = 35;
            ctx.drawImage(heroIconDict[hero.name], xPos-iconWidth/2, canvas.height-yPos-iconHeight/2, iconWidth, iconHeight);

            }
        });
    });
}

   function drawObservers () {
    for (var observer in observerDict) {
        var ward = observerDict[observer];
        if (ward.xPos != null && ward.yPos != null){
     //       var xPos = convertFromGameUnits(ward.xPos);
     //       var yPos = convertFromGameUnits(ward.yPos);

        var xPos = convertToRange(ward.xPos, [(-7500), 7500], [0, canvas.width]);
        var yPos = convertToRange(ward.yPos, [(-7500), 7500], [0, canvas.width]);
       // console.log(xPos);
       // console.log(yPos);
        if (ward.hero != null){
        if (ward.hero.team.name=="dire") {
                ctx.fillStyle = "rgba(169, 72, 79, 0.5)";
            }
            else {
                ctx.fillStyle = "rgba(75, 170, 73, 0.5)";
            }
            
            ctx.beginPath();
            ctx.arc(xPos,canvas.height-yPos,convertToRange(1600, [(0), 15000], [0, canvas.width]),0,2*Math.PI);
            console.log(wardRadius);
            //ctx.stroke();
            ctx.fill();
        }
        }
    }
}

function addToEventFeed (gEvent) {
    var hero = gEvent.hero;
    var team = hero.team;
    if(gEvent.type == "death"){
            var listItem = "<li><span class ='"+team.name+"'>"+hero.player.name+"</span> has died.</li>"
    }

    if (gEvent.type == "respawn") {
            var listItem = "<li><span class ='"+team.name+"'>"+hero.player.name+"</span> has returned to battle.</li>" 
    }

    if (gEvent.type == "observerPlaced") {
            var listItem = "<li><span class ='"+team.name+"'>"+hero.player.name+"</span> has placed an observer ward.</li>"
    }

    if (gEvent.type == "observerExpired") {
        var listItem = "<li><span class ='"+team.name+"'>"+hero.player.name+"\'s</span> observer ward has expired.</li>"
    }

    if (gEvent.type == "observerDestroyed") {
        var listItem = "<li><span class ='"+gEvent.heroResponsible.team.name+"'>"+gEvent.heroResponsible.player.name+"</span> has destroyed <span class = '"+team.name+"'>"+hero.player.name+"\'s</span> observer ward.</li>"
    }

    eventFeed.prepend(listItem);
    eventFeed.listview('refresh', true);
}

// Object constructors

function Player(playerID) {
    this.playerID = playerID;
}

function Hero(heroID, player) {
    this.heroID = heroID;
    this.player = player;
    this.goldEvents = [];
    this.positions = [];
    this.isAlive = true;
}

function Team(teamID, name) {
    this.teamID = teamID;
    this.name = name;
    this.heroes = [];
}

function Observer(observerID, hero) {
    this.observerID = observerID;
    this.hero = hero;
}

function GameEvent(hero, type, xPos, yPos, gameTime) {
    this.hero = hero;
    this.type = type;
    this.location = [xPos, yPos];
    this.gameTime = gameTime;
}

// Helper functions

function convertFromGameUnits(value) {
    console.log("initial value: ")+value;
    var newValue = convertToRange(value, [(-7500), 7500], [0, visualisationSize]);
    console.log("new value: ")+newValue;
    return newValue;
}

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
   // console.log(playerObj.playerID);
}

function readHeroes (heroObj) {
  //  console.log(heroObj.heroID+" corresponds to "+heroObj.player.playerID+" "+heroObj.name+" "+heroObj.player.name);
}

function readTeams (teamObj) {
    var name = teamObj.name;
    var list = teamObj.heroes;
   // console.log("Team "+name+" consists of...");
    list.forEach(function(hero) {
      //  console.log(hero.player.name+", aka "+hero.heroID);
    });
}