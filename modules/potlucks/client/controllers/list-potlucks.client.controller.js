(function () {
  'use strict';

  angular
    .module('potlucks')
    .controller('PotlucksListController', PotlucksListController);

  PotlucksListController.$inject = ['PotlucksService'];

  function PotlucksListController(PotlucksService) {
    var vm = this;

    vm.potlucks = PotlucksService.query();
  }
}());
