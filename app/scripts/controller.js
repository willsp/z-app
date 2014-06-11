(function(global) {
    'use strict';

    var app = global.app = global.app || {};

    function Controller(init) {
        if (init && init.app) {
            this.app = init.app;
        }
    }

}(window));
