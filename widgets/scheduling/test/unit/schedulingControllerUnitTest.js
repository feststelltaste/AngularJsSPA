/* 
 * Document : schedulingcontrollerUnitTest.js
 * Created on : 25.07.2013
 * Author : Christian Wolter christian.wolter.42@gmail.com, Johannes Koelbl <johannes.koelbl88@googlemail.com>
 * Description : Testfile for schedulingController
 */

describe("schedulingController", function() {
    var scope, controller;

    beforeEach(module('mainApp'));
    beforeEach(inject(function ($controller, $rootScope) 
    {       
        scope = $rootScope.$new(); 
        controller = $controller(schedulingController, {
            $scope: scope 
        });        
    }));
    
    it('should set barDate to schedulingDate', function() {
        scope.schedulingDate = '2012-09-01';
        scope.setBarDate(scope.schedulingDate);
        
        expect(scope.barDate).toBe(scope.schedulingDate);
    });
    
    it('should set final Date', function() {
    	scope.barDate = 'testDate';
    	scope.setFinalDate();
    	
    	expect(scope.finalDate).toBe('testDate');
    }); 

    describe('date list', function() {
        beforeEach(function() {
            scope.datePickerDate = '10/09/2013';
            scope.setBarDate(scope.datePickerDate);
        });
        
        it('should check if date exists', function() {
            //date does not exist
            expect(scope.checkDateExists()).toBeFalsy();

            //date exists
            var dateObj = {
                date: '10/09/2013', 
                positiveUserList: [], 
                negativeUserList: [], 
                undecidedUserList: [], 
                positivePercent: "0%", 
                negativePercent: "0%", 
                undecidedPercent: "0%"
            };	
            scope.dateList['10/09/2013'] = dateObj;
            
            expect(scope.checkDateExists()).toBeTruthy();
        });
        
        it('should add date to dateList', function() {
            scope.addDate();
            
            expect(Object.keys(scope.dateList).length).toBe(1);
        });
        
        describe('user lists', function() {
        	
            beforeEach(function() {
                var dateObj = {
                    date: scope.barDate, 
                    "positiveUserList":[] , 
                    "negativeUserList":[] , 
                    "undecidedUserList":[] , 
                    positivePercent: "0%" , 
                    negativePercent: "0%" , 
                    undecidedPercent: "0%"
                };

                scope.barDate = '10/09/2013';
                scope.dateList['10/09/2013'] = dateObj;
                scope.schedulingName = 'Horst';
            });

            it('should check wether user exists', function() {
                //user does not exist
                expect(scope.checkUserExists()).toBeFalsy();
                
                //user exists
                scope.dateList['10/09/2013'].positiveUserList.push('Horst');
                expect(scope.checkUserExists()).toBeTruthy();
            });
        });
        
        describe('add and remove of users', function() {
            
            var oldLength, newLength;
            beforeEach(function() {
            	var dateObj = {
                    date: scope.barDate, 
                    "positiveUserList":[] , 
                    "negativeUserList":[] , 
                    "undecidedUserList":[] , 
                    positivePercent: "0%" , 
                    negativePercent: "0%" , 
                    undecidedPercent: "0%"
                };
            	
                scope.dateList[scope.barDate] = dateObj;
                scope.schedulingName = 'Horst';
            });
            
            it('should add username to positive users', function() {
            	//mocking function
            	spyOn(scope, 'checkUserExists').andCallFake(function(){
                    return false;
            	});
            	
                oldLength = scope.dateList[scope.barDate].positiveUserList.length;
                scope.addUser('positive');
                newLength = scope.dateList[scope.barDate].positiveUserList.length;
                expect(newLength).toBeGreaterThan(oldLength);
            });

            it('should remove username from positive users', function() {
                scope.dateList[scope.barDate].positiveUserList.push(scope.schedulingName);
                oldLength = scope.dateList[scope.barDate].positiveUserList.length;
                scope.removeUser();
                newLength = scope.dateList[scope.barDate].positiveUserList.length;
                
                expect(newLength).toBeLessThan(oldLength);
            });

            it('should calculate percentage for bars', function() {
                scope.addUser('positive'); //add Horst
                
                scope.schedulingName = 'Willy';
                scope.addUser('negative');
                
                scope.updatePercentage();
                expect(scope.dateList[scope.barDate].positivePercent).toEqual(scope.dateList[scope.barDate].negativePercent);
                expect(scope.dateList[scope.barDate].positivePercent).toEqual('50%');
                expect(scope.dateList[scope.barDate].negativePercent).toEqual('50%');
            });
        });
    });
});