/**
 * Created by arunsharma on 6/2/16.
 */
 'use strict';

/**
 *Module dependencies
 */
 var path = require('path'),
 _ = require('lodash'),
 mongoose = require('mongoose'),
 Event = mongoose.model('Event'),
 Deal = mongoose.model('Deal'),
 Notification = mongoose.model('Notification'),
 LoyaltyHistory = mongoose.model('LoyaltyHistory'),
 LoyaltyPlan = mongoose.model('LoyaltyPlan'),
 Loyalty = mongoose.model('Loyalty'),
 User = mongoose.model('User'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
 multer = require('multer'),
 graphics = require(path.resolve('./modules/core/server/controllers/graphics.server.controller'));

 function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit=="K") { dist = dist * 1.609344; }
    if (unit=="N") { dist = dist * 0.8684; }
    return dist;
};

//v2 event create
exports.v2_create = function(req,res,next) {
    // console.log('here in v2 event create');
    if(req.body!==undefined && req.body!=="" && req.body!==null) {

    // console.log(req.body.event);

    var event = new Event();
    event.name = req.body.event.name;
    event.eventStartDate = req.body.event.eventStartDate;
    event.eventEndDate = req.body.event.eventEndDate;
    event.category = req.body.event.category;
    event.categories = req.body.event.categories;
    // event.location = {
    //   "longitude" : -67.03561305999756,
    //   "latitude" : 18.31178922964229
    // }
    event.location = {type:'Point', coordinates: [req.body.event.location.longitude,req.body.event.location.latitude], latitude: req.body.event.location.latitude, longitude: req.body.event.location.longitude};
    event.description = req.body.event.description;
    // user objects who are invited by user
    event.invites = [];
    event.going = [];
    event.going.push(req.body.event.user._id);
    event.public = req.body.event.public;
    event.eventDisplayPic = req.body.event.eventDisplayPic;
    event.place = req.body.event.place;
    // event.venueName = req.body.event.venueName;
    event.creator = req.body.event.user._id;

    event.save(function(err){
        if(err) {
            return (res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            }));
        }

        res.json(event);
    });
  }
  else{
    // console.log('missing info to create event');
    return res.status(400).send({
        message: "event creation failed"
    });
  }

};

//v2 event edit
exports.v2_update = function(req,res,next) {

  if(req.body!==undefined && req.body!=="" && req.body!==null) {
      // console.log('here updating event');
      // console.log(req.body.event);
      //req.body = req.body.event;
      // todo: to check if all the invited guys are already in the going list
      Event.findOne({_id:req.body.event._id}, function (err, event) {
          if (err) {
              res.send(422, 'update failed');
          } else {
                  //console.log('going in');
                  //update fields
                  //console.log(event);
                  if (event !== null || event !== undefined) {
                      //console.log('inside');
                      for (var field in Event.schema.paths) {
                          //console.log(field);
                          if ((field !== '_id') && (field !== '__v') && (field !== 'creator')) {
                              if (req.body.event[field] !== undefined) {
                                  //console.log(req.body[field]);
                                  event[field] = req.body.event[field];
                                  event.location = {type:'Point', coordinates: [req.body.event.location.longitude,req.body.event.location.latitude], latitude: req.body.event.location.latitude, longitude: req.body.event.location.longitude};
                              }
                          }
                      }
                      //console.log('saving');
                      event.save(function (err) {
                          if (err) {
                              console.log(err);
                              return (res.status(400).send({
                                  message: errorHandler.getErrorMessage(err)
                              }));
                          }
                      });


                          //console.log(event);
                          return res.status(200).send({
                              message: "update Success"
                          });


                      }
                      else {
                          return res.status(400).send({
                              message: "update failed"
                          });
                      }

                  }
              });
  }
};

