/**
 * Created by anshal on 2/21/2016.
 */
 'use strict';



 angular.module('events').controller('AdminEventController', ['$rootScope','$scope','$timeout','$interval','$http', '$state', 'Authentication',
 	function ($rootScope,$scope, $timeout,$interval, $http, $state, Authentication) {

 		$scope.events = [];
 		$scope.deals = [];
 		$scope.selectedIndex=-1;
 		$scope.error = "";
 		$scope.success = "";

 		$http.get("/api/events").success(function(data){
 			$scope.events = data;
 		}).error(function(error){
 			$scope.error = "Error while fetching events! : ";
 			$timeout(function(){
 				$scope.error="";
 			},3000);
 		});

 		$http.get("/api/v2/deals").success(function(data){
 			$scope.deals = data;
 		}).error(function(error){
 			$scope.error = "Error while fetching deals! : ";
 			$timeout(function(){
 				$scope.error="";
 			},3000);
 		});

 		$scope.attachDealToEvent = function(d) {
 			var e = $scope.events[$scope.selectedIndex];
 			$http.post('/api/v2/events/attach',{deal: d._id, event: e._id})
 			.success(function(data){
 				console.log(data);
 				$scope.success="Successfully attached event";
 				$timeout(function(){
 					$scope.success="";
 				},3000);
 			})
 			.error(function(error){
 				$scope.error="Error while attaching deal to event! : " + error.message;
 				$timeout(function(){
 					$scope.error="";
 				},3000);
 			});
 		};

 		$scope.showDeals = function(i) {
 			$scope.selectedIndex = i;
 		}


 	}
 	]);
