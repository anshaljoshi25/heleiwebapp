/**
 * Created by anshal on 02-04-16.
 */
'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    validator = require('validator');
    //errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.renderPortal = function(req, res) {

    //return a safe admin object
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
            firstName: validator.escape(req.user.firstName)
        };
    }
    res.render('modules/adminportal/server/views/adminindex',{user : safeUserObject});
};

exports.activeUsers = function (req, res) {

    //res.json(profile);
    User.find({}).select('displayName firstName lastName profileImageURL').exec(function (err, activeUsers) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        //console.log();
        res.json(friendsList);
    });


};
