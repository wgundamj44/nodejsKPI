'use strict';

var init = require('../../config/init')(),
    config = require('../../config/config'),
    mongoose = require('mongoose'),
    mongoClient = require('mongodb').MongoClient,
    path = require('path');

var firstName = process.argv[2],
    lastName  = process.argv[3],
    password  = process.argv[4];

if (!firstName || !lastName || !password) {
  console.log(process.argv);
  console.error('need firstName, lastName and password');
  process.exit(1);
}

var db = mongoose.connect(config.db, function(err) {
	if (err) {
      console.error(err);
	}
});

// init models
config.getGlobbedFiles('../models/**/*.js').forEach(function(modelPath) {
  require(path.resolve(modelPath));
});

//var app = require('../../config/express')(db);
var User = mongoose.model('User');

var username = firstName + '.' + lastName;

var user = new User(
  {
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    provider: 'local',
    email: 'test@trifort.jp'
  }
);
User.find(function(err, data) {
  console.log('here');
  console.log(err);
  console.log(data);
});


user.save(function(err){
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log('Success, Your user info is: ');
    console.log(user);
    process.exit(0);
  }
});

