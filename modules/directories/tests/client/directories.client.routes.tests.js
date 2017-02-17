(function () {
  'use strict';

  describe('Directories Route Tests', function () {
    // Initialize global variables
    var $scope,
      DirectoriesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DirectoriesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DirectoriesService = _DirectoriesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('directories');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/directories');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          DirectoriesController,
          mockDirectory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('directories.view');
          $templateCache.put('modules/directories/client/views/view-directory.client.view.html', '');

          // create mock Directory
          mockDirectory = new DirectoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Directory Name'
          });

          // Initialize Controller
          DirectoriesController = $controller('DirectoriesController as vm', {
            $scope: $scope,
            directoryResolve: mockDirectory
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:directoryId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.directoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            directoryId: 1
          })).toEqual('/directories/1');
        }));

        it('should attach an Directory to the controller scope', function () {
          expect($scope.vm.directory._id).toBe(mockDirectory._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/directories/client/views/view-directory.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DirectoriesController,
          mockDirectory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('directories.create');
          $templateCache.put('modules/directories/client/views/form-directory.client.view.html', '');

          // create mock Directory
          mockDirectory = new DirectoriesService();

          // Initialize Controller
          DirectoriesController = $controller('DirectoriesController as vm', {
            $scope: $scope,
            directoryResolve: mockDirectory
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.directoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/directories/create');
        }));

        it('should attach an Directory to the controller scope', function () {
          expect($scope.vm.directory._id).toBe(mockDirectory._id);
          expect($scope.vm.directory._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/directories/client/views/form-directory.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DirectoriesController,
          mockDirectory;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('directories.edit');
          $templateCache.put('modules/directories/client/views/form-directory.client.view.html', '');

          // create mock Directory
          mockDirectory = new DirectoriesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Directory Name'
          });

          // Initialize Controller
          DirectoriesController = $controller('DirectoriesController as vm', {
            $scope: $scope,
            directoryResolve: mockDirectory
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:directoryId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.directoryResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            directoryId: 1
          })).toEqual('/directories/1/edit');
        }));

        it('should attach an Directory to the controller scope', function () {
          expect($scope.vm.directory._id).toBe(mockDirectory._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/directories/client/views/form-directory.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
