(function ($) {
        var access = false,
            log = function (m) {
                if (typeof console !== 'undefined' && console.log) {
                    console.log(m);
                }
            },

            init = function (videoContainers, opt) {
                videoContainers.not('[data-video-id-ready]').each(function () {
                    var container = $(this).attr('data-video-id-ready', 1),
                        imgGroup = container.find('.youtube-preview'),
                        iframeId = container.attr('data-video-iframe-id'),
                        load = function () {
                            var mode = access == 'youku' && container.attr('data-youku-id') ? 'youku' : 'youtube',
                                src;

                            if (mode === 'youtube') {
                                src = 'https://www.youtube.com/embed/' + container.attr('data-video-id') +
                                    '?rel=0&autoplay=1&wmode=transparent&controls=' + opt.controls +
                                    '&showinfo=' + opt.showInfo;
                                if (opt.autoPlay) {
                                    src += '&enablejsapi=1&version=3'
                                }
                            } else {
                                src = 'http://player.youku.com/embed/' + container.attr('data-youku-id');
                                if (opt.autoPlay) {
                                    src += '&autoplay=1'
                                }
                            }

                            log (mode);
                            log (src);
                            
                            var iframe = $('<iframe></iframe>').attr('id', iframeId).attr('src', src).attr('frameborder', 0);
                            if (opt.allowFullscreen) {
                                iframe.attr('allowfullscreen', 1);
                            }
                            iframe.appendTo(container);
                            if (opt.callback) {
                                opt.callback();
                            }
                            if (mode === 'youtube' && opt.autoPlay && typeof YT !== 'undefined') {
                                new YT.Player(iframeId, {
                                    events: {
                                        'onReady': function (event) {
                                            console.log('onready', new Date().getTime());
                                            event.target.playVideo();
                                        }
                                    }
                                });
                            }
                        };

                    imgGroup.click(function () {
                        if (access === false) {
                            var test = new Image();
                            test.onload = function () {
                                access = 'youtube';
                                load();
                            };
                            test.onerror = function () {
                                access = 'youku';
                                load();
                            };
                            test.src = "http://youtube.com/favicon.ico";
                        } else {
                            load();
                        }
                    });
                });
            };

        $.fn.videoPreview = function (opt) {
            init(this, $.extend({
                autoPlay: true,
                allowFullscreen: true,
                controls: 2,
                showInfo: 1
            }, opt));
            return this;
        };
    }(jQuery)
)
;
