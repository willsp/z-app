(function(global) {
    'use strict';

    var readElement = function(element) {
        var img = element.getElementsByTagName('img')[0];
        var time = element.getElementsByTagName('time')[0];

        var out = {
            title: element.getElementsByTagName('h2')[0].textContent,
            img: {
                src: img.getAttribute('src'),
                alt: img.getAttribute('alt')
            },
            time: {
                datetime: time.getAttribute('datetime'),
                text: time.textContent
            }
        };

        return out;
    };

    global.readElement = readElement;
}(window));
