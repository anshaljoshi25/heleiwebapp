/**
 * Created by pardeep
 */
'use strict';

angular.module('adminportal').service('CategoryDataService', ['$http', function($http){

    var promiseCount;
    var categoryDataService = {
    
        countAllCategory: function() {

                console.log('running factory for getting count for all category');

                // $http returns a promise, which has a then function, which also returns a promise
                promiseCount = $http.get('/api/category/count').then(function (response) {
                    // The then function here is an opportunity to modify the response
                    console.log(response);
                    // The return value gets picked up by the then in the controller.
                    return response.data;
                });
            // Return the promise to the controller
            return promiseCount;
        },

        

    };
    return categoryDataService;

}]);
