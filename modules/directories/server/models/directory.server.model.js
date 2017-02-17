'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Directory Schema
 */
var DirectorySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Directory name',
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

mongoose.model('Directory', DirectorySchema);
