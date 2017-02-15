(function () {
  'use strict';

  angular
    .module('potlucks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('potlucks', {
        abstract: true,
        url: '/potlucks',
        template: '<ui-view/>'
      })
      .state('potlucks.list', {
        url: '',
        templateUrl: 'modules/potlucks/client/views/list-potlucks.client.view.html',
        controller: 'PotlucksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Potlucks List'
        }
      })
      .state('potlucks.create', {
        url: '/create',
        templateUrl: 'modules/potlucks/client/views/form-potluck.client.view.html',
        controller: 'PotlucksController',
        controllerAs: 'vm',
        resolve: {
          potluckResolve: newPotluck
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Potlucks Create'
        }
      })
      .state('potlucks.edit', {
        url: '/:potluckId/edit',
        templateUrl: 'modules/potlucks/client/views/form-potluck.client.view.html',
        controller: 'PotlucksController',
        controllerAs: 'vm',
        resolve: {
          potluckResolve: getPotluck
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Potluck {{ potluckResolve.name }}'
        }
      })
      .state('potlucks.view', {
        url: '/:potluckId',
        templateUrl: 'modules/potlucks/client/views/view-potluck.client.view.html',
        controller: 'PotlucksController',
        controllerAs: 'vm',
        resolve: {
          potluckResolve: getPotluck
        },
        data: {
          pageTitle: 'Potluck {{ potluckResolve.name }}'
        }
      });
  }

  getPotluck.$inject = ['$stateParams', 'PotlucksService'];

  function getPotluck($stateParams, PotlucksService) {
    return PotlucksService.get({
      potluckId: $stateParams.potluckId
    }).$promise;
  }

  newPotluck.$inject = ['PotlucksService'];

  function newPotluck(PotlucksService) {
    return new PotlucksService();
  }
}());
