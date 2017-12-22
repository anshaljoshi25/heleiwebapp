/**
 * Created by pardeep on 2/8/16.
 */

'use strict';

/**
 *Module dependencies
 */

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    ChatMessage = mongoose.model('ChatMessage'),
    ChatGroup = mongoose.model('ChatGroup'),
    Friend = mongoose.model('Friend'),
    Notification = mongoose.model('Notification'),
    path=require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
/*
send chat for the user for last one day
 */


exports.receiveuserchat = function (req, res) {

    //console.log('Api hit for receiving chat for user----> '+req.body.userId + '---type '+ req.body.type);


    /*firstDate = firstMsgDate recived at user end
    * lastDate = lastmsgDate recieved at user end (it is more recent than firstMsgDate)
    * */
    var firstDate = req.body.firstMsgDate;
    var lastDate = req.body.lastMsgDate;
    var type = req.body.type;


    if(type === 'single') {

        /*
        * to find one day data */
        if (firstDate === undefined && lastDate === undefined) {
            var firstMsgDate = new Date();
            var lastMsgDate = new Date();

            firstMsgDate.setDate(lastMsgDate.getDate() - 1);

            //console.log('querry data in if 1  with Date gte--> ' + firstMsgDate + ' and lt ->' + lastMsgDate);


            ChatMessage.find({
                $or: [
                    {$and: [{'to': req.user._id}, {'from': req.body.userId}]},
                    {$and: [{'to': req.body.userId}, {'from': req.user._id}]}
                ],
                $and: [
                    {created: {$gte: firstMsgDate}},
                    {created: {$lt: lastMsgDate}}
                ],
                'archived':{$nin:[req.user._id]}

                //    ,
                //$ne:{
                //        'archived':[{
                //            "member":{eq:req.user._id},
                //            "status": {eq:true}
                //         }]
                //    }



            })
                .populate('from', '-password -salt -longitude -latitude -roles -username ')
                .populate('to', '-password -salt -longitude -latitude -roles -username ')
                .sort({'created': 1}).exec(function (err, chatData) {
                    if (err) {
                        console.log('error occured here');
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                    //console.log(chatData);
                    res.json(chatData);
                });
        }

        /*to find recent data */
        if (firstDate === undefined && lastDate !== undefined) {

            var firstMsgDate = new Date(lastDate);

            // set first msg date to the last msg recieved date on user side

            //console.log('querry data in if 2  with Date gte--> ' + firstMsgDate );


            ChatMessage.find({
                $or: [
                    {$and: [{'to': req.user._id}, {'from': req.body.userId}]},
                    {$and: [{'to': req.body.userId}, {'from': req.user._id}]}
                ],
                created: {$gt: firstMsgDate},
                'archived':{$nin:[req.user._id]}
            })
                .populate('from', '-password -salt -longitude -latitude -roles -username ')
                .populate('to', '-password -salt -longitude -latitude -roles -username ')
                .sort({'created': 1}).exec(function (err, chatData) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                    //console.log(chatData);
                    res.json(chatData);
                });


        }

        /*
        * to find previous data */
        if (firstDate !== undefined && lastDate === undefined) {

            var lastMsgDate = new Date(firstDate);
            var firstMsgDate = new Date();
            firstMsgDate.setDate(lastMsgDate.getDate() - 1 -(req.body.countID));

            //console.log('querry data in if 3 with Date gte--> ' + firstMsgDate + ' and lt ->' + lastMsgDate + 'countID '+ req.body.countID);

            ChatMessage.find({
                $or: [
                    {$and: [{'to': req.user._id}, {'from': req.body.userId}]},
                    {$and: [{'to': req.body.userId}, {'from': req.user._id}]}
                ],
                $and: [{created: {$gte: firstMsgDate}},
                    {created: {$lt: lastMsgDate}}],
                'archived':{$nin:[req.user._id]}
            })
                .populate('from', '-password -salt -longitude -latitude -roles -username ')
                .populate('to', '-password -salt -longitude -latitude -roles -username ')
                .sort({'created': 1}).exec(function (err, chatData) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                    //console.log(chatData);
                    res.json(chatData);
                });


        }

    }

    else if(type === 'group'){
        // userId will be treated as groupId

        if (firstDate === undefined && lastDate === undefined){
            var firstMsgDate = new Date();
            var lastMsgDate = new Date();

            firstMsgDate.setDate(lastMsgDate.getDate() - 1);

            //console.log('querry data in if 1 with firstMsgDate --> ' + firstMsgDate + 'recived last date ->' + lastDate);

            ChatMessage.find({
                $or : [
                    //{$and : [{'to' : req.user._id},{'from' : req.params.groupId}]},
                    {$and : [{'to' : req.body.userId}]}

                ],
                $and: [
                    {created: {$gte: firstMsgDate}},
                    {created: {$lt: lastMsgDate}}
                ],
                'archived':{$nin:[req.user._id]}
            }).populate('from', '-password -salt -longitude -latitude -roles -username ')
                .sort({'created':1}).exec(function(err,groupchatData){
                if(err){
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                //console.log(groupchatData);
                res.json(groupchatData);

            });
        }

        if (firstDate === undefined && lastDate !== undefined){

            var firstMsgDate = new Date(lastDate);

            // set first msg date to the last msg recieved date on user side

            //console.log('querry data in if 2 with firstMsgDate --> ' + firstMsgDate + 'recived last date ->' + lastDate);


            ChatMessage.find({
                $or : [
                    //{$and : [{'to' : req.user._id},{'from' : req.params.groupId}]},
                    {$and : [{'to' : req.body.userId}]}

                ],
                created: {$gt: firstMsgDate},
                'archived':{$nin:[req.user._id]}
            }).populate('from', '-password -salt -longitude -latitude -roles -username ')
                .sort({'created':1}).exec(function(err,groupchatData){
                if(err){
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                //console.log(groupData);
                res.json(groupchatData);

            });

        }

        if (firstDate !== undefined && lastDate === undefined){
            var lastMsgDate = new Date(firstDate);
            var firstMsgDate = new Date();
            firstMsgDate.setDate(lastMsgDate.getDate() - 1 -(req.body.countID));

            // console.log('querry data in if 3 with Date gte--> ' + firstMsgDate + ' and lt ->' + lastMsgDate + 'countID '+ req.body.countID);


            ChatMessage.find({
                $or : [
                    //{$and : [{'to' : req.user._id},{'from' : req.params.groupId}]},
                    {$and : [{'to' : req.body.userId}]}

                ],
                $and: [{created: {$gte: firstMsgDate}},
                    {created: {$lt: lastMsgDate}}],
                'archived':{$nin:[req.user._id]}
            }).populate('from', '-password -salt -longitude -latitude -roles -username ')
                .sort({'created':1}).exec(function(err,groupchatData){
                    if(err){
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                    //console.log(groupchatData);
                    res.json(groupchatData);

                });

        }
    }
    else{
        return res.status(400).send({
            message: "chat not saved... server error"
        });
    }

};




exports.receiverecentchat = function(req,res){

    //console.log('Api hit for receiving recent chat for '+req.body.userId);

    //return res.status(200).send({
    //    message: "Success"
    //});
    if(req.body.type === 'single'){
        ChatMessage.findOne({
            $or: [
                {$and: [{'to': req.user._id}, {'from': req.body.userId}]},
                {$and: [{'to': req.body.userId}, {'from': req.user._id}]}
            ],
            'archived':{$nin:[req.user._id]}
        }).sort({'created': -1})
            //.populate('from', '-password -salt -longitude -latitude -roles -username ')
            //.populate('to', '-password -salt -longitude -latitude -roles -username ')
            .exec(function (err, chatData) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                //console.log(chatData);
                res.json(chatData);
            });
    }
    if(req.body.type === 'group'){
        ChatMessage.findOne({
            $or : [
                //{$and : [{'to' : req.user._id},{'from' : req.params.groupId}]},
                {$and : [{'to' : req.body.userId}]}

            ],
            'archived':{$nin:[req.user._id]}
        }).sort({'created': -1})
            //.populate('from', '-password -salt -longitude -latitude -roles -username ')
            //.populate('to', '-password -salt -longitude -latitude -roles -username ')
            .exec(function (err, chatData) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                //console.log(chatData);
                res.json(chatData);
            });
    }




};


