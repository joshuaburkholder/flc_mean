(function () {
  'use strict';

  // Gatherings controller
  angular
    .module('gatherings')
    .controller('GatheringsController', GatheringsController);


  GatheringsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'gatheringResolve'];

  function GatheringsController ($scope, $state, $window, Authentication, gathering) {
    var vm = this;

    vm.authentication = Authentication;
    vm.gathering = gathering;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.date = new Date(2017, 2, 16);



    // Remove existing Gathering
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.gathering.$remove($state.go('gatherings.list'));
      }
    }

    // Save Gathering
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.gatheringForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.gathering._id) {
        vm.gathering.$update(successCallback, errorCallback);
      } else {
        vm.gathering.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('gatherings.view', {
          gatheringId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
