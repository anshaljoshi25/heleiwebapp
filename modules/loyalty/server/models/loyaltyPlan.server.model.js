/**
 * Created by anshal on 3/24/2016.
 */
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
 * loyaltyPlan Schema
 */
var LoyaltyPlanSchema = new Schema({
    type: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in the Loyalty Type']
    },
    points : {
        type: Number,
        default : 0
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
LoyaltyPlanSchema.pre('save', function (next) {

    next();
});


mongoose.model('LoyaltyPlan', LoyaltyPlanSchema);
