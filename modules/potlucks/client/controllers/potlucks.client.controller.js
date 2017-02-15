(function () {
  'use strict';

  // Potlucks controller
  angular
    .module('potlucks')
    .controller('PotlucksController', PotlucksController);

  PotlucksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'potluckResolve'];

  function PotlucksController ($scope, $state, $window, Authentication, potluck) {
    var vm = this;

    vm.authentication = Authentication;
    vm.potluck = potluck;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Potluck
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.potluck.$remove($state.go('potlucks.list'));
      }
    }

    // Save Potluck
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.potluckForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.potluck._id) {
        vm.potluck.$update(successCallback, errorCallback);
      } else {
        vm.potluck.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('potlucks.view', {
          potluckId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
