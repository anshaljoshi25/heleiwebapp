'use strict';

angular.module('core').controller('LoaderController', ['$scope','$rootScope','$interval',
	function ($scope,$rootScope,$interval) {
		$scope.msg = "Loading";
		//$("#loaderGif").css("width","0");
		$scope.lgw = 0;
		$scope.lgflipFloat = false;
		$scope.lgfloat = "left";
		$scope.showing = false;
		$scope.animateLoader = function() {
			
			$("#loaderGif").animate({backgroundPositionX : '+=80px'},100,'linear',function(){
				if($scope.showLoader) {
					$scope.animateLoader();
				}
			});	
		}
		
		
		$scope.$watch('showLoader',function(nv){

			if($scope.showLoader) {
				$scope.animateLoader();
			}

		});
	}
	]);