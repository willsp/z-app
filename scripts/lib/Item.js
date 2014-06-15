(function(global) {
    'use strict';

    var Item = function() {
        var me = this;

        this.img = {
            src: '',
            alt: ''
        };

        // These need to be here, otherwise,
        // they don't get picked up as hasOwn...
        this.publishedText = function() {
            var pub = me.published;

            return months[pub.getMonth()] + 
                ' ' + pub.getDate() + 
                ', ' + pub.getFullYear();
         };

         this.publishedISO = function() {
             return me.published.toISOString();
         };
    };

    Item.prototype = {
        featured: '',
        title: '',
        published: null
    };

    Item.prototype.fromElement = function(element) {
        var h2 = element.getElementsByTagName('h2')[0];
        var img = element.getElementsByTagName('img')[0];
        var date = element.getElementsByTagName('time')[0];
        var featured = element.classList.contains('featured');

        this.title = h2.textContent;
        this.img.src = img.getAttribute('src');
        this.img.alt = img.getAttribute('alt');
        this.featured = featured ? 'featured' : '';
        this.published = new Date(date.getAttribute('datetime'));
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
