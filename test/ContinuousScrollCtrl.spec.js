/*global describe, expect, it, beforeEach, ContinuousScrollCtrl*/

describe('ContinuousScrollCtrl', function() {
    'use strict';

    var Model = function() {};
    Model.prototype = {
        title: ''
    };

    var createEl = function(num) {
        var ul = document.createElement('ul');
        var li;
        for (var i = num || 5; i--; ) {
            li = document.createElement('li');
            li.textContent = 'Test Title ' + i;
            ul.appendChild(li);
        }

        ul.setAttribute('style', 'height: 300px; overflow: auto');
        document.body.appendChild(ul);
        return ul;
    };

    it('is defined', function() {
        expect(ContinuousScrollCtrl).toBeDefined();
    });

    it('defaults the properties to null or empty string', function() {
        var target = new ContinuousScrollCtrl();

        expect(target.model).toBe(null);
        expect(target.container).toBe(null);
        expect(target.template).toBe('');
        expect(target.loadModel()).toBe(null);
        expect(target.list).toBe(null);
        expect(target.buffer).toBe(50);
        expect(target.numVisible).toBe(0);
    });

    it('loads the prototype with passed object', function() {
        var element = createEl();
        var options = {
            model: Model,
            container: element,
            template: '<li>{{title}}</li>',
            loadModel: function(element) {
                this.title = element.textContent;
            },
            buffer: 75,
            numVisible: 5
        };
                
        var target = new ContinuousScrollCtrl(options);

        expect(target.model).toBe(options.model);
        expect(target.container).toBe(options.container);
        expect(target.template).toBe(options.template);
        expect(target.loadModel).toBe(options.loadModel);
        expect(target.buffer).toBe(options.buffer);
        expect(target.numVisible).toBe(options.numVisible);

        document.body.removeChild(element);
    });

    describe('.init()', function() {
        var element, options, target;

        beforeEach(function() {
            element = createEl();
            options = {
                model: Model,
                container: element,
                template: '<li>{{title}}</li>',
                loadModel: function(element) {
                    this.title = element.textContent;
                }
            };
                
            target = new ContinuousScrollCtrl(options);
        });

        it('adds elements to the container until page is full', function() {
            target.init();

            expect(element.children.length > 5).toBe(true);
        });

        it('adds elements according to the original list', function() {
            target.init();

            expect(element.children[5].textContent).toEqual(element.children[0].textContent);
            expect(element.children[6].textContent).toEqual(element.children[1].textContent);
        });

        it('adds elements to the bottom of the list when scrolling down', function() {
            target.init();

            var beginHeight = element.scrollHeight;
            element.scrollByLines(10);
            target.check(); // scroll event not firing... ugh
            var endHeight = element.scrollHeight;

            expect((endHeight - beginHeight) > 0).toBe(true);
        });

        it('adds elements to the top of the list when scrolling up', function() {
            target.init();

            element.scrollByLines(10);
            target.check(); // scroll event not firing... ugh
            var beginHeight = element.scrollHeight;
            element.scrollByLines(-10);
            target.check(); // scroll event not firing... ugh
            var endHeight = element.scrollHeight;

            expect((endHeight - beginHeight) > 0).toBe(true);
        });

        it('does not add elements to the top of the list without scrolling up', function() {
            target.init();

            element.scrollByLines(10);
            target.check();

            expect(element.children[0].textContent).toEqual(target.list.first.data.title);
        });
    });

    describe('numVisible', function() {
        var element, options, target;

        beforeEach(function() {
            element = createEl();
            element.setAttribute('style', 'height: 35px; overflow: auto');

            options = {
                model: Model,
                container: element,
                template: '<li>{{title}}</li>',
                loadModel: function(element) {
                    this.title = element.textContent;
                },
                numVisible: 4,
                buffer: 10
            };
                
            target = new ContinuousScrollCtrl(options);
        });

        it('limits the number of elements visible on the page at any time', function() {
            // Need to be careful about the height when we limit elements
            // or we won't be able to scroll
            target.init();

            expect(target.numVisible).toBe(options.numVisible);
            expect(element.children.length).toBe(4);
            expect(element.children[0].textContent).toEqual(target.list.first.data.title);
        });

        it('should create elements on scroll but maintain the correct number of elements', function() {
            target.init();

            element.scrollByLines(10);
            target.check();

            expect(element.children.length).toBe(options.numVisible);
            expect(element.children[3].textContent).toEqual(target.list.first.next.next.next.next.data.title);
        });
    });

    describe('with shiv value', function() {
        var element, options, target, inserted;

        beforeEach(function() {
            element = createEl();
            element.setAttribute('style', 'height: 350px; overflow: auto');

            options = {
                model: Model,
                container: element,
                template: '<li>{{title}}</li>',
                loadModel: function(element) {
                    this.title = element.textContent;
                },
                buffer: 10
            };

            inserted = document.createElement('li');
            inserted.textContent = 'Inserted Element';
        });

        it('inserts element at given position', function() {
            options.shiv = {
                element: inserted,
                position: 2
            };

            target = new ContinuousScrollCtrl(options);
            target.init();

            expect(target.shiv).toBe(options.shiv);
            expect(element.children[2]).toBe(inserted);
        });

        it('runs the callback when shiv is inserted', function() {
            var thisVal;

            options.shiv = {
                element: inserted,
                position: 2,
                createCallback: function() {
                    thisVal = this;
                }
            };

            target = new ContinuousScrollCtrl(options);
            target.init();

            expect(thisVal).toBe(inserted);
        });

        it('inserts element at multiple positions, based on function', function() {
            options.shiv = {
                element: inserted,
                position: function(position) {
                    // 2n + 1
                    return (position - 1) % 2 === 0;
                }
            };

            target = new ContinuousScrollCtrl(options);
            target.init();

            expect(element.children[1].textContent).toEqual(inserted.textContent);
            expect(element.children[3].textContent).toEqual(inserted.textContent);
            expect(element.children[5].textContent).toEqual(inserted.textContent);
            expect(element.children[7].textContent).toEqual(inserted.textContent);
            
            // Check added nodes...
            expect(element.children[9].textContent).toEqual(inserted.textContent, 'Appended');
            expect(element.children[11].textContent).toEqual(inserted.textContent, 'Appended');

            // Check prepended nodes...
            element.scrollByLines(-10);
            target.check();
            expect(element.children[0].textContent).toEqual(inserted.textContent, 'Prepended, first');
            element.scrollByLines(-10);
            target.check();
            element.scrollByLines(-10);
            target.check();
            expect(element.children[0].textContent).toEqual(inserted.textContent, 'Prepended, second');
        });

        it('runs the callback when shiv is inserted based on function', function() {
            var thisVal;

            options.shiv = {
                element: inserted,
                position: function(position) {
                    // 2n + 1
                    return (position - 1) % 2 === 0;
                },
                createCallback: function() {
                    thisVal = this;
                }
            };

            target = new ContinuousScrollCtrl(options);
            target.init();

            expect(thisVal.textContent).toEqual(inserted.textContent);
        });

        it('does not lose track of which element should be inserted when shivving and removing on init', function() {
            element = createEl(30);
            element.setAttribute('style', 'height: 35px; overflow: auto');

            options.container = element;
            options.shiv = {
                element: inserted,
                position: function(position) {
                    // 2n + 1
                    return (position - 1) % 2 === 0;
                }
            };
            options.numVisible = 5;

            target = new ContinuousScrollCtrl(options);
            target.init();

            element.scrollByLines(30);
            target.check();
            element.scrollByLines(30);
            target.check();

            expect(element.children[element.children.length - 1].textContent).toEqual('Test Title 26');
        });

        it('keeps the limit even when removing shivs', function() {
            element = createEl(30);
            element.setAttribute('style', 'height: 35px; overflow: auto');

            options.container = element;
            options.shiv = {
                element: inserted,
                position: function(position) {
                    // 2n + 1
                    return (position - 1) % 2 === 0;
                }
            };
            options.numVisible = 5;

            target = new ContinuousScrollCtrl(options);
            target.init();

            element.scrollByLines(30);
            target.check();
            element.scrollByLines(30);
            target.check();

            expect(element.children.length).toEqual(options.numVisible);
        });
    });
});

