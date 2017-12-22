/**
 * Created by arunsharma on 5/3/16.
 */
'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Notifiation Schema
 */
var NotificationSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref : 'User'
    },
    actor : {
        type: Schema.ObjectId,
        ref : 'User'
    },
    type: {
        type: String,
        enum: ['request','message','event','invite','gmessage']
    },
    message: {
        type: String,
        default: 'New Notification!',
        trim: true
    },
    read: {
        type: Boolean,
        default: false
    },
    actionURI : {
        type: String,
        trim : true
    },
    archived: {
        type: Boolean,
        default: false
    },
    updated: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});


mongoose.model('Notification', NotificationSchema);
