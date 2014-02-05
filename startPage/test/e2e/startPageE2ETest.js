/* 
 * Document	: startPageE2ETest.js
 * Createt on	: 11.10.2013
 * Author	: Johannes Koelbl <johannes.koelbl88@googlemail.com>
 * Description	: Describes the e2e test for sign in.
 */

describe("startPage: ", function() {

    beforeEach( function() {
         browser().navigateTo('/index.html'); 
    });
    
    it('should redirect index.html to index.html#/', function() {
        expect(browser().location().url()).toBe('/');
        
        //Find on new template a key word
        var content = element('[data-ng-view]').text();
        expect(content).toMatch(/Live your Event!/);
    }); 
    
    it('should check if submit button is disabled', function() {
        expect(element('#create-event').prop('disabled')).toBeTruthy();
    });

    it('should check if submit button is enabled when validation successed', function() {
        input('event.creator').enter('Karl');
        input('event.email').enter('Karl@karlheit.de');
        input('event.title').enter('title');
        input('event.description').enter('description');
        
        expect(element('#create-event').prop('disabled')).toBeFalsy();
    });
    
    it('should load and compile correct template', function() {
        input('event.creator').enter('Karl');
        input('event.email').enter('Karl@karlheit.de');
        input('event.title').enter('title');
        input('event.description').enter('description');
        
        element(':button').click();
        expect(browser().location().url()).not().toBe('/');
        
        //Find on new template a key word
        var content = element('[data-ng-view]').text();
        expect(content).toMatch(/Comments/);
    });
});
