/* 
 * Document	: eventPageE2ETest.js
 * Createt on	: 15.10.2013
 * Author	: Johannes Koelbl <johannes.koelbl88@googlemail.com>
 * Description	: Describes the e2e tests through the event template
 */


describe("eventPage: ", function() {

    beforeEach( function() {
        browser().navigateTo('/index.html');
         
        input('event.creator').enter('Karl');
        input('event.email').enter('Karl@karlheit.de');
        input('event.title').enter('title');
        input('event.description').enter('description');

        element(':button').click();
    });
    
    describe("Comments: ", function() {
        
        it('should load and compile correct template', function() {
            
            //Find on comment template a key word
            var content = element('#comment-widget[data-ng-include]').text();
            expect(content).toMatch(/Comments/);
        });
        
        it('should check if comment submit button is disabled', function() {
            expect(element('#comment-widget :button').prop('disabled')).toBeTruthy();
        });
        
        it('should check if comment submit button is enabled when validation successed', function() {
            input('commentWidget.creator').enter('Karl'); //should be min two chars
            input('commentWidget.content').enter('Example Text'); //should not be empty
            expect(element('#comment-widget :button').prop('disabled')).toBeFalsy();
        });
        
        it('should check if comment will be listed by pushing add button', function() {
            var r = using('#comment-widget').repeater('.do-widget-row');
            expect(r.count()).toBe(1); //form is also a row
            
            input('commentWidget.creator').enter('Karl'); //should be min two chars
            input('commentWidget.content').enter('Example Text'); //should not be empty
            element('#comment-widget :button').click();
            
            r = using('#comment-widget').repeater('.do-widget-row');
            expect(r.count()).toBe(2); //first comment is pushed on frontend
        });
    });
    
    describe("Widgets generally on different window size: ", function() {
        var r,
            windowSize; //different DOM-partial will be included on different window sizes
        
        it('should check if one widget will be already listed', function() {
            windowSize = $(window).width();
            
            if(windowSize < 992)
            {
                r = using('[data-ng-view]').repeater('#do-widget-carousel [data-ng-include]');
                expect(r.count()).toBe(1);
            }
            else
            {
                r = using('[data-ng-view]').repeater('#do-widget-no-carousel [data-ng-include]');
                expect(r.count()).toBe(1);
            }
        });
        
        it('should check if widget will be listed by pushing add button', function() {
            windowSize = $(window).width();
            
            element('#do-create-todo-list').click();
            if(windowSize < 992)
            {
                r = using('[data-ng-view]').repeater('#do-widget-carousel [data-ng-include]');
                expect(r.count()).toBe(2);
            }
            else
            {
                r = using('[data-ng-view]').repeater('#do-widget-no-carousel [data-ng-include]');
                expect(r.count()).toBe(2);
            }
        });
    });
});
