'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Gathering = mongoose.model('Gathering'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Gathering
 */
exports.create = function(req, res) {
  var gathering = new Gathering(req.body);
  gathering.user = req.user;

  gathering.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gathering);
    }
  });
};

/**
 * Show the current Gathering
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var gathering = req.gathering ? req.gathering.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  gathering.isCurrentUserOwner = req.user && gathering.user && gathering.user._id.toString() === req.user._id.toString();

  res.jsonp(gathering);
};

/**
 * Update a Gathering
 */
exports.update = function(req, res) {
  var gathering = req.gathering;

  gathering = _.extend(gathering, req.body);

  gathering.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gathering);
    }
  });
};

/**
 * Delete an Gathering
 */
exports.delete = function(req, res) {
  var gathering = req.gathering;

  gathering.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gathering);
    }
  });
};

/**
 * List of Gatherings
 */
exports.list = function(req, res) {
  Gathering.find().sort('-created').populate('user', 'displayName').exec(function(err, gatherings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(gatherings);
    }
  });
};

/**
 * Gathering middleware
 */
exports.gatheringByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Gathering is invalid'
    });
  }

  Gathering.findById(id).populate('user', 'displayName').exec(function (err, gathering) {
    if (err) {
      return next(err);
    } else if (!gathering) {
      return res.status(404).send({
        message: 'No Gathering with that identifier has been found'
      });
    }
    req.gathering = gathering;
    next();
  });
};
