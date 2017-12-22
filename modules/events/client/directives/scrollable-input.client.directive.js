/**
 * Created by arunsharma on 6/2/16.
 */

'use strict';

angular.module('events')
    .directive('scrollableInput',['$timeout',function($timeout){
        return {
            restrict:'E',
            replace:true,
            scope: true,
            templateUrl:'/modules/events/client/views/scrollable-input.client.view.html',
            link : function(scope, element, attr) {
                var minVal = attr.min;
                var maxVal = attr.max;

                scope.vals = [];
                for(var i=minVal; i<=maxVal;i++) {
                    var zero = "";
                    if(i<10) {
                       zero = "0";
                    }
                    scope.vals.push(""+zero+""+i);
                }

                scope.currentVal = scope.vals[0];
                scope.$parent[attr.model] = scope.currentVal;
                var tot = maxVal - minVal + 1;
                var pos = 0;
                scope.plus = function() {
                    pos = (pos+1)%tot;
                    scope.currentVal = scope.vals[pos];
                    scope.$parent[attr.model] = scope.currentVal;

                    $timeout(function(){
                        scope.$apply();
                    },100);
                }
                scope.minus = function() {
                    if(pos<1) {
                        pos = tot-1;
                    } else {
                        pos = (pos - 1) % tot;
                    }
                    scope.currentVal = scope.vals[pos];
                    scope.$parent[attr.model] = scope.currentVal;
                    $timeout(function(){
                        scope.$apply();
                    },100);

                }
            }
        };
    }]);
