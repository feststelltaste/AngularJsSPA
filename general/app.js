/* 
 * Document     : app.js
 * Created on   : 28.07.2013
 * Author       : Johannes Koelbl <johannes.koelbl88@googlemail.com>, Sandra Bergmeir <sandrabergmeir@gmail.com>
 * Description  : Defining modules, global http settings, global variables and directives.
 */

// Define all your modules with no dependencies
angular.module('todoWidget', []);
angular.module('schedulingWidget', []);
angular.module('commentWidget', []);
angular.module('eventPage', []);
angular.module('startPage', []);
angular.module('customServices', []);

// Lastly, define your "main" module and inject all other modules as dependencies
angular.module('mainApp',
    [
        'ngSanitize',
        'angular-carousel',
        'startPage',
        'todoWidget',
        'schedulingWidget',
        'commentWidget',
        'eventPage',
        'customServices'
    ]
).config(['$httpProvider', function($httpProvider) {
    // global definition of POST header content type  
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // global definition of PUT header content type
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/json';
    // global defintion for $http requests: accepted content type
    $httpProvider.defaults.headers.common['Accept'] = 'application/json';
    }]
).directive('contenteditable', function() {
    return {
        //directive contenteditable is required to change text with ng-repeat lists
        //without this directive it does not work in lists
        //see: http://jsfiddle.net/blingz/B5UbE/12/
        require: 'ngModel',
        link: function(scope, el, attr, ngModelCtrl) {
            // view -> model
            el.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(el.html());
                });
            });

            // model -> view
            ngModelCtrl.$render = function() {
                el.html(ngModelCtrl.$viewValue);
            };
        }
    };
}).directive('ngModelOnblur', function() {
    return {
        //required for calling change-function while leave the target DOM element with cursor,
        //when content is changed
        //see: http://jsfiddle.net/cn8VF/144/
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, el, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox')
                return;

            el.unbind('input').unbind('keydown').unbind('change');
            el.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(el.html()); //change "html()" into "val()" for using input instead div
                });
            });
        }
    };
}).directive('ngDatepicker', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attr, ngModelCtrl) {
            $(el).datepicker({
                format: "mm/dd/yy",
                weekStart: 0,
                autoclose: true,
                todayHighlight: true
            });

            //update model with new/changed date
            el.on('change', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(el.val());
                });
            });
        }
    };
});

//see: http://docs.angularjs.org/guide/dev_guide.services.creating_services
var customServices = angular.module('customServices', []);
customServices.factory('globalVariables', globalVariables);
customServices.factory('notifications', notifications);

function globalVariables()
{
    var backendURL = 'http://backendstaging.hwhlabs.cloudbees.net/';

    return {
        getBackendURL : function() {
            return backendURL;
        }
    };
}

function notifications()
{
    var element = $(".alert"),
        elementWidth, winWidth,
        doRunOnce = true;

    function alert(msg)
    {
        element.children()[1].innerHTML = " "+msg;

        if(doRunOnce)
        {
            window.addEventListener('resize', positionateNotification);
            doRunOnce = false;
        }
        
        function positionateNotification()
        {
            elementWidth = element.outerWidth();
            winWidth = $(window).width();
            element.css("left", (winWidth/2) - (elementWidth/2)+"px");   
        }
        
        //set position to center
        positionateNotification();

        element.removeClass("visible");
        setTimeout(function()
        {
            element.addClass("visible");
        }, 0);
    }
    
    return {
        call : function(msg) {
            alert(msg);
        }
    };
}