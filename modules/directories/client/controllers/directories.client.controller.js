(function () {
  'use strict';

  // Directories controller
  angular
    .module('directories')
    .controller('DirectoriesController', DirectoriesController);

  DirectoriesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'directoryResolve', 'Users', '$filter'];

  function DirectoriesController ($scope, $state, $window, Authentication, directory, Users, $filter) {
    var vm = this;

    vm.userList = Users.query();
    vm.authentication = Authentication;
    vm.directory = directory;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

  //   $scope.userList = [
  //   { displayName: displayName, email: email, username: username },
  //   { displayName: displayName, email: email, username: username },
  // ];

    // Remove existing Directory
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.directory.$remove($state.go('directories.list'));
      }
    }

  
// Filter Query results

//     $scope.showdetails = function(getByID){
         
//          var found = $filter('userList')($scope.user, user_id);
//          console.log(found);
//          $scope.selected = JSON.stringify(found);
//      }
// };

//     $scope.user = [
//     {
//       displayName: this.displayName, 
//       username: this.username
//     }, {
//       displayName: this.displayName, 
//       username: this.username
//     }]


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
