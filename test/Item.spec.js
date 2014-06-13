/*global describe, expect, it, beforeEach, afterEach, Item*/

describe('Item', function() {
    'use strict';

    var title = 'Title of Item';
    var imgSrc = 'img.jpg';
    var imgAlt = 'alt text';
    var timeDatetime = '2014-05-31T07:00:00.000Z';
    var timeText = 'May 31, 2014';

    it('is defined', function() {
        expect(Item).toBeDefined();
    });

    it('defaults all properties to empty strings', function() {
        var target = new Item();

        expect(target.featured).toEqual('');
        expect(target.title).toEqual('');
        expect(target.img.src).toEqual('');
        expect(target.img.alt).toEqual('');
        expect(target.published).toBe(null);
    });

    it('returns the properly formatted string for publishedText()', function() {
        var target = new Item();
        target.published = new Date(timeText);

        expect(target.publishedText()).toEqual(timeText);
    });

    it('returns the ISO formatted date string for publishedISO()', function() {
        var target = new Item();
        target.published = new Date(timeText);

        expect(target.publishedISO()).toEqual(timeDatetime);
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
            var target = new Item();

            expect(target.fromElement).toBeDefined();
        });

        it('sets title property of output Item to .contents>h2', function() {
            var target = new Item();
            target.fromElement(el);

            expect(target.title).toEqual(title);
        });

        it('sets img.src property of output object to img[src]', function() {
            var target = new Item();
            target.fromElement(el);

            expect(target.img.src).toEqual(imgSrc);
        });

        it('sets img.alt property of output object to img[alt]', function() {
            var target = new Item();
            target.fromElement(el);

            expect(target.img.alt).toEqual(imgAlt);
        });

        it('sets published property of output object to date from time[datetime]', function() {
            var target = new Item();
            target.fromElement(el);
            var expected = new Date(timeDatetime);

            expect(target.published).toEqual(expected);
        });

        it('sets featured property to featured when a featured class is present on element', function() {
            el.setAttribute('class', 'featured');

            var target = new Item();
            target.fromElement(el);

            expect(target.featured).toEqual('featured');
        });
    });
});
