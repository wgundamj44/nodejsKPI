'use strict';

angular.module('product').factory('CommonAPI', ['$resource',
  function($resource) {
    return {
      funcList: function(productName) {
        return $resource('/product/' + productName + '/funcList');
      },
      dau: function (productName) {
        return $resource('/product/' + productName + '/dau');
      }
    };
  }
]);
