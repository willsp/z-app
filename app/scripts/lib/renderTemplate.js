(function(global) {
    'use strict';

    var renderTemplate = function(corpus, data) {
        var out = corpus;

        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                var expression = new RegExp('{{' + prop + '(?:\\.(\\w+))?}}', 'g');
                var part, replacement, i, max;

                while ((part = expression.exec(corpus)) !== null) {
                    replacement = data[prop];
                    for (i = 1, max = part.length; i < max; i++) {
                        replacement = (part[i]) ? replacement[part[i]] : replacement;
                    }

                    out = out.replace(part[0], replacement);
                }
            } 
        }

        return out;
    };

    global.renderTemplate = renderTemplate;
}(window));

