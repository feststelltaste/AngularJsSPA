/* 
 * Document     : schedulingController.js
 * Created on   : 25.07.2013
 * Author       : Christian Wolter christian.wolter.42@gmail.com; Johannes.koelbl88@googlemail.com
 * Description  : Scheduling logic.
 */
angular.module('schedulingWidget').controller('schedulingController', schedulingController);

function schedulingController($scope)
{
    $scope.schedulingName = '';     
    $scope.datePickerDate = null;
    $scope.dateList = {};
    $scope.finalDate = '';
    $scope.totalUsers = [];
    //$scope.id = $scope.widget.widgetId; //TODO: check why widget is undefined while tests

    /* begin add Date */

    $scope.addDate = function()
    {
        var schedulingDate = $scope.datePickerDate;
        if (schedulingDate !== null)
        {
            if (!($scope.checkDateExists()))
            {
                //List with date objects containing the user lists
                $scope.dateList[schedulingDate] = {
                    date: schedulingDate, 
                    positiveUserList: [], 
                    negativeUserList: [], 
                    undecidedUserList: [], 
                    positivePercent: "0%", 
                    negativePercent: "0%", 
                    undecidedPercent: "0%", 
                    //strings with usernames for tooltip
                    positiveUsersString: "", 
                    undecidedUsersString: "", 
                    negativeUsersString: ""
                };
            }
        }
    };

    //Check if date exists to avoid overwriting
    $scope.checkDateExists = function()
    {
        if ($scope.dateList[$scope.datePickerDate] !== undefined)
        {
            return true;
        }
        else
        {
            return false;
        }
    };

    // set aktual date for actual bar
    $scope.setBarDate = function(schedulingDate)
    {
        $scope.barDate = schedulingDate;
    };
    /* end add Date */
    
    /* begin verifing and finding Users */
    
    $scope.checkUserExists = function()
    {
        if ($scope.dateList[$scope.barDate])
        {
            //search user and check if he was found
            var userLocation = findUserInDateObject($scope.barDate);
            if (userLocation.found)
            {
                return true;
            }
            else if (userLocation.found === undefined)
            {
                return false;
            }
            else
            {
                return false;
            }
        }
    };
    /* end verifing and finding Users */

    /* begin adding and removing Users */

    //add user to the choosen list (decision)
    $scope.addUser = function(decision)
    {
        if ($scope.schedulingName.length < 1)
        {
            return;
        }
        $scope.dateList[$scope.barDate][decision+'UserList'].push($scope.schedulingName);
        
        //tooltip string
        $scope.dateList[$scope.barDate][decision+'UsersString'] += $scope.schedulingName + "<br>";
        
        //Update percentage 
        addToTotalUsers();
        $scope.updatePercentage();
    };
    
    $scope.removeUser = function()
    {
        if ($scope.schedulingName.length < 1)
        {
            return;
        }
        
        //find userlocation
        var userLocation = findUserInDateObject($scope.barDate);
        if (userLocation.found)
        {
            //remove User
            $scope.dateList[$scope.barDate][userLocation.decisionList].splice(userLocation.index, 1);
        }

        //update percentage
        removeFromTotalUsers();
        $scope.updatePercentage();
    };
    /* end adding and removing Users */

    /* set the final event date */

    $scope.setFinalDate = function()
    {
        $scope.finalDate = $scope.barDate;
    };

    /*begin: creat a global list of all users to calculate correct procentual values*/
    
    var getTotalUsers = function()
    {
        return $scope.totalUsers.length;
    };
    
    var addToTotalUsers = function()
    {
        // user already in totalUsers?
        if ($scope.totalUsers.length !== 0)
        {
            for(var i = 0; i < $scope.totalUsers.length; i++)
            {
                if ($scope.totalUsers[i] === $scope.schedulingName)
                {
                    return;
                }
            }
        }
        //add user to totalUsers
        $scope.totalUsers.push($scope.schedulingName);
    };
    
    var findUserInDateObject = function(date)
    {
        // search for user and provide his location
        var userLocation = {
            index: '',
            decisionList: '',
            found: false
        };
        var decisionLists = ['positiveUserList', 'negativeUserList', 'undecidedUserList'];
            
        //iterate over all three decisions
        for (var listIndex = 0; listIndex < decisionLists.length; listIndex++)
        {
            //search in concret list in concret DateObject
            for (var i = 0; i < $scope.dateList[date][decisionLists[listIndex]].length; i++)
            {
                if ($scope.schedulingName === $scope.dateList[date][decisionLists[listIndex]][i])
                {
                    userLocation.found = true;
                    userLocation.index = i;
                    userLocation.decisionList = decisionLists[listIndex];
                    
                    break;
                }
            }
        }
        return userLocation;
    };
    
    var removeFromTotalUsers = function()
    {
        //User still existing?
        for (var date in $scope.dateList)
        {
            if (findUserInDateObject(date).found)
            {
                return;
            }
        }
        
        //find name index in total user list
        var indexOfName = 0;
        for (var i = 0; i < $scope.totalUsers.length; i++)
        {
            if ($scope.schedulingName === $scope.totalUsers[i])
            {
                indexOfName = i;
                break;
            }
        }
        //remove name
        $scope.totalUsers.splice(indexOfName, 1);
    };

    /* end: Creat a global list of all users to calculate correct procentual values*/

    /* begin calculate percentage */

    $scope.updatePercentage = function()
    {
        var userSum = getTotalUsers();
        for (var date in $scope.dateList)
        {
            var positiveUserSum = $scope.dateList[date].positiveUserList.length;
            var negativeUserSum = $scope.dateList[date].negativeUserList.length;
            var undecidedUserSum = $scope.dateList[date].undecidedUserList.length;
            
            calculateSpecificPercentage(positiveUserSum, userSum, date, 'positivePercent');
            calculateSpecificPercentage(negativeUserSum, userSum, date, 'negativePercent');
            calculateSpecificPercentage(undecidedUserSum, userSum, date, 'undecidedPercent');
        }
    };

    var calculateSpecificPercentage = function(specificUserSum, userSum, date, specificChoice)
    {
        var userRatio = specificUserSum / userSum,
            percent = userRatio * 100;
        $scope.dateList[date][specificChoice] = percent + "%";
    };
    /* end calculate percentage */
}
;