exports.create = function(req,res,next) {

    var event = new Event();
    event.name = req.body.name;
    event.eventStartDate = req.body.eventStartDate;
    event.eventEndDate = req.body.eventEndDate;
    event.category = req.body.category;
    // event.location = req.body.location;
    event.location = {type:'Point', coordinates: [req.body.location.longitude,req.body.location.latitude], latitude: req.body.location.latitude, longitude: req.body.location.longitude};
    event.description = req.body.description;
    // user objects who are invited by user
    event.invites = req.body.invites;
    event.going = [];
    event.going.push(req.user._id);
    event.public = req.body.public;
    event.eventDisplayPic = req.body.eventDisplayPic;
    event.place = req.body.place;
    event.venueName = req.body.venueName;
    event.creator = req.user._id;

    //create notification
    for(var i =0;i<req.body.invites.length;i    ++){
        //console.log('adding invite notfication');

        var notif = new Notification();
        notif.user = req.body.invites[i]._id;
        notif.type = "invite";
        notif.actor = req.user;
        notif.message = "Event invitation from {val1}";
        notif.actionURI = "settings.invites";
        notif.save(function(e){
            if(e) {
                console.log(e);
            }
            User.findOne({_id:notif.user}).exec(function(e,u){

                u.notificationCount = u.notificationCount!==undefined?u.notificationCount+1:1;
                // console.log('incrementing count');
                // console.log(u.notificationCount);
                u.save(function(e1){
                    if(e1) {
                        console.log(e1);
                    }
                });
            });

        });
    }

    event.save(function(err){
        if(err) {
            return (res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            }));
        }

        res.json(event);
    });


};
exports.update = function(req,res){
    if(req.body!==undefined && req.body!=="" && req.body!==null) {
        //console.log('here updating event');
        //console.log(req.body.event);
        //req.body = req.body.event;
        // todo: to check if all the invited guys are already in the going list
        Event.findOne({_id:req.body.event._id}, function (err, event) {
            if (err) {
                res.send(422, 'update failed');
            } else {
                    //console.log('going in');
                    //update fields
                    //console.log(event);
                    if (event !== null || event !== undefined) {
                        //console.log('inside');
                        for (var field in Event.schema.paths) {
                            //console.log(field);
                            if ((field !== '_id') && (field !== '__v') && (field !== 'creator')) {
                                if (req.body.event[field] !== undefined) {
                                    //console.log(req.body[field]);
                                    event[field] = req.body.event[field];
                                    event.location =  {type:'Point', coordinates: [req.body.event.location.longitude,req.body.event.location.latitude], latitude: req.body.event.location.latitude, longitude: req.body.event.location.longitude};
                                }
                            }
                        }
                        //console.log('saving');
                        event.save(function (err) {
                            if (err) {
                                console.log(err);
                                return (res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                }));
                            }
                        });

                        if(req.body.type === 'updateInvites'){
                            //create notification
                            //req.body = req.body.event;
                            //console.log(req.body);
                            //console.log(req.body.event.invites.length);
                            for(var i =0;i<req.body.event.invites.length;i++){
                                //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>adding invite notfication');
                                Notification.findOneAndUpdate({
                                    user:req.body.event.invites[i],
                                    actor:req.user,
                                    type:"invite",
                                    archived:"false"
                                },
                                {
                                    $set:{
                                        read:false,
                                        actionURI:'settings.invites',
                                        message :"Event invitation from {val1}",
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
                        }
                            //console.log(event);
                            return res.status(200).send({
                                message: "update Success"
                            });


                        }
                        else {
                            return res.status(200).send({
                                message: "update failed"
                            });
                        }

                    }
                });



    }


};



exports.find = function(req,res) {
    if(req.params.searchText!==undefined && req.params.searchText.length) {

        var searchItems = req.params.searchText.split(" ");
        for(var i=0;i<searchItems.length;i++) {
          searchItems[i] = new RegExp(searchItems[i],'i');
      }

      Event.find({name : {$in:searchItems}}).exec(function(e,users){
          if(e) {
            return res.status(500).send({
              message : 'Server Error!'
          });
        }



        return res.json(users);
    });

  } else {
    return res.status(400).send({
      message : 'Invalid Request!'
  });
}
};

exports.saveImage = function(req,res) {
    if(req.body!==undefined && req.body!=="" && req.body!==null) {
        Event.findOne({_id:req.body._id}).exec(function (err, event) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            event.images.push({imgURL: req.body.newEventImage, user : req.user._id});
            event.save(function(err){
                if(err) {
                    return res.status(400).send({
                        message: "Invalid Request!"
                    });
                }
                return res.json(event);
            });

        });
    } else {
        return res.status(400).send({
            message: "Invalid Request!"
        });
    }
};

exports.list = function (req, res) {
    Event.find({}).populate('category deals').sort('-name').exec(function (err, events) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.json(events);
    });
};

