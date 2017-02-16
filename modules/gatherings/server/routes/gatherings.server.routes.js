'use strict';

/**
 * Module dependencies
 */
var gatheringsPolicy = require('../policies/gatherings.server.policy'),
  gatherings = require('../controllers/gatherings.server.controller');

module.exports = function(app) {
  // Gatherings Routes
  app.route('/api/gatherings').all(gatheringsPolicy.isAllowed)
    .get(gatherings.list)
    .post(gatherings.create);

  app.route('/api/gatherings/:gatheringId').all(gatheringsPolicy.isAllowed)
    .get(gatherings.read)
    .put(gatherings.update)
    .delete(gatherings.delete);

  // Finish by binding the Gathering middleware
  app.param('gatheringId', gatherings.gatheringByID);
};
