// Directories service used to communicate Directories REST endpoints
(function () {
  'use strict';

  angular
    .module('directories')
    .factory('DirectoriesService', DirectoriesService);

  DirectoriesService.$inject = ['$resource'];

  function DirectoriesService($resource) {
    return $resource('api/directories/:directoryId', {
      directoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
