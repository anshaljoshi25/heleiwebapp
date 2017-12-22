/**
 * Created by arunsharma on 6/2/16.
 */
/**
 * Created by arunsharma on 5/2/16.
 */
'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validator = require('validator');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};


/**
 * User Schema
 */
var EventSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in the event name']
    },
    venueName :{
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in the venue name']
    },
    eventDisplayPic:{
        type: String,
        trim: true,
        default: ''
    },
    eventStartDate: {
        type: Date
    },
    eventEndDate: {
        type: Date
    },
    category:{
        type: Schema.ObjectId,
        ref : 'Category'
    },
    categories: {
        type: [{type: Schema.ObjectId, ref: 'Category'}]
    },
    location: {
        type: Schema.Types.Mixed,
        trim: true,
        default : {}
    },
    description: {
        type: String,
        trim: true
    },
    lovedBy: {
        type: [{type: Schema.ObjectId,ref:'User'}]
    },
    place:{
        type: {}
    },
    going: {
        type : [{type:Schema.ObjectId,ref:'User'}]
    },
    invites: {
        type : [{type:Schema.ObjectId,ref:'User'}]
    },
    invited : {
        type : [{type:Schema.ObjectId,ref:'User'}]
    },
    images: {
        type: [{
            imgURL : {type: String},
            user: {type: Schema.ObjectId, ref:'User'}
        }]
    },
    deals: {
        type: [{type: Schema.ObjectId, ref: 'Deal'}],
    },
    public: {
        type: Boolean,
        default: false
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
EventSchema.pre('save', function (next) {

    next();
});


mongoose.model('Event', EventSchema);
