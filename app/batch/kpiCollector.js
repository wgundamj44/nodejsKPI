'use strict';

/*
* node kpiCollector.js productName targetDate kpiName
*
* productName: MUST
* targetDate: MUST
* kpiName: OPTIONAL
*/

require('date-utils');

process.env.NODE_ENV = 'development';

var spawn = require('child_process').spawn,
    fs = require('fs'),
    mongoClient = require('mongodb').MongoClient,
    config = require('../../config/config.js'),
    baseDir = '/BACKUP/log/';

var productName = process.argv[3] || 'Avatar',
    targetDate = process.argv[4] || new Date().addDays(-1).toYMD('-'),
    kpiName     = process.argv[5] || 'GeneralKPI';


function loadKPI(logDir, name, date, kpi) {
  var dir = logDir + name + '/' + date;
  
  if (kpi) {
    var file = dir + '/' + kpi;
    saveKPI([file]);
    return;
  }
  
  fs.readdir(dir, function(err, list) {
    if (err) {
      console.log(err);
      throw err;
    }
    var fileList = [];
    console.log(list);
    list.forEach(function(el, i, array) {
      fileList.push({ path: dir + '/' + el, name: name, kpi: el, date: date });
    });
    saveKPI(fileList);
  });
}

function saveKPI(jobList) {
  console.log(jobList);
  console.log('here');
  var job = jobList.pop();
  if (!job) {
    return;
  }

  
  var collectionName = job.name + '_' + job.kpi,
      cat = spawn('cat', [job.path]);

  cat.stdout.on('data', function(data) {
    var kpiData = JSON.parse('' + data);
    console.log(kpiData);
    mongoClient.connect(config.db, function(err, db) {
      if (err) {
        console.err(err);
        return;
      }
      db.collection(collectionName).update(
        { date: job.date },
        kpiData,
        {
          upsert: true
        },
        function(err, result) {
          if (err) {
            console.err(err);
            return;
          }
          console.log('success');
          db.close();
          saveKPI(jobList);
        }
      );
    });
  });

  cat.stderr.on('data', function(data) {
    console.log('stderr ' + data);
  });
}


loadKPI(baseDir, productName, targetDate);
