/*global describe, it, expect, afterEach, beforeEach, readElement*/

describe('readElement', function() {
    'use strict';

    it('is defined', function() {
        expect(readElement).toBeDefined();
    });

    describe('loads the passed element and', function() {
        var title = 'Title of Item';
        var imgSrc = 'img.jpg';
        var imgAlt = 'alt text';
        var timeDatetime = '2014-05-31';
        var timeText = 'May 31, 2015';
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

        it('sets title property of output object to .contents>h2', function() {
            var target = readElement(el);

            expect(target.title).toEqual(title);
        });

        it('sets img.src property of output object to img[src]', function() {
            var target = readElement(el);

            expect(target.img.src).toEqual(imgSrc);
        });

        it('sets img.alt property of output object to img[alt]', function() {
            var target = readElement(el);

            expect(target.img.alt).toEqual(imgAlt);
        });

        it('sets time.datetime property of output object to time[datetime]', function() {
            var target = readElement(el);

            expect(target.time.datetime).toEqual(timeDatetime);
        });

        it('sets time.text property of output object to time text content', function() {
            var target = readElement(el);

            expect(target.time.text).toEqual(timeText);
        });
    });
});
