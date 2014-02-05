/* 
 * Document	: schedulingE2ETest.js
 * Createt on	: 04.11.2013
 * Author	: Johannes Koelbl <johannes.koelbl88@googlemail.com>
 * Description	: Describes the e2e tests of scheduling widget.
 */

describe("Scheduling Widget: ", function() {

    beforeEach( function() {
        browser().navigateTo('/index.html');
         
        input('event.creator').enter('Karl');
        input('event.email').enter('Karl@karlheit.de');
        input('event.title').enter('title');
        input('event.description').enter('description');

        //create event page
        element(':button').click();
        
        //scheduling widget initially already exists
    });
    
    it('should check if scheduling data add button is disabled', function() {
        expect(element('.scheduling-widget .do-btn-primary').prop('disabled')).toBeTruthy();
    });
    
    it('should check if scheduling data add button is enabled when validation successed', function() {
        input('datePickerDate').enter('01/01/2013');
        expect(element('.scheduling-widget .do-btn-primary').prop('disabled')).toBeFalsy();
    });
    
    describe("Scheduling bar list: ", function() {
    	var r;
        
        beforeEach( function() {
            r = using('.scheduling-widget').repeater('.do-widget-row.voting-result-bars');
        });
        
        it('should check if scheduling bar list is initially be empty', function() {
            expect(r.count()).toBe(0);
        });
        
        it('should check if scheduling data list is increasing while enabled add button is pushed', function() {
        	input('datePickerDate').enter('01/01/2013');
        	element('.scheduling-widget .do-btn-primary').click();
            
            expect(r.count()).toBe(1);
        });
    });
    
    describe("modal dialog: ", function() {
    	var pos;
        
        beforeEach( function() {
            input('datePickerDate').enter('01/01/2013');
            //add date
        	element('.scheduling-widget .do-btn-primary').click();
        	
        	pos = using('.scheduling-widget').repeater('ul.user-list li');
        	
        	//click bar
        	element('.scheduling-widget a.do-bar').click();
        });
        
        it('should check if positive name list is increasing while add button is pushed', function() {
        	input('schedulingName').enter('Karl');
        	element('.scheduling-widget .btn-success').click();
        	expect(pos.count()).toBe(1);
        	
        	input('schedulingName').enter('Karli');
        	element('.scheduling-widget .btn-success').click();
        	expect(pos.count()).toBe(2);
        	
        	//list does not allow similar names
        	input('schedulingName').enter('Karl');
        	element('.scheduling-widget .btn-success').click();
        	expect(pos.count()).toBe(2);
        });
        
        it('should check if add button is disabled when input field has an already existing name', function() {
        	input('schedulingName').enter('Karl');
        	element('.scheduling-widget .btn-success').click();
        	
        	input('schedulingName').enter('Karl');
        	expect(element('.scheduling-widget .btn-success').prop('disabled')).toBeTruthy();
        	expect(pos.count()).toBe(1);
        });
    });
});