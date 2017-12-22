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
    LoyaltyHistory = mongoose.model('LoyaltyHistory'),
    LoyaltyPlan = mongoose.model('LoyaltyPlan'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.update = function (req, res, next) {

    var loyaltyHistory = new LoyaltyHistory();
    loyaltyHistory.user = req.body.user;
    loyaltyHistory.loyaltyType = req.body;

    loyaltyHistory.save(function (err) {
        if (err) {
            return (res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            }));
        }

        res.json(loyaltyHistory);
    });
};

exports.get = function (req, res, next) {
    if(req.user===undefined || req.user==="" || req.user===null ||
        req.body.object === undefined ) {
        return res.status(400).send({status:"ERROR",message:"Invalid Request!"});
    }

    LoyaltyPlan.findOne({type: req.body.object.type}).exec(function (err, lp) {
        if (err) {
            return res.status(500).send({
                status: "ERROR",
                message: "Server Error!1"
            });
        }

        LoyaltyHistory.findOne({
                user: req.user._id,
                loyaltyId: req.body.object._id,
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
                return res.json({
                    status: "NOTFOUND",
                    message: "Not Rewarded!"
                });
            }
        });
    });

}
