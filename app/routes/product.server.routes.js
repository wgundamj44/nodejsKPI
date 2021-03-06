'use strict';

var product = require('../../app/controllers/product.server.controller'),
    avatar = require('../../app/controllers/avatar.server.controller'),
    users = require('../../app/controllers/users.server.controller'),
    express = require('express');

module.exports = function(app) {
  var router = express.Router();
  router.use(users.requiresLogin);
  router.route('/avatar/funcList').get(avatar.funcList);
  router.route('/avatar/dau').get(avatar.dau);
  router.route('/avatar/generalKPIList').get(avatar.generalKPIList);
  router.route('/avatar/loadGeneralKPI').get(avatar.loadGeneralKPI);
  router.route('/avatar/downloadGeneralKPI').get(avatar.downloadGeneralKPI);

  app.use('/product', router);
};
