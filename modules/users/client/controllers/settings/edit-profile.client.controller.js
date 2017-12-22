'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
    function ($scope, $http, $location, Users, Authentication) {
        $scope.user = Authentication.user;

        //checkState
        $scope.checkState();
        if ($scope.user.phone !== undefined && $scope.user.phone !== "" && $scope.user.phone !== null) {
            $("#phone").val("+" + $scope.user.phone);
        }
        $("#phone").intlTelInput();

        // Update a user profile
        $scope.updateUserProfile = function (isValid) {
            $scope.success = $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
                console.log("not valid")
                return false;
            }
            $scope.user.phone = $("#phone").val().replace("+", "");
            if ($scope.user.phone !== undefined && $scope.user.phone !== "" && $scope.user.phone !== null) {
                if (!(/^[+]\d{11,16}$/.test($("#phone").val()))) {
                    $scope.invalidPhone = true;
                    return false;
                } else {
                    $scope.invalidPhone = false;
                }
            }

            var user = new Users($scope.user);
            user.$update(function (response) {
                $scope.$broadcast('show-errors-reset', 'userForm');

                $scope.success = true;
                Authentication.user = response;
            }, function (response) {
                $scope.error = response.data.message;
            });
        }
        ;
    }
]);
