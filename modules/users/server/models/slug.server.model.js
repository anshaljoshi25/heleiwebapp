'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

/* slug schema */

var SlugSchema = new Schema({
  value: {
    type: String,
    trim: true,
    default: '',
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  used : {
    type: Boolean,
    default: false
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
});

/**
 * Hook a pre save method to generate slug
 */
SlugSchema.pre('save', function (next) {
  var text = "";
    var possible = "0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    this.value = text;
    next();
});



mongoose.model('Slug', SlugSchema);
