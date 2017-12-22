/**
 * Created by arun on 6/20/2016.
 */
'use strict';



angular.module('events').controller('AdminDealsController', ['$rootScope','$scope','$timeout','$interval','$http', '$state', 'Authentication',
    function ($rootScope,$scope, $timeout,$interval, $http, $state, Authentication) {

        $scope.deal = {};
        $scope.deals = [];
        $scope.error = "";
        $scope.success = "";
        //get deals
        $http.get("/api/v2/deals")
        .success(function(d){
        	$scope.deals = d;
        })
        .error(function(e){
        	$scope.deals=[];
        	console.log(e);
        });

        $scope.create= function() {
        	if($scope.deal){
        		//validation

        		//post
        		$http.post("/api/v2/deals/create",$scope.deal)
        		.success(function(data){
        			$scope.success="Saved successfully!";
        			$timeout(function(){
        				$scope.success="";
        			},3000);
        		})
        		.error(function(err){
        			$scope.error=err.message;
        			$timeout(function(){
        				$scope.error="";
        			},3000);
        		});
        	}
        }

    }
]);
