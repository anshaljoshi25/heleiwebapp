/**
 * Created by pardeep on 2/6/16.
 */


'use strict';

angular.module('inbox').controller('InboxShowConversationController', ['$scope','$timeout','$interval','$http', '$state', 'Authentication','Users','$stateParams', '$filter',
    function ($scope, $timeout,$interval, $http, $state, Authentication, Users, $stateParams) {

        $scope.allMessages = [];

        $scope.me = Authentication.user;
        $scope.lastMsgId = '';
        $scope.userId = $stateParams.uid;
        $scope.profileType = "";

        $scope.countID = 0;
        $scope.firstMsgDatetime;
        $scope.lastMsgDatetime;

        //$scope.showUserProfileByID = function(obj) {
        //    $state.go('user.profile',{uid : obj._id});
        //};

        $scope.sendChat =
        {
            from: Authentication.user.email,
            to: '',
            message: '',
            shortmessage: '',
            conversationType: ''
        };

        $scope.recieveChat =
        {
            from: {},
            to: {},
            message: '',
            shortmessage: '',
            conversationType: ''
        };


        $scope.renderGroup = {
            '_id': '',
            'displayname':'',
            'email':'',
            profileImageURL : '',
            firstName : '',
            lastName : ''

        };
        /*
         pick profile of group or user based on click
         */
        $http.post('/api/inbox/friend/group', {'groupId':$stateParams.uid}).then(function success(res) {
            //console.log("in group post" );
            //console.log( res.data);
            $scope.gProfile = res.data;
            //console.log($scope.gProfile);
            if($scope.gProfile !== undefined && $scope.gProfile.length>0){
                //$scope.friendProfile = res.data;
                //$scope.gProfile = [];
                //console.log('in loop');
                $scope.renderGroup._id=$scope.gProfile[0]._id;
                $scope.renderGroup.displayname=$scope.gProfile[0].name;
                $scope.renderGroup.email="";
                $scope.renderGroup.profileImageURL=$scope.gProfile[0].groupImgURL;
                $scope.renderGroup.firstName=$scope.gProfile[0].name;
                $scope.renderGroup.lastName='Group';
                $scope.friendProfile =  $scope.renderGroup;
                //console.log($scope.renderGroup._id);
                $scope.sendChat.conversationType = 'Group';
                $scope.profileType = "group";
                $scope.getOneDayData();
            }else{
                //console.log('not in loop');
                $scope.profileType = "user";
                $http.get('/api/users/profile/' + $stateParams.uid).then(function success(res) {
                    $scope.friendProfile = res.data;
                    //console.log(res.data);
                    $scope.renderGroup._id="";
                    //$scope.allMessages[0].from = $scope.friendProfile;
                    $scope.sendChat.conversationType = 'Single';
                    $scope.profileType = "single";
                    $scope.getOneDayData();

                }, function error(err) {
                    console.log(err);
                });
            }


        }, function error(err) {
            console.log(err);

        });

        //allMsgs -> one day chat -> sort allMsgs by created date  first msg [1,,,,,n] n -> last msg
        // last msg time of last msg
        // first msg time of last
        // timeout -> jo sirf latest msgs laye
        //


        /*
         get one day chat for selected uid
         */
        $scope.getOneDayData = function() {
            $http.post('/api/inbox/conversation/receiveuserchat', {
                    'userId': $stateParams.uid,
                    'type':  $scope.profileType,
                    'firstMsgDate': $scope.firstMsgDatetime,
                    'lastMsgDate': $scope.lastMsgDatetime
                })
                .then(function success(res) {

                    //console.log('loading last day data');

                    if (res.data.length > 0) {
                        $scope.allMessages = $scope.allMessages.concat(res.data);
                        $scope.allMessages.sort($scope.sorter("created"));
                        $scope.firstMsgDatetime = $scope.allMessages[0].created;
                        $scope.lastMsgDatetime = $scope.allMessages[$scope.allMessages.length - 1].created;

                    }
                    else{
                        $scope.firstMsgDatetime = new Date();
                        //console.log($scope.firstMsgDatetime);
                        $scope.countID = 1;
                        while(!$scope.allMessages.length &&  $scope.countID < 2){
                            //console.log('recieving last chat');
                            $scope.receivelastchat();
                            setTimeout(function(){


                            },500);
                            //console.log('getting cht'+$scope.countID);
                            //$scope.countID +=1;

                        }

                    }

                    $scope.fetcherCounter = $timeout($scope.refreshChat, 2000);
                    //console.log($scope.allMessages);
                }, function error(err) {
                    console.log(err);
                });

        };


        /*
         * Sorter method to sort allMessages array
         * */
        $scope.sorter = function (property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        };

        $scope.runOnce2 = false;
        $scope.refreshChat = function(){
            //console.log($scope.firstMsgDate);
            //console.log($scope.lastMsgDatetime);
            if($state.current.name==='inbox.conversation' ) {

                $http.post('/api/inbox/conversation/receiveuserchat',
                    {
                        'userId': $stateParams.uid,
                        'type':  $scope.profileType ,
                        'firstMsgDate':undefined,
                        'lastMsgDate': $scope.lastMsgDatetime
                    })
                    .then(function success(res) {
                        //console.log('printing recent data');
                        //console.log(res.data);


                        $scope.allMessages = $scope.allMessages.concat(res.data);
                        if($scope.allMessages.length >0){
                            $scope.allMessages.sort($scope.sorter("created"));
                            $scope.lastMsgDatetime = $scope.allMessages[$scope.allMessages.length -1].created;
                            //console.log('new last date updated in refreshChat ->>>>>'+  $scope.lastMsgDatetime);
                        }

                    });

                $timeout(function () {
                    //$("#chatArea").animate({
                    //    scrollTop:$("#chatWindow").height
                    //},1000);
                    //$("#chatArea").animate({scrollTop:$("#chatWindow").height()},1000);
                    //console.log("test");
                    if(!$scope.runOnce2){
                        window.scrollTo(0,document.body.scrollHeight);
                        $scope.runOnce2 = true;
                    }
                    if ($scope.allMessages.length <= 0) {
                        //window.scrollTo(0,document.body.scrollHeight);
                        return;
                    }

                    //console.log('all msgs len ->> ' + $scope.allMessages.length);
                    var newLastmsgId = $scope.allMessages[$scope.allMessages.length - 1]._id;
                    if ($scope.lastMsgId !== newLastmsgId) {
                        $scope.lastMsgId = newLastmsgId;
                        $("#chatArea").animate({
                            scrollTop: document.getElementById("chatArea").scrollHeight
                        }, 100);
                        window.scrollTo(0,document.body.scrollHeight);
                    }
                }, 100);

                $scope.fetcherCounter = $timeout($scope.refreshChat, 1000);
            }
            else{

            }

        };





        $scope.receivelastchat = function(){
            //console.log('last chat');

            $http.post('/api/inbox/conversation/receiveuserchat',
                {'userId':$stateParams.uid,
                    'type': $scope.profileType,
                    'firstMsgDate':$scope.firstMsgDatetime,
                    'lastMsgDate':undefined,
                    'countID':$scope.countID})
                .then(function success(res) {

                    if(res.data.length>0) {
                        $scope.allMessages = $scope.allMessages.concat(res.data);

                        //console.log('new allmessgs---------------');
                        //console.log($scope.allMessages);
                        $scope.allMessages.sort($scope.sorter("created"));
                        $scope.firstMsgDatetime = $scope.allMessages[0].created;
                        //console.log('new first date updated in recieveLastChat->>>>>'+  $scope.firstMsgDatetime);


                    }
                    //console.log($scope.allMessages);


                }, function error(err) {
                    console.log(err);
                });
            $scope.countID+=1;


        };

        /*
         * destroy timeout on state change
         * */
        $scope.$on('$destroy', function(){
            $timeout.cancel($scope.refreshChat);
        });
        $scope.$on('$locationChangeStart', function(){
            $timeout.cancel($scope.refreshChat);
        });

        var chatWindowHeight = 0;
        var bottomOffset = 10;

        chatWindowHeight = $(document).height() - ($("#chatWindow").offset().top ) + 10;
        //console.log(chatWindowHeight);
        $("#chatWindow").css("height",chatWindowHeight + "px");


        /*
         *
         * method for sending chat and pushing it to allMessages array
         * */
        $scope.chatFlag = false;

        $scope.sendChatText = function(event){
            event.preventDefault();
            if(event.type==='click') {
                if(true){
                    //console.log(event);
                    var mx = event.pageX - $("#chatTxtBox").offset().left;
                    var my = event.pageY - $("#chatTxtBox").offset().top;
                    //console.log(mx + " -- " + my);
                    if(mx > $("#chatTxtBox").width()-10 && my > $("#chatTxtBox").height()-40) {
                        //noop
                    } else {
                        return false;
                    }
                }
            }
            $("#chatArea").animate({
                scrollTop: document.getElementById("chatArea").scrollHeight
            }, 100);
            if($scope.chatFlag === false) {
                $scope.chatFlag = true;

                //console.log("send chat " + $scope.chatMsg);

                $scope.sendChat.message = $scope.chatMsg;
                $timeout(function () {
                    $scope.chatMsg = "";
                    $("#chatTxtBox").focus();
                }, 100);

                $scope.sendChat.to = $stateParams.uid;
                $scope.sendChat.shortmessage = "demo short";

                //var chatArr = [$scope.sendChat];
                //console.log(chatArr);

                //$scope.allMessages.push($scope.sendChat);

                //$scope.allMessages = $scope.allMessages.concat(chatArr);

                //$scope.allMessages.sort($scope.sorter("created"));
                //$scope.lastMsgDatetime = $scope.allMessages[$scope.allMessages.length -1].created;
                //console.log('new last date updated in sendChat ->>>>>'+  $scope.lastMsgDatetime);
                $timeout(function () {
                    //console.log('len of all msgs'+ $scope.allMessages.length);
                    if($scope.allMessages.length >0){
                        var newLastmsgId = $scope.allMessages[$scope.allMessages.length - 1]._id;
                    }

                    //$scope.allMessages.length ===0 ?'':$scope.allMessages[$scope.allMessages.length - 1]._id;
                    if ($scope.lastMsgId !== newLastmsgId) {
                        $scope.lastMsgId = newLastmsgId;
                        $("#chatArea").animate({
                            scrollTop: document.getElementById("chatArea").scrollHeight
                        }, 100);
                    }
                }, 100);
                $http.post('/api/inbox/conversation/sendchat',$scope.sendChat).then(function success(res) {
                    //console.log(res.data);
                    $scope.chatFlag=false;
                }, function error(err) {
                    console.log(err);
                    $scope.chatFlag=false;
                });
            }
        };



        $scope.value1 = {
            value: 'hide'
        };

        $scope.selectMsg = function(chatId){

            if($scope.value1.value === 'hide'){
                $scope.value1.value = 'show';
                //console.log('show checkbox');
                return
            }

            $scope.value1.value = 'hide';
            //console.log('hide checkbox');

        };
        $scope.runOnce = false;
        $scope.countSelected = 0;
        $scope.selectChatId = [];
        $scope.showTrash=false;

        $scope.selectUserChatMD = function(event, msg) {

            if($scope.runOnce === false && $scope.countSelected === 0) {
                if (event.type === "mousedown") {

                    $scope.promise = $interval(function () {

                        if (event.type === 'mousedown') {

                            if (msg.isSelected === false || msg.isSelected === undefined) {
                                msg.isSelected = true;
                                $scope.countSelected +=1;
                                $scope.showTrash = true;
                                $scope.selectChatId.push(msg._id);
                            }
                            else {
                                if($scope.selectChatId.indexOf(msg._id) > -1){
                                    $scope.selectChatId.splice($scope.selectChatId.indexOf(msg._id),1);
                                }
                                msg.isSelected = false;
                                $scope.countSelected -=1;
                                $scope.showTrash = false;
                                //console.log('counter decreased'+ $scope.countSelected)
                            }

                        }
                        $scope.runOnce = true;

                    }, (1000));

                }
            }
            if ($scope.runOnce === true ){
                if (event.type === "mousedown")
                {

                    if (msg.isSelected === false || msg.isSelected === undefined) {
                        msg.isSelected = true;
                        $scope.countSelected +=1;
                        //console.log('counter increased'+ $scope.countSelected)
                        $scope.selectChatId.push(msg._id);
                    }
                    else {
                        msg.isSelected = false;
                        $scope.countSelected -=1;
                        if($scope.selectChatId.indexOf(msg._id) > -1){
                            $scope.selectChatId.splice($scope.selectChatId.indexOf(msg._id),1);
                        }
                        //console.log('counter decreased'+ $scope.countSelected)
                    }
                }
                if($scope.countSelected ===0){
                    $scope.showTrash = false;
                    $scope.runOnce = false;
                }

            }
            //console.log($scope.selectChatId);
        };

        $scope.selectUserChatMU = function(event) {
            //console.log('cancelling event');

            $interval.cancel($scope.promise);

        };

        $scope.removeChat = function(){
            $http.post('/api/inbox/conversation/deletechat',{'chatId':$scope.selectChatId})
                .then(function sucess(res){

                    //console.log(res);
                    //console.log($scope.allMessages);
                    for(var i = 0; i<$scope.selectChatId.length;i++){
                        for(var j=0;j<$scope.allMessages.length;j++){
                            //console.log($scope.selectChatId[i]);
                            if($scope.allMessages[j]._id === ($scope.selectChatId[i])){
                                //console.log('found msg ');
                                $scope.allMessages.splice(j,1);
                                j--;

                            }
                        }

                    }

                    //console.log($scope.allMessages);
                }, function error (err){
                    console.log(err);
                });

        };


    }
]);
//angular.module('inbox').filter('parseDate', function($filter) {
//    return function(input) {
//        if(input == null){ return ""; }
//
//        var _date = $filter('date')(new Date(input), 'MMM dd yyyy - HH:mm:ss');
//
//        return _date.toLowerCase();
//
//    };
//});
