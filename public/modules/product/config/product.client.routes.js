'use strict';

angular.module('product').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('avatar', {
        url: '/product/avatar',
        templateUrl: 'modules/product/views/avatar/avatar.client.view.html',
        resolve: {
          funcList: ['AvatarAPI', function(AvatarAPI) {
            return AvatarAPI.funcList('avatar').query();
          }]
        },
        controller: ['$scope', 'funcList', function($scope, funcList) {
          $scope.kpi_func = funcList;
        }]
      })
    // generalKPI special
      .state('avatar.general', {
        url: '/generalKPI',
        resolve: {
          generalKPIList: ['AvatarAPI', function(AvatarAPI) {
            return AvatarAPI.generalKPIList('avatar').query();
          }]
        },
        templateUrl: function($stateParams) {
          return 'modules/product/views/avatar/' + 'generalKPI' + '.client.view.html';
        },
        controller: 'avatarGeneralKPIController'
      })
    // other kpi func
      .state('avatar.func', {
        url: '/{func}',
        templateUrl: function($stateParams) {
          return 'modules/product/views/avatar/' + $stateParams.func + '.client.view.html';
        },
        parent: 'avatar',
        controllerProvider: ['$stateParams', function($stateParams) {
          return $stateParams.productName + 'Controller';
        }]
      });
  }
]);
