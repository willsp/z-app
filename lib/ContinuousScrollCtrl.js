/*global LinkedList, renderTemplate*/

(function(global) {
    'use strict';

    var bottom, top;
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

        bottom = this.list.last;
        top = this.list.first;
        var me = this;
        window.addEventListener('scroll', function() {
            me.check();
        });

        this.check();
    };

    ContinuousScrollCtrl.prototype.check = function() {
        var el = this.container;
        var buffer = 50;
        while (el.scrollHeight - el.scrollTop - buffer < el.offsetHeight) {
            bottom = bottom.next;
            el.insertAdjacentHTML('beforeend', renderTemplate(this.template, bottom.data));
        }

        while (el.scrollTop < buffer) {
            top = top.previous;
            el.insertAdjacentHTML('afterbegin', renderTemplate(this.template, top.data));
            el.scrollTop = el.scrollTop + el.children[0].offsetHeight; 
        }
    };

    global.ContinuousScrollCtrl = ContinuousScrollCtrl;
}(window));

