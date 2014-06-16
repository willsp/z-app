/*global LinkedList, renderTemplate*/

(function(global) {
    'use strict';

    var ContinuousScrollCtrl = function(opts) {
        if (opts) {
            for (var prop in opts) {
                if (opts.hasOwnProperty(prop)) {
                    this[prop] = opts[prop];
                }
            }
        }
        this.bottomPosition = 0;
        this.topPosition = 0;
        this.bottom = null;
        this.top = null;
    };

    ContinuousScrollCtrl.prototype = {
        model: null,
        container: null,
        template: '',
        loadModel: function() { return null; },
        list: null,
        buffer: 50,
        numVisible: 0,
        shiv: {}
    };

    ContinuousScrollCtrl.prototype.init = function() {
        var me = this;
        var container = this.container;
        var children = container.children;
        var numVisible = this.numVisible;
        var shiv = this.shiv;
        var datum;

        // Build the list
        this.list = new LinkedList({
            circular: true
        });

        for (var i = 0, max = children.length; i < max; i++) {
            datum = new this.model();
            this.loadModel.call(datum, children[i]);
            this.list.add(datum);
        }

        // Initializing some variables
        this.bottom = this.list.last;
        this.top = this.list.first;
        this.lastScrollTop = 0;

        container.addEventListener('scroll', function() {
            me.check();
        });

        // Reduce elements, if necessary
        if (numVisible) {
            for (var last = children.length; last-- > numVisible; ) {
                this.removeLast();
            }
        }

        // Insert shivs in starting elements
        if (shiv.element) {
            shiv.element.classList.add('shiv');
            if (typeof(shiv.position) === 'function') {
                for (var pos = 0; pos < children.length; pos++) { // using length directly to account for inserted nodes
                    if (this.doShiv(pos, children[pos]) && numVisible) {
                        this.removeLast();
                    }

                    this.bottomPosition = pos;
                }
            } else {
                container.insertBefore(shiv.element, children[shiv.position]);
                if (numVisible) {
                    this.removeLast();
                }
                if (shiv.createCallback) {
                    shiv.createCallback.call(shiv.element);
                }
            }
        }

        // Expand, if necessary
        this.append();
    };

    ContinuousScrollCtrl.prototype.append = function() {
        var el = this.container;
        var buffer = this.buffer;

        while (el.scrollHeight - el.scrollTop - buffer < el.offsetHeight) {
            if (!this.doShiv(++this.bottomPosition, null)) {
                this.bottom = this.bottom.next;
                el.insertAdjacentHTML('beforeend', renderTemplate(this.template, this.bottom.data));
            }

            if (this.numVisible) {
                this.removeFirst();
            }
        }
    };

    ContinuousScrollCtrl.prototype.prepend = function() {
        var el = this.container;
        var children = el.children;
        var buffer = this.buffer;
        var st;

        while (el.scrollTop < buffer) {
            st = el.scrollTop;
            if (!this.doShiv(--this.topPosition, children[0])) {
                this.top = this.top.previous;
                el.insertAdjacentHTML('afterbegin', renderTemplate(this.template, this.top.data));
            }
            el.scrollTop = st + children[0].offsetHeight; 
            this.lastScrollTop = el.scrollTop;

            if (this.numVisible) {
                this.removeLast();
            }
        }
    };

    ContinuousScrollCtrl.prototype.check = function() {
        var el = this.container;

        if (el.scrollTop > this.lastScrollTop) {
            this.append();
        } else {
            this.prepend();
        }

        this.lastScrollTop = el.scrollTop;
    };

    ContinuousScrollCtrl.prototype.removeLast = function() {
        var el = this.container;
        var children = el.children;

        var removed = el.removeChild(children[children.length - 1]);

        if (!removed.classList.contains('shiv')) {
            this.bottom = this.bottom.previous;
        }

        this.bottomPosition--;
    };

    ContinuousScrollCtrl.prototype.removeFirst = function() {
        var el = this.container;
        var children = el.children;
        var height = children[0].offsetHeight;
        var st = el.scrollTop;

        var removed = el.removeChild(children[0]);
        el.scrollTop = st - height;
        this.lastScrollTop = el.scrollTop;

        if (!removed.classList.contains('shiv')) {
            this.top = this.top.next;
        }

        this.topPosition++;
    };

    ContinuousScrollCtrl.prototype.doShiv = function(position, nextElement) {
        var shiv = this.shiv;
        var container = this.container;
        var toInsert;

        if (typeof(shiv.position) === 'function' && shiv.position(position)) {
            if (shiv.noclone) {
                toInsert = shiv.element;
            } else {
                toInsert = shiv.element.cloneNode(true);
            }
            if (nextElement) {
                container.insertBefore(toInsert, nextElement);
            } else {
                container.appendChild(toInsert);
            }

            if (shiv.createCallback) {
                shiv.createCallback.call(toInsert);
            }

            return true;
        } else {
            return false;
        }
    };

    global.ContinuousScrollCtrl = ContinuousScrollCtrl;
}(window));

