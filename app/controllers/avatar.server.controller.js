'use strict';

var product = require('./product.server.controller'),
    mongoClient = require('mongodb').MongoClient,
    config = require('../../config/config.js'),
    errorHandler = require('./errors.server.controller'),
    csv = require('express-csv');

require('date-utils');


var productName = 'AvatarDrive';
var kpiPerCarrier = {
  'regist_user_num': 1,
  'DAU': 1,
  'sales': 1,
  'pay_UU': 1,
  'tutorial_end_num': 1
};

exports.funcList = function(req, res) {
  return res.json(['generalKPI', 'DAU']);
};

exports.generalKPIList = function(req, res) {
  mongoClient.connect(config.db, function(err, db) {
    if (err) {
      console.err(err);
      return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
	  });
    } 

    var col = db.collection('Avatar_GeneralKPI');
    var ret = [];
    col.find({}, {"_id" : 0, "date" : 0}).sort({date: 1}).limit(1).next(function(err, item) {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      var re = /^(.+)_([^_]+)$/;
      var kpiNames = Object.keys(item).filter(function(name) {
        var result = re.exec(name);
        if (result === null) {
          return true;
        }
        return !kpiPerCarrier.hasOwnProperty(result[1]);
      });
      kpiNames = kpiNames.concat(Object.keys(kpiPerCarrier));
      //      return res.json(Object.keys(item));
      return res.json(kpiNames);
    });
  });
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
    col.find({date: {$gte: from, $lte: to}}, {"_id" : 0, "DAU": 1, "date": 1}).sort({date: 1}).toArray(function(err, r) {
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
            val.change = val.DAU - array[index - 1].DAU;
            ret.push(val);
          }
        });
        return res.json({data: ret});
      }
    });
  });
};

exports.loadGeneralKPI = function(req, res) {
  var kpiName = req.query.kpiName,
      to   = req.query.to || new Date().addDays(-1).toYMD('-'),
      from = req.query.from || new Date().addDays(-8).toYMD('-');

  mongoClient.connect(config.db, function(err, db) {
    if (err) {
      console.log(err);
      res.json({});
    }
    var col = db.collection('Avatar_GeneralKPI'),
        cri = {_id: 0, date: 1};
    if (!kpiPerCarrier.hasOwnProperty(kpiName)) {
      cri[kpiName] = 1;
    } else {
      cri[kpiName + '_iOS'] = 1;
      cri[kpiName + '_iPad'] = 1;
      cri[kpiName + '_Android'] = 1;
      cri[kpiName + '_Kindle'] = 1;
      cri[kpiName] = 1;
    }
    console.log(cri);
    col.find({date: {$gte: from, $lte: to}}, cri).sort({date: 1}).toArray(function(err, items) {
      res.json({data: items});
    });
  });
};


exports.downloadGeneralKPI = function(req, res) {
  var to   = req.query.to || new Date().addDays(-1).toYMD('-'),
      from = req.query.from || new Date().addDays(-8).toYMD('-');

  mongoClient.connect(config.db, function(err, db) {
    if (err) {
      console.log(err);
      return res.json({});
    }
    var col = db.collection('Avatar_GeneralKPI'),
        csv_data = [];
    col.find({date: {$gte: from, $lte: to}}, {'_id': 0}).toArray(function(err, items) {
      if (err) {
        console.log(err);
        return res.json({});
      }
      if (items.length === 0) {
        return res.json({});
      }
      var header = Object.keys(items[0]);
      csv_data.push(header);
      items.forEach(function(val, index, array) {
        var row = [];
        header.forEach(function(key) {
          row.push(val[key]);
        });
        csv_data.push(row);
      });
      res.csv(csv_data);
    });
  });
};

