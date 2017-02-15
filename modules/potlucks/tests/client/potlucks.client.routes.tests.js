(function () {
  'use strict';

  describe('Potlucks Route Tests', function () {
    // Initialize global variables
    var $scope,
      PotlucksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PotlucksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PotlucksService = _PotlucksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('potlucks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/potlucks');
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
          PotlucksController,
          mockPotluck;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('potlucks.view');
          $templateCache.put('modules/potlucks/client/views/view-potluck.client.view.html', '');

          // create mock Potluck
          mockPotluck = new PotlucksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Potluck Name'
          });

          // Initialize Controller
          PotlucksController = $controller('PotlucksController as vm', {
            $scope: $scope,
            potluckResolve: mockPotluck
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:potluckId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.potluckResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            potluckId: 1
          })).toEqual('/potlucks/1');
        }));

        it('should attach an Potluck to the controller scope', function () {
          expect($scope.vm.potluck._id).toBe(mockPotluck._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/potlucks/client/views/view-potluck.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PotlucksController,
          mockPotluck;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('potlucks.create');
          $templateCache.put('modules/potlucks/client/views/form-potluck.client.view.html', '');

          // create mock Potluck
          mockPotluck = new PotlucksService();

          // Initialize Controller
          PotlucksController = $controller('PotlucksController as vm', {
            $scope: $scope,
            potluckResolve: mockPotluck
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.potluckResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/potlucks/create');
        }));

        it('should attach an Potluck to the controller scope', function () {
          expect($scope.vm.potluck._id).toBe(mockPotluck._id);
          expect($scope.vm.potluck._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/potlucks/client/views/form-potluck.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PotlucksController,
          mockPotluck;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('potlucks.edit');
          $templateCache.put('modules/potlucks/client/views/form-potluck.client.view.html', '');

          // create mock Potluck
          mockPotluck = new PotlucksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Potluck Name'
          });

          // Initialize Controller
          PotlucksController = $controller('PotlucksController as vm', {
            $scope: $scope,
            potluckResolve: mockPotluck
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:potluckId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.potluckResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            potluckId: 1
          })).toEqual('/potlucks/1/edit');
        }));

        it('should attach an Potluck to the controller scope', function () {
          expect($scope.vm.potluck._id).toBe(mockPotluck._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/potlucks/client/views/form-potluck.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
