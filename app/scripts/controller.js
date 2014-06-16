/*global Item, ContinuousScrollCtrl*/

(function() {
    'use strict';

    var container = document.getElementById('scroller');
    var template = document.getElementById('itemTemplate').textContent;
    var videoContainer = document.getElementById('videoInsert');
    var videoInsert = videoContainer.children[0];
    var video = document.getElementById('video');

    // Set maximum height for the scroller
    var maxHeight = window.innerHeight - 60 + 'px';
    container.setAttribute('style', 'max-height: ' + maxHeight);

    // Don't display the video in it's original spot, hiding it here
    // so it still shows if js is disabled.
    videoContainer.setAttribute('style', 'display: none;');

    var playPauseVideo = function() {
        var videoLi;
        var vids = this.getElementsByClassName('video');
        for (var i = 0, max = vids.length; i < max; i++) {
            videoLi = vids[i];

            if (videoLi.offsetTop >= container.scrollTop &&
                videoLi.offsetTop < container.scrollTop + container.offsetHeight) {
                if (video.paused) {
                    video.play();
                }
            } else {
                video.pause();
            }
        }
    };

    container.addEventListener('scroll', playPauseVideo);
    var buffer = document.body.offsetWidth / 4;

    console.log(buffer);

    var opts = {
        model: Item,
        container: container,
        template: template,
        loadModel: Item.prototype.fromElement,
        buffer: buffer,
        numVisible: 6,
        shiv: {
            element: videoInsert,
            position: function(position) {
                // 9n + 4 (not including video element in count)
                return (position - 4) % 9 === 0;
            },
            noclone: true
        }
    };

    // Saddle up!
    var scrollCtrl = new ContinuousScrollCtrl(opts);
    scrollCtrl.init();
}());
