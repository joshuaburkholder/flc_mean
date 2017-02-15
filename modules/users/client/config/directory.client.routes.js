'use strict';

// Configure the 'chat' module routes
angular.module('chat').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('list-users', {
        url: '/directory',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
