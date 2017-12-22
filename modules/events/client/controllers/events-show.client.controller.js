/**
 * Created by arunsharma on 3/2/16.
 */
'use strict';


angular.module('events').controller('EventsShowController', ['$rootScope', '$scope','$state','$stateParams','$http', '$window', '$timeout', '$interval', 'Authentication', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'MarkerCreatorService', 'Users',
    function ($rootScope, $scope,$state, $stateParams, $http, $window, $timeout, $interval, Authentication, uiGmapGoogleMapApi, uiGmapIsReady, MarkerCreatorService, Users) {

        // initialize FB parser everytime this controllers gets loaded
        // to show the coment plugin conatiner
        try {
            FB.XFBML.parse();
            FB.XFBML.parse(document.getElementById('social-facebook'));
        } catch (e) {
            console.log(e);
        }
        $scope.authentication = Authentication;
        $scope.eid = $stateParams.eid;
        $scope.me = Authentication.user;
        $scope.event = {};
        $scope.event.eventMonth = 0;
        /* fetch the event*/
        $scope.directions = {};
        $scope.newEventImage = "";
        //check if logged in user is already subscribed to the event or not
        $scope.subscribedByMe = false;
        $scope.qrBtn = false;
        $scope.showLoyaltyBtn = true;
        $http.get('/api/events/show/' + $stateParams.eid).then(function success(res) {

            $scope.event = res.data;
            var dt = new Date($scope.event.eventStartDate);
            $scope.event.eventMonth = (dt.getMonth())+1;
            $scope.event.eventDay = dt.getDate();
            $scope.event.eventTime = getTime(dt);
            var staticMapUri = "";
            $timeout(function () {
                $("#eventSlider").slick({
                    slidesToShow: 3,
                    infinite: true,
                    arrows: false,
                    responsive: [{
                        breakpoint: 1366,
                        settings: {
                            slidesToShow: 6,
                            slidesToScroll: 1,
                            infinite: true
                        }
                    },
                    {
                        breakpoint: 600,
                        settings: {
                            slidesToShow: 4,
                            slidesToScroll: 1,
                            infinite: true
                        }
                    },
                    {
                        breakpoint: 480,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                            infinite: true
                        }
                    }

                    ]
                });
            }, 1000);


            //check if rewards can be given
            $scope.pos50 = {};
            navigator.geolocation.getCurrentPosition(function (pos) {
                pos = pos.coords;
                $scope.pos50.latitude = pos.latitude;
                $scope.pos50.longitude = pos.longitude;
            //all api to update user's current location
            //$scope.map.center = pos;
            //$rootScope.currentLocationt = pos;
            //$rootScope.myBaseLoc = pos;
            //$scope.filters.location = $rootScope.lastLocation;
            $scope.dist = $rootScope.distance($scope.event.location.latitude, $scope.event.location.longitude, pos.latitude, pos.longitude);
            var dd = new Date();
            

            $http.post("/api/loyalties/history/get",{object:{type:'ATTENDED',_id:$scope.event._id}}).then(
                function(s) {

                    if ($scope.dist < 1 && dd >= new Date($scope.event.eventStartDate) && dd <= new Date($scope.event.eventEndDate)
                        && s.data.status === "NOTFOUND") {

                        $scope.showLoyaltyBtn = false;
                }
            },
            function(e) {

            }
            );});


            $http.get("/api/users/me").then(function (res) {
                $scope.user = res.data;
                if ($scope.user!==undefined && $scope.user!=="" && $scope.user!==null && $scope.user.roles.indexOf('owner') >= 0) {
                    $scope.qrBtn = true;
                }

                if (!res.hasOwnProperty("data") || res.data === null) {
                    return;
                }

                //check if user is the creator
                //if($scope.user.roles.indexOf('user') >= 0) {
                //    $scope.showLoyaltyBtn = true;
                //}

                $scope.userId = res.data._id;
                for (var i = 0; i < $scope.event.going.length; i++) {
                    if ($scope.event.going[i]._id == $scope.userId) {
                        $scope.subscribedByMe = true;
                    }

                }
            }, function (err) {
                console.log(err);
            });



        }, function error(err) {
            console.log(err);
        });

        $scope.clearImage = function () {
            $scope.newEventImage = "";
            $scope.cancelUpload();
            $("#imageUploadModal").modal("hide");
        };
        $scope.saveImage = function() {
            if($scope.newEventImage!=="") {
                $http.post("/api/events/saveimage",{
                    _id:$scope.event._id,
                    newEventImage : $scope.newEventImage
                }).then(function(s){
                    $('#eventSlider').slick('slickAdd',
                        '<div style="background-image: url('+$scope.newEventImage+')"></div>');
                    $scope.newEventImage = "";
                    $("#imageUploadModal").modal("hide");

                },function(e){
                    console.log(e);
                });
            }
        };

        $scope.attendEvent=function(ie) {
            if($scope.authentication.user === undefined || $scope.authentication.user==="" || $scope.authentication.user==={}) {
                $state.go("authentication.signin");
                return;
            }
            if($scope.subscribedByMe){
                var confirm = $window.confirm("Press OK to unattend the event.");
                if(confirm) {
                    $http.post('/api/events/accepted/decline', ie).then(function (res) {
                        $scope.subscribedByMe = false;
                        for(var i=0;i<$scope.event.going.length;i++) {
                            if($scope.event.going[i].email==$scope.authentication.user.email) {
                                $scope.event.going.splice(i,1);
                                i--;
                            }
                        }
                    }, function (err) {
                        console.log("error");
                    });
                }
                return;
            }
            $http.post('/api/events/invites/accept/',ie).then(function(res){
                $scope.subscribedByMe = true;
                $scope.event.going.push($scope.authentication.user);
            },function(err){
                console.log("error");
            });
        };

        $scope.showUploadImagesFn = function(e) {
            $scope.showUploadImages = !$scope.showUploadImages;
        };


        var getTime = function(dt) {
            var th,tm,ampm;
            th = dt.getHours();
            ampm='am';
            if(th>12) {
                th = th % 12;
                ampm='pm';
            }
            tm = dt.getMinutes();
            th = th<10?"0"+th:""+th;
            tm = tm<10?"0"+tm:""+tm;

            return th+":"+tm+" "+ampm;

        };

        $scope.goBack = function() {
            window.history.back();
        };

        $scope.showUserProfile = function(u) {
            $state.go('user.profile',{uid : u._id,ptype:'single'});
        };

        $scope.showMoreInfoFn = function() {
            $scope.showMoreInfo = true;
            $(".more-info-container p").css("height","initial");
        };

        


        $scope.get50Points = function () {
            $http.post('/api/events/getloyalty', {'location': $scope.pos50, 'event': $scope.event}).then(
                function success(res) {

                    $scope.showLoyaltyBtn = true;

                },
                function error(err) {
                    console.log(err);
                }
                )
        };

        // document.getElementById("Print").onclick = function () {
        //     printElement(document.getElementById("printThis"));
        // };
        // function printElement(elem) {

        //     var domClone = elem.cloneNode(true);

        //     var $printSection = document.getElementById("printSection");
        //     var w = window.open("", "", ["height=" + screen.height, "width=" + screen.width]);
        //     var html = $(".qrbody").html();

        //     $(w.document.body).html(html);

        //     $(w.document.body).find(".qrcode-link").html("<img src=\"" + $(".qrcode-link").attr("href") + "\" \>");
        //     $(w.document.body).css("width", "300px");
        //     $(w.document.body).css("height", "450px");
        //     $(w.document.body).css("margin", "0px auto");
        //     $(w.document.body).append("<button style='width:300px; margin:0px auto; display:block;' onclick='window.print();' >Print</button>");
        // }

        $scope.showFullImage= function(img) {
            // console.log(img);
            $(".displayPic").attr("src",img);
        }


    }
    ]);
