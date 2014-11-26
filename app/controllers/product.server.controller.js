'use strict';


exports.dispatch = function(req, res) {
  var productName = req.params.productName,
      func = req.params.func;

  func(req, res);
};

