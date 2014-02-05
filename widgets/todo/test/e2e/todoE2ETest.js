/* 
 * Document	: todoE2ETest.js
 * Createt on	: 15.10.2013
 * Author	: Johannes Koelbl <johannes.koelbl88@googlemail.com>
 * Description	: Describes the e2e tests of todo widget.
 */


describe("Todo Widget: ", function() {

    beforeEach( function() {
        browser().navigateTo('/index.html');
         
        input('event.creator').enter('Karl');
        input('event.email').enter('Karl@karlheit.de');
        input('event.title').enter('title');
        input('event.description').enter('description');

        //create event page
        element(':button').click();
        
        //create todo widget for testing
        element('#do-create-todo-list').click();
    });
    
    it('should check if todo add button is disabled', function() {
        expect(element('#todo-widget0 .do-btn-primary').prop('disabled')).toBeTruthy();
    });
    
    it('should check if todo add button is enabled when validation successed', function() {
        input('todoWidget.todoText').enter('Karl'); //should be min two chars
        expect(element('#todo-widget0 .do-btn-primary').prop('disabled')).toBeFalsy();
    });

    describe("Todo list: ", function() {
        var r;
        
        beforeEach( function() {
            r = using('#todo-widget0').repeater('tbody tr');
        });
        
        it('should check if todo list is initially be empty', function() {
            expect(r.count()).toBe(1); //first row is the form row 
        });
        
        it('should check if todo list is increasing while enabled add button is pushed', function() {
            input('todoWidget.todoText').enter('example'); //should be min two chars
            element('#todo-widget0 .do-btn-primary').click();
            
            expect(r.count()).toBe(2);
        });
        
        it('should update repeater when filter predicate changes', function() {
            expect(r.count()).toBe(1); //first row is the form row 
            
            //add two todos to list
            input('todoWidget.todoText').enter('abc');
            element('#todo-widget0 .do-btn-primary').click();
            input('todoWidget.todoText').enter('xyz');
            element('#todo-widget0 .do-btn-primary').click();
            
            expect(r.count()).toBe(3);

            input('search').enter('abc');

            expect(r.count()).toBe(2);
        });
        
        it('should update repeater when filter options will be pushed', function() {
            expect(r.count()).toBe(1); //first row is the form row 
            
            //add three todos to list
            input('todoWidget.todoText').enter('abc');
            element('#todo-widget0 .do-btn-primary').click();
            input('todoWidget.todoText').enter('efg');
            element('#todo-widget0 .do-btn-primary').click();
            input('todoWidget.todoText').enter('xyz');
            element('#todo-widget0 .do-btn-primary').click();
            
            expect(r.count()).toBe(4);

            //check two checkboxes
            using('#todo-widget0 table:visible tbody tr:eq(1) td:eq(0)').input("todo.done").check();
            using('#todo-widget0 table:visible tbody tr:eq(2) td:eq(0)').input("todo.done").check();

            //switch filter to "Done"
            input('$parent.todoWidget.switchTodos').select('true');
            expect(using('#todo-widget0').repeater('tbody tr:visible').count()).toBe(3);
            
            //switch filter to "Todo"
            input('$parent.todoWidget.switchTodos').select('false');
            expect(using('#todo-widget0').repeater('tbody tr:visible').count()).toBe(2);
        });
    });
});