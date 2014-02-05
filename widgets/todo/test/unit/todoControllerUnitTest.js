/* 
 * Document     : todoControllerUnitTest
 * Created on   : 11.09.2013
 * Author       : Johannes Koelbl <johannes.koelbl88@googlemail.com>
 * Description  : Testfile for todoController
 */

describe("todoController", function() {
	
	// required variables for tests
    var scope, $httpBackend, controller, url, globalVariablesProvider, todoWidget;

    beforeEach(module('mainApp'));
        // beforeEach creates variables and dependencies before each test runs
    beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $routeParams, globalVariables) {
        // tests need a provider to access globalVariables
        globalVariablesProvider = globalVariables;
        // create correct backend url
        url = globalVariablesProvider.getBackendURL() + 'sites/eventId/todolists/todoListID';
        // create a backend variable to mock the backend
        $httpBackend = _$httpBackend_;        
        // read Todos
        $httpBackend.expectGET(url).respond({title : 'Title', todos : []});
        // change routeParams to static value for testing purposes only
        $routeParams.eventId = 'eventId';
        // define scope, widget and controller to test in 
        scope = $rootScope.$new();
        scope.widget = {widgetId : "todoListID"};
        controller = $controller("todoController", {$scope : scope});      
    }));
    
     afterEach(function () {
        // make sure backend mock is empty and all expects and requests are satisfied (flush in every test)
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should make a http GET request to receive todoListTitle', function () { 
        expect(scope.todoWidget.title).toBe('');        
        $httpBackend.flush();
        expect(scope.todoWidget.title).toEqual('Title');
    });

    it('should check default value to to todo Text', function() {
        $httpBackend.flush();
        expect(scope.todoWidget.todoText).toBe('');
    });
    
    it('should check default value to responsible person', function() {
        $httpBackend.flush();
        expect(scope.todoWidget.todoResponsiblePerson).toBe('');
    });
    
    it('should check default value to to due date', function() {
        $httpBackend.flush();
        expect(scope.todoWidget.todoDueDate).toBe('');
    });
    
    describe('todo list: ', function() {
        
    	it('should initially be empty', function() {
            $httpBackend.flush();
            expect(scope.todoWidget.todos.length).toBe(0);
        });
    	
        describe('add and remove: ', function() {
            var oldLength, newLength;
            
            beforeEach(function() {
                $httpBackend.flush();
                todoWidget = scope.todoWidget;
                todoWidget.todos.push({
                    text : "example todo", 
                    responsiblePerson : "example name", 
                    dueDate : '', 
                    done : false});
                oldLength = todoWidget.todos.length;
                
                url = globalVariablesProvider.getBackendURL() + 'sites/eventId/todolists/todoListID/todos';
                
                // define backend mock for POST
                $httpBackend.whenPOST(url, $.param({
                    text : todoWidget.todoText, 
                    responsiblePerson : '', 
                    dueDate : '', 
                    done : false
                })).respond({
                    text : todoWidget.todoText, 
                    responsiblePerson : '', 
                    dueDate : '', 
                    done : false, 
                    position : 1
                });
            });
            
            it('should push exactly one todo', function() {
                
                //todoWidget.todoText = "example todo";
                // call backend mock for POST
                $httpBackend.expectPOST(url).respond({
                    text : todoWidget.todoText, 
                    responsiblePerson : '', 
                    dueDate : '', 
                    done : false, 
                    position : 1
                });                
                scope.addTodo();
                $httpBackend.flush();
                
                newLength = todoWidget.todos.length;
                expect(newLength).toBe(oldLength + 1);                
             });  

            it('should remove exactly one todo from frontend', function() {
               
               scope.removeTodo();
               newLength = todoWidget.todos.length;
               expect(newLength).toBe(oldLength - 1);
           });
        });
    });
});
