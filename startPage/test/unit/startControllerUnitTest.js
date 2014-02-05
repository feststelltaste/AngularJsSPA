/* 
 * Document     : startControllerUnitTest.js
 * Created on   : Aug 29, 2013
 * Author       : Sandra Bergmeir sandrabergmeir@gmail.com, Johannes Koelbl <johannes.koelbl88@googlemail.com>
 * Description  : Unit tests for start page.
 */

describe("startController", function() {

	// required variables for tests
    var scope, httpBackend, http, controller, globalVariablesProvider;

    beforeEach(module('mainApp'));
	// beforeEach creates variables and dependencies before each test runs
    beforeEach(inject(function ($rootScope, $controller, $httpBackend, $http, globalVariables) {
        // create a new scope from the rootScope to test on
		scope = $rootScope.$new();
		// create a backend variable to mock the backend
        httpBackend = $httpBackend;
        controller = $controller;
        http = $http;
		// tests need a provider to access globalVariables
        globalVariablesProvider = globalVariables;
        
		// backend mock
        httpBackend.when('POST', globalVariablesProvider.getBackendURL() + 'sites').respond({object: 'actuallyCreatedSite'});
        $controller('startController', {
            $scope: scope,
            $http: $http,
            globalVariables : globalVariablesProvider
        });
    }));
    
    it('should check if event creator has a default value', function () {
        expect(scope.event.creator).toBeDefined();
    });
    
    it('should check if event title has a default value', function () {
        expect(scope.event.title).toBeDefined();
    });
    
    it('should check if event description has a default value', function () {
        expect(scope.event.description).toBeDefined();
    });
    
    it('should check if event email has a default value', function () {
        expect(scope.event.email).toBeDefined();
    });
    
    
    it('should make a http POST request to create a new page on the server', function () {
        httpBackend.expectPOST(globalVariablesProvider.getBackendURL() + 'sites');
        controller('startController', {
            $scope: scope,
            $http: http,
            globalVariables : globalVariablesProvider
        });
    });
});
