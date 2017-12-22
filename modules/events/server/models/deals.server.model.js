'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var validateLocalStrategyProperty = function (property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};
/**
 * User Schema
 */
var DealSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in the deal name']
    },
    description: {
        type: String,
        trim: true,

    },
    likes : {
        type : [{type: Schema.ObjectId, ref: 'User'}]
    },
    type: {
        type: String,
        enum: ['prepaid','prebook','postpaid']
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    creator: {
        type : Schema.ObjectId,
        ref : 'User'
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Hook a pre save method to hash the password
 */
DealSchema.pre('save', function (next) {

    next();
});


mongoose.model('Deal', DealSchema);
