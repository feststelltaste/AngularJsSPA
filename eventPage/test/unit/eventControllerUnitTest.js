/* 
 * Document     : eventControllerUnitTest.js
 * Created on   : Aug 30, 2013
 * Author       : Sandra Bergmeir <sandrabergmeir@gmail.com>
 * Description  : Unit tests for event controller.
 */

describe("event controller: ", function() {

	// required variables for tests
    var scope, $httpBackend, controller, url, globalVariablesProvider, todoLists, window;

    beforeEach(module('mainApp'));
	// beforeEach creates variables and dependencies before each test runs
    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, $routeParams, globalVariables, $window) {
		
		// create correct backend url
        globalVariablesProvider = globalVariables;
        url = globalVariablesProvider.getBackendURL() + 'sites/eventId';
		
		// create a backend variable to mock the backend
        $httpBackend = _$httpBackend_;
		
        // backend mock
		
        // readEventData
        $httpBackend.expectGET(url).respond({data: {title: 'ToDo List', description:'Description', creator: 'Creator'}}); 
        // readToDoLists
        todoLists = {"todoLists":[0]};
        $httpBackend.expectGET(url + '/todolists').respond(todoLists); 
		
        // needs to be changed to a static variable, because the test doesn't know the siteName from the server
		// (no real server connection, just a mock)
        $routeParams.eventId = 'eventId';
        
        scope = $rootScope.$new();
        window = $window;
        controller = $controller(eventController, {
            $scope: scope,
            $window: window
        });        
    }));
    
     afterEach(function () {
		// make sure backend mock is empty and all expects and requests are satisfied (flush in every test)
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a http GET request to receive eventTitle, eventDescription and eventCreator', function () {         
        expect(scope.eventTitle).toBeUndefined();
        expect(scope.eventDescription).toBeUndefined(); 
        expect(scope.eventCreator).toBeUndefined();
        $httpBackend.flush();
 
        expect(scope.eventTitle).toEqual('ToDo List');     
        expect(scope.eventDescription).toEqual('Description');
        expect(scope.eventCreator).toEqual('Creator');
    });
    
    it('should check a widget variable', function() {
        $httpBackend.flush();
        expect(scope.widgetCarousel).toBeDefined();
    });
    
//    it('should swap widgets', function() {
//        var id0, id1;
//        $httpBackend.flush();
//        id0 = scope.widgets[0].id;
//        id1 = scope.widgets[1].id;
//        scope.swapWidgets(0, 1);
//        
//        expect(scope.widgets[1].id).toBeDefined(id0);
//        expect(scope.widgets[0].id).toBeDefined(id1);
//    });
    
    it('should return correct string of window size', function() {
        var size;
        $httpBackend.flush();
        size = scope.getViewportWidth();
        
        if(window.innerWidth < 992)
        {
            expect(size).toBe('small');
        }
        else
        {
            expect(size).toBe('large');
        }
    });
    
    describe("widget list: ", function() {
        
        it('should check a widget variable', function() {
            $httpBackend.flush();
            expect(scope.widgets).toBeDefined();
        });
        
        it('should initially check the length of the widget list', function() {
            expect(scope.widgets.length).toBe(1); //scheduling widget already exists in array
            $httpBackend.flush();
        });
        
        it('should make a http GET request to fetch all todo lists from server and push them into the widgets array', function (){        
            expect(scope.todoListIDs).toBeUndefined();         
            $httpBackend.flush();        

            scope.todoListIDs = todoLists;        
            for(var i = 0; i < 3; i++){
                expect(scope.todoListIDs[i]).toEqual(todoLists[i]);
            }
        });
        
        it('should make a http POST request to create a new todo widget (fill widgets-array with todoWidget)', function () { 
            $httpBackend.expectPOST(url + '/todolists', $.param({title: 'ToDo List'})).respond({listId: 1});   

            scope.createTodoList();  
            $httpBackend.flush();  

            // TODO: Test if listId was creaeted properly
        });
    
        describe('add and remove: ', function(){
            var oldLength, newLength;
            
            it('should increase the widget array', function(){
                oldLength = scope.widgets.length;     
                scope.widgets.push({
                    id: 'todo-widget-0', 
                    widgetId: 0, 
                    orderPos: scope.widgets.length, 
                    src: 'widgets/scheduling/views/schedulingView.html'
                });
                newLength = scope.widgets.length;
                $httpBackend.flush();

                expect(newLength).toBe(oldLength + 1);
            });
            
            it('should increase the widget array', function(){
                oldLength = scope.widgets.length;     
                scope.widgets.push({
                    id: 'scheduling-widget-0', 
                    widgetId: 0, 
                    orderPos: scope.widgets.length, 
                    src: 'widgets/scheduling/views/schedulingView.html'
                });
                newLength = scope.widgets.length;
                $httpBackend.flush();

                expect(newLength).toBe(oldLength + 1);
            });
            
            it('should decrease the widget array', function(){
                oldLength = scope.widgets.length;     
                scope.removeWidget(0);
                newLength = scope.widgets.length;
                $httpBackend.flush();

                expect(newLength).toBe(oldLength - 1);
            });
        });
    });
});
