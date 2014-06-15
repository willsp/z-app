/*global Item, ContinuousScrollCtrl*/

(function() {
    'use strict';

    var container = document.getElementById('scroller');
    var template = document.getElementById('itemTemplate').textContent;
    var videoContainer = document.getElementById('videoInsert');
    var videoInsert = videoContainer.removeChild(videoContainer.children[0]);
    videoContainer.parentNode.removeChild(videoContainer);

    var playPauseVideo = function() {
        var video, videoLi;
        var vids = this.getElementsByClassName('video');
        for (var i = 0, max = vids.length; i < max; i++) {
            videoLi = vids[i];
            video = videoLi.children[0];

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

    var opts = {
        model: Item,
        container: container,
        template: template,
        loadModel: Item.prototype.fromElement,
        buffer: 250,
        numVisible: 6,
        shiv: {
            element: videoInsert,
            position: function(position) {
                // 9n + 4 (not including video element in count)
                return (position - 4) % 9 === 0;
            }
        }
    };

    // Saddle up!
    var scrollCtrl = new ContinuousScrollCtrl(opts);
    scrollCtrl.init();
}());
