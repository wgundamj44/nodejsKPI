'use strict';

var product = require('./product.server.logic'),
    mongoClient = require('mongodb').MongoClient,
    config = require('../../config/config.js');


function avatar() {
  this.productName = "AvatarDrive";
}

avatar.prototype.dau = function(from, to) {
  mongoClient.connect(config.db, function(err, db) {
    if (err) {
      console.err(err);
      return;
    }

    
  });
}

module.exports = avatar;
