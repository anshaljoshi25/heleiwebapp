/**
 * Created by anshal on 3/28/2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
    return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};

/**
 * User Schema
 */
var FeedbackSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },

    email: {
        type: String,
        lowercase: true,
        trim: true,
        default: '',
        validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
    },
    comment: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please write your feedback']
    },
    uiViewRating: {
        type : {},
        validate: [validateLocalStrategyProperty, 'Please select the rating']
    },
    userExpRating: {
        type : {},
        validate: [validateLocalStrategyProperty, 'Please select the rating']
    },
    relevanceRating: {
        type : {},
        validate: [validateLocalStrategyProperty, 'Please select the rating']
    },
    contentRating: {
        type : {},
        validate: [validateLocalStrategyProperty, 'Please select the rating']
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }

});


FeedbackSchema.pre('save', function (next) {

    next();
});


mongoose.model('Feedback', FeedbackSchema);
