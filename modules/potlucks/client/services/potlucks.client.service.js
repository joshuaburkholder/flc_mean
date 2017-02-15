// Potlucks service used to communicate Potlucks REST endpoints
(function () {
  'use strict';

  angular
    .module('potlucks')
    .factory('PotlucksService', PotlucksService);

  PotlucksService.$inject = ['$resource'];

  function PotlucksService($resource) {
    return $resource('api/potlucks/:potluckId', {
      potluckId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
