/**
 * Created by arunsharma on 3/2/16.
 */
'use strict';


angular.module('events').controller('EventsCreateController', ['$rootScope', '$scope', '$timeout', '$interval', '$http', '$state', 'Authentication', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'MarkerCreatorService', 'Users', '$filter', '$stateParams',
    function ($rootScope, $scope, $timeout, $interval, $http, $state, Authentication, uiGmapGoogleMapApi, uiGmapIsReady, MarkerCreatorService, Users, $filter, $stateParams) {

        $scope.eventStartDate = new Date();

        $scope.authentication = Authentication;
        if ($scope.authentication.user === undefined || $scope.authentication.user === "") {
            $state.go('authentication.signin');
        }

        $scope.goBack = function () {
            history.back();
        };
        $scope.geocodeKey = "AIzaSyDWTjMdRtyDlBi8emTUxrJpIo1JQCp3VhE";
        $scope.eventTimeHour = '09';
        $scope.eventTimeMinutes = '15';
        $scope.eventMonthChar = 'Feb';
        $scope.eventDay = '01';
        $scope.eventMonth = '02';
        $scope.tabName = 'Create Event';
        $scope.totalTabs = $(".tab-pane").length;
        $scope.categories = [];
        $scope.selectedFriends = [];
        $scope.selectedOpts = [];
        $scope.currentForm = 0;
        $scope.place = {};
        $scope.public = true;
        $scope.location = {
            longitude: 0,
            latitude: 0
        };
        $scope.eventDisplayPic = "";
        $scope.formLastTab = false;
        $scope.map = {
            center: {
                latitude: 0,
                longitude: 0
            },
            zoom: 16,
            markers: [],
            control: {},
            options: {
                scrollwheel: true
            },
            events: {
                dragstart: function (map, eventName, args) {
                    //console.log('change button with drag ');
                    $scope.userCurrentLoc("mapchange");


                }
                ,
                zoom_changed: function (map, eventName, args) {
                    //console.log('change button with zoom ');
                    $scope.userCurrentLoc("mapchange");


                }
            }
        };

        $scope.coordsUpdates = 0;
        $scope.dynamicMoveCtr = 0;
        $scope.marker = {
            id: 0,
            coords: {
                latitude: 40.1451,
                longitude: -99.6680
            },
            options: {},
            events: {}
        };
        $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
            if (_.isEqual(newVal, oldVal))
                return;
            $scope.coordsUpdates++;
        });
        $scope.runOnceEdit = true;
        if ($state.current.name === 'events.edit') {
            //console.log('get event to eidt ' + $stateParams.eid);
            $scope.tabName = 'Edit Event';
            $http.get("/api/events/edit/" + $stateParams.eid).then(function (res) {
                //console.log(res.data);
                //$scope.event.images=[];
                $scope.name = res.data.name;
                $scope.venueName = res.data.venueName;
                $scope.eventStartDate = new Date(res.data.eventStartDate);
                $scope.eventEndDate = new Date(res.data.eventEndDate);
                $scope.description = res.data.description;
                $scope.location.latitude = res.data.location.latitude;
                $scope.location.longitude = res.data.location.longitude;
                $scope.eventDisplayPic = res.data.eventDisplayPic;
                $scope.images = res.data.images;
                //console.log($scope.location);
                $scope.map.control.refresh({latitude: $scope.location.latitude, longitude: $scope.location.longitude});
                $scope.marker.coords = $scope.location;
                //console.log($scope.images);
                $scope.selectedOpts = res.data.category;
                $scope.runOnceEdit = false;
                $scope.place = res.data.place;
                //console.log($scope.selectedOpts);
                //console.log('editing default');
            }, function (err) {
                console.log(err)
            });

        }

        $scope.applyCatFilter = function () {
            //window.scrollTo(0,document.getElementById('catSelect').scrollHeight);
            window.scrollTo(0, $(document).height());
            //console.log($scope.selectedOpts);
        };

        // map api init
        uiGmapGoogleMapApi.then(function (maps) {
            console.log("Api is ready!");

        });

        uiGmapIsReady.promise().then(function (maps) {

            console.log("Map created!");

            //execute main code after 1 second
            if ($state.current.name !== 'events.edit') {
                //console.log('getting new locations for edit');
                $timeout(function () {
                    getCurrentPosition(function (pos) {

                        //all api to update user's current location
                        $scope.location = pos;
                        $scope.map.center = pos;
                        $scope.marker.coords = pos;
                        //console.log(pos);
                        //now set pos.email to user's email for db save

                        //refresh the map now
                        $scope.map.control.refresh({
                            latitude: $scope.map.center.latitude,
                            longitude: $scope.map.center.longitude
                        });


                    });
                }, 1000);
            } else {
                //console.log('getting new locations');
                $timeout(function () {
                    getCurrentPosition(function (pos) {

                        //all api to update user's current location
                        $scope.location = $scope.location;
                        $scope.map.center = $scope.location;
                        $scope.marker.coords = $scope.location;
                        //console.log(pos);
                        //now set pos.email to user's email for db save

                        //refresh the map now
                        $scope.map.control.refresh({
                            latitude: $scope.map.center.latitude,
                            longitude: $scope.map.center.longitude
                        });


                    });
                }, 1000);
            }
        });

        //search area/place
        $scope.searchPlace = function () {
            //search after full text entered
            //console.log($scope.geocodeKey);
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + getLocationString($scope.location) + '&key=' + $scope.geocodeKey).then(function success(res) {
                //console.log(res.data);
                $scope.place = res.data.results[0].formatted_address;
            }, function error(err) {
                console.log(err);
            });
        };

        //search area/place
        $scope.searchPlaceByLatLong = function (obj) {
            //search after full text entered
            console.log($scope.geocodeKey);
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + getLocationString(obj) + '&key=' + $scope.geocodeKey).then(function success(res) {
                //console.log(res.data);
                $scope.place = res.data.results[0].formatted_address;
            }, function error(err) {
                console.log(err);
            });
        };


        $scope.$watch("place", function (nv, ov) {
            //console.log($scope.place);
            if ($scope.place !== undefined && $scope.place.geometry !== undefined) {
                if ($scope.runOnceEdit) {
                    //console.log('updating place');
                    $scope.location.latitude = $scope.place.geometry.location.lat();
                    $scope.location.longitude = $scope.place.geometry.location.lng();
                }
                else {
                    $scope.runOnceEdit = true;
                }

                //$timeout(function(){refreshMap($scope.location);},100);
            }
            else {
                $scope.runOnceEdit = true;
            }

        });

        // categories list
        $http.get('/api/categories').then(function success(res) {
            $scope.categories = res.data;
        }, function error(err) {
            console.log(err);
        });

        // friends list
        $scope.friends = [];


        $scope.selectFriend = function (user) {

            var found = false;
            for (var i = 0; i < $scope.selectedFriends.length; i++) {
                if (user._id === $scope.selectedFriends[i]._id) {
                    found = true;
                    $("#userblock" + user._id).css("background-color", "#FFD064");
                    $("#userblock" + user._id + " #ulIconBox" + user._id).html("");
                }
            }
            if (!found) {
                $scope.selectedFriends.push(user);
                $("#userblock" + user._id).css("background-color", "#DAAC44");
                $("#userblock" + user._id + " #ulIconBox" + user._id).html("<i class='glyphicon glyphicon-ok inbox-list-sideoption pull-left' />");
            }

            //console.log($scope.selectedFriends);


        };

        $scope.removeSelectedFriend = function (user) {
            for (var i = 0; i < $scope.selectedFriends.length; i++) {
                if (user._id === $scope.selectedFriends[i]._id) {
                    $scope.selectedFriends.splice(i, 1);
                    i--;
                }
            }
        };


        // tabs
        $scope.pageValidator = [false, false, false];

        $scope.runOnce = false;
        if (!$scope.runOnce) {
            $scope.name = "";
            $scope.venueName = "";
            $scope.eventStartDate = new Date();
            $scope.eventEndDate = "";
            $scope.selectedOpts = "";
            console.log('init default for event creation');
            $scope.runOnce = true;
        }
        $scope.showItV = false;
        $scope.clickTab = function (tab, tabName) {

            if (tabName === 'prev') {
                if ($scope.currentForm < 1) {
                    //console.log('current form is less than 1');
                    $scope.currentForm = $scope.totalTabs - 1;
                } else {
                    //console.log('current form is greater than 1');
                    $scope.currentForm -= 1;
                }
                //console.log('len of array ' + $scope.pageValidator.length);
                //console.log('value of cuurent form '+ $scope.currentForm);
                for (var i = 0; i < $scope.pageValidator.length; i++) {

                    if (i > 0 && $scope.pageValidator[i] === false) {
                        //console.log('found false at --> '+i);
                        $scope.pageValidator[i - 1] = false;

                        break;
                    }
                    else {
                        $scope.pageValidator[$scope.pageValidator.length - 1] = false;
                    }


                }
                //console.log($scope.pageValidator);
            } else {

                if ($scope.currentForm === $scope.totalTabs - 1) {
                    //console.log('here ----->> 1');
                    if ($scope.name.length >= 5 && $scope.venueName.length >= 5
                        && $scope.eventStartDate !== '' && $scope.eventEndDate !== '') {

                        //console.log('success ----->> next on 3rd page');
                        $scope.d1 = new Date($scope.eventStartDate);
                        $scope.d2 = new Date($scope.eventEndDate);
                        $scope.d3 = new Date();
                        if (($scope.d1.getTime() < $scope.d2.getTime()) && ($scope.d1.getDate() > ($scope.d3.getDate() - 1) ) && ($state.current.name === 'events.create')) {
                            $scope.pageValidator[3] = true;
                            $scope.currentForm = ($scope.currentForm + 1) % $scope.totalTabs;
                            $scope.showItV = false;
                            //console.log('created success');
                            return $scope.submitForm();
                        }
                        else if (($scope.d1.getTime() < $scope.d2.getTime()) && ($state.current.name === 'events.edit')) {
                            $scope.pageValidator[3] = true;
                            $scope.currentForm = ($scope.currentForm + 1) % $scope.totalTabs;
                            $scope.showItV = false;
                            //console.log('edit success');
                            return $scope.submitForm();
                        }
                        else {
                            $scope.eventStartDate = "";
                            $scope.eventEndDate = "";
                            $scope.pageValidator[3] = false;
                            $scope.finalValid = true;
                            //console.log('create/edit failed');
                        }


                    }
                    else {
                        $scope.finalValid = false;
                        return;
                    }

                }
                else {
                    //console.log($scope.name.length);venueName
                    if ($scope.name.length < 5) {
                        $scope.showItV = true;
                        $scope.venueName = "";
                        window.scrollTo(0, 0);
                        return;
                    }

                    if ($scope.name !== undefined && $scope.name.length >= 5
                        && $scope.selectedOpts !== undefined && Object.keys($scope.selectedOpts).length > 0
                        && $scope.pageValidator[0] === false) {
                        //console.log('success ----->> next on 1st page');
                        //console.log($scope.name);
                        $scope.currentForm = ($scope.currentForm + 1) % $scope.totalTabs;

                        $scope.pageValidator[0] = true;
                        $scope.showItV = false;
                        if(!($state.current.name === 'events.edit')){
                            $scope.userCurrentLoc('userclick');
                        }



                    } else if ($scope.venueName !== undefined && $scope.venueName.length >= 5
                        && $scope.pageValidator[1] === false) {
                        //console.log('success ----->> next on 2nd page');
                        $scope.currentForm = ($scope.currentForm + 1) % $scope.totalTabs;

                        $scope.pageValidator[1] = true;
                        $scope.showItV = false;

                    }

                    else {
                        //console.log($scope.venueName);
                        $scope.showItV = true;
                        //console.log('clicked on next btn')
                    }

                    //console.log('scrolling up');

                    window.scrollTo(0, 0);

                    //$scope.current    Form = $scope.currentForm ;
                }
                //console.log($scope.pageValidator);


            }
            //console.log($scope.pageValidator);
            //refresh map
            if ($scope.currentForm === 1) {
                $timeout(function () {
                    refreshMap($scope.location);
                }, 10);
            }

            $(".tab-pane").removeClass("active");
            $(".tab-pan" + $scope.currentForm).addClass("active");

        };

        //Choose first tab of event form.

        $scope.submitForm = function () {
            var event = {};

            event.name = $scope.name;
            event.eventStartDate = $scope.eventStartDate;
            event.eventEndDate = $scope.eventEndDate;
            event.category = $scope.selectedOpts;
            event.location = $scope.location;
            event.creator = $scope.authentication.user;
            event.description = $scope.description;
            event.invites = $scope.selectedFriends;
            event.public = $scope.public;
            event.eventDisplayPic = $scope.eventDisplayPic;
            event.venueName = $scope.venueName;
            event.place = $scope.place;

            if ($state.current.name === 'events.edit') {
                //console.log('update event');
                event.images = $scope.images;
                //console.log(event);
                event._id = $stateParams.eid;
                $http.post("/api/events/update", {'event': event}).success(function (resp) {
                        //console.log(resp);
                        $state.go("home");
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            }
            else if ($state.current.name === 'events.create') {
                //console.log('create new event');
                //console.log(event);
                $http.post("/api/events/create", event).success(function (resp) {
                        //console.log("Saved event!");
                        $state.go("home");
                    })
                    .error(function (err) {
                    });
            }

            return false;
        };

        var getDate = function (em, ed, th, tm) {
            var d = "" + new Date().getFullYear() + " " + em + " " + ed + " " + th + ":" + tm + ":" + "00";
            return Date.parse(d);
        };

        var getCurrentPosition = function (callback) {
            //console.log('getting current position map');
            navigator.geolocation.getCurrentPosition(function (pos) {
                var center = {};
                center.latitude = pos.coords.latitude;
                center.longitude = pos.coords.longitude;
                callback(center);
            });
        };

        function refreshMap(marker) {
            //console.log('refreshing map');
            $scope.map.control.refresh({latitude: marker.latitude, longitude: marker.longitude});
        }

        function getLocationString(loc) {
            return loc.latitude + "," + loc.longitude;
        }

        $scope.saveFirstLoc = {
            latitude: 0,
            longitude: 0
        };

        $scope.userCurrentLoc = function (when) {

            //console.log('here changing css');
            var ele = document.getElementById('autoLoc');
            var ele1 = document.getElementById('autoLocIcon');
            //var holderDiv = document.getElementsByClassName('locationTab');
            var scrollTo = document.getElementById('eventDisplayPic');

            if (when === undefined || when === "mapchange") {
                //console.log('map changed');
                ele.style.color = "white";
                ele1.style.color = "white";
                $scope.searchPlaceByLatLong($scope.location);
                return;
            }
            else {
                if (ele.style.color === 'rgb(239, 122, 38)') {
                    ele.style.color = "white";
                    ele1.style.color = "white";
                    //console.log('here changing to none');
                    //console.log($scope.saveFirstLoc);
                    //console.log($scope.location);
                    //window.scrollTo(0,document.getElementById('autoLoc').scrollHeight);
                }
                else {
                    ele.style.color = "rgb(239, 122, 38)";
                    ele1.style.color = "rgb(239, 122, 38)";
                    //console.log('clicked on location btn');


                    //console.log(Authentication.user.longitude);
                    //console.log(Authentication.user);
                    $scope.saveFirstLoc.latitude = Authentication.user.latitude;
                    $scope.saveFirstLoc.longitude = Authentication.user.longitude;

                    $scope.location.latitude = $scope.saveFirstLoc.latitude;
                    $scope.location.longitude = $scope.saveFirstLoc.longitude;

                    //console.log($scope.saveFirstLoc);

                    //console.log($scope.location);
                    //$scope.map.zoom=16;

                    $scope.searchPlaceByLatLong($scope.location);


                    $scope.map.control.refresh({
                        latitude: $scope.saveFirstLoc.latitude,
                        longitude: $scope.saveFirstLoc.longitude
                    });
                    //console.log(getCurrentPosition)

                    window.scrollTo(0, $(document).height());
                    //window.scrollTo(0,document.getElementById('eventDisplayPic').scrollHeight + 64);
                    //$scope.place={};
                }

            }
            //console.log($scope.place);

        };

        $scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
            var nowUtc = new Date();
            //console.log(nowUtc);
            nowUtc.setDate(nowUtc.getDate() - 1);
            //console.log(nowUtc);
            if ($view === 'day') {
                nowUtc.setHours(0, 0, 0, 0);
            } else {
                if ($view === 'hour') {
                    nowUtc.setMinutes(0, 0, 0);
                }
            }

            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].utcDateValue <= nowUtc) {
                    $dates[i].selectable = false;
                } else {
                    $dates[i].selectable = true;
                }
            }
        };

        $scope.beforeRenderED = function ($view, $dates, $leftDate, $upDate, $rightDate) {
            //console.log('hiding dates fro end dropdown');
            var nowUtc = new Date();
            if ($view === 'day') {
                nowUtc.setHours(0, 0, 0, 0);
            } else {
                if ($view === 'hour') {
                    nowUtc.setMinutes(0, 0, 0);
                }
            }

            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].utcDateValue <= nowUtc) {
                    $dates[i].selectable = false;
                } else {
                    $dates[i].selectable = true;
                }
            }
        };

    }
]);
