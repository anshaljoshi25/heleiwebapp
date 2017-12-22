'use strict';

var validator = require('validator'),
mongoose = require('mongoose'),
plivo = require('plivo'),
User = mongoose.model('User'),
Event = mongoose.model('Event');

//initialize plivo

var plivoService = plivo.RestAPI({
  authId:'MAM2Y3MZYYYMVKNJG2YZ',
  authToken:'MjdmMDg4MTkwODIxOTU1ZWRlNGNmMDFlNDE3OGVl'
});

/**
 * Render the main application page
 */
 exports.renderIndex = function (req, res) {

  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      latitude: validator.escape(req.user.latitude),
      longitude: validator.escape(req.user.longitude),
      countryCode: validator.escape(req.user.countryCode),
      phone: validator.escape(req.user.phone),
      address: req.user.address,
      gender: validator.escape(req.user.gender),
      filterPrefs: req.user.filterPrefs
    };
  }

  res.render('modules/core/server/views/index', {
    user: safeUserObject
  });
};

exports.renderVersion2 = function (req, res) {
  var urls ={android:"https://play.google.com",ios:"https://ios.com"};
  res.render('modules/core/server/views/version2', {
    urls: urls
  });
};

/**
 * Render the server error page
 */
 exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

exports.renderCode = function (req, res) {
  return res.status(302).send("fQTpCUtvPvmsXX9ta9mZ");
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
 exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

/**
 * Search for all possible publicly accessible data
 */
 exports.search = function (req, res) {
  if(req.params.searchText!==undefined && req.params.searchText.length) {
    var searchResults = [];
    var searchItems = req.params.searchText.split(" ");
    for(var i=0;i<searchItems.length;i++) {
      searchItems[i] = new RegExp(searchItems[i],'i');
    }

    User.find({$or : [ {firstName : {$in:searchItems}}, {lastName: {$in:searchItems}}, {email : {$in:searchItems}} ] },'-password -salt')
    .exec(function(e,users){
      if(e) {
        return res.status(500).send({
          message : 'Server Error!'
        });
      }
      searchResults.push(users);
      Event.find({name: {$in:searchItems},public:true}).exec(function (e,events){
        if(e){
          return res.status(500).send({
            message : 'Server Error!'
          });
        }
        searchResults.push(events);
            //console.log(searchResults);
            return res.json(searchResults);
          });
    });
  } else {
    return res.status(400).send({
      message : 'Invalid Request!'
    });
  }

};

exports.searchEvents = function (req, res) {
  if(req.body.searchText!==undefined && req.body.searchText.length) {
    var searchResults = [];
    var searchItems = req.body.searchText.split(" ");
    for(var i=0;i<searchItems.length;i++) {
      searchItems[i] = new RegExp(searchItems[i],'i');
    }

    var pg = 0;
    var limit  = 10;

    if(req.body.pg!==undefined) {
     pg = req.body.pg;
    }
    if(req.body.limit!==undefined) {
     limit = req.body.limit;
    }

    // User.find({$or : [ {firstName : {$in:searchItems}}, {lastName: {$in:searchItems}}, {email : {$in:searchItems}} ] },'-password -salt')
    //     .exec(function(e,users){
    //   if(e) {
    //     return res.status(500).send({
    //       message : 'Server Error!'
    //     });
    //   }
    //       searchResults.push(users);
    Event.find({$or: [{name: {$in:searchItems}}, {description: {$in: searchItems}}, {venueName: {$in: searchItems}}]})
    .populate('categories category deals').skip(pg*limit).limit(limit).exec(function (e,events){
      if(e){
        return res.status(500).send({
          message : 'Server Error!'
        });
      }
      return res.json(events);
    });
    // });
  } else {
    return res.status(400).send({
      message : 'Invalid Request!'
    });
  }

};


//v2 sms api
exports.smsMulti = function(req,res) {
  if(req.body!==undefined) {
    var phones = req.body.phones;
    var text = req.body.text;
    if(phones===undefined || text === undefined) {
      res.status(400).send({status: 'ERROR', message: 'Please provide phone numbers and message'});  
      return;
    } else {
      // send bulk sms
      var params = {'src':'18056227148','dst':'','text':text};
      for(var i=0;i<phones.length;i++) {
        params.dst+=phones[i]+"<";
      }
      params.dst = params.dst.substring(0,params.dst.length-1);
      
      plivoService.send_message(params,function(status,response){
        res.json(response);
        return;
      });

    }
  } else {
    res.status(400).send({status: 'ERROR', message: 'Please provide phone numbers and message'});
  }
};
