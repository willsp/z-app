/*global describe, expect, it, xit, beforeEach, afterEach, ContinuousScrollCtrl*/

describe('ContinuousScrollCtrl', function() {
    'use strict';

    var Model = function() {};
    Model.prototype = {
        title: ''
    };

    var createEl = function() {
        var ul = document.createElement('ul');
        var li;
        for (var i = 5; i--; ) {
            li = document.createElement('li');
            li.textContent = 'Test Title ' + i;
            ul.appendChild(li);
        }

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
    });

    it('loads the prototype with passed object', function() {
        var element = createEl();
        var options = {
            model: Model,
            container: element,
            template: '<li>{{title}}</li>',
            loadModel: function(element) {
                this.title = element.textContent;
            }
        };
                
        var target = new ContinuousScrollCtrl(options);

        expect(target.model).toBe(options.model);
        expect(target.container).toBe(options.container);
        expect(target.template).toBe(options.template);
        expect(target.loadModel).toBe(options.loadModel);

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

        afterEach(function() {
            document.body.removeChild(element);
        });

        // Need to rework this work with phantom... testing in other browsers is too slow.
        xit('loads a linked list with the DOM children', function() {
            target.init();

            var first = target.list.first;
            expect(first.data.title).toEqual(element.children[0].textContent);
            expect(first.next.data.title).toEqual(element.children[1].textContent);
            expect(target.list.last.data.title).toBe(element.children[4].textContent);
        });

        xit('adds elements to the container until page is full', function() {
            target.init();

            expect(element.children.length > 5).toBe(true);
        });

        xit('adds elements according to the original list', function() {
            target.init();

            expect(element.children[5].textContent).toEqual(element.children[0].textContent);
            expect(element.children[6].textContent).toEqual(element.children[1].textContent);
        });

        xit('adds elements to the bottom of the list when scrolling down', function() {
            target.init();

            var beginHeight = window.innerHeight;
            window.scrollBy(0, element.children[0].offsetHeight * 2);
            var endHeight = window.innerHeight;

            expect((endHeight - beginHeight) > 0).toBe(true);
        });
    });
});

