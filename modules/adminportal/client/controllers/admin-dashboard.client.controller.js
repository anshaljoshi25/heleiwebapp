/**
 * Created by anshal on 02-08-16.
 */
'use strict';

angular.module('adminportal').controller('AdminDashboardController', ['$scope','$timeout','$http', 'Authentication','uiGmapGoogleMapApi','uiGmapIsReady','MarkerCreatorService','Users','CategoryDataService','$state',
    function ($scope, $timeout, $http, Authentication, uiGmapGoogleMapApi, uiGmapIsReady, MarkerCreatorService,Users,CategoryDataService,$state) {
        // This provides Authentication context.

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
        $scope.newEvents=10;
        $scope.newRegistrations=20;
        $scope.newOrders=10;
        $scope.newFeedback=9;
        CategoryDataService.countAllCategory().then(function (d) {
            console.log('data returned');
            console.log(d);
             $scope.categories=d;
             $scope.fillPieChartRows('name',$scope.drawChart1);
        });


        /*
        * chart object for pie chart
        * */
        $scope.chartObject = {};
        $scope.chartObject.cssStyle = "height:100%; width:100%; ";
        $scope.chartObject.type = "PieChart";
        $scope.chartObject.options = {
            'title': 'Popular Event Categories',
            isStacked: 'relative',
            legend: {position: 'bottom', maxLines: 4}
        };

        $scope.rows1 = [];
        $scope.chartObject.data = {
            "cols": [
                {id: "t", label: "Name", type: "string"},
                {id: "s", label: "Total", type: "number"}
            ], "rows":$scope.rows
        };
        

        /*
        * methods to draw chart
        * */

        $scope.drawChart1 = function (obj) {
            $scope.chartObject.data = {
                "cols": [
                    {id: "t", label: "Category", type: "string"},
                    {id: "s", label: "Total", type: "number"}
                ], "rows":obj
            };
            $scope.showChart1();


        };

        /*
        * method to fill rows of charts with given key
        * */

        $scope.entryFound = true;
        $scope.fillPieChartRows = function (key, callback) {
            $scope.rows = [];
            //console.log($scope.rows.length);
           for(var i =0; i<$scope.categories.length;i++){
               $scope.rowData = {
                        'c': [
                            {'v': ''},
                            {'v': 0}
                        ]
                    };
                    $scope.rowData.c[0].v = $scope.categories[i][key];
                    $scope.rowData.c[1].v = $scope.categories[i]['count'];
                    $scope.rows.push($scope.rowData);
           }
            if ($scope.rows.length > 0) {
                console.log($scope.rows);
                callback($scope.rows);
            }
        };


        $(window).resize(function () {
            console.log('windows resized');
            $scope.showChart1();
          
        });

        /*method to show chart
        * */
        $scope.showChart1 = function () {
            //$scope.chartObject.cssStyle = "height:"+($(document).height()/2)+"px"+"; width:100%; ";
            $scope.chartObject.cssStyle = "height:300px; width:100%; ";
            $scope.chartVisible = true;
            //$scope.chartObject.options.forceRedrawNow = true;
        };




    }
]);
