'use strict';

angular.module('product').
  controller('avatarGeneralKPIController',
     ['$scope', '$http', '$stateParams', 'AvatarAPI', 'generalKPIList',
      function($scope, $http, $stateParams, AvatarAPI, generalKPIList) {

        $scope.productName = 'AvatarDrive';
        $scope.kpiTitle    = 'GeneralKPI';
        

        $scope.gdata = [
        ];

        $scope.generalKPIList = generalKPIList;

        $scope.hasData = function() {
          return $scope.gdata.length > 0;
        };

        $scope.xAxisTickFormat = function() {
          return function(d) {
            return d3.time.format('%x')(new Date(d));
          };
        };
        $scope.yAxisTickFormat = function() {
            return d3.format(',f');
        };

        $scope.loadKPI = function() {
          $scope.clearFigure();
          if (!$scope.kpiName) return;
          var format = d3.time.format('%Y-%m-%d');
          AvatarAPI.loadGeneralKPI().get({kpiName: $scope.kpiName, from: $scope.from, to: $scope.to}, function(res) {
            $scope.data = res.data;
            
            if ($scope.data.length == 0) {
              return;
            }
            var keys = Object.keys($scope.data[0]).filter(function(name) {
              return name != 'date';
            });
            var series = {}, gdata = [];
            $scope.kpiNames = keys;
            keys.forEach(function(key) {
              series[key] = [];
            });
            //            var series = {key: $scope.kpiName, values: []};
            
            res.data.forEach(function(entry, index, array) {
              //  series.values.push([format.parse(entry.date).getTime(), entry[$scope.kpiName]]);
              keys.forEach(function(key) {
                series[key].push([format.parse(entry.date).getTime(), entry[key]]);
              });
            });
            //            $scope.gdata = [series];
            
            Object.keys(series).forEach(function(key) {
              gdata.push({key: key, values: series[key]});
            });
            console.log(gdata);
            $scope.gdata = gdata;
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
          $scope.gdata = [
          ];
        };
      }
     ]
  );
