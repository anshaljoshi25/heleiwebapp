/**
 * Created by pardeep on 2/8/16.
 */

'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;



/**
 * Chat message Schema
 */
var ChatMessageSchema = new Schema({
    message: {
        type: String,
        trim: true,
        default: ''

    },
    shortMessage: {
        type: String,
        trim: true,
        default: ''
    },

    // who sent the chat
    from: {
        type: Schema.ObjectId,
        ref:'User'
    },
    //who received the chat
    to: {
        type:Schema.ObjectId,
        ref:'User'
    },
    conversationType: {
        type:[{
            type: String,
            enum: ['Group', 'Single']
        }]
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    archived: [{
            type: Schema.ObjectId,
            ref:'User'
        }]

});

mongoose.model('ChatMessage',ChatMessageSchema);
