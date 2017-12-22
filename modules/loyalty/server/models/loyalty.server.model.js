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
 * loyalty Schema
 */
var LoyaltySchema = new Schema({
    user: {
        type : Schema.ObjectId,
        ref:'User',
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


LoyaltySchema.pre('save', function (next) {

    next();
});


mongoose.model('Loyalty', LoyaltySchema);
