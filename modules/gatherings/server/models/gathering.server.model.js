'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Gathering Schema
 */
var GatheringSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Gathering name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Gathering name',
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  contact: {
    type: String
  },
  location: {
    type: String
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

mongoose.model('Gathering', GatheringSchema);
