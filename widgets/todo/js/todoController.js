/* 
 * Document	: todoController.js
 * Created on	: 25.07.2013
 * Author	: Johannes Koelbl <johannes.koelbl88@googlemail.com>, Daniel Sauer <sauerda45569@th-nuernberg.de>
 * Description	: Todo widget logic.
 */
angular.module('todoWidget').controller('todoController', todoController);

function todoController($scope, $http, globalVariables, $routeParams, $filter, notifications){

/**** Initiating scope variables and all necessary data for this controller ****/
	
	// create correct backend URL and required IDs
    var eventId = $routeParams.eventId,
        url = globalVariables.getBackendURL() + 'sites/' + eventId;

	// todo Array that holds all necessary information
    $scope.todoWidget = {
        id : $scope.widget.widgetId,
        title : '',
        todoText : '',
        todoResponsiblePerson : '',
        todoDueDate : '',
        todos : [],
        filterOptions : [{
                value: "all",
                displayValue: "All"
            }, {
                value: "true",
                displayValue: "Done"
            }, {
                value: "false",
                displayValue: "Todo"
            }
        ] 
    };
    //set default option to 'all'
    $scope.todoWidget.switchTodos = $scope.todoWidget.filterOptions[0].value;
    
    //get all todos while site reloads
    if($scope.todoWidget.id !== undefined){
        readTodos();
    };
	
/*******************************************************************************/

/**** Frontend functions interacting with the HTML template are on the scope ****/

    //add a new todo to the end of the list
    $scope.addTodo = function(){
        var todoBackend = {
            text: $scope.todoWidget.todoText,
            responsiblePerson: $scope.todoWidget.todoResponsiblePerson,
            dueDate: $scope.todoWidget.todoDueDate,
            done: false
        };
        
        pushTodoToBackend(todoBackend);
    };
	
	 //only called if content or checkbox are changed
    $scope.changeTodo = function(todo){
        var date = null;
        if(todo.dueDate){
            date = convertTimeStampToDate(todo.dueDate);
        };

        var todoID = todo.position;
        todo = {
            text : todo.text, 
            dueDate : date,
            responsiblePerson : todo.responsiblePerson,
            done : todo.done
        };

        //put changed todo to server - MUST PUT date in format dd/mm/yy
        $http({
            method: 'PUT',
            url: url + '/todolists/' + $scope.todoWidget.id + '/todos/' + todoID,
            data: $.param(todo)
        }).success(function(){
            console.log("PUT http success (todolists/id/todos/id)");
        }).error(function(){
            console.error("PUT http error (todolists/id/todos/id)");
        });
    };
	
	//removes the selected todo from list in frontend
    $scope.removeTodo = function(index){
        $scope.todoWidget.todos.splice(index, 1);
    };
	
    //filter options helper
    $scope.convertStringToBoolean = function(value){
        return value === "true" ? true : false;
    };

/*******************************************************************************/

/**** Functions only needed for functionality, not interacting with the HTML template are not on the scope ****/

    function pushTodoToFrontend(todo){
        //push new todo to frontend
        $scope.todoWidget.todos.push(todo);
        
        //clear input variables
        clearVariables();
    };
    
    function pushTodoToBackend(todo){
        $http({
            method: 'POST',
            url: url + '/todolists/' + $scope.todoWidget.id + '/todos',
            data: $.param(todo)
        }).success(function(data){
            console.log("POST http success (todolists/id/todos)");
            todo.position = data.position;
            pushTodoToFrontend(todo);
            
        }).error(function(){
            //call alert
            notifications.call("Incorrect input.");
            console.error("POST http error (todolists/id/todos)");
        });
    };
    
    function clearVariables(){
        $scope.todoWidget.todoText = '';
        $scope.todoWidget.todoResponsiblePerson = '';
        $scope.todoWidget.todoDueDate = '';
    };    
    
    function convertTimeStampToDate(data){
        //TODO: wieso kann man todos nur in dem format MM/dd/yy abspeichern?
        return $filter('date')(new Date(data), 'MM/dd/yy');
    };
    
    //get all todos from server
    function readTodos(){
        $http({
            method: 'GET',
            url: url + '/todolists/' + $scope.todoWidget.id
        }).success(function(data){
            console.log("GET http success (sites) - get todos");
            $scope.todoWidget.title = data.title;
            $scope.todoWidget.todos = data.todos;
        }).error(function(){
            //call alert
            notifications.call("Unable to load todos.");
            console.error("GET http error (sites) - get todos");
        });
    }; 
};
