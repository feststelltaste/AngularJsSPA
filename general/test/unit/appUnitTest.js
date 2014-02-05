/* 
 * Document	:   appUnitTest.js
 * Createt on	:   10.10.2013
 * Author	:   Johannes Koelbl <johannes.koelbl88@googlemail.com>
 * Description	:   Test file to see that the module is there and it works. 
 *                  Also to see if the dependencies are set for the module.
 */


describe("Testing Modules", function() {
    describe("mainApp Module:", function() {

        var module;
        beforeEach(function() {
            module = angular.module("mainApp");
        });

        it("should be registered", function() {
            expect(module).not.toBeNull();
        });

        describe("Dependencies:", function() {

            var deps,
            	hasModule = function(m) {
                return deps.indexOf(m) >= 0;
            };
            beforeEach(function() {
                deps = module.requires;
            });

            it("should have mainApp.startPage as a dependency", function() {
                expect(hasModule('startPage')).toEqual(true);
            });
            
            it("should have mainApp.todoWidget as a dependency", function() {
                expect(hasModule('todoWidget')).toEqual(true);
            });
            
            it("should have mainApp.schedulingWidget as a dependency", function() {
                expect(hasModule('schedulingWidget')).toEqual(true);
            });
            
            it("should have mainApp.commentWidget as a dependency", function() {
                expect(hasModule('commentWidget')).toEqual(true);
            });
            
            it("should have mainApp.eventPage as a dependency", function() {
                expect(hasModule('eventPage')).toEqual(true);
            });
            
            it("should have mainApp.customServices as a dependency", function() {
                expect(hasModule('customServices')).toEqual(true);
            });
            
            it("should have mainApp.customServices as a dependency", function() {
                expect(hasModule('ngSanitize')).toEqual(true);
            });
        });
    });
});