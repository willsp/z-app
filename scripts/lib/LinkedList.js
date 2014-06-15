(function(global) {
    'use strict';

    var LinkedListNode = function(data) {
        this.data = data;
    };

    var LinkedList = function(init) {
        this.first = null;
        this.last = null;
        this.circular = (init && init.circular);

        if (init && init.data) {
            if (init.data.push) {
                for (var i = 0, max = init.data.length; i < max; i++) {
                    this.add(init.data[i]);
                }
            } else {
                this.add(init.data);
            }
        }
    };

    LinkedList.prototype.add = function(data) {
        var node = new LinkedListNode(data);
        if (!this.first) {
            this.first = node;
            this.last = node;
            if (this.circular) {
                node.next = node;
                node.previous = node;
            }
        } else {
            node.previous = this.last;
            this.last.next = node;
            this.last = node;
            if (this.circular) {
                node.next = this.first;
                this.first.previous = node;
            }
        }
    };

    global.LinkedList = LinkedList;
}(window));

