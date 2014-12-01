'use strict';

var product = require('./product.server.controller'),
    mongoClient = require('mongodb').MongoClient,
    config = require('../../config/config.js'),
    errorHandler = require('./errors.server.controller');

require('date-utils');


var productName = "AvatarDrive";

exports.funcList = function(req, res) {
  return res.json(['DAU', 'Sales', 'ARPU']);
};

exports.dau = function(req, res) {
  var from = req.query.from,
      to   = req.query.to;

  if (!from || !to) {
    to   = new Date().addDays(-1).toYMD('-');
    from = new Date().addDays(-8).toYMD('-');
  }

  mongoClient.connect(config.db, function(err, db) {
    if (err) {
      console.err(err);
      return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
	  });
    } 

    var col = db.collection('Avatar_GeneralKPI');
    var ret = [];
    col.find({date: {$gte: from, $lte: to}}, {"_id" : 0, "DAU": 1}).sort({date: 1}).toArray(function(err, r) {
      if (err) {
        console.err(err);
        return res.status(400).send({
		  message: errorHandler.getErrorMessage(err)
	    });
      } else {
        r.forEach(function(val, index, array) {
          if (index === 0) {
            val.change = 0;
            ret.push(val);
          } else {
            val.DAU = Match.random();
            val.change = val.DAU - array[index - 1].DAU;
            ret.push(val);
          }
        });
        return res.json({data: ret});
      }
    });
  });
};