exports.listPaged= function(req,res) {
    var pg = 0;
    var limit  = 10;
    var filters = {};
    var sort = "name", forDays = 365, categories = [0], maxDistance = 50000, loc=[0,0];

    var skipCat = true;
    var sortByDistace = false;
    var finalFilters={};

    if(req.body.pg !== undefined) {
        pg = req.body.pg;
    }

    if(req.body.limit!==undefined) {
        limit = req.body.limit;
    }

    if(req.body.filters!==undefined) {
        filters = req.body.filters;
    }

    if(filters.sort!==undefined) {
        sort = filters.sort;
        if(sort==="date") {
            sort = {eventStartDate:1};
        } else if(sort === "distance") {
            // sortByDistace = true;
            sort = {distance:1};

        } else if(sort === "deals") {
            sort = {"deals.likes.length":-1};
        }
    }
    // console.log("Sort by : " + JSON.stringify(sort));

    if(filters.place!==undefined) {
        loc[0] = filters.place.geometry.location.lng;
        loc[1] = filters.place.geometry.location.lat;
    }

    if(filters.maxDistance!==undefined) {
        maxDistance = filters.maxDistance;
    }

    if(filters.categories!==undefined && filters.categories.length>0) {
        if(filters.categories[0]===0) {
            skipCat = true;
        } else {
            var categories_temp = filters.categories;
            // for(var i=0;i<categories.length;i++) {
            //     categories[i] = new mongoose.Schema.ObjectId(categories[i]);
            // }
            categories = categories_temp.map(function(item){return mongoose.Types.ObjectId(item)});
            skipCat = false;
        }
    }

    if(filters.forDays!==undefined) {
        forDays = filters.forDays;
    }
    // console.log(filters);
    // console.log(forDays);

    if(!skipCat) {
        finalFilters.$or = [{categories:{$in : categories}}, {category: {$in: categories}}];
    }
    finalFilters.$and=[{public:true}];
    // maxDistance/=6371;
    // finalFilters.location = {$near: {$geometry:{type:'point', coordinates: loc}, $maxDistance: maxDistance, $distanceField:'distance'}};

    var dt = new Date(), today = new Date();
    dt.setDate(dt.getDate() + parseInt(forDays));
    // console.log("date is : " + dt);
    var forDaysFilter = {
        $or :
        [
        {
            eventStartDate : {
                $gte : today,
                $lte : dt
            }
        },{
            $and : [{
                eventStartDate :{
                    $lte : today,
                }
            },{
                eventEndDate : {
                    $gte : today
                }
            }]
        }
        ]
    };
    // finalFilters.location = {type: 'Point'};
    finalFilters = {$and : [forDaysFilter,finalFilters]};
    // console.log(JSON.stringify(finalFilters));

    Event.aggregate(
        [
        { "$geoNear": {
            "near": {
                "type": "Point",
                "coordinates": loc
            },
            "distanceField": "distance",
            "maxDistance": maxDistance,
            "spherical": true,
            "query": finalFilters
        }},
        { "$sort": sort},{"$skip": pg*limit},{ "$limit":limit } // Sort nearest first
        ],
        function(err,docs) {
            // console.log("docs are: " + JSON.stringify(docs));
            Event.populate(docs, {"path": "categories category deals images.user" }, function(err,results) {
                if (err) {
                    return res.status(400).send({
                        message: err
                    });
                }
                // console.log( JSON.stringify( results, undefined, 4 ) );
                // console.log('good');
                // console.log(docs);
                if(docs===undefined){
                  return res.json([]);
                }
                return res.json(docs);
            });
        }
        );

    // Event.find(finalFilters).populate('category deals').sort(sort).limit(limit).skip(pg*limit).exec(function (err, events) {
    //     if (err) {
    //         return res.status(400).send({
    //             message: err
    //         });
    //     }
    //     res.json(events);
    // });
};

