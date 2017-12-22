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
    LoyaltyPlan = mongoose.model('LoyaltyPlan'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.update = function (req, res, next) {
    if(req.body===undefined) {
        return res.status(400).send({
            message : "Invalid Request!"
        });
    }
    if(req.body._id!==undefined) {
        LoyaltyPlan.findOne({_id:req.body._id}).exec(function(err,lp){
            if(err) {
                return res.status(500).send({
                    message : "Server Error!"
                });
            }

            lp.type = req.body.type;
            lp.points = req.body.points;
            lp.save(function(err){
                if(err) {
                    return res.status(500).send({
                        message : "Server Error!"
                    });
                }
                return res.json(lp);
            });

        });
    } else {
        var loyaltyplan = new LoyaltyPlan();
        loyaltyplan.type = req.body.type;
        loyaltyplan.points = req.body.points;

        loyaltyplan.save(function (err) {
            if (err) {
                return (res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                }));
            }

            return res.json(loyaltyplan);
        });
    }

};

exports.getLoyaltyFromDB = function(type,callback) {
    if(type!==undefined && type!=="" && callback!==undefined) {
        LoyaltyPlan.findOne({type: type}).exec(function(err,lp){
            if(err) {
                console.log(err);
                callback(err,undefined);
                return;
            }
            callback(undefined,lp)
        });
    } else {
        return undefined;
    }
};

exports.getLoyalty = function(req,res) {
    if(req.body.type!==undefined && req.body.type!=="") {
        exports.getLoyaltyFromDB(req.body.type,function(err,lp){
            if(err) {
                return res.status(400).send({
                    message:err
                });
            }
            return res.json(lp);
        });
    } else {
        return res.status(400).send({
           message:"Invalid Request!"
        });
    }
};

exports.list = function (req, res) {
    LoyaltyPlan.find({}).sort('-type').exec(function (err, loyaltyPlans) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(loyaltyPlans);
    });
};

exports.delete = function (req, res) {
    if(req.body===undefined || req.body._id===undefined) {
        return res.status(400).send({message:"Invalid Request!"});
    }
    LoyaltyPlan.findOne({_id:req.body._id}).remove(function(err) {
        if(err) {
            return res.status(500).send({
                status: "ERROR",
                message:"Server Error!"
            })
        }
        return res.status(200).send({
            status: "OK",
            message : "Removed!"
        });
    });
};
//(function(){
//
//    var data = new LoyaltyPlan({
//        type: 'Signup',
//        points : 100
//    });
//console.log('here');
//    data.save(function (err) {
//        if (err) {
//            return (res.status(400).send({
//                message: errorHandler.getErrorMessage(err)
//            }));
//        }
//    });
//
//})();
