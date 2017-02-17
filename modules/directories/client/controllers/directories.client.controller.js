(function () {
  'use strict';

  // Directories controller
  angular
    .module('directories')
    .controller('DirectoriesController', DirectoriesController);

  DirectoriesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'directoryResolve', 'Users'];

  function DirectoriesController ($scope, $state, $window, Authentication, directory, Users) {
    var vm = this;

    vm.userList = Users.query();
    vm.authentication = Authentication;
    vm.directory = directory;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Directory
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.directory.$remove($state.go('directories.list'));
      }
    }

    // Save Directory
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.directoryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.directory._id) {
        vm.directory.$update(successCallback, errorCallback);
      } else {
        vm.directory.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('directories.view', {
          directoryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