exports.eventbyId = function (req, res) {
    console.log(req.params.eid);
    Event.findOne({_id:req.params.eid})
    .populate('category').populate('images.user')
    .sort('-name').exec(function (err, events) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        //console.log(events);
        res.json(events);
    });
};


exports.listByFilters = function (req, res) {
    if(req.body.selectedOpts!==undefined && req.body.selectedOpts!==null
        && req.body.fDays !== undefined && req.body.fDays !== null ) {
        //get date from days
    var dt = new Date();
    dt.setDate(dt.getDate() + req.body.fDays);
    var idsSO = req.body.selectedOpts.map(function(so){return so._id});
    var filters = {};
    var filterAddon = {};
    if(req.user!==undefined && req.user!=="") {
        filterAddon.$or = [{
            public : false,
            going : req.user._id
        },{
            public : true
        }];
    } else {
        filterAddon.public = true;
    }
        // var cdt = new Date();
        // var cdt2 = new Date();
        // cdt.setDate(cdt.getDate()-1);
        var today = new Date();
        filters.$or = [
        {
            eventStartDate : {
                $gte : today,
                $lte : dt
            }
        },{
            $and : [{
                eventStartDate :{
                    $lte : today,
                }
            },{
                eventEndDate : {
                    $gte : today
                }
            }]
        }
        ];
        if(idsSO.length) {
            filters.category = {$in : idsSO};
        }

        filters = {$and : [filters,filterAddon]};

        Event.find(filters).populate('category').sort('-name').exec(function (err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
        //strip off events not within the raius [in miles]
        var loc = {};

        if(req.body.location!==undefined && req.body.location.hasOwnProperty('latitude')) {
            loc = req.body.location;
        } else if(req.user!==undefined && req.user!=="" && req.user!==null){
            loc = {};
            loc.latitude = req.user.latitude;
            loc.longitude = req.user.longitude;
        }


        if(loc!==undefined && loc.latitude!==undefined && loc.longitude!==undefined) {
            for(var i=0;i<events.length;i++) {
                var e = events[i];
                var elt = e.location.latitude;
                var elg = e.location.longitude;
                var dist = distance(elt,elg,loc.latitude,loc.longitude,'M');
                if(dist>req.body.radiusValMiles) {
                    events.splice(i,1);
                    i--;
                };
            }
        }
        return res.json(events);
    });
    } else {
        var filters = {};
        if(req.user!==undefined && req.user!=="") {
            filters.$or = [{
                public : false,
                going : req.user._id
            },{
                public : true
            }];
        } else {
            filters.public = true;
        }
        Event.find(filters).populate('category').sort('-name').exec(function (err, events) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            return res.json(events);
        });
    }
};

exports.listAllById =function(req,res) {

    Event.find({

        going:req.body._id,
        public:true

    }).populate('category').populate('going').populate('invites').populate('creator','email').sort('-name').exec(function (err, events) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.json(events);
    });
};

exports.listByCreator = function(req,res){

    Event.find({

        creator:req.body.uid

    }).populate('category').populate('going').populate('invites').populate('creator','email').sort('-name').exec(function (err, events) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.json(events);
    });


};
// v2 for paypal pay
exports.pay = function(req,res){
  console.log('payment recieved');
  console.log(req);
}
//v2 for getting all evets for creator
exports.listByCreatorID = function(req,res){
  // if(req.body.uid )
  // console.log('sending all events for creator'+req.body.uid);
  Event.find({

      creator:req.body.uid

  }).populate('category').populate('categories').populate('going').populate('invites').populate('creator').sort('-created').exec(function (err, events) {
      if (err) {
          return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
          });
      }
      res.json(events);
  });
}

