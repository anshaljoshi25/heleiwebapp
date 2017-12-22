/**
 * Created by anshal on 3/24/2016.
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
 * loyaltyHistory Schema
 */
var LoyaltyHistorySchema = new Schema({
    user: {
        type : Schema.ObjectId,
        ref:'User'
    },
    loyaltyId: {
        type : Schema.ObjectId
    },

    loyaltyType: {
        type :Schema.ObjectId,
        ref: 'LoyaltyPlan'
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
LoyaltyHistorySchema.pre('save', function (next) {

    next();
});


mongoose.model('LoyaltyHistory', LoyaltyHistorySchema);
