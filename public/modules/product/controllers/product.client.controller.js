'use strict';

angular.module('product').
  controller('avatarController',
    ['$scope', '$http', '$stateParams', 'Authentication', 'CommonAPI',
    function($scope, $http, $stateParams, Authentication, CommonAPI) {
      $scope.kpi_func = CommonAPI.funcList('avatar').query(function() {
      });
      $scope.productName = 'AvatarDrive';
      $scope.kpiTitle    = $stateParams.func;
      
      $scope.gconfig = {
        title: '',
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
          display: false,
          position: 'right'
        }
      };

      $scope.gdata = {
        series: [],
        data:[]
      };

      $scope.data = [];

      $scope.hasData = function() {
        return $scope.data.length > 0;
      };
      
      $scope.dau = function() {
        CommonAPI.dau('avatar').get({from: $scope.from, to: $scope.to}, function(res) {
          $scope.gconfig.title = 'DAU';
          $scope.data          = res.data;
          var tmpData = {
            series: ['dau'],
            data: []
          };
          $scope.data.forEach(function(entry, index, array) {
            tmpData.data.push({
              x: entry.date,
              y: [entry.DAU]
            });
          });
          $scope.gdata = tmpData;
          console.log($scope.data);
          console.log($scope.gdata);
        });
      };
    }
]);
                        
                                                           
  
