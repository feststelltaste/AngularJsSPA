/* 
 * Document	: commentControllerUnitTest.js
 * Created on	: 25.07.2013
 * Author	: Johannes Koelbl <johannes.koelbl88@googlemail.com>, Sandra Bergmeir <sandrabergmeir@gmail.com>
 * Description	: Unit-tests for comment controller.
 */

describe("Comment Controller", function() {
	
    // required variables for tests
    var scope, $httpBackend, controller, url, globalVariablesProvider, responseComments;

    beforeEach(module('mainApp'));
    // beforeEach creates variables and dependencies before each test runs
    beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $routeParams, globalVariables){
		
        // create correct backend url
        globalVariablesProvider = globalVariables;
        url = globalVariablesProvider.getBackendURL() + 'sites/eventId';

        // create a backend variable to mock the backend
        $httpBackend = _$httpBackend_;

        // readComments
        responseComments = {
            comments : [{
                creator : "Tester", 
                since: { formated : "right now" }, 
                createdAt : 1379589236071, 
                id : 0, 
                content : "Kommentar"
            }]
        };
		
        // backend mock
        $httpBackend.expectGET(url + '/comments').respond(responseComments);
		
        // needs to be changed to a static variable, because the test doesn't know the siteName from the server
        // (no real server connection, just a mock)
        $routeParams.eventId = 'eventId';
		
        // create a new scope from the rootScope to test on
        scope = $rootScope.$new();
        controller = $controller(commentController, {$scope: scope});
    }));

    afterEach(function () {
        // make sure backend mock is empty and all expects and requests are satisfied (flush in every test)
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a http GET request to create a new array of comments', function() {
        expect(scope.commentWidget.comments).toEqual([]);
        
        // call flush before http request gets executed
        $httpBackend.flush();
        expect(scope.commentWidget.comments).toEqual(responseComments.comments);
    });

    it('should initially check the input values', function() {
        $httpBackend.flush();
        expect(scope.commentWidget.content).toBe('');
        expect(scope.commentWidget.content).not.toBeNull();
        
        expect(scope.commentWidget.creator).toBe('');
        expect(scope.commentWidget.creator).not.toBeNull();
    });
    
    describe("Comment list: ", function() {
        
        it('should push exactly one comment to frontend', function() {
            $httpBackend.flush();
            var oldLength = scope.commentWidget.comments.length;
            scope.commentWidget.creator = 'Creator';
            scope.commentWidget.content = 'Text';

            // mock backend and expect post request
            singleComment = {
                comment: {
                    creator: "Creator", 
                    since: {
                        formated: "right now"
                    }, 
                    createdAt: 1379589236071, 
                    id: 0, 
                    content: "Text"
                } 
            };
            $httpBackend.expectPOST(url + '/comments', $.param({
                creator : scope.commentWidget.creator, 
                content : scope.commentWidget.content
            })).respond(singleComment);
            
            scope.addComment();
            $httpBackend.flush();
            
            var newLength = scope.commentWidget.comments.length;
            expect(newLength).toEqual(oldLength + 1);
        });
    });
});