exports.show = function (req, res) {
    Event.findOne({_id:req.params.id}).populate('category').populate('going').populate('creator','email').populate('images.user').exec(function (err, event) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.json(event);
    });
};

exports.showById = function (req, res) {
    if(req.body!==undefined && req.body.id!==undefined){
        Event.findOne({_id:req.body.id}).populate('category categories deals').populate('going').populate('creator','email').populate('images.user').exec(function (err, event) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            res.json(event);
            return;
        });
    } else {
        return res.status(400).send({
            status: 'ERROR',
            message: "Please provide event id"
        });
    }
};


exports.getInvites = function(req,res) {
    var q = Event.find({invites:req.user._id}).populate('category').populate('creator','email').populate('going');
    if(req.query.perPage!==undefined && req.query.page!==undefined) {
        q.limit(req.query.perPage).skip(req.query.perPage*req.query.page);
    }
    q.sort('-name').exec(function (err, events) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.json(events);
    })
};
//v2 for getting attending events
exports.v2_getAccepted = function(req,res) {
  // console.log('sending all accepted/attending events'+req.body.uid);
    req.query.id=req.body.uid;
    // console.log(req.query.id);
    if(req.query.id===undefined || req.query.id===null) {
        req.query.id = (req.user===undefined || req.user==="")?undefined:req.user._id;
        if(req.query.id===undefined) {
            return res.json([]);
        }
    }
    var q = Event.find({going:req.query.id}).populate('categories').populate('category').populate('going').populate('creator').populate('invites');
    if(req.query.perPage!==undefined && req.query.page!==undefined) {
        q.limit(req.query.perPage).skip(req.query.perPage*req.query.page);
    }
    q.sort('-name').exec(function (err, events) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        // console.log(events);
        res.json(events);
    });
};

exports.getAccepted = function(req,res) {
    if(req.query.id===undefined || req.query.id===null) {
        req.query.id = (req.user===undefined || req.user==="")?undefined:req.user._id;
        if(req.query.id===undefined) {
            return res.json([]);
        }
    }
    var q = Event.find({going:req.query.id}).populate('category').populate('going').populate('creator','email').populate('invites');
    if(req.query.perPage!==undefined && req.query.page!==undefined) {
        q.limit(req.query.perPage).skip(req.query.perPage*req.query.page);
    }
    q.sort('-name').exec(function (err, events) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.json(events);
    });
};

exports.searchAccepted = function(req,res) {
    if(req.query.id===undefined || req.query.id===null) {
        req.query.id = (req.user===undefined || req.user==="")?undefined:req.user._id;
        if(req.query.id===undefined) {
            return res.json([]);
        }
    }
    if(req.query.searchText===undefined || req.query.searchText==="" || req.query.searchText===null) {
        return res.json([]);
    };
    var searchItems = req.query.searchText.split(" ");
    for(var i=0;i<searchItems.length;i++) {
      searchItems[i] = new RegExp(searchItems[i],'i');
  };
  var q = Event.find({going:req.query.id, name: {$in : searchItems}}).populate('category').populate('going').populate('creator','email').populate('invites');
  q.sort('-name').exec(function (err, events) {
    if (err) {
        return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
        });
    }
    res.json(events);
});
};

