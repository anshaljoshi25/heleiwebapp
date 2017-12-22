/**
 * Created by anshal on 3/28/2016.
 */
'use strict';

/**
 *Module dependencies
 */
var path = require('path'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Feedback = mongoose.model('Feedback'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.update = function (req, res, next) {

    if(req.body===undefined || req.body==="" ||  req.body===null) {
        return res.status(400).send({
            message : "Invalid Request!"
        });
    }
    var feedback = new Feedback();
    feedback = _.extend(feedback,req.body);
    feedback.save(function (err) {
        if (err) {
            return (res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            }));
        }

        return res.json(feedback);
    });
};
