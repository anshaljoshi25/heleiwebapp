/**
 * Created by anshal on 3/28/2016.
 */
angular.module('users').controller('FeedbackController', ['$scope', '$stateParams', '$http','$timeout','$interval', '$location', 'Authentication','$state',
    function ($scope, $stateParams, $http,$timeout,$interval, $location, Authentication, $state) {


        $scope.alertDone=false;
        $scope.user = Authentication.user;

        $scope.feedback={};
        $scope.feedback.uiViewRating=5;
        $scope.feedback.userExpRating = 5;
        $scope.feedback.relevanceRating = 5;
        $scope.feedback.contentRating = 5;

        if($scope.user!==undefined && $scope.user!=="" && $scope.user!==null) {
            $scope.feedback.name = $scope.user.firstName + " " + $scope.user.lastName;
            $scope.feedback.email = $scope.user.email;
        }
        $scope.submitForm = function() {
            $http.post("/api/feedback/create",$scope.feedback).success(function(resp){
                    console.log("Saved feedback!");
                    $scope.alertDone=true;
                    setTimeout(function(){
                        $state.go("home");
                    }, 3000);

                })
                .error(function(err){
                    console.log(err);
                });
            return false;
        }

    }
]);
