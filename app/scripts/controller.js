/*global Item, ContinuousScrollCtrl*/

(function() {
    'use strict';

    var container = document.getElementById('scroller');
    var template = document.getElementById('itemTemplate').textContent;

    var opts = {
        model: Item,
        container: container,
        template: template,
        loadModel: Item.prototype.fromElement
    };

    var scrollCtrl = new ContinuousScrollCtrl(opts);
    scrollCtrl.init();

}());
