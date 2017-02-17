'use strict';

/**
 * Module dependencies
 */
var directoriesPolicy = require('../policies/directories.server.policy'),
  directories = require('../controllers/directories.server.controller');

module.exports = function(app) {
  // Directories Routes
  app.route('/api/directories').all(directoriesPolicy.isAllowed)
    .get(directories.list)
    .post(directories.create);

  app.route('/api/directories/:directoryId').all(directoriesPolicy.isAllowed)
    .get(directories.read)
    .put(directories.update)
    .delete(directories.delete);

  // Finish by binding the Directory middleware
  app.param('directoryId', directories.directoryByID);
};
