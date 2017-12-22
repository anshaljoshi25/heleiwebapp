/**
 * Created by arunsharma on 5/2/16.
 */
'use strict';

/**
 *Module dependencies
 */
var path = require('path'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
    Event = mongoose.model('Event'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    multer = require('multer'),
    uploads = multer({dest: './modules/events/client/img/upload/'}),
    async = require('async');

exports.update = function (req, res, next) {

    var category = new Category();
    category.name = req.body.name;
    category.imgURL = req.body.imgURL;
    category.markerImgURL = req.body.markerImgURL;
    category.save(function (err) {
        if (err) {
            return (res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            }));
        }

        res.json(category);
    });
}
exports.updatecat = function (req, res) {
    if (req.body) {

        Category.findOne({_id: req.body._id}, function (err, category) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            //For security purposes only merge these parameters
            category = _.extend(category, req.body);
            category.save(function (err) {

                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
                return res.json(category);
            });


        });
    } else {
        return res.status(400).send({
            message : 'Invalid Request!'
        });
    }
}
exports.deletecat = function (req, res) {
    if (req.body) {

        Category.findOne({_id: req.body._id}, function (err, category) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            //For security purposes only merge these parameters
           // category = _.extend(category, req.body);

            Category.remove({_id: req.body._id}, function (err, category) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
            });


        });
    } else {
        return res.status(400).send({
            message : 'Invalid Request!'
        });
    }
}

exports.list = function (req, res) {
    Category.find({}).sort('-name').exec(function (err, categories) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(categories);
    });
};
//for v2
exports.listCategories = function (req, res) {
    Category.find({}).sort('-name').exec(function (err, categories) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(categories);
    });
};
exports.editlist = function (req, res) {
    Category.findOne({'_id': req.params.cid}).sort('-name').exec(function (err, categories) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(categories);
    });
};


exports.upload = function (req, res) {
    var upath = './modules/events/client/img/category/upload/';
    var upload = multer({
        dest: upath
    }).single('categoryDisplayPic');

    upload(req, res, function (uploadError) {
        console.log(uploadError);
        if (uploadError) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(uploadError)
            });
        }

        return res.json({
            path: upath + "" + req.file.filename,
            message: "OK"
        });
    });
};

exports.countAll = function (req, res){

    console.log('sending count for all categories ');
    if(req.user===undefined || req.user==="") {
        res.json([]);
        return;
    }
 
    function readCategories (callback) {
        Category
        .find()
        .select('name _id')
        .exec(function (e,totCategory) {
            if(e){
                callback(e,null);
            }
            callback(null,totCategory);
        })
    };

    function countTotalEvent (totCategory,callback) {
        if(totCategory.length>0){
            //  console.log(totCategory);
                async.map(totCategory, function (tc,done) {

                    Event
                    .count({category:tc._id})
                    .exec(function (e,count) {
                        if(e){
                            console.log(e);
                        }
                        else{
                        // console.log(tc._id + ' done');
                        done(null,{
                            name:tc.name,
                            count:count
                        });
                        }
                    });
                }, function (err,params) {
                     if(err){
                            console.log(e);
                        }
                    // console.log(params);
                    res.json(params);
                    
                })
                 
             callback(null,'Done');
        }
        else{
             callback(null,'Error');
        }
    };
    
    async.waterfall([
        readCategories,
        countTotalEvent,
       function (err) {
           if(err){
                console.log('waterfall success ' + err);
                return;
           }
       } 
    ]);

};
