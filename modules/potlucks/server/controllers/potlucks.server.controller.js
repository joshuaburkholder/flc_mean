'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Potluck = mongoose.model('Potluck'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Potluck
 */
exports.create = function(req, res) {
  var potluck = new Potluck(req.body);
  potluck.user = req.user;

  potluck.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(potluck);
    }
  });
};

/**
 * Show the current Potluck
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var potluck = req.potluck ? req.potluck.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  potluck.isCurrentUserOwner = req.user && potluck.user && potluck.user._id.toString() === req.user._id.toString();

  res.jsonp(potluck);
};

/**
 * Update a Potluck
 */
exports.update = function(req, res) {
  var potluck = req.potluck;

  potluck = _.extend(potluck, req.body);

  potluck.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(potluck);
    }
  });
};

/**
 * Delete an Potluck
 */
exports.delete = function(req, res) {
  var potluck = req.potluck;

  potluck.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(potluck);
    }
  });
};

/**
 * List of Potlucks
 */
exports.list = function(req, res) {
  Potluck.find().sort('-created').populate('user', 'displayName').exec(function(err, potlucks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(potlucks);
    }
  });
};

/**
 * Potluck middleware
 */
exports.potluckByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Potluck is invalid'
    });
  }

  Potluck.findById(id).populate('user', 'displayName').exec(function (err, potluck) {
    if (err) {
      return next(err);
    } else if (!potluck) {
      return res.status(404).send({
        message: 'No Potluck with that identifier has been found'
      });
    }
    req.potluck = potluck;
    next();
  });
};
