/**
 * Created by sairam on 5/1/16.
 */

'use strict';

angular.module('adminportal').controller('adminPayController', ['$scope', '$timeout', '$http', '$state', 'Authentication', 'Users',
    function ($scope, $timeout, $http, $state, Authentication, Users) {
        $scope.authentication = Authentication;
        $scope.user = Authentication.user;

        $scope.events = [];
        //$scope.showOptions = true;
        $scope.checkit = function (obj) {
            console.log('getting user ');
            console.log(obj);
            $scope.rows = [];
            $scope.chartObject.data = {
                "cols": [
                    {id: "t", label: "Category", type: "string"},
                    {id: "s", label: "Total", type: "number"}
                ], "rows": $scope.rows

            };
            //console.log($scope.rows);

            $scope.profile = obj;
            //console.log($scope.profile);
            $scope.profile.tec = 0;
            $scope.profile.eventPrice = 0.50;


            $http.post('/api/events/listByCreator', {'uid': $scope.profile._id}).then(function success(res) {

                if (res.data.length > 0) {
                    //console.log('received info');
                    //console.log(res.data);
                    $scope.events = res.data;
                    $scope.profile.tec = res.data.length;
                    $scope.profile.eventPrice = 0.50;
                    $scope.fillChartRows($scope.drawChart);
                    //$scope.showChart();
                }

            }, function error(err) {
                console.log(err);
            });
            //console.log($scope.profile);
        };

        $scope.drawChart = function () {
            $scope.chartObject.data = {
                "cols": [
                    {id: "t", label: "Category", type: "string"},
                    {id: "s", label: "Total", type: "number"}
                ], "rows": $scope.rows
            };

            //console.log($scope.chartObject.data);
            $scope.showChart();

        };
        $scope.entryFound = true;
        $scope.fillChartRows = function (callback) {
            $scope.rows = [];
            //console.log($scope.rows.length);
            for (var i = 0; i < $scope.events.length; i++) {
                if ($scope.rows.length === 0) {
                    //console.log('creating new cat entry for ' +  $scope.events[i].category.name);
                    $scope.rowData = {
                        'c': [
                            {'v': ''},
                            {'v': 0}
                        ]
                    };
                    $scope.rowData.c[0].v = $scope.events[i].category.name;
                    $scope.rowData.c[1].v = 1;
                    $scope.rows.push($scope.rowData);
                    //continue;
                }
                else {
                    for (var j = 0; j < $scope.rows.length; j++) {
                        //console.log($scope.rows[j].c[0].v + " === " + $scope.events[i].category.name);
                        if (( $scope.rows[j].c[0].v === $scope.events[i].category.name )) {
                            //console.log('incrementing count for ' + $scope.rows[j].c[0].v);
                            $scope.rows[j].c[1].v += 1;
                            $scope.entryFound = true;
                            break;
                        }
                        else {
                            $scope.entryFound = false;
                        }
                    }
                    if (!$scope.entryFound) {
                        //console.log('creating new cat entry for ' +  $scope.events[i].category.name );
                        $scope.rowData = {
                            'c': [
                                {'v': ''},
                                {'v': 0}
                            ]
                        };
                        $scope.rowData.c[0].v = $scope.events[i].category.name;
                        $scope.rowData.c[1].v = 1;
                        $scope.rows.push($scope.rowData);
                        $scope.entryFound = false;
                        //break;
                    }
                    //console.log($scope.rows);
                    //console.log('finsihed inner cycle '+ j);
                }
                //console.log('finsihed cycle '+ i);
            }
            if ($scope.rows.length > 0) {
                //console.log($scope.rows);
                //console.log('ruinning callback');
                callback();
            }
        };

        $scope.chartObject = {};
        $scope.chartObject.cssStyle = "height:100%; width:100%; ";

        $scope.chartObject.type = "PieChart";

        $scope.chartObject.options = {
            'title': 'Event categories',
            isStacked: 'relative',
            //is3D:true,
            //legend:'none',
            legend: {position: 'bottom', maxLines: 4}
        };

        $(window).resize(function () {
            $scope.showChart();
        });

        $scope.showChart = function () {
            //$scope.chartObject.cssStyle = "height:"+($(document).height()/2)+"px"+"; width:100%; ";
            $scope.chartObject.cssStyle = "height:300px; width:100%; ";
            $scope.chartVisible = true;
            $scope.chartObject.options.forceRedrawNow = true;
        };


    }


]);
