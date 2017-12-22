'use strict';

angular.module('core').controller('HomeController', ['$scope', '$rootScope', '$timeout', '$state', '$http', 'Authentication', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'MarkerCreatorService', 'Users',
    function ($scope, $rootScope, $timeout, $state, $http, Authentication, uiGmapGoogleMapApi, uiGmapIsReady, MarkerCreatorService, Users) {
        // variables
        $scope.authentication = Authentication;
        $scope.user = Authentication.user;
        $scope.listMode = false;
        $scope.IAmOnline = false;
        $scope.zoomVal = 12;
        $scope.events = [];
        $scope.meMarker = {};
        $scope.directionsService = {};
        $scope.directionsRenderer = {};
        $scope.showClearDir = false;
        $scope.todayDate = new Date();
        $scope.todayDate.setHours(0,0,0,0);
        $scope.tomorrowDate = new Date();
        $scope.tomorrowDate.setDate($scope.tomorrowDate.getDate()+1);
        $scope.tomorrowDate.setHours(0,0,0,0);
        $scope.mapZoomChangedTimeout = -1;
        $scope.centerChangedTimeout  = -1;
        $scope.zoomChangedTimeout  = -1;
        $scope.doNotRefreshOnPan = false;
        $scope.doNotRefreshOnZoom = false;
        $scope.isActive  = true;
        // $scope.startWalkthrough("demo");
        $scope.map = {
            center: {
                latitude: $rootScope.lastLocation === undefined ? 0 : $rootScope.lastLocation.latitude,
                longitude: $rootScope.lastLocation === undefined ? 0 : $rootScope.lastLocation.longitude
            },
            zoom: 12,
            markers: [],
            control: {
                getGMap: function () {
                }
            },
            events: {
                center_changed: function (map, eventName, args) {
                    $timeout.cancel($scope.centerChangedTimeout);
                    $scope.centerChangedTimeout = $timeout(function(){
                        if ($scope.map.center !== undefined && $scope.map.center !== "" && $scope.map.center !== {}) {
                            $rootScope.lastLocation = $scope.map.center;
                        //console.log($rootScope.lastLocation);
                        
                        if(!$scope.doNotRefreshOnPan && !$scope.showClearDir){
                            $timeout.cancel($scope.mapZoomChangedTimeout);
                            $scope.mapZoomChangedTimeout = $timeout(function(){
                                $scope.applyCatFilter();
                                $scope.applyForDaysFilter($scope.fDays);
                                $scope.applyRadiusFilter($scope.radiusVal,false);
                                $scope.getEventsByFilters($scope.filters,function(err,resp){
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        $scope.events = resp.data;
                                        $scope.drawEventMarkers($scope.events);
                                    }
                                });
                            },1000);

                        }


                    }
                },200);
                    
                },
                zoom_changed: function (map, eventName, args) {
                    $timeout.cancel($scope.centerChangedTimeout);
                    $scope.centerChangedTimeout = $timeout(function(){
                        $rootScope.lastZoom = $scope.map.control.getGMap().getZoom();
                        $scope.radiusVal = $scope.map.control.getGMap().getZoom();
                        $scope.radiusValMiles = $scope.radSliderOptions.stepsArray[$scope.radiusVal];

                        if(!$scope.doNotRefreshOnZoom && !$scope.showClearDir){
                            $timeout.cancel($scope.mapZoomChangedTimeout);
                            $scope.mapZoomChangedTimeout = $timeout(function(){
                                $scope.applyCatFilter();
                                $scope.applyForDaysFilter($scope.fDays);
                                $scope.applyRadiusFilter($scope.radiusVal,false);
                                $scope.getEventsByFilters($scope.filters,function(err,resp){
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        $scope.events = resp.data;
                                        $scope.drawEventMarkers($scope.events);
                                    }
                                });
                            },1000);

                        }
                    },200);
                }
            },
            options: {
                scrollwheel: true,
                disableDefaultUI: true
            }
        };

        $scope.categories = [];
        $scope.selectedOpts = [];
        $scope.radiusValIndex=3;
        $scope.radiusVal = 16;
        $scope.radiusValMiles = 0.25;
        $scope.fDays = 7;
        $scope.defaultFilters = {
            fDays: 7,
            radiusVal : 16,
            radiusValMiles : 0.25,
            selectedOpts: [],
            radiusValIndex : 3
        };
        $scope.daysSliderOptions = {
            floor:1,
            ceil: 90,
            onEnd:function(sliderId,mV,hV) {
                $scope.applyForDaysFilter(mV);
            }
        };
        $scope.radSliderOptions = {
            stepsArray : [163840,8192,4096,2048,1024,512,256,128,64,32,16,8,4,2,1,0.5,0.25,0.125,0.0625,0.03125,0.015625,0.0078125,0],
            rightToLeft:true,
            translate: function(val) {
                if(val<=0.5 && val >0.25) {
                    return 'half';
                } else if(val<=0.25 && val >0.125) {
                    return 'quarter';
                } else if(val<=0.125) {
                    return 'less than quarter';
                }
            },
            onEnd:function(sliderId,mV,hV) {
                $scope.radiusValMiles = $scope.radSliderOptions.stepsArray[$scope.radiusVal];
                $scope.applyRadiusFilter($scope.radiusVal,true);
            }
        };

        $scope.currentDirMiles = '';
        $scope.showLocTimeout = -1;

        //introduction variables
        






        





        /**
         *initialize
         */

        //prefetch
        $http.get('/api/categories').then(function success(res) {
            $scope.categories = res.data;
        }, function error(err) {
            console.log(err);
        });

        $scope.localDistance = function(loc) {
            return $rootScope.distance($scope.myBaseLoc.latitude,$scope.myBaseLoc.longitude,loc.latitude,loc.longitude);
        }

        //init
        if ($scope.user!==undefined && $scope.user!=="") {
            if($scope.user.filterPrefs===undefined){
                $scope.user.filterPrefs = {
                    fDays : $scope.fDays,
                    radiusVal: $scope.radiusVal,
                    selectedOpts : $scope.selectedOpts
                };
                $scope.filters = $scope.user.filterPrefs;
            } else {
                $scope.fDays = $scope.user.filterPrefs.fDays;
                $scope.map.zoom = $scope.radiusVal = $scope.user.filterPrefs.radiusVal;
                $scope.selectedOpts = $scope.user.filterPrefs.selectedOpts;
                $scope.filters = $scope.user.filterPrefs;

            }
            $scope.radiusValMiles = $scope.radSliderOptions.stepsArray[$scope.radiusVal];
            //set online
            $scope.IAmOnline = true;


        } else {

            if($rootScope.lfilters!==undefined) {
                $scope.filters=$rootScope.lfilters;
                $scope.fDays = $scope.filters.fDays;
                $scope.radiusVal = $scope.filters.radiusVal;
                $scope.radiusValMiles = $scope.filters.radiusValMiles;
                $scope.selectedOpts= $scope.filters.selectedOpts;
            } else {
                $scope.filters = {
                    fDays : $scope.fDays,
                    radiusVal: $scope.radiusVal,
                    selectedOpts : $scope.selectedOpts
                }
                $rootScope.lfilters = $scope.filters;
            }
            
            $scope.IAmOnline = false;
        }

        // uiGmapGoogleMapApi.then(function (maps) {
        //     // console.log("Api is ready!");

        // });

        uiGmapIsReady.promise().then(function (maps) {
            // console.log("Map created!");

            //initialize the directions service and renderer
            $scope.directionsService = new google.maps.DirectionsService();
            $scope.directionsRenderer = new google.maps.DirectionsRenderer();


            //get current location
            if ($rootScope.lastLocation !== undefined && 
                $rootScope.lastLocation.hasOwnProperty('latitude') && 
                $rootScope.lastLocation.hasOwnProperty('longitude')) {
                if($rootScope.lastZoom!==undefined) {
                    $scope.radiusVal = $rootScope.lastZoom;
                }
                refreshMap($rootScope.lastLocation);
                //console.log("Skipping refresh");
                //console.log($rootScope.lastLocation);
                //console.log($scope.map.markers);

                // //create a marker at current position
                // MarkerCreatorService.createByCoords($rootScope.myBaseLoc.latitude, $rootScope.myBaseLoc.longitude, function (marker) {
                //     marker.options.labelContent = $scope.user.firstName;
                //     marker.options.icon = "/modules/core/client/img/locationgif.gif";
                //     marker.email = $scope.user.email;
                //     $scope.meMarker = marker;
                //     marker.options.visible=false;
                //     $scope.map.markers.push($scope.meMarker);

                // });
                $scope.filters.location = $rootScope.myBaseLoc;
                $scope.getEventsByFilters($scope.filters,function(err,resp){
                    if(err) {
                        console.log(err);
                    } else {
                        $scope.events = resp.data;
                        $scope.drawEventMarkers($scope.events);
                    }
                });



            } else {
                // console.log("first call");
                MarkerCreatorService.getCurrentPosition(function (pos) {


                    //all api to update user's current location
                    //$scope.map.center = pos;
                    $rootScope.lastLocation = pos;
                    $rootScope.myBaseLoc = pos;
                    $scope.filters.location = $rootScope.lastLocation;
                    $scope.getEventsByFilters($scope.filters,function(err,resp){
                        if(err) {
                            console.log(err);
                        } else {
                            $scope.events = resp.data;
                            $scope.drawEventMarkers($scope.events);
                            if($scope.events.length){
                                // Default : only show list if we have events to show
                                $scope.showListMode();
                            }

                        }
                    });
                    //$scope.map.center = pos;
                    //now set pos.email to user's email for db save
                    pos.email = $scope.user.email;

                    //post user now
                    if (Authentication.user) {
                        $http({
                            url: '/api/users/updateLoc',
                            method: "POST",
                            data: pos
                        })
                        .then(function (response) {
                        },
                                function (response) { // optional
                                    // failed
                                    console.log("Loc could not be updated!");
                                });
                    }
                    //end - user;s location now updated in db


                    //refresh the map now
                    refreshMap($rootScope.myBaseLoc);

                    //create a marker at current position
                    MarkerCreatorService.createByCoords($rootScope.myBaseLoc.latitude,$rootScope.myBaseLoc.longitude, function (marker) {
                        marker.options.labelContent = $scope.user.firstName;
                        marker.options.icon = "/modules/core/client/img/locationgif.gif";
                        marker.email = $scope.user.email;
                        $scope.meMarker = marker;
                        marker.options.visible=false;
                        $scope.map.markers.push($scope.meMarker);
                    });


                });
                //apply filters once page is loaded
                
                
                
            }



        });













        /**
         *functions
         */

         var clearZoomPanParams = function() {
            $scope.doNotRefreshOnZoom = false;
            $scope.doNotRefreshOnPan = false;
        }

        $scope.getJustDate = function(dt) {
            var dtn = new Date(dt);
            dtn.setHours(0,0,0,0);
            return dtn;
        };

        $scope.getEventsByFilters = function(filters,callback) {
            if(filters!==undefined) {
                filters.radiusValMiles = $scope.radiusValMiles;
                var lastLoc = {};
                if($rootScope.lastLocation!==undefined  && $rootScope.lastLocation.hasOwnProperty('latitude')){
                    filters.location = $rootScope.lastLocation;    
                } else if($scope.user!==undefined && $scope.user!=="" && $scope.user.hasOwnProperty('latitude')) {
                    filters.location = {latitude : $scope.user.latitude, longitude: $scope.user.longitude};
                }
                
                $http.post("/api/events/filtered",filters).then(function(s){

                    callback(undefined,s);
                },function(e){
                    callback(e,undefined);
                });
            } else {
                callback({msg: 'filters not defined'},undefined);
            }
        };
        $scope.radCircle = "";
        $scope.showCircle = true;
        $scope.showHideCircle = function(){
            if($scope.showCircle) {
                $scope.radCircle.setVisible(false);
                $scope.showCircle = false;
            } else {
                $scope.radCircle.setVisible(true);
                $scope.showCircle = true;
            }
        };
        $scope.drawEventMarkers = function (events) {
            //draw circle also
            if($scope.radCircle===""){
                $scope.radCircle = new google.maps.Circle({
                    strokeColor: '#0000FF',
                    strokeOpacity: 0.5,
                    strokeWeight: 2,
                    fillColor: '#0000FF',
                    fillOpacity: 0.15,
                    map: $scope.map.control.getGMap(),
                    center: {lat:$rootScope.lastLocation.latitude,lng:$rootScope.lastLocation.longitude},
                    radius: $scope.radiusValMiles*1600,
                    visible: $scope.showCircle
                });
            } else {
                $scope.radCircle.setCenter({lat:$rootScope.lastLocation.latitude,lng:$rootScope.lastLocation.longitude});
                $scope.radCircle.setRadius($scope.radiusValMiles*1600);
            }

            $scope.map.markers = [];
            //create a marker at current position
            MarkerCreatorService.createByCoords($rootScope.myBaseLoc.latitude,$rootScope.myBaseLoc.longitude, function (marker) {
                marker.options.labelContent = $scope.user.firstName;
                marker.options.icon = "/modules/core/client/img/locationgif.gif";
                marker.email = $scope.user.email;
                $scope.meMarker = marker;
                marker.options.visible=false;
                $scope.map.markers.push($scope.meMarker);
            });
            var cdt = new Date();
            cdt.setDate(cdt.getDate()+5);
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                MarkerCreatorService.createByCoords(event.location.latitude, event.location.longitude, function (marker) {
                    marker.options.animation = 0;
                    var edt = new Date(event.eventStartDate);
                    if(edt<=cdt) {
                        marker.options.animation = 1;
                    }
                    marker.options.labelContent = event.name.length>5?event.name.substring(0,5)+'..':event.name;
                    marker.options.icon = event.category.markerImgURL;
                    marker.uid = event._id;
                    marker.events.click = function (m, ev, args) {
                        $state.go("events.show", {eid: m.model.uid});
                    };
                    marker.options.category = event.category._id;
                    $scope.map.markers.push(marker);
                });
            }

            //refreshMap($scope.meMarker);
        }

        // categories list
        var showFilters = false;
        //watch on rootscope's showfilter menu var
        $("#menu-filter").click(function () {
            showFilters = !showFilters;
            if (showFilters) {
                $(".filters-menu").show();
            } else {
                $(".filters-menu").hide();
            }
        });


        // filter for categories

        $scope.applyCatFilter = function () {
            //console.log($scope.map.markers);
            if ($scope.selectedOpts.length < 1) {
                for (var i = 0; i < $scope.map.markers.length; i++) {
                    var marker = $scope.map.markers[i];
                    marker.options.visible = true;
                    if (marker.options.icon === "/modules/core/client/img/locationgif.gif") {
                        marker.options.visible = false;
                    }
                }
                if($scope.user!=="undefined" && $scope.user!=="") {
                    $scope.user.filterPrefs.selectedOpts = $scope.selectedOpts;
                }
                return;
            }
            for (var i = 0; i < $scope.map.markers.length; i++) {
                var marker = $scope.map.markers[i];
                //if (marker.id === $scope.meMarker.id)
                marker.options.visible = false;
            }

            for (var i = 0; i < $scope.selectedOpts.length; i++) {
                var cat = $scope.selectedOpts[i];
                for (var j = 0; j < $scope.map.markers.length; j++) {
                    var marker = $scope.map.markers[j];
                    if (marker.options.category === cat._id) {
                        marker.options.visible = true;
                    }

                }
            }
            if($scope.user!==undefined && $scope.user!=="")
                $scope.user.filterPrefs.selectedOpts = $scope.selectedOpts;
        };

        

        //filter for days
        $scope.applyForDaysFilter = function(val) {
            if($scope.user)
                $scope.user.filterPrefs.fDays = val;
            $scope.filters.fDays = $scope.fDays;
        };
        //filter for radius
        $scope.applyRadiusFilter = function(val,setZoom) {

            // refreshMap($scope.meMarker);
            if($scope.user)
                $scope.user.filterPrefs.radiusVal = val;
            if(setZoom)
                $scope.map.control.getGMap().setZoom(val);
            
        };

        $scope.applyAllFilters = function() {

            $scope.applyCatFilter();
            $scope.applyForDaysFilter($scope.fDays);
            $scope.applyRadiusFilter($scope.radiusVal,true);
            //save filters for user
            if($scope.user!==undefined && $scope.user!==""){
                $http.post('/api/users/filters/save',$scope.user.filterPrefs).then(function success(res) {
                    $rootScope.lfilters= $scope.filters = $scope.user.filterPrefs = res.data;

                    //redraw markers after refresh
                    $scope.getEventsByFilters($scope.filters,function(err,resp){
                        if(err) {
                            console.log(err);
                        } else {
                            $scope.events = resp.data;
                            $scope.drawEventMarkers($scope.events);
                        }
                    });

                }, function error(err) {
                    console.log(err);
                });
            } else {
                // if($rootScope.lfilters!==undefined){
                //     $scope.filters = $rootScope.lfilters;
                //     $scope.fDays = $rootScope.lfilters.fDays;
                //     $scope.radiusVal = $rootScope.lfilters.radiusVal;
                //     $scope.selectedOpts = $rootScope.lfilters.selectedOpts;
                // }
                $rootScope.lfilters = $scope.filters;
                $scope.getEventsByFilters($scope.filters,function(err,resp){
                    if(err) {
                        console.log(err);
                    } else {
                        $scope.events = resp.data;
                        $scope.drawEventMarkers($scope.events);
                    }
                });
            }

            

            if($scope.showFilters){
                $scope.showFilter();
            }
        }



        function refreshMap(marker) {
            if (marker) {
                $scope.map.control.refresh({latitude: marker.latitude, longitude: marker.longitude});

                $scope.map.control.getGMap().setZoom($scope.radiusVal);

            } else {
                //MarkerCreatorService.getCurrentPosition(function(pos){
                //  $scope.map.control.refresh({latitude: pos.latitude, longitude: pos.longitude});
                //});
            }
        }

        $scope.showDirections = function(loc1, loc2) {
            var start = new google.maps.LatLng(loc1.latitude, loc1.longitude);
            var end = new google.maps.LatLng(loc2.latitude, loc2.longitude);
            var request  = {
                origin : start,
                destination: end,
                travelMode : google.maps.TravelMode.DRIVING,
                unitSystem : google.maps.UnitSystem.IMPERIAL
            };
            $scope.directionsService.route(request,function(result,status){
                if(status== google.maps.DirectionsStatus.OK) {
                    $scope.currentDirMiles = result.routes[0].legs[0].distance.text;
                    $scope.directionsRenderer.setDirections(result);
                } else {
                    $scope.currentDirMiles = 'No Route Found!';
                }
            });
        }

        $scope.showProfile = function () {

        };

        // map actions
        $scope.showFilter = function(){
            $scope.showFilters = !$scope.showFilters;
        };

        $scope.hideFilter = function(){
            $scope.showFilters = false;
        };
        // // map actions
        // var radiusToZoom = function (radius) {

        //     return Math.round(14 - Math.log(radius) / Math.LN2);

        // };
        // // map actions
        // var zoomToRadius = function (zoom) {
        //     return Math.round(2^(14-zoom));
        // };

        
        $scope.showMyLocation = function(){
            //console.log($rootScope.myBaseLoc);

            //create marker again if not already present
            if($scope.meMarker===undefined){
                //console.log($scope.meMarker);
                //create a marker at current position
                MarkerCreatorService.createByCoords($rootScope.myBaseLoc.latitude, $rootScope.myBaseLoc.longitude, function (marker) {
                    marker.options.labelContent = $scope.user.firstName;
                    marker.options.icon = "/modules/core/client/img/locationgif.gif";
                    marker.email = $scope.user.email;
                    $scope.meMarker = marker;
                    marker.options.visible = false;
                    $scope.map.markers.push($scope.meMarker);
                });

            }
            //$scope.map.center = $rootScope.myBaseLoc;
            for (var i = 0; i < $scope.map.markers.length; i++) {
                var marker = $scope.map.markers[i];
                if (marker.options.icon === "/modules/core/client/img/locationgif.gif") {
                    $scope.meMarker = marker;
                }
            }
            $timeout.cancel($scope.showLocTimeout);
            $scope.meMarker.options.visible=true;
            refreshMap($rootScope.myBaseLoc);
            $scope.showLocTimeout = $timeout(function(){
                $scope.meMarker.options.visible=false;
            },5000);
        };

        $scope.clearAllFilters = function() {


            $scope.fDays = $scope.defaultFilters.fDays;
            $scope.radiusVal = $scope.defaultFilters.radiusVal;
            $scope.selectedOpts = [];
            $scope.radiusValMiles = $scope.defaultFilters.radiusValMiles;
            $scope.radiusValIndex = $scope.defaultFilters.radiusValIndex;

            $scope.applyForDaysFilter($scope.fDays);
            $scope.applyRadiusFilter($scope.radiusVal,true);
            if($scope.user!==undefined && $scope.user!=="") {
                $scope.user.filterPrefs = $scope.defaultFilters;
                $http.post("/api/users/filters/save",$scope.defaultFilters).then(function(s){
                    $scope.user.filterPrefs = $scope.defaultFilters;
                },function(){});
            }
        };


        $scope.listMode=false;

        $scope.showListMode = function() {
            $scope.doNotRefreshOnPan = true;
            $scope.doNotRefreshOnZoom = true;
            $scope.listMode =!$scope.listMode;
            if($scope.listMode) {
                $(".list-drawer").animate({height:"45%"},400);
                // $(".angular-google-map-container").animate({bottom:'50%'},400,function(){
                //     refreshMap($rootScope.lastLocation);
                //     $timeout(function(){
                //         clearZoomPanParams();
                //     },1000);
                // });
            } else {
                $(".list-drawer").animate({height:"45px"},400);
                $(".angular-google-map-container").animate({bottom:'0px'},400,function(){
                    refreshMap($rootScope.lastLocation);
                    $timeout(function(){
                        clearZoomPanParams();
                    },1000);
                });

            }
        };

        $scope.locateEventOnMap = function(loc) {
            $scope.radiusVal = 15;
            refreshMap(loc);
        }
        $scope.clearEventDirections = function() {
            $scope.doNotRefreshOnPan = true;
            $scope.doNotRefreshOnZoom = true;
            $scope.directionsRenderer.setMap(null);
            $scope.showClearDir = false;
            for (var i = 0; i < $scope.map.markers.length; i++) {
                var marker = $scope.map.markers[i];
                if (marker.options.icon !== "/modules/core/client/img/locationgif.gif") {
                    marker.options.visible = true;
                }
            }
            $timeout(function(){
                clearZoomPanParams();
            },1000);
        }
        $scope.showEventDirections = function(e) {
            $scope.doNotRefreshOnPan = true;
            $scope.doNotRefreshOnZoom = true;
            $scope.showClearDir = true;
            for (var i = 0; i < $scope.map.markers.length; i++) {
                var marker = $scope.map.markers[i];
                if(marker.uid !== e._id){
                    marker.options.visible = false;
                }
            }
            //set map for renderer
            $scope.directionsRenderer.setMap($scope.map.control.getGMap());
            $scope.showDirections($rootScope.myBaseLoc,e.location);
        }

    }
    ]);