exports.acceptEvent = function(req,res) {

    try {

        if (req.body && req.user) {
            Event.findOne({_id: req.body._id}).populate('invites').exec(function (err, event) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                if(event===null) {
                    Event.find({invites: req.user._id}).populate('going').populate('creator','email').sort('-name').exec(function (err, events) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }
                        res.json(events);
                    });
                }
                var found = false;
                for (var i = 0; i < event.going.length; i++) {
                    if (event.going[i] + "" == req.user._id) {
                        found = true;
                    }
                }
                if (!found) {
                    event.going.push(req.user);

                }

                for (var i = 0; i < event.invites.length; i++) {
                    var inv = event.invites[i];
                    if (inv._id + "" == req.user._id) {
                        event.invites.splice(i, 1);
                        i--;
                    }
                }


                event.save(function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                    Event.find({invites: req.user._id}).populate('going').populate('creator','email').sort('-name').exec(function (err, events) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }
                        res.json(events);
                    });
                });
            });
        } else {
            return res.status(400).send({
                message: "Invalid request"
            });
        }
    } catch (ex) {
        return res.status(400).send({
            message: "Invalid request"
        });
    }


};

//v2 of accept event
exports.acceptEventByUID = function(req,res) {

    try {

        if (req.body.event && req.body.uid) {
            Event.findOne({_id: req.body.event._id}).populate('invites').exec(function (err, event) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                // if(event===null) {
                //     Event.find({invites: req.body.uid}).populate('going').populate('creator','email').sort('-name').exec(function (err, events) {
                //         if (err) {
                //             return res.status(400).send({
                //                 message: errorHandler.getErrorMessage(err)
                //             });
                //         }
                //         res.json(events);
                //     });
                // }
                var found = false;
                for (var i = 0; i < event.going.length; i++) {
                    if (event.going[i] + "" == req.body.uid) {
                        found = true;
                    }
                }
                if (!found) {
                    event.going.push(req.body.uid);

                }

                found=false;

                for (var i = 0; i < event.invites.length; i++) {
                    if (event.invites[i] + "" == req.body.uid) {
                        found = true;
                    }
                }
                if (!found) {
                    event.invites.push(req.body.uid);

                }



                event.save(function (err) {
                    if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
                    }
                    Event.findOne({_id: event._id}).populate('going categories category deals').populate('creator','email').sort('-name').exec(function (err, event) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }
                        res.json(event);
                    });
                });
            });
        } else {
            return res.status(400).send({
                message: "Invalid request"
            });
        }
    } catch (ex) {
        return res.status(400).send({
            message: "Invalid request"
        });
    }


};

exports.declineEvent = function(req,res) {
    if(req.body) {
        if(req.user) {
            Event.findOne({
                _id : req.body._id
            }).exec(function(err,event) {
                if(err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }

                if(event) {
                    for(var i=0;i<event.going.length;i++) {
                        if(event.going[i]==req.user.id) {

                            event.invited.push(event.going[i]);
                            event.going.splice(i, 1);
                            i--;
                            break;
                        }
                    }

                    event.save(function(err){
                        if(err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }

                        Event.find({going:req.user._id}).populate('category').populate('going').populate('creator','email').populate('invites').sort('-name').exec(function (err, events) {
                            if (err) {
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            }
                            res.json(events);
                            return;
                        });

                    });
                }

            });
        } else {
            return res.status(400).send({
                message: "Unauthorized Access"
            });
        }
    } else {
        return res.status(400).send({
            message: "Invalid request"
        });
    }
};

exports.declineInvite = function(req,res) {
    if(req.body) {
        if(req.user) {
            Event.findOne({
                _id : req.body._id
            }).exec(function(err,event) {
                if(err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }

                if(event) {
                    for(var i=0;i<event.invites.length;i++) {
                        if(event.invites[i]==req.user.id) {

                            event.invited.push(event.invites[i]);
                            event.invites.splice(i, 1);
                            i--;
                            break;
                        }
                    }

                    event.save(function(err){
                        if(err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }

                        Event.find({invites:req.user._id}).populate('category').populate('going').populate('creator','email').populate('invites').sort('-name').exec(function (err, events) {
                            if (err) {
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(err)
                                });
                            }
                            res.json(events);
                            return;
                        });

                    });
                }

            });
        } else {
            return res.status(400).send({
                message: "Unauthorized Access"
            });
        }
    } else {
        return res.status(400).send({
            message: "Invalid request"
        });
    }
};

