const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getData = function(name, callback) {
    console.log(name);
    //var data;
      const collection = mongoose.connection.collection("propertyStream");
      console.log(collection.name);
      const query = {propertyName: name}
      var options = {
          "sort": [["_id","desc"],["entityID","desc"]],
          "limit": 50
      }

      collection.find(query, options).toArray(function(err, items) {
          if (err) {
              console.log("Broken");
              throw err;
          }
          if (items) {
              console.log(items);
              callback(null, items);
          }
      });
}