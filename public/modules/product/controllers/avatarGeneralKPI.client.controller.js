'use strict';

angular.module('product').
  controller('avatarGeneralKPIController',
     ['$scope', '$http', '$stateParams', 'AvatarAPI', 'generalKPIList',
      function($scope, $http, $stateParams, AvatarAPI, generalKPIList) {

        $scope.productName = 'AvatarDrive';
        $scope.kpiTitle    = 'GeneralKPI';
        

        $scope.data = [];

        $scope.generalKPIList = generalKPIList;

        $scope.hasData = function() {
          return $scope.data.length > 0;
        };

        $scope.loadKPI = function() {
          console.log($scope.kpiName);
          $scope.clearFigure();
          if (!$scope.kpiName) return;
          $scope.data = AvatarAPI.loadGeneralKPI().get({kpiName: $scope.kpiName, from: $scope.from, to: $scope.to}, function(res) {
            $scope.gconfig.title = $scope.kpiName;
            $scope.data = res.data;
            console.log($scope.data);
            $scope.data.forEach(function(entry, index, array) {
              $scope.gdata.data.push({
                x: entry.date,
                y: [entry[$scope.kpiName]]
              });
            });
          });
        };

        $scope.downloadKPI = function() {
          $http.get('/product/avatar/downloadGeneralKPI', {params: {from: $scope.from, to: $scope.to}}).success(function(data) {
            var element = angular.element('<a/>');
            element.attr({
              href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
              target: '_blank',
              download: 'kpi.csv'
            })[0].click();
          });
        };

        $scope.clearFigure = function() {
          $scope.data = [];
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
        };
      }
     ]
  );
