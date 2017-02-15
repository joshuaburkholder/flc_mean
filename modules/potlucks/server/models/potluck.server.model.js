'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Potluck Schema
 */
var PotluckSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Potluck name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Potluck', PotluckSchema);
