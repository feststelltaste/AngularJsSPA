/* 
 * Document	: eventController.js
 * Created on	: 25.07.2013
 * Author	: Daniel Sauer <sauerda45569@th-nuernberg.de>, Johannes Koelbl <johannes.koelbl88@googlemail.com>, Sandra Bergmeir <sandrabergmeir@gmail.com>
 * Description	: 
 */
angular.module('eventPage').controller('eventController', eventController);

function eventController($scope, $http, globalVariables, $routeParams, $window) {
    
/**** Initiating scope variables and all necessary data for this controller ****/
    
    $scope.widgets = [];
    $scope.widgetCarousel = { currentWidget : 0 };

    $scope.eventTitle;
    $scope.eventDescription;
    $scope.eventCreator;
    
        // get current eventId (siteName)
    var eventId = $routeParams.eventId,
        // create backend URL
        url = globalVariables.getBackendURL() + 'sites/' + eventId,
        // template URLs for widgets
        schedulingTemplate = 'widgets/scheduling/views/schedulingView.html',
        todoTemplate = 'widgets/todo/views/todoView.html',
        // helper as long as there is no backend connection for scheduling
        schedulingId = 0;
        
    // call necessary functions to initiate page    
    readEventData();
    readTodoLists();
    // initiate default widget in frontend: scheduling --> widget-carousel in smartphone view doesn't work if there are initially no widgets in the array
    pushWidget('scheduling-widget', 0, schedulingTemplate);
    
/*******************************************************************************/

/**** Frontend functions interacting with the HTML template are on the scope ****/

    // Create TodoList in Backend and push to Frontend array
    $scope.createTodoList = function(){
        var listId;
        $http({
            method: 'POST',
            url: url + '/todolists',
            data: $.param({title: "ToDo List"})
        }).success(function(data) {            
            listId = data.listId;            
            // push list to frontend (fill array)
            pushWidget('todo-widget', listId, todoTemplate);            
        }).error(function() {
            console.warn("POST http error (todolists)");
        });
    };

    // create schedulingWidget in Frontend (no backend connection yet)
    $scope.createScheduling = function(){
        // backend functionality for scheduling needs to be wrapped around here
        schedulingId += 1 ;
        pushWidget('scheduling-widget', schedulingId, schedulingTemplate);
    };
    
    // delete a widget (only frontend functionality because there is no delete on the backend)
    $scope.removeWidget = function($index)
    {
        $scope.widgets.splice($index, 1);
    };
    
/*******************************************************************************/

/**** Functions only needed for functionality, not interacting with the HTML template are not on the scope ****/
  
     // push a widget to widget array (frontend)    
    function pushWidget(id, listId, templateURL){
        $scope.widgets.push({
            id: id + listId, 
            widgetId: listId, 
            orderPos: $scope.widgets.length, 
            src: templateURL
        });
    };

    // Get data for eventPage from backend
    function readEventData() {

        $http.get(url).success(function(data) {
            console.log("GET http success (sites) - get Event Data");
            $scope.eventTitle = data.data.title;
            $scope.eventDescription = data.data.description;
            $scope.eventCreator = data.data.creator;
        }).error(function() {
            console.warn("GET http error (sites)");
        });
    };

    // Get data for todo lists from backend and add them to frontend
    // this needs to be adjusted when there are more than just todolists to retrieve from backend
    function readTodoLists(){      
         
        var todoListIDs = [];
        $http.get(url + '/todolists').success(function(data) {
            console.log("GET http success (sites) - get todoLists");
            todoListIDs = data.todoLists;
            for (var i = 0, length = todoListIDs.length; i < length; i++)
            {
                pushWidget('todo-widget', todoListIDs[i], todoTemplate );
            };
        }).error(function() {
            console.warn("GET http error (sites) - get todoLists");
        });
    };
    
/*******************************************************************************/   
    
/**** Functions for adjusting the size of the widgets in different viewports, need to be on scope ****/

    $scope.getViewportWidth = function() {
        if ($window.innerWidth < 992)
            return "small";
        else
            return "large";
    };
    
    window.onresize = function() {
        $scope.$apply();
    };
    
    // Watch height of current li (widget) in ul (widget-carousel) and set as height for the ul (widget-carousel)
    $scope.$watch(function() {
        var widgetHeight = $('#do-widget-' + $scope.widgetCarousel.currentWidget).height();
        $('#do-widget-carousel').css("height", widgetHeight);
    });
};
