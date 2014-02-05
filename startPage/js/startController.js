/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

angular.module('startPage').controller('startController', startController);

function startController($scope, $http, $location, globalVariables){
    
/**** Initiate scope variables ****/    
    $scope.event = {
        creator : '',
        title : '',
        description : '',
        email : ''
    }; 
    var eventId;    
/*******************************************************************************/

/**** Create page on backend and get siteName (eventId) for URL and routes ****/
    $scope.createEvent = function(){    
        
        var dataToSend = $.param({
            title: $scope.event.title,
            description: $scope.event.description,
            creator: $scope.event.creator        
        }); 
        
        $http({
            method: 'POST', 
            url: globalVariables.getBackendURL() + 'sites', 
            data: dataToSend
        }).success(function(data) {
            // save eventId (siteName from server)
            eventId = data.actuallyCreatedSite.name;
            // hand it over to routes.js and add it to the URL
            $location.path(eventId);                   
        }).error(function() {
            console.warn("POST http error (sites)");
            notifications.call("Creating a new page wasn't possible."); 
        });
    };
}