exports.receivegroupchat = function(req,res){

    //console.log('---------- requesting group chat'+req.body.groupId);

    //var lastOneDay1 = new Date();
    //var d = req.body.cid;
    //var givenDate =  new Date();
    //lastOneDay1.setDate(lastOneDay1.getDate()-d);
    //
    //givenDate.setDate(givenDate.getDate()+1);
    //if(req.body.mindate !== undefined){
    //
    //    givenDate = new Date(req.body.mindate);
    //    //lastOneDay1 = givenDate;
    //    var dd = 0;
    //    //console.log('received min date'+ givenDate);
    //
    //
    //}
    //ChatMessage.find({
    //    $or : [
    //        //{$and : [{'to' : req.user._id},{'from' : req.params.groupId}]},
    //        {$and : [{'to' : req.body.groupId}]}
    //
    //    ],
    //    created : {$gte : lastOneDay1,$lt:givenDate}
    //}).populate('from').sort({'created':1}).exec(function(err,groupchatData){
    //    if(err){
    //        return res.status(400).send({
    //            message: errorHandler.getErrorMessage(err)
    //        });
    //    }
    //    //console.log(groupData);
    //    res.json(groupchatData);
    //
    //});

};


exports.deletechat = function(req,res){
    //console.log('chat ids to delete -->>> '+ req.body.chatId + ' for user ' + req.user._id);

    // write logic ofr instering user id into specific chat id for archived array of user.

    ChatMessage.find({'_id': {$in:req.body.chatId}}).exec(function(err,doc){
        if(err){
            console.log(err);
        }else {
                //console.log(doc.length);
            for(var i=0;i<doc.length;i++){
                doc[i].archived.push(req.user._id);

                doc[i].save(function (err1, docs) {
                    if (err1) return console.error(err1);
                    //console.log(docs);

                });
            }
            return res.status(200).send({
                message: "Success"
            });

        }
    })
     ;

};

