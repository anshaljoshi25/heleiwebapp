/**
 * Created by arunsharma on 18/2/16.
 */
'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



/**
 * User Schema
 */
var FriendSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref : 'User'
    },
    friend: {
        type: Schema.ObjectId,
        ref : 'User'
    },
    type: {
        type: String,
        enum: ['normal','restricted','group' ]
    },

    status: {
        type: String,
        enum: ['0', '1', '2', '3'] //pending, accepted, declined, blocked
    },
    //who initiated the action
    actionUserId: {
        type:Schema.ObjectId,
        ref:'User'
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});



mongoose.model('Friend', FriendSchema);
