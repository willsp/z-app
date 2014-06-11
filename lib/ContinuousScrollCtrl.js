/*global LinkedList, renderTemplate*/

(function(global) {
    'use strict';

    var current;
    var ContinuousScrollCtrl = function(opts) {
        if (opts) {
            for (var prop in opts) {
                if (opts.hasOwnProperty(prop)) {
                    this[prop] = opts[prop];
                }
            }
        }
    };

    ContinuousScrollCtrl.prototype = {
        model: null,
        container: null,
        template: '',
        loadModel: function() { return null; },
        list: null
    };

    ContinuousScrollCtrl.prototype.init = function() {
        var children = this.container.children;
        var datum;
        this.list = new LinkedList({
            circular: true
        });

        for (var i = 0, max = children.length; i < max; i++) {
            datum = new this.model();
            this.loadModel.call(datum, children[i]);
            this.list.add(datum);
        }

        current = this.list.first;
        //var me = this;
        window.addEventListener('scroll', function() {
            //me.check();
        });

        this.check();
    };

    ContinuousScrollCtrl.prototype.check = function() {
        while (window.innerHeight + document.body.scrollTop > document.body.offsetHeight) {
            this.container.insertAdjacentHTML('beforeend', renderTemplate(this.template, current.data));
            current = current.next;
        }
    };

    global.ContinuousScrollCtrl = ContinuousScrollCtrl;
}(window));