/*
send freidns list of the user
 */
exports.friendlist = function (req, res) {

    //res.json(profile);
    //console.log('friend list requested')

    //print all users from user where user.id = (seclect user from friend where user.id = c-user.id)


    Friend.find({
            $or: [
                {$and: [{'user': req.user._id},{'status':'1'}]},
                {$and: [{'friend': req.user._id},{'status':'1'}]}
                ]
        }
    )
        .exec(function(err,docs) {
            //console.log(docs);
            var ids1 = docs.map(function (doc) {
                return doc.user ;
            });
            var ids2 = docs.map(function (doc) {
                return doc.friend ;
            });

            //console.log(ids1);
            //console.log(ids2);
            var ids = ids1.concat(ids2);
            //console.log(ids);
            User.find({'_id':{$in:ids}})
                .select(' -password -salt -longitude -latitude -roles -username ')
                .exec(function (e, friendsList) {
                    if (e) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(e)
                        });
                    }
                    //console.log(friendsList);
                    res.json(friendsList);
                }
            );
        });


};

/*
receive chat from user and save it in db
 */
exports.sendchat = function (req, res) {

    User.findOne({email:req.body.from}).exec(function (err, user) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        var msg = new ChatMessage({
                'message':req.body.message,
                'shortMessage':req.body.shortmessage,

                // who sent the chat
                'from': user,
                //who received the chat
                'to':req.body.to,
                'conversationType': req.body.conversationType
            });
        msg.save(function(err,msg){
            if(err) return console.error(err);

        });

        if(req.body.conversationType === 'Single'){

            Notification.findOneAndUpdate({
                user:req.body.to,
                actor:user._id,
                type:"message",
                archived:"false"
            },{
                $set:{
                    read:false,
                    actionURI:'inbox.list',
                    message :"You have recieved new personal message from {val1}.",
                    updated:new Date()
                }
            },
                {upsert:true}
        ).exec(function(err,notif){
                if(err){
                    console.log(err);
                }
                //console.log(notif);
                return res.status(200).send({message:'Success'});

            });


        }
    });

    if(req.body.conversationType === 'Group'){

        ChatGroup.findOne({_id:req.body.to}).populate('members').exec(function (err,gUser){
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            //console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<creating notfication for group users');
            //console.log(gUser.members.length);
            for(var ii=0;ii<gUser.members.length;ii++){
                Notification.findOneAndUpdate({
                        user:gUser.members[ii]._id,
                        //actor:req.body.to,
                        type:"gmessage",
                        archived:"false"
                    },
                    {
                        $set:{
                            read:false,
                            actionURI:'inbox.list',
                            message :"You have recieved a new group message.",
                            updated:new Date()
                        }
                    },
                    {upsert:true}
                ).exec(function(err,notif1){
                    if(err){
                        console.log(err);
                    }
                    //console.log(notif1);
                });
            }
            return res.status(200).send({message: "Success"});
        });
        }
};


