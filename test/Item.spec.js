/*global describe, expect, it, beforeEach, afterEach, Item*/

describe('Item', function() {
    'use strict';

    var title = 'Title of Item';
    var imgSrc = 'img.jpg';
    var imgAlt = 'alt text';
    var timeDatetime = '2014-05-31';
    var timeText = 'May 31, 2015';

    it('is defined', function() {
        expect(Item).toBeDefined();
    });

    it('defaults all properties to empty strings', function() {
        var target = new Item();

        expect(target.featured).toBe(false);
        expect(target.title).toEqual('');
        expect(target.img.src).toEqual('');
        expect(target.img.alt).toEqual('');
        expect(target.time.datetime).toEqual('');
        expect(target.time.text).toEqual('');
    });

    describe('.fromElement()', function() {
        var el;

        var createElement = function() {
            var element = document.createElement('div');
            var img = document.createElement('img');
            var contents = document.createElement('div');
            var h2 = document.createElement('h2');
            var time = document.createElement('time');
            
            img.setAttribute('src', imgSrc);
            img.setAttribute('alt', imgAlt);

            contents.setAttribute('class', 'contents');

            h2.textContent = title;

            time.setAttribute('datetime', timeDatetime);
            time.textContent = timeText;

            contents.appendChild(h2);
            contents.appendChild(time);

            element.appendChild(img);
            element.appendChild(contents);

            return element;
        };

        beforeEach(function() {
            el = createElement();
        });

        afterEach(function() {
            el = undefined;
        });
        
        it('is defined', function() {
            expect(Item.fromElement).toBeDefined();
        });

        it('sets title property of output Item to .contents>h2', function() {
            var target = Item.fromElement(el);

            expect(target.title).toEqual(title);
        });

        it('sets img.src property of output object to img[src]', function() {
            var target = Item.fromElement(el);

            expect(target.img.src).toEqual(imgSrc);
        });

        it('sets img.alt property of output object to img[alt]', function() {
            var target = Item.fromElement(el);

            expect(target.img.alt).toEqual(imgAlt);
        });

        it('sets time.datetime property of output object to time[datetime]', function() {
            var target = Item.fromElement(el);

            expect(target.time.datetime).toEqual(timeDatetime);
        });

        it('sets time.text property of output object to time text content', function() {
            var target = Item.fromElement(el);

            expect(target.time.text).toEqual(timeText);
        });

        it('sets featured property to true when a featured class is present on element', function() {
            el.setAttribute('class', 'featured');

            var target = Item.fromElement(el);

            expect(target.featured).toBe(true);
        });
    });
});
