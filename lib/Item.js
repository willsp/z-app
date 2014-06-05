(function(global) {
    'use strict';

    var Item = function() {};

    Item.prototype = {
        featured: false,
        title: '',
        img: {
            src: '',
            alt: ''
        },
        time: {
            datetime: '',
            text: ''
        }
    };

    Item.fromElement = function(element) {
        var item = new Item();
        var h2 = element.getElementsByTagName('h2')[0];
        var img = element.getElementsByTagName('img')[0];
        var date = element.getElementsByTagName('time')[0];
        var elClass = element.getAttribute('class');

        item.title = h2.textContent;
        item.img.src = img.getAttribute('src');
        item.img.alt = img.getAttribute('alt');
        item.time.datetime = date.getAttribute('datetime');
        item.time.text = date.textContent;
        item.featured = elClass && elClass.indexOf('featured') > -1;

        return item;
    };

    Item.prototype.toElement = function() {
    };

    global.Item = Item;
}(window));
