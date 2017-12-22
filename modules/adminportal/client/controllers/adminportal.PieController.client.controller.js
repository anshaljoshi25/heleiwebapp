/**
 * Created by anshal on 02-08-16.
 */
'use strict';

angular.module('adminportal').controller('PieController', ['$scope','$timeout','$http', 'Authentication','uiGmapGoogleMapApi','uiGmapIsReady','MarkerCreatorService','Users',
    function ($scope, $timeout, $http, Authentication, uiGmapGoogleMapApi, uiGmapIsReady, MarkerCreatorService,Users) {
        // This provides Authentication context.

        $scope.authentication = Authentication;
        $scope.user = Authentication.user;

        //$scope.title = "pie chart";
        //$log.info ("Create Chart");


        $scope.chartObject = {};
        $scope.chartObject.cssStyle = "height:100%; width:100%; ";
        //$scope.chartObject.cssStyle = {
        //    displayExactValues: true,
        //    width: 400,
        //    height: 400,
        //    is3D : true,
        //    chartArea: {left:10,top:10,bottom:0,height:"100%"}
        //};
        $scope.chartObject.type = "PieChart";

        $scope.Justas = [
            {v: "Justas"},
            {v: 3},
        ];

        $scope.chartObject.data = {"cols": [
            {id: "t", label: "Events", type: "string"},
            {id: "s", label: "Attendies", type: "number"}
        ], "rows": [
            {c: [
                {v: "Carnivals"},
                {v: 3},
            ]},
            {c: $scope.Justas},
            {c: [
                {v: "Night"},
                {v: 31}
            ]},
            {c: [
                {v: "Sports"},
                {v: 1},
            ]},
            {c: [
                {v: "Fund Raiser"},
                {v: 2},
            ]}
        ]};

        $scope.chartObject.options = {
           // 'title': 'Popular Categories',
            isStacked: 'relative',
            is3D:true,
            //legend:'none',
            legend:{position: 'bottom', maxLines: 4}
        };

        $(window).resize(function(){
            $scope.showChart();
        });

        $scope.showChart = function(){
            //$scope.chartObject.cssStyle = "height:"+($(document).height()/2)+"px"+"; width:100%; ";
            $scope.chartObject.cssStyle = "height:300px; width:100%; ";
            $scope.chartVisible = true;
            $scope.chartObject.options.forceRedrawNow = true;
        };
        $scope.showChart();

    }
]);
