(function () {
  'use strict';

  angular
    .module('gatherings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('gatherings', {
        abstract: true,
        url: '/gatherings',
        template: '<ui-view/>'
      })
      .state('gatherings.list', {
        url: '',
        templateUrl: 'modules/gatherings/client/views/list-gatherings.client.view.html',
        controller: 'GatheringsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Gatherings List'
        }
      })
      .state('gatherings.create', {
        url: '/create',
        templateUrl: 'modules/gatherings/client/views/form-gathering.client.view.html',
        controller: 'GatheringsController',
        controllerAs: 'vm',
        resolve: {
          gatheringResolve: newGathering
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Gatherings Create'
        }
      })
      .state('gatherings.edit', {
        url: '/:gatheringId/edit',
        templateUrl: 'modules/gatherings/client/views/form-gathering.client.view.html',
        controller: 'GatheringsController',
        controllerAs: 'vm',
        resolve: {
          gatheringResolve: getGathering
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Gathering {{ gatheringResolve.name }}'
        }
      })
      .state('gatherings.view', {
        url: '/:gatheringId',
        templateUrl: 'modules/gatherings/client/views/view-gathering.client.view.html',
        controller: 'GatheringsController',
        controllerAs: 'vm',
        resolve: {
          gatheringResolve: getGathering
        },
        data: {
          pageTitle: 'Gathering {{ gatheringResolve.name }}'
        }
      });
  }

  getGathering.$inject = ['$stateParams', 'GatheringsService'];

  function getGathering($stateParams, GatheringsService) {
    return GatheringsService.get({
      gatheringId: $stateParams.gatheringId
    }).$promise;
  }

  newGathering.$inject = ['GatheringsService'];

  function newGathering(GatheringsService) {
    return new GatheringsService();
  }
}());
