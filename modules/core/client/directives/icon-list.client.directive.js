/**
 * Created by pardeep on 3/5/16.
 */


 'use strict';

 angular.module('core')
 .directive('iconList',['$timeout',"$http","Authentication",function($timeout,$http,Authentication){

    return {
        restrict:'E',
        replace:true,
        scope: {
            mode : "@",
            icon: "@",
            content : "@",
            listuri : "@",
            listParams:"@",
            searchuri:"@",
            searchParams:"@",
            searchField:"@",
            list: "=?",
            clickFunc : "&?",
            optionsList : "=?",
            optionsListClickFunc : "=?",
            perPage : "@",
            fetchItemCount : "=?",
            modeWatch : "=?",
            enableSearch : "@",
            localSearch : "@",
            
        },
        templateUrl:'/modules/core/client/views/icon-list.client.view.html',
        link : function(scope,element,attr) {

            scope.me = Authentication.user;
            scope.list= scope.list!==undefined?scope.list:[];
            scope.page=0;
            scope.perPage = scope.perPage===undefined?10:parseInt(scope.perPage);
            scope.mode = scope.mode===undefined?'list':scope.mode;
            scope.initItemCount = scope.initItemCount===undefined?10:scope.initItemCount;
            scope.customLimit = scope.customLimit===undefined?10:scope.customLimit;
            scope.enableSearch = scope.enableSearch===undefined?false:(scope.enableSearch==="false"?false:true);
            scope.localSearch = scope.localSearch===undefined?false:(scope.localSearch==="false"?false:true);
            scope.modeWatch = scope.mode==='list'?false:true;
            scope.lListParams = scope.listParams===undefined?"":scope.listParams+"";
            scope.lSearchParams = scope.searchParams===undefined?"":scope.searchParams+"";
            

            


            var args = scope.lListParams.split("&");
            scope.lListParams={};
            for(var i=0;i<args.length;i++) {
                var an = args[i].split("=")[0];
                var av = args[i].split("=")[1];
                scope.lListParams[an] = av;
            }
            var args = scope.lSearchParams.split("&");
            scope.lSearchParams={};
            for(var i=0;i<args.length;i++) {
                var an = args[i].split("=")[0];
                var av = args[i].split("=")[1];
                scope.lSearchParams[an] = av;
            }
            
            scope.$watch('modeWatch',function(nv,ov){
                if(nv===true) {
                    scope.mode = 'grid';
                } else {
                    scope.mode = 'list';
                }
            });
            scope.incrementLimit = function(){
                scope.customLimit =Number(scope.customLimit)+ 4;
            };
            scope.showLoadMore = true;
            scope.enableFilters = false;
            scope.loadMore = function() {
                if(scope.listuri!==undefined && scope.listuri.length) {
                    $http.get(scope.listuri,{params:_.extend({page:scope.page,perPage:scope.perPage},scope.lListParams)}).then(function(s){
                        
                        scope.list = scope.list.concat(s.data);

                        if(s.data.length<scope.perPage || s.data.length > scope.perPage) {
                            scope.showLoadMore = false;
                        }
                        scope.page+=1;
                    },function(e){
                        console.log(e);
                    });
                } else {
                    scope.page+=1;
                    scope.showLoadMore=false;
                }
            };
            
            scope.sMode = false;
            scope.searchMode = function() {
                scope.sMode=!scope.sMode;
                if(scope.localSearch) {
                    return;
                }
                if(scope.sMode) {
                    scope.showLoadMore  = false;
                    scope.list = [];
                } else {
                    scope.searchText = "";
                    scope.page=0;
                    scope.list=[];
                    scope.showLoadMore = true;
                    scope.loadMore();
                }
            }
            var toc = null;
            if(!scope.localSearch && scope.searchuri!==undefined && scope.searchuri.length) {
                scope.$watch('searchText',function(nv,ov){
                    $timeout.cancel(toc);
                    toc = $timeout(function(){
                        if(scope.searchText===undefined || scope.searchText.length<=0){
                            return;
                        }
                        $http.get(scope.searchuri,{params:_.extend({searchText:scope.searchText},scope.lSearchParams)}).then(function(res){
                            scope.list = res.data;
                        },function(err){

                        });

                    },1000);
                });
            };

            //initial load

            scope.loadMore();
            
        }

    };


}]);
