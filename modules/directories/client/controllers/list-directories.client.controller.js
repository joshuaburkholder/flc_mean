(function () {
  'use strict';

  angular
    .module('directories')
    .controller('DirectoriesListController', DirectoriesListController);

  DirectoriesListController.$inject = ['DirectoriesService'];

  function DirectoriesListController(DirectoriesService) {
    var vm = this;

    vm.directories = DirectoriesService.query();
  }
}());
