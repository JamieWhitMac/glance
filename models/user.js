const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getData = function(name, matchID, callback) {
  //  console.log(name);
    //var data;
      const collection = mongoose.connection.collection(matchID);
   //   console.log(collection.name);
      const query = {propertyName: name};
      var options = {
          "sort": [["_id","desc"],["entityID","desc"]]
      }

      collection.find(query, options).toArray(function(err, items) {
          if (err) {
              console.log("Broken");
              throw err;
          }
          if (items) {
        //      console.log(items);
              callback(null, items);
          }
      });
}

module.exports.getLatestDataAboutEntity = function(entity, property, limit, time, matchID, callback) {
 //   console.log(property);
    //var data;
      const collection = mongoose.connection.collection(matchID);
  //    console.log(collection.name);
  //    console.log (entity);
      var query;
      var timeInt = parseInt(time);
      if (Array.isArray(entity)){
       query = {propertyName: property, entityID: {$in: entity}, gameTime: {$gt: timeInt}};
      }
      else {
          query = {propertyName: property, entityID: entity}
      }
  //    console.log(query);
      var limitInt = parseInt(limit);
      var options = {
          "sort": [["_id","desc"],["entityID","desc"]],
          "limit": limitInt
      }

      collection.find(query, options).toArray(function(err, items) {
          if (err) {
              console.log("Broken");
              throw err;
          }
          if (items) {
      //        console.log(items);
              callback(null, items);
          }
      });
}


module.exports.getDistinct = function(field, property, matchID, callback){
    const collection = mongoose.connection.collection(matchID);

    const query = {propertyName: property};

      collection.distinct(field, query, function(err, items) {
          if (err) {
              console.log("Broken");
              throw err;
          }
          if (items) {
    //          console.log(items);
              callback(null, items);
          }
      });
}

module.exports.getByEntityType = function(type, matchID, callback){
    const collection = mongoose.connection.collection(matchID);
    const query = {entityType: type};

    collection.find(query).toArray(function(err, items){
        if (err) {
              console.log("Broken");
              throw err;
          }
          if (items) {
  //            console.log(items);
              callback(null, items);
          }
    });
}

module.exports.getByProperties = function(field1, field2, value1, value2, matchID, callback) {
    const collection = mongoose.connection.collection(matchID);
    const query = {$or: [{propertyName : value1}, {propertyName : value2}]};
 //   console.log(query);

    collection.find(query).toArray(function(err, items){
        if(err) {
            console.log("Broken");
            throw err;
        }
        if (items) {
    //        console.log(items);
            callback(null, items);
        }
    });
}

module.exports.getMatches = function(callback) {
    const collection = mongoose.connection.collection("matchList");
    const query = {};

    collection.find(query).toArray(function(err, items){
                if(err) {
            console.log("Broken");
            throw err;
        }
        if (items) {
 //           console.log(items);
            callback(null, items);
        }
    });
}