//v2 for event decline
exports.declineInviteByUID = function(req,res) {
    if(req.body.event) {
        if(req.body.uid) {
            Event.findOne({
                _id : req.body.event._id
            }).exec(function(err,event) {
                if(err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }

                if(event) {

                    for(var i=0;i<event.going.length;i++) {
                        if(event.going[i]==req.body.uid) {
                            event.going.splice(i, 1);
                            i--;
                            break;
                        }
                    }

                    event.save(function(err){
                        if(err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        }

                        return res.json(event);

                    });
                } else {
                    return res.status(400).send({
                        status: 'ERROR',
                        message: "No such event"
                    });
                }

            });
        } else {
            return res.status(400).send({
                message: "Unauthorized Access"
            });
        }
    } else {
        return res.status(400).send({
            message: "Invalid request"
        });
    }
};

exports.upload = function (req, res) {
  // console.log('uploading file');
    var upath = './modules/events/client/img/upload/';
    var upload = multer({
        dest:upath
    }).single('eventDisplayPic');

    upload(req, res, function (uploadError) {
        // console.log(uploadError);
        if(uploadError) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(uploadError)
            });
        }
        // console.log(req.file);
        //try to save 32,64 and 128 versions of image
        graphics.resizeImage(upath+""+req.file.filename,32,32, function(saved32){
            if(saved32) {

                graphics.resizeImage(upath+""+req.file.filename,64,64, function(saved64){

                    if(saved64) {

                        graphics.resizeImage(upath+""+req.file.filename,128,128, function(saved128){

                            if(saved128) {

                                // return res.json({
                                //     path: upath + "" + req.file.filename,
                                //     message: "OK"
                                // });

                                graphics.resizeImage(upath+""+req.file.filename,256,256, function(saved256){

                                    if(saved256) {

                                        return res.json({
                                            path: upath + "" + req.file.filename,
                                            message: "OK"
                                        });

                                    } else {
                                        return res.status(400).send({
                                            message: errorHandler.getErrorMessage(uploadError)
                                        });
                                    }

                                });

                            } else {
                                return res.status(400).send({
                                    message: errorHandler.getErrorMessage(uploadError)
                                });
                            }

                        });
                    } else {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(uploadError)
                        });
                    }

                });


            } else {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(uploadError)
                });
            }
        });

    });

};
exports.getLoyalty = function (req, res) {
    if (req.body.location !== undefined && req.body.location !== "" && req.body.event !== undefined && req.user !== undefined && req.user !== "") {
        //get plan
        LoyaltyPlan.findOne({type: "ATTENDED"}).exec(function (err, lp) {
            if (err) {
                return res.status(500).send({
                    status: "ERROR",
                    message: "Server Error!0"
                });
            }
            if(lp===null || lp===undefined) {
                return res.status(500).send({
                    status: "ERROR",
                    message: "Server Error!1"
                });
            }

            //get any previous history for this loyalty plan for this user
            LoyaltyHistory.findOne({
                user: req.user._id,
                loyaltyId: req.body.event._id,
                loyaltyType: lp._id
            }
            ).exec(function (err, loyHis) {
                if (err) {
                    return res.status(500).send({
                        status: "ERROR",
                        message: "Server Error!2"
                    });
                }
                //if found

                if (loyHis !== undefined && loyHis !== "" && loyHis !== null) {
                    //history found, no need to add more points for this user for this event
                    return res.json({
                        status: "FOUND",
                        message: "Already Rewarded!"
                    });
                } else {
                    //not found any history, so proceed to create one now

                    var lh = new LoyaltyHistory();
                    lh.user = req.user._id;
                    lh.loyaltyId = req.body.event._id;
                    lh.loyaltyType = lp;
                    lh.updated = new Date();

                    lh.save(function (err) {
                        if (err) {
                            return res.status(500).send({
                                status: "ERROR",
                                message: "Server Error!3",
                                error: err
                            });
                        }

                        //now update points for user in loyalty collection
                        Loyalty.findOne({user: req.user._id}).exec(function (err, loyalty) {
                            if (err) {
                                return res.status(500).send({
                                    status: "ERROR",
                                    message: "Server Error!4"
                                });
                            }

                            if (loyalty === null) {
                                loyalty = new Loyalty();
                                loyalty.user = req.user;
                            }

                            loyalty.points += lp.points;
                            loyalty.updated = new Date();
                            loyalty.save(function (err) {
                                if (err) {
                                    return res.status(500).send({
                                        status: "ERROR",
                                        message: "Server Error!5"
                                    });
                                }

                                return res.json(lh);

                            });

                        });

                    });
                }

            });

        });


    } else {
        return res.status(400).send({
            message: "Invalid request"
        });
    }


};

