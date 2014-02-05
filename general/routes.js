/*
* Document      : routes.js
* Created on    : 28.07.2013
* Author        : Johannes Koelbl <johannes.koelbl88@googlemail.com>, Sandra Bergmeir <sandrabergmeir@gmail.com>
* Description   : Defining routes.
*/

// Homepage injection, tells the routeProvider (ngView) which page to load first and which controller to use
angular.module('mainApp').config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'startPage/views/startView.html',
            controller: startController
        })
        // Eventpage injection, tells the routeProvider which page to load/controller to use
        .when('/:eventId', {
            templateUrl: 'eventPage/views/eventView.html',
            controller: eventController }).
            otherwise({redirectTo: '/' // if no such page exists, routeProvider will redirect to Homepage
        });
    }]
);