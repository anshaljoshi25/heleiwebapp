/**
 * Created by arunsharma on 3/2/16.
 */
 'use strict';

 angular.module('events')
 .directive('catSelect',['$timeout',function($timeout){
    return {
      restrict:'E',
      replace:true,
      templateUrl:'/modules/events/client/views/custom-select.client.view.html',
      link : function(scope, element, attr) {
        var options = attr.options;

        scope.opts = [];
        scope.$watch(options,function(newValue,oldValue){
            scope.opts = scope[options];
            $timeout(function(){
                scope.$apply();
            },100);

        });

        
        scope.isArray = false;
        if(attr.multiselect) {
            scope.isArray = true;
        }
        scope.selected = scope[attr.catmodel];
        scope.$watch(attr['catmodel'],function(nv,ov){
            // console.log(Object.prototype.toString.call(nv));
            scope.selected = scope[attr.catmodel];
            if(scope.selected.length<1) {
                $(".custom-select-cat").css("background-color", "transparent");    
            }
            
            $timeout(function(){
                for(var i=0; i<scope.selected.length;i++) {
                    var s = scope.selected[i];
                    $("#cat-img-" + s._id).css("background-color", "rgb(90, 91, 89)");
                };
            },1000);
        });

        scope.omniSelect = function(e) {
            if(e!==null && e!==undefined) {
                if(e.target.id==='categoryPopup' || e.target.id==='closePopup') {
                    $(".popup-backdrop").toggleClass('popup-animate-open');
                    $(".popup").toggleClass('popup-visible');
                }
            } else {
                $(".popup-backdrop").toggleClass('popup-animate-open');
                $(".popup").toggleClass('popup-visible');
            }


        };
        scope.selectCat = function(obj) {
            var found = false;
            var index = -1;
            if(attr.multiselect) {
                    //check if already selcted or not
                    for(var i=0;i<scope[attr.catmodel].length;i++) {
                        if(scope[attr.catmodel][i]._id === obj._id) {
                            found=true;
                            index=i;
                            break;
                        }
                    }
                    if(found===false) {
                        scope[attr.catmodel].push(obj);
                        $timeout(function () {
                            scope.$apply();
                        }, 100);

                        $("#cat-img-" + obj._id).css("background-color", "rgb(90, 91, 89)");
                    } else {
                        scope[attr.catmodel].splice(index,1);
                        $timeout(function () {
                            scope.$apply();
                        }, 100);

                        $("#cat-img-" + obj._id).css("background-color", "transparent");
                    }
                    scope.selected = scope[attr.catmodel];
                } else {
                    scope[attr.catmodel] = obj;
                    $timeout(function () {
                        scope.$apply();
                    }, 100);

                    var allCats = document.getElementsByClassName("custom-select-cat");
                    for (var i = 0; i < allCats.length; i++) {
                        allCats[i].style.backgroundColor = "transparent";
                    }
                    $("#cat-img-" + obj._id).css("background-color", "rgb(90, 91, 89)");
                    scope.selected = [scope[attr.catmodel]];
                }
                
                if(attr.callback!==undefined && attr.callback.length) {
                    scope[attr.callback]();
                }
            };

            $timeout(function(){
                for(var i=0; i<scope.selected.length;i++) {
                    var s = scope.selected[i];
                    $("#cat-img-" + s._id).css("background-color", "rgb(90, 91, 89)");
                };
            },1000);




        }
    };
}]);
