/*global Item, ContinuousScrollCtrl*/

(function() {
    'use strict';

    var container = document.getElementById('scroller');
    var template = document.getElementById('itemTemplate').textContent;

    // Generate the video element to shiv in.
    var videoInsert = document.createElement('li');
    var video = document.createElement('video');
    var webm = document.createElement('source');
    var mp4 = document.createElement('source');
    var ogv = document.createElement('source');

    videoInsert.setAttribute('class', 'video');
    video.id = 'oceanvid';
    video.setAttribute('preload', 'none');

    mp4.setAttribute('src', 'http://video-js.zencoder.com/oceans-clip.mp4');
    mp4.setAttribute('type', 'video/mp4');
    webm.setAttribute('src', 'http://video-js.zencoder.com/oceans-clip.webm');
    webm.setAttribute('type', 'video/webm');
    ogv.setAttribute('src', 'http://video-js.zencoder.com/oceans-clip.ogv');
    ogv.setAttribute('type', 'video/ogv');

    video.appendChild(mp4);
    video.appendChild(webm);
    video.appendChild(ogv);
    videoInsert.appendChild(video);

    // Set height for the scroller to the height of the window - header
    var height = window.innerHeight - 60 + 'px';
    container.setAttribute('style', 'height: ' + height);

    var playPauseVideo = function() {
        var videoLi;
        var vids = this.getElementsByClassName('video');
        for (var i = 0, max = vids.length; i < max; i++) {
            videoLi = vids[i];

            if (videoLi.offsetTop >= container.scrollTop &&
                videoLi.offsetTop < container.scrollTop + container.offsetHeight) {
                if (video.readyState === 0) {
                    video.load();
                }
                if (video.paused) {
                    video.play();
                }
            } else {
                video.pause();
            }
        }
    };

    container.addEventListener('scroll', playPauseVideo);
    container.addEventListener('touchmove', playPauseVideo);

    var opts = {
        model: Item,
        container: container,
        template: template,
        loadModel: Item.prototype.fromElement,
        buffer: 100,
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
