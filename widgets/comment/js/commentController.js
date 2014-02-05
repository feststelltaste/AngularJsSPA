/* 
 * Document	: commentController.js
 * Created on	: 25.07.2013
 * Author	: Johannes Koelbl <johannes.koelbl88@googlemail.com>
 * Description	: Comment widget logic.
 */
angular.module('commentWidget').controller('commentController', commentController);

function commentController($scope, $http, globalVariables, $routeParams, notifications){

/**** Initiating scope variables and all necessary data for this controller ****/
    // create correct backend URL
    var url = globalVariables.getBackendURL() + 'sites/' + $routeParams.eventId;
	
	// comment Array that holds all necessary information
    $scope.commentWidget = {
        content : '',
        creator : '',
        comments : [],
        predicate : '-createdAt'
    };
   
    //get all comments while site reloads
    readComments();

/*******************************************************************************/

/**** Frontend functions interacting with the HTML template are on the scope ****/	
	
    //add a new comment
    $scope.addComment = function(){
        var commentBackend = {
            creator: $scope.commentWidget.creator,
            content: $scope.commentWidget.content
        };
        
        pushCommentToBackend(commentBackend);
    };
    
/*******************************************************************************/

/**** Functions only needed for functionality, not interacting with the HTML template are not on the scope ****/
    
    function pushCommentToFrontend(comment){
        //push new comment to frontend
        $scope.commentWidget.comments.push(comment);
        
        //clear input variables
        clearVariables();
    };
    
    function pushCommentToBackend(comment){
        $http({
            method: 'POST', 
            url: url + '/comments', 
            data: $.param(comment)
        }).success(function(data){
            console.log("POST http success (comments)");
            // extract since and id from comment
            comment.since = { formated: data.comment.since.formated };
            comment.id = data.comment.id;
            comment.creator = data.comment.creator;
            comment.content = data.comment.content;
            
            pushCommentToFrontend(comment);
        }).error(function(){
            //call alert
            notifications.call("Unable to push comment.");
            console.error("POST http error (comments)");
        }); 
    }
    
    function clearVariables(){
        $scope.commentWidget.content = '';
        $scope.commentWidget.creator = '';
    };
    
    //get all comments from server
    function readComments() {    
        
        $http({
            method: 'GET', 
            url: url + '/comments'
        }).success(function(data)
        {        
            console.log("GET http success (comments) - get comments"); 
            $scope.commentWidget.comments = data.comments;
        }).error(function(data, status, headers, config) 
        {
            //call alert
            notifications.call("Unable to load comments.");
            console.error("GET http error (comments)");
        });
    };
};
