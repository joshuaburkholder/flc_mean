(function () {
  'use strict';

  angular
    .module('directories')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('directories', {
        abstract: true,
        url: '/directories',
        template: '<ui-view/>'
      })
      .state('directories.list', {
        url: '',
        templateUrl: 'modules/directories/client/views/list-directories.client.view.html',
        controller: 'DirectoriesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Directories List'
        }
      })
      .state('directories.create', {
        url: '/create',
        templateUrl: 'modules/directories/client/views/form-directory.client.view.html',
        controller: 'DirectoriesController',
        controllerAs: 'vm',
        resolve: {
          directoryResolve: newDirectory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Directories Create'
        }
      })
      .state('directories.edit', {
        url: '/:directoryId/edit',
        templateUrl: 'modules/directories/client/views/form-directory.client.view.html',
        controller: 'DirectoriesController',
        controllerAs: 'vm',
        resolve: {
          directoryResolve: getDirectory
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Directory {{ directoryResolve.name }}'
        }
      })
      .state('directories.view', {
        url: '/:directoryId',
        templateUrl: 'modules/directories/client/views/view-directory.client.view.html',
        controller: 'DirectoriesController',
        controllerAs: 'vm',
        resolve: {
          directoryResolve: getDirectory
        },
        data: {
          pageTitle: 'Directory {{ directoryResolve.name }}'
        }
      });
  }

  getDirectory.$inject = ['$stateParams', 'DirectoriesService'];

  function getDirectory($stateParams, DirectoriesService) {
    return DirectoriesService.get({
      directoryId: $stateParams.directoryId
    }).$promise;
  }

  newDirectory.$inject = ['DirectoriesService'];

  function newDirectory(DirectoriesService) {
    return new DirectoriesService();
  }
}());
