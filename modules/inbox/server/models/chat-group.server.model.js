/**
 * Created by pardeep on 2/18/16.
 */

'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



/**
 * Chat message Schema
 */
var ChatGroupSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: ''

    },
    // member of group
    members: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: Schema.ObjectId,
        ref:'User'
    },
    groupImgURL: {
        type: String,
        default:'/modules/inbox/client/images/groupchat.png'
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('ChatGroup',ChatGroupSchema);
