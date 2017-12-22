'use strict';

/**
 * Module dependencies
 */
 var _ = require('lodash'),
 fs = require('fs'),
 path = require('path'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 mongoose = require('mongoose'),
 multer = require('multer'),
 config = require(path.resolve('./config/config')),
 User = mongoose.model('User'),
 Friend = mongoose.model('Friend'),
 Slug = mongoose.model('Slug'),
 ChatGroup = mongoose.model('ChatGroup'),
 Notification = mongoose.model('Notification'),
 graphics = require(path.resolve('./modules/core/server/controllers/graphics.server.controller'));;


/**
 * Update user details
 */
 exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Update profile picture
 */
 exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  
  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture',
          error: uploadError
        });
      } else {
        graphics.resizeImage(config.uploads.profileUpload.dest + req.file.filename,128,128, function(saved32){
          if(saved32) {

            user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename+"_128x128";

            user.save(function (saveError) {
              if (saveError) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(saveError)
                });
              } else {
                req.login(user, function (err) {
                  if (err) {
                    res.status(400).send(err);
                  } else {
                    res.json(user);
                  }
                });
              }
            });

          } else {
            return res.status(500).send({
              message: "Server error while uploading user profile image."
            });
          }
        });

      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

exports.findByPhone = function(req,res) {
  var phone = req.body.phone;
  var name = req.body.name;
  if(phone!==undefined && phone!=="" && phone!==null && name!==undefined && name!=="" && name!==null) {

    User.findOne({phone:phone},function(err,u){
      if(err) {
        res.json({status: 'ERROR', msg: 'Error occured while executing query!'});
        return;
      } 
      console.log(u);
      if(u!==null && u!==undefined && u!=={} && u!=="") {
        res.json(u);
        return;
      } else {
        var fName = name.split(" ")[0];
        var lName = name.split(" ").length>1?name.split(" ")[1]:"";
        u = new User();
        u.updated = Date.now();
        u.firstName = fName;
        u.lastName = lName;
        u.email = "not@set.com";
        u.provider = "Local";
        u.username = "notset";
        u.phone=phone;
        u.save(function(err,u){
          if(err) {
            console.log("error1"+err);
            res.json({status: 'ERROR', msg: 'Error occured while saving user!'});

            return;
          }

          res.json(u);
          return;
        });

      }
      
    });
  } else {
    res.json({status: 'ERROR', msg: 'Please provide a phone number to login/register!'});
  }
};

/**
 * Update user location
 */
 exports.updateLoc = function (req, res) {
  // Init Variables
  var loc = req.body;



  if (loc!==undefined && loc!==null && loc!=="") {

    //update user's online field = true
    User.findOne({
      email: loc.email
    }, function (err, u) {
      if (err) {
        res.status(400).send(err);
      } else {

        u.latitude = loc.latitude;
        u.longitude = loc.longitude;

        u.save(function (err) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.json(u);
          }
        });
      }
    });

  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

/**
 * Find online users and return to front
 */

 exports.online = function(req,res) {
  var users = [];
  //get all online users
  try {
    User.find({online: true}, 'username profileImageURL online email latitude longitude', function (err, data) {
      if (err) {
        console.log("No online users found!");

      } else {
        console.log("Sent all found online users.");
      }

      //at the end return all online users
      res.json(data);
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).send({message:'Error!'});
  }
};

exports.singleProfile = function (req, res) {


    //console.log("reached api method " + req.params.userId );
    //res.json(profile);
    User.findOne({_id : req.params.userId })
    .select('-password -salt -providerData -additionalProvidersData -resetPasswordToken -resetPasswordExpires')
        // 'displayName firstName lastName email profileImageURL'
        .exec(function (err, userprofile) {
          if (err) {
            console.log("here in error ");
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
        //console.log("here in error " +userprofile);
        res.json(userprofile);
      });


      };

// find friends
exports.searchFriends = function(req,res) {
  if(req.params.searchText===undefined && req.query.searchText===undefined) {
    res.json([]);
    return;
  }
  req.params.searchText = req.params.searchText===undefined?req.query.searchText:req.params.searchText;
  Friend.find(
  {
    $or : [{
      user: req.user._id
    },{
      friend : req.user._id
    }]
  }
  )
  .exec(function(err,friends){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    var searchItems = req.params.searchText.split(" ");
    for(var i=0;i<searchItems.length;i++) {
      searchItems[i] = new RegExp(searchItems[i],'i');
    }
    var idf = friends.map(function(f){return f.friend});
    var idu = friends.map(function(f){return f.user});
    var ids = idf.concat(idu);
    for(var i=0;i<ids.length;i++) {
      if(ids[i]+""==req.user._id) {
        ids.splice(i,1);
        i--;
      }
    }
    User.find({_id : {$in:ids}, $or : [ {firstName : {$in:searchItems}}, {lastName: {$in:searchItems}} ] },'-password -salt').exec(function(e,ufriends){
      if (e) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(e)
        });
      }

      res.json(ufriends);
    });

  });

};

