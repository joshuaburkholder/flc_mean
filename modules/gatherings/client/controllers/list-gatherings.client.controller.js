(function () {
  'use strict';

  angular
    .module('gatherings')
    .controller('GatheringsListController', GatheringsListController);

  GatheringsListController.$inject = ['GatheringsService'];

  function GatheringsListController(GatheringsService) {
    var vm = this;

    vm.gatherings = GatheringsService.query();
  }
}());
