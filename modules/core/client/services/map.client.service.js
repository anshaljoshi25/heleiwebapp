/**
 * Created by arunsharma on 31/1/16.
 */
'use strict';

var coreApp = angular.module('core');

coreApp.factory('MarkerCreatorService', function () {

    var markerId = 0;

    function create(latitude, longitude, options) {
        var marker = {
            options: {
                animation: 0,
                icon:'',
                visible: true
            },
            latitude: latitude,
            longitude: longitude,
            id: ++markerId,
            events : {
                dragend : function(m,en,arg){},
                click : function(m,en,args){}
            },
            email: '',
            setVisible : function(sh){}
        };
        return marker;
    }

    function getDirOptions() {
        return {
            origin: "",
            destination: "",
            provideRouteAlternatives: false,
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
                departureTime: new Date(/* now, or future date */),
                trafficModel: google.maps.TrafficModel.PESSIMISTIC
            }
        };
    }

    function invokeSuccessCallback(successCallback, marker) {
        if (typeof successCallback === 'function') {
            successCallback(marker);
        }
    }

    function createByCoords(latitude, longitude, successCallback) {
        var marker = create(latitude, longitude);
        invokeSuccessCallback(successCallback, marker);
    }

    function createByAddress(address, successCallback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address' : address}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var firstAddress = results[0];
                var latitude = firstAddress.geometry.location.lat();
                var longitude = firstAddress.geometry.location.lng();
                var marker = create(latitude, longitude);
                invokeSuccessCallback(successCallback, marker);
            } else {
                alert("Unknown address: " + address);
            }
        });
    }

    function createByCurrentLocation(successCallback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var marker = create(position.coords.latitude, position.coords.longitude);
                invokeSuccessCallback(successCallback, marker);
            });
        } else {
            alert('Unable to locate current position');
        }
    }

    function getCurrentPosition(callback) {
        navigator.geolocation.getCurrentPosition(function(pos){
            var center = {};
            center.latitude = pos.coords.latitude;
            center.longitude = pos.coords.longitude;
            callback(center);
        });
    }

    function  getDirection(src,dest,callBack) {
        var ds = new google.maps.DirectionsService();
        var options = getDirOptions();
        options.origin = src;
        options.destination = dest;
        ds.route(options,function(result,status){
            callBack(result,status);
        });
    }

    return {
        createByCoords: createByCoords,
        createByAddress: createByAddress,
        createByCurrentLocation: createByCurrentLocation,
        getCurrentPosition :getCurrentPosition,
        getDirection : getDirection
    };

});
