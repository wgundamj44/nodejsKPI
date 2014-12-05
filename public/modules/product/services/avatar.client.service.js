'user strict';

angular.module('product').factory('AvatarAPI', ['$resource',
  function($resource) {
    return {
      funcList: function(productName) {
        return $resource('/product/' + productName + '/funcList');
      },
      dau: function (productName) {
        return $resource('/product/' + productName + '/dau');
      },
      generalKPIList: function(productName) {
        return $resource('/product/' + productName + '/generalKPIList');
      },
      loadGeneralKPI: function() {
        return $resource('/product/avatar/loadGeneralKPI');
      }
    };
  }
]);