exports.love = function(req,res) {
    if(req.body===undefined || req.body==="" | req.body===null) {
        return res.status(400).send({
            message: "Invalid Request"
        });
    }
    //find user
    User.findOne({phone:req.body.user}).exec(function(err,u){
        if(err) {
            return res.status(500).send({
                message: "Server Error"
            });
        }
        if(u===undefined || u===null || u==="") {
            return res.status(500).send({
                message: "No such user"
            });
        }
        u = u._id;
        console.log(u);
        //find event
        Event.findOne({_id:req.body.id}).exec(function(err,event) {
            if(err) {
                return res.status(500).send({
                    message: "Server Error"
                });
            }
            var found=false;
            if(event.lovedBy!==undefined) {
                for(var i =0; i<event.lovedBy.length; i++) {
                    var uu = event.lovedBy[i];
                    if(uu+"" == u) {
                        event.lovedBy.splice(i,1);
                        found=true;
                    }
                }
                if(!found)
                    event.lovedBy.push(u);
            } else {
                event.lovedBy = [u];
            }
            event.save(function(err){
                if(err) {
                    return res.status(500).send({
                        message: 'Server Error'
                    });
                }
                return res.json(event);
            });
        });
    });

};

exports.getDeals = function(req,res) {
    Deal.find({creator: req.user._id}).exec(function(err,deals) {
        if(err) {
            return res.status(500).send({
                message: "Server Error"
            });

        }
        return res.json(deals);
    });
};

exports.getDeal = function(req,res) {
    if(req.params.id===undefined || req.params.id===null || req.params.id===""){
        return res.status(400).send({
            message: 'Invalid Request'
        });
    }
    Deal.find({_id:req.params.id}).exec(function(err,deals) {
        if(err) {
            return res.status(500).send({
                message: "Server Error"
            });

        }
        return res.json(deals);
    });
};

exports.createDeal = function(req,res) {
    if(req.body===undefined || req.body===null || req.body===""){
        return res.status(400).send({
            message: 'Invalid Request'
        });
    }
    var deal = new Deal();
    deal = _.extend(deal,req.body);
    deal.creator = req.user._id;
    deal.save(function(err){
        if(err) {
            return res.status(500).send({
                message: "Server Error"
            });
        }
        return res.json(deal);
    });
};

exports.attachDealToEvent = function(req,res) {
    if(req.body===undefined || req.body===null || req.body===""){
        return res.status(400).send({
            message: 'Invalid Request'
        });
    }
    var deal = req.body.deal;
    var eventid = req.body.event;

    Event.findOne({_id:eventid}).exec(function(err,event){
        if(err) {
            return res.status(500).send({
                message: 'Server Error: ' + err
            });
        }
        console.log(event);

        if(event.deals!==undefined) {
            for(var i =0; i<event.deals.length; i++) {
                var d = event.deals[i];
                if(d+"" == deal) {
                    return res.status(400).send({message: 'Deal already assigned!'});
                }
            }
            event.deals.push(deal);
        } else {
            event.deals = [deal];
        }
        event.save(function(err){
            if(err) {
                return res.status(400).send({message: 'Server Error: ' + err});
            }
            return res.json(d);
        });

    });
};
