'use strict';

/**
 * Module dependencies
 */
var potlucksPolicy = require('../policies/potlucks.server.policy'),
  potlucks = require('../controllers/potlucks.server.controller');

module.exports = function(app) {
  // Potlucks Routes
  app.route('/api/potlucks').all(potlucksPolicy.isAllowed)
    .get(potlucks.list)
    .post(potlucks.create);

  app.route('/api/potlucks/:potluckId').all(potlucksPolicy.isAllowed)
    .get(potlucks.read)
    .put(potlucks.update)
    .delete(potlucks.delete);

  // Finish by binding the Potluck middleware
  app.param('potluckId', potlucks.potluckByID);
};
