(function () {
  'use strict';

  describe('Gatherings Route Tests', function () {
    // Initialize global variables
    var $scope,
      GatheringsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _GatheringsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      GatheringsService = _GatheringsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('gatherings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/gatherings');
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
          GatheringsController,
          mockGathering;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('gatherings.view');
          $templateCache.put('modules/gatherings/client/views/view-gathering.client.view.html', '');

          // create mock Gathering
          mockGathering = new GatheringsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Gathering Name'
          });

          // Initialize Controller
          GatheringsController = $controller('GatheringsController as vm', {
            $scope: $scope,
            gatheringResolve: mockGathering
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:gatheringId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.gatheringResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            gatheringId: 1
          })).toEqual('/gatherings/1');
        }));

        it('should attach an Gathering to the controller scope', function () {
          expect($scope.vm.gathering._id).toBe(mockGathering._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/gatherings/client/views/view-gathering.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          GatheringsController,
          mockGathering;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('gatherings.create');
          $templateCache.put('modules/gatherings/client/views/form-gathering.client.view.html', '');

          // create mock Gathering
          mockGathering = new GatheringsService();

          // Initialize Controller
          GatheringsController = $controller('GatheringsController as vm', {
            $scope: $scope,
            gatheringResolve: mockGathering
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.gatheringResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/gatherings/create');
        }));

        it('should attach an Gathering to the controller scope', function () {
          expect($scope.vm.gathering._id).toBe(mockGathering._id);
          expect($scope.vm.gathering._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/gatherings/client/views/form-gathering.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          GatheringsController,
          mockGathering;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('gatherings.edit');
          $templateCache.put('modules/gatherings/client/views/form-gathering.client.view.html', '');

          // create mock Gathering
          mockGathering = new GatheringsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Gathering Name'
          });

          // Initialize Controller
          GatheringsController = $controller('GatheringsController as vm', {
            $scope: $scope,
            gatheringResolve: mockGathering
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:gatheringId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.gatheringResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            gatheringId: 1
          })).toEqual('/gatherings/1/edit');
        }));

        it('should attach an Gathering to the controller scope', function () {
          expect($scope.vm.gathering._id).toBe(mockGathering._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/gatherings/client/views/form-gathering.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