/*
manage user friends relation
 */
exports.friendadd = function (req, res) {
    //console.log('_-----------------------------_ add friend');
    //console.log(req.body.friend);



    var friend = new Friend({
        'user': req.user._id,
        'friend': req.body.friend,
        'status': '1',
        'actionUserId':req.user._id
    });

    //console.log("msg recived" + msg);


    friend.save(function(err,friend){
        if(err) return console.error(err);
        return res.status(200).send({
            message: "Success"
        });
    });


};

/*friend list by name based on the given regular expression */

exports.friendlistbyId = function (req, res) {

    //res.json(profile);
    //console.log('friend list requested by keyword ' + req.body.searchfriend);
    var r = new RegExp(req.body.searchfriend,'i');

    Friend.find({
            $or: [
                {$and: [{'user': req.user._id},{'status':'1'}]},
                {$and: [{'friend': req.user._id},{'status':'1'}]}
            ]
        }
        ,function(err,docs) {
            //console.log(docs[0]._id);
            var ids1 = docs.map(function (doc) {
                return doc.friend ;
            });
            var ids2 = docs.map(function (doc) {
                return doc.user ;
            });
            var ids = ids1.concat(ids2);
            //console.log(ids);
            User.find({
                '_id':{$in:ids}

            }).or([{'firstName':   {$regex:r}},{'lastName':  {$regex:r} }])
                .select(' -password -salt -longitude -latitude -roles -username ')
                .exec(function (err, friendsList) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                    //console.log(friendsList);
                    res.json(friendsList);
                }
            );
        });



};

exports.friendAll = function(req,res){

    //console.log(' send all friends list for '+ req.body.userId + ' ');

    Friend.find({
            $or: [
                {$and: [{'user': req.body.userId}, {'status': '1'}]},
                {$and: [{'friend': req.body.userId}, {'status': '1'}]}
            ]
        }
    )
        .exec(function (err, docs) {
            //console.log(docs);
            var ids1 = docs.map(function (doc) {
                return doc.user;
            });
            var ids2 = docs.map(function (doc) {
                return doc.friend;
            });

            //console.log(ids1);
            //console.log(ids2);
            var ids = ids1.concat(ids2);
            //console.log(ids);
            User.find({'_id': {$in: ids}}).select(' -password -salt -longitude -latitude -roles -username')
                .exec(function (e, friendsList) {
                    if (e) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(e)
                        });
                    }
                    //console.log(friendsList);
                    res.json(friendsList);
                }
            );
        });



};



exports.groupcreate = function (req, res) {
    //console.log('------------saving group');
    //console.log(req.body.groupData);


    var chatgroup = new ChatGroup({
        'name': req.body.groupData[0],
        'members': req.body.groupData[1],
        'createdBy':req.user._id

    });

    //console.log(chatgroup);
    chatgroup.save(function(err,friend){
        if(err) return console.error(err);
        return res.status(200).send({
            message: "Success"
        });
    });


};

exports.grouplist = function(req,res){

    //console.log('---------- requesting groups');
    //find all groups for given user._id

    ChatGroup.find({
        $or : [
        {$and : [{'createdBy' : req.user._id}]},
        {$and : [{'members' : req.user._id}]}

    ]}
    ).populate('members')
        //.select('displayName firstName lastName email profileImageURL')
        .exec(function(err,groupData){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        //console.log(groupData);
        res.json(groupData);

    });

};

exports.grouplistbyname = function(req,res){

    //console.log('---------- requesting groups');

    ChatGroup.find({'_id':req.body.groupId}).populate('members').exec(function(err,groupData){
        if(err){
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        //console.log(groupData);
        res.json(groupData);

    });

};




