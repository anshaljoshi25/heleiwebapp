/**
 * Created by anshal on 3/24/2016.
 */
 'use strict';

/**
 *Module dependencies
 */
 var path = require('path'),
 _ = require('lodash'),
 mongoose = require('mongoose'),
 Loyalty = mongoose.model('Loyalty'),
 errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

 exports.update = function (req, res, next) {

    var loyalty = new Loyalty();
    loyalty.user = req.body.user;
    loyalty.points = req.body.points;

    loyalty.save(function (err) {
        if (err) {
            return (res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            }));
        }

        res.json(loyalty);
    });
}

exports.list = function (req, res) {
    Loyalty.find({}).sort('-name').exec(function (err, loyalty) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        res.json(loyalties);
    });
};

exports.get = function (req, res) {
    if(req.user===undefined || req.user ==="" || req.user === null) {
        return res.status(400).send({
            status: 'ERROR',
            message : 'Invalid Request!'
        });
    }

    Loyalty.findOne({user: req.user._id}).exec(function(err,l){
        if(err) {
            return res.status(500).send({
                status: 'ERROR',
                message : 'Server Error!'
            });
        }

        if(l===null) {
            return res.status(500).send({
                status: 'OK',
                message : 'Loyalty Not Found!'
            });
        }

        return res.json(l);

    });

}




