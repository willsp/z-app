(function(global) {
    'use strict';

    var app = global.app = global.app || {};

    function Controller(init) {
        if (init && init.app) {
            this.app = init.app;
        }
    }

    Controller.prototype.loadModel = function(opts) {
        var source = opts.source;
        var app = this.app;
        var model = this.model;

        
    };

    app.controller = new Controller({
        app: app
    });
}(window));