// find user

exports.searchUser = function(req, res){
  if(req.params.searchText===undefined && req.query.searchText===undefined) {
    res.json([]);
    return;
  }
  req.params.searchText = req.params.searchText===undefined?req.query.searchText:req.params.searchText;
  var searchItems = req.params.searchText.split(" ");
  for(var i=0;i<searchItems.length;i++) {
    searchItems[i] = new RegExp(searchItems[i],'i');
  }
  User.find({
    $or : [ {firstName : {$in:searchItems}},
    {lastName: {$in:searchItems}} ] },'-password -salt').exec(function(e,user){
      if (e) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(e)
        });
      }
          //console.log(user);
          res.json(user);
        });
  };

  exports.addAsFriend = function(req,res) {
    if(req.params.uid!==undefined && req.params.uid.length>0) {

      Friend.findOne({
        $or:[
        {$and :[{user:req.user._id, friend:req.params.uid}]},
        {$and :[{user:req.params.uid, friend:req.user._id}]}
        ]
      }).exec(function(err,f){
        if(err) {
          return res.status(500).send({message: err});
        }
        if(f) {
          return res.status(400).send({message: 'Already Friends!'});
        }
        var friend = new Friend();
        friend.user = req.user._id;
        friend.friend = req.params.uid;
        friend.type = 'normal';
        friend.status='0';
        friend.save(function(err){
          if(err) {
            return res.status(500).send({message:err});
          }

        //create notification

        var notif = new Notification();
        notif.user = req.params.uid;
        notif.type = "request";
        notif.actor = req.user;
        notif.message = "Friend request from {val1}";
        notif.actionURI = "settings.friends";
        notif.save(function(e){
          if(e) {
            console.log(e);
          }
          User.findOne({_id:req.params.uid}).exec(function(e,u){
            console.log(u);
            u.notificationCount = u.notificationCount!==undefined?u.notificationCount+1:1;
            u.save(function(e1){
              if(e1) {
                console.log(e1);
              }
            });
          });

        });
        exports.listFriends(req, res);
      });

      });

    } else {
      res.status(400).send({message : 'Inavlid request!'});
    }
  }

  exports.unFriend = function(req,res) {
    if(req.body) {
      Friend.findOne({
        $or:[
        {$and :[{user:req.user._id, friend:req.body._id}]},
        {$and :[{user:req.body._id, friend:req.user._id}]}
        ]
      }).exec(function(err,f){
        if(err) {
          return res.status(500).send({message:'Server error!'});
        }
        f.remove(function(err){
          if(err) {
            return res.status(500).send({message:'Server error!'});
          }
          exports.listFriends(req, res);
        });

      });
    } else {
      res.status(400).send({message : 'Inavlid request!'});
    }
  }

  exports.accept = function(req,res) {
    if(req.user!==undefined && req.user!=="" && req.params.uid!==undefined && req.params.uid.length>0) {
      Friend.findOne({
        friend:req.user._id,
        user:req.params.uid
      }).exec(function(err,f){
        if(err) {
          return res.status(500).send({message:'Server error!'});
        }
        f.status="1";
        f.save(function(err){
          if(err) {
            return res.status(500).send({message:'Server error!'});
          }
          return exports.listFriends(req,res);
        });

      });
    } else {
      res.status(400).send({message : 'Inavlid request!'});
    }
  };

  exports.listFriends = function(req,res) {
    if(req.query.id===undefined || req.query.id==="") {
      req.query.id = (req.user!== undefined && req.user._id!==undefined)?req.user._id:undefined;
    }
    if(req.query.id!==undefined) {
      var q =  Friend.find({
        $or:[{user:req.query.id},{friend:req.query.id}]
      });
      if(req.query.perPage!==undefined && req.query.page!==undefined) {
        q.limit(req.query.perPage).skip(req.query.perPage*req.query.page);
      };
      q.populate('user').populate('friend','-password -salt -longitude -latitude -roles -username ')
      .exec(function(e,fs){
        if(e) {
          return res.status(500).send({message:'Server error!'});
        }
        return res.json(fs);
      });
    } else {
      return res.status(400).send({message:'Unauthorized access!'});
    }
  };

