/**
 * Created by arunsharma on 20/2/16.
 */
'use strict';

angular.module('core')
    .directive('fileUpload', ['$timeout','$window', 'FileUploader', function ($timeout,$window, FileUploader) {
        return {
            restrict:'E',
            replace:true,
            scope:{
                sPath : "=savedpath"
            },
            templateUrl:'/modules/core/client/views/file-uploader.client.view.html',
            link : function(scope,elem,attr){




            },
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, controller) {
                        scope.uploader = new FileUploader(
                            {
                                url: iAttrs.url,
                                alias: iAttrs.alias
                            }
                        );

                        scope.uploaded = false;
                        // Called after the user selected a new picture file
                        scope.uploader.onAfterAddingFile = function (fileItem) {
                            if ($window.FileReader) {
                                var fileReader = new FileReader();
                                fileReader.readAsDataURL(fileItem._file);

                                fileReader.onload = function (fileReaderEvent) {
                                    $timeout(function () {
                                        scope.imageURL = fileReaderEvent.target.result;
                                    }, 0);
                                };
                            }
                            $("#fuFile").hide();
                        };

                        scope.upload = function () {
                            scope.uploader.uploadAll();
                            $("#fuLoader").show();
                            $("#buttonsHolder").hide();
                        };

                        scope.cancelUpload = function() {
                            scope.sPath = "";
                            scope.uploaded=false;
                            scope.imageURL = "nan";
                            scope.uploader.clearQueue();
                            $("#fuFile").show();
                        };

                        scope.sPath = "";
                        scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                            $("#fuLoader").hide();
                            $("#buttonsHolder").show();
                            scope.sPath = response.path;
                            scope.uploaded=true;
                            $timeout(function(){
                                scope.$apply();
                                if(iAttrs.callback!==undefined && iAttrs.callback!=='') {
                                    scope[iAttrs.callback]();
                                }
                            },100);
                        };

                        // Set file uploader image filter
                        if (iAttrs.filters) {
                            scope.uploader.filters.push({
                                name: 'imageFilter',
                                fn: function (item, options) {
                                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                                    var ind = iAttrs.filters.indexOf(type);
                                    if(ind<0) {
                                        alert("Image type not supported!");
                                    }
                                    return ind!== -1;
                                }
                            });
                        }
                    }
                }
            }
        }
    }]);
