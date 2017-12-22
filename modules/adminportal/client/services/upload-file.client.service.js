/**
 * Created by anshal on 02-20-16.
 */
angular.module('adminportal').service('multipartForm', ['$http', function($http){
    this.post = function(uploadUrl, data){
        var fd = new FormData();
        for(var key in data)
            fd.append(key, data[key]);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.indentity,
            headers: { 'Content-Type': undefined }
        });
    }
}]);