/**
 * notifs
 */
 exports.notifications = function(req,res) {
  if(req.user!==undefined && req.user!=='') {
    Notification.find({
      user:req.user,
      archived:false
    }).populate('user actor').exec(function(e,d){
      if(e) {
        return res.status(500).send({message : 'Server Error!'});
      }
      res.json(d);
    });
  } else {
    return res.status(400).send({message : 'Invalid Request!'});
  }
};

exports.clearNotifications = function(req,res) {

  if(req.user!==undefined && req.user!=='') {
    //console.log('clearing  count-------------->>>>');
    //console.log(req.body.type);

    User.findOne({
      _id:req.user._id
    }).exec(function(e,u) {
      if (e) {
        return res.status(500).send({message: 'Server Error!'});
      }

      if (req.body.type === "message") {
        //console.log('clearing all messages count-------------->>>>');
        //console.log(u);
        Notification.find({
          user: u._id,
              //actor: u._id,
              type:"message",
              archived:"false"
            }
            ).exec(function(err,notif) {
              if (err) {
                console.log(err);
              }
          //console.log(notif);
          //console.log('find notif status: ');
          if (notif.length >0) {
            //console.log('found');
            //console.log(notif);
            var updatedAllPrevNotifs = true;
            for(var i=0;i<notif.length;i++){
              Notification.update({
                _id: notif[i]._id
              }, {
                $set: {
                  read: true
                  //updated: new Date()
                }
              }).exec(function (err, notifUpd) {
                if (err) {
                  console.log('error updating');
                  console.log(err);
                  updatedAllPrevNotifs = false;
                }
                else {
                  //console.log(notifUpd);
                  //console.log('updated previous notif');
                  //return res.status(200).send({message:'Success'});
                }
              });
            }
            if(!updatedAllPrevNotifs){
              console.log("Not all previous notifs updated!");
              return res.status(200).send({message:'Success'});
            } else {
              return res.status(200).send({message:'Success'});
            }
          }
          else{
            //console.log("------------->>> notification not found");
            return res.status(200).send({message : 'notification not found!'});
          }

        });
          }
          else if(req.body.type === "all") {
            Notification.find({
              user: u._id,
              //actor: u._id,
              //type:"message",
              archived:"false"
            }
            ).exec(function(err,notif) {
              if (err) {
                console.log(err);
              }
          //console.log(notif.length);
          //console.log('find notif status: ');
          var updatedAllPrevNotifs = true;
          if (notif.length >0) {
            //console.log('found');
            //console.log(notif);

            for(var i=0;i<notif.length;i++){
              Notification.update({
                _id: notif[i]._id
              }, {
                $set: {
                  read: true
                  //updated: new Date()
                }
              }).exec(function (err, notifUpd) {
                if (err) {
                  console.log('error updating');
                  console.log(err);
                }
                //else {
                //  console.log(notifUpd);
                //  console.log('updated previous notif');
                //  //return res.status(200).send({message:'Success'});
                //}
              });
            }
            if(!updatedAllPrevNotifs){
              console.log("Not all previous notifs updated!");
              return res.status(200).send({message:'Success'});
            } else {
              return res.status(200).send({message:'Success'});
            }
          }
          else{
            //console.log("------------->>> notification not found");
            return res.status(204).send({message : 'notification not found!'});
          }
        });
          }

        });

  } else {
    return res.status(400).send({message : 'Invalid Request!'});
  }
};

exports.archiveNotifications = function(req,res){

  console.log('archiving notif');

  if(req.body.n !== undefined && req.body.n !== ''){
    //console.log(req.body.n);
    Notification.update({_id: req.body.n},{$set:{archived:"true"}})
    .exec(function (err, status){
      if(err){
            //console.log(err);
            return res.status(400).send({message:'Server error!'});
          }
          else{
            //console.log(status);
            return res.status(200).send({message:'Success'});
          }
        });
  }

};

exports.countNotifications = function(req,res){

  if(req.user!==undefined && req.user!=='') {
    //console.log('here in countnotif--->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    User.findOne({_id: req.user._id}).exec(function (e, u) {
      //console.log(u);
      //u.notificationCount = u.notificationCount !== undefined ? u.notificationCount + 1 : 1;
      if(e){
        console.log(e)
      }
      else {


        Notification.count({
          user: u._id,
          //actor: u._id,
          //type: "message",
          archived: "false",
          read:"false"
        }).exec(function (err, count) {
          if (err) {
            console.log(err);
          }

          //console.log(count);
          if (count > 0) {
            u.notificationCount = count;
          }
          else{
            u.notificationCount = 0;
          }

            //console.log('updated value');
            //console.log(u.notificationCount);
            u.save(function (e1) {
              if (e1) {
                console.log(e1);
              }
            });


          });
      }
    });
    return res.status(200).send({message:'Success'});
  }
  else{

    return res.status(204).send({message : 'Empty response'});

  }

  //return res.status(200).send({message:'Success'});

};


