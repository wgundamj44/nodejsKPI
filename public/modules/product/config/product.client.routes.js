'use strict';

angular.module('product').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('product', {
        url: '/product/{productName}',
        templateUrl: 'modules/product/views/product.client.view.html',
        resolve: {
          funcList: ['$stateParams', 'CommonAPI', function($stateParams, CommonAPI) {
            return CommonAPI.funcList($stateParams.productName).query();
          }]
        },
        controller: ['$scope', '$stateParams', 'funcList', function($scope, $stateParams, funcList) {
          $scope.kpi_func = funcList;
        }]
      })
      .state('product.func', {
        url: '/{func}',
        templateUrl: function($stateParams) {
          return 'modules/product/views/' + $stateParams.func + '.client.view.html';
        },
        parent: 'product',
        controllerProvider: ['$stateParams', function($stateParams) {
          return $stateParams.productName + 'Controller';
        }]
      });
  }
]);
