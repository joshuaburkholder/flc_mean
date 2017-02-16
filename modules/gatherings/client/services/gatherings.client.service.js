// Gatherings service used to communicate Gatherings REST endpoints
(function () {
  'use strict';

  angular
    .module('gatherings')
    .factory('GatheringsService', GatheringsService);

  GatheringsService.$inject = ['$resource'];

  function GatheringsService($resource) {
    return $resource('api/gatherings/:gatheringId', {
      gatheringId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