exports.filterPrefs = function(req,res) {

  if(req.user!==undefined && req.user!=='') {
    User.findOne({
      _id:req.user._id
    }).exec(function(e,u){
      if(e) {
        return res.status(500).send({message : 'Server Error!'});
      }
      
      return res.json(u.filterPrefs);

    });
  } else {
    return res.status(400).send({message : 'Invalid Request!'});
  }

};

exports.updateFilterPrefs = function(req,res) {

  if(req.user!==undefined && req.user!=='' && req.body!==undefined && req.body!=='') {
    User.findOne({
      _id:req.user._id
    }).exec(function(e,u){
      if(e) {
        return res.status(500).send({message : 'Server Error!'});
      }
      u.filterPrefs = req.body;
      u.save(function(e){
        if(e) {
          return res.status(500).send({message : 'Server Error!'});
        }
        return res.json(u.filterPrefs);
      });      

    });
  } else {
    return res.status(400).send({message : 'Invalid Request!'});
  }

};

//uploadWallImg
exports.uploadWallImg = function(req,res) {

  var upath = './modules/users/client/img/upload/';
  var upload = multer({
    dest:upath
  }).single('eventDisplayPic');

  upload(req, res, function (uploadError) {
    console.log(uploadError);
    if (uploadError) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(uploadError)
      });
    }

    //try to save 32,64 and 128 versions of image

    graphics.resizeImage(upath + "" + req.file.filename, 568, 200, function (saved128) {

      if (saved128) {

        var user = req.user;

        // For security measurement we remove the roles from the req.body object
        delete req.body.roles;

        if (user) {
          // Merge existing user
          user = _.extend(user, req.body);
          user.wallImageURL = upath + "" + req.file.filename+"_568x200";
          //console.log(user.wallImageURL);
          //user.displayName = user.firstName + ' ' + user.lastName;

          user.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
          });
          return res.json({
            path: upath + "" + req.file.filename+"_568x200",
            message: "OK"
          });
        } else {
          return res.status(400).send({
            message: 'User is not signed in'
          });
        }
      } else {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(uploadError)
        });
      }

    });
  });
};

exports.slug = function(req,res) {
  if(req.body!==undefined && req.body.phone!==undefined) {
    var phone = req.body.phone;
    Slug.findOne({'phone':phone, 'used':false}).sort('-created').skip(0).limit(1).exec(function(e,s){
      if(e)
        return res.status(500).send({status:'ERROR',message:'Server Error: '+e});
      if(s!==undefined && s!==null && s!=="") {
        //check if slug was generated 15 minutes ago
        var nd = new Date();
        var dd = new Date(nd.getTime()- 15*60000);
        console.log(dd +"<" + new Date(s.created));
        if(new Date(s.created) > dd) {
          return res.json(s);
        } else {
          s= new Slug();
          s.phone = phone;
          s.save(function(e){
            if(e) {
              return res.status(500).send({status:'ERROR',message:'Server Error: '+e});
            }
            return res.json(s);
          });
        }
      } else {
        s = new Slug();
        s.phone = phone;
        s.save(function(e){
          if(e) {
            return res.status(500).send({status:'ERROR',message:'Server Error: '+e});
          }
          return res.json(s);
        });
      }
    });
  } else {
    return res.status(400).send({status:'ERROR',message:'Invalid Request'});
  }
}

exports.verifySlug = function(req,res) {
  if(req.body===undefined || req.body.slug===undefined || req.body.phone===undefined) {
    return res.json({status:'ERROR1',message:'Invalid Request'});
  }
  var slug = req.body.slug+"",
  phone = req.body.phone+"";
  console.log(slug+" " + phone);
  //verify
  Slug.findOne({phone: phone, value: slug, used: false}).exec(function(e,s){
    if(e)
      return res.status(500).send({status:'ERROR2',message:'Server Error: '+e});
    console.log(s);
    if(s===undefined || s===null || s==="") {
      return res.status(400).send({status:'ERROR3',message:'Verification Failed!'});
    }
    var nd = new Date();
    var dd = new Date(nd.getTime()- 15*60000);
    if(s.created > dd) {
      s.used = true;
      s.save(function(e){
        if(e)
          return res.status(500).send({status:'ERROR4',message:'Server Error: '+e});

        return res.json({status:'OK', message:'Verification Done!'});
      });
      
    } else {
      return res.json({status:'CODE_EXPIRED', message:'Code Expired, Please request again!'});
    }
    return;

  });

};

/**
 * Send User
 */
 exports.me = function (req, res) {
  res.json(req.user || null);
};


