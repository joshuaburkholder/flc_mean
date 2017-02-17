'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Directory = mongoose.model('Directory'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Directory
 */
exports.create = function(req, res) {
  var directory = new Directory(req.body);
  directory.user = req.user;

  directory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(directory);
    }
  });
};

/**
 * Show the current Directory
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var directory = req.directory ? req.directory.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  directory.isCurrentUserOwner = req.user && directory.user && directory.user._id.toString() === req.user._id.toString();

  res.jsonp(directory);
};

/**
 * Update a Directory
 */
exports.update = function(req, res) {
  var directory = req.directory;

  directory = _.extend(directory, req.body);

  directory.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(directory);
    }
  });
};

/**
 * Delete an Directory
 */
exports.delete = function(req, res) {
  var directory = req.directory;

  directory.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(directory);
    }
  });
};

/**
 * List of Directories
 */
exports.list = function(req, res) {
  Directory.find().sort('-created').populate('user', 'displayName').exec(function(err, directories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(directories);
    }
  });
};

/**
 * Directory middleware
 */
exports.directoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Directory is invalid'
    });
  }

  Directory.findById(id).populate('user', 'displayName').exec(function (err, directory) {
    if (err) {
      return next(err);
    } else if (!directory) {
      return res.status(404).send({
        message: 'No Directory with that identifier has been found'
      });
    }
    req.directory = directory;
    next();
  });
};
