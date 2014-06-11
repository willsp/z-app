(function(global) {
    'use strict';

    var Item = function() {};

    Item.prototype = {
        featured: false,
        title: '',
        published: null,
        img: {
            src: '',
            alt: ''
        },
        publishedText: function() {
            var pub = this.published;

            return months[pub.getMonth()] + 
                ' ' + pub.getDate() + 
                ', ' + pub.getFullYear();
         },
         publishedISO: function() {
             return this.published.toISOString();
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
        item.featured = elClass && elClass.indexOf('featured') > -1;
        item.published = new Date(date.getAttribute('datetime'));

        return item;
    };

    var months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    global.Item = Item;
}(window));
