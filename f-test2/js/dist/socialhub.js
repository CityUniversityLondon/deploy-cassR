"use strict";

//beginning of self-executable function
(function () {
    /**
    * defines a global var exist to have a genreal scope do have access outside of function
    */
    exist, app = {}, app.Router = Backbone.Router.extend({
        routes: {
            "": "home"
        },
        home: function home() {
            this.feedListView ? this.feedListView.render() : this.feedListView = new app.feedListView({
                collection: app.feeds
            }), this.feedListViewyt ? this.feedListViewyt.renderyt() : this.feedListViewyt = new app.feedListViewyt({
                collection: app.feedsyt
            }), this.feedListViewfb ? this.feedListViewfb.renderfb() : this.feedListViewfb = new app.feedListViewfb({
                collection: app.feedsfb
            });
        }
    }), app.Feed = Backbone.Model.extend({
        defaults: {
            id: "",
            type: "",
            title: "",
            description: "",
            content: "",
            url: "",
            comment_url: "",
            like_url: "",
            thumbnail: "",
            author: "",
            created: "",
            updated: "",
            time: "",
            custom: "",
            twLength: null
        }
    }), app.FeedList = Backbone.Collection.extend({
        model: app.Feed
    }), app.feeds = new app.FeedList(twitterJSON), app.feedsyt = new app.FeedList(youtubeJSON), app.feedsfb = new app.FeedList(facebookJSON);

    exist = app.feedsfb.length;

    app.FeedView = Backbone.View.extend({
        tagName: "li",
        className: "feedTag",
        template: _.template($("#feedTemplate").html()),
        render: function render() {

            /*
            //returns the highest ID from the twitter feeds
            max = 0;
            twitterId = this.model.id;
             if (twitterId > max) {
                max = twitterId;
            }
             console.log(max);
            console.log(this.model.type);
            */
            return this.$el.html(this.template(this.model.toJSON())), this;
            /* return this.$el.html("this is some content"), this*/
        }
    }), app.FeedViewyt = Backbone.View.extend({
        tagName: "li",
        className: "feedTagyt",
        template: _.template($("#feedTemplateyt").html()),
        renderyt: function renderyt() {

            //console.log(exist);
            return this.$el.html(this.template(this.model.toJSON())), this;
        }
    }), app.FeedViewfb = Backbone.View.extend({
        tagName: "li",
        className: "feedTagfb",
        template: _.template($("#feedTemplatefb").html()),
        renderfb: function renderfb() {
            if (exist == null) {
                this.template = "";
            }

            return this.$el.html(this.template(this.model.toJSON())), this;
        }
    }), app.feedListView = Backbone.View.extend({
        el: ".tw",
        initialize: function initialize() {
            this.render();
        },
        render: function render() {
            this.$el.empty(), this.collection.each(function (a) {
                this.renderBook(a);
            }, this);
        },
        renderBook: function renderBook(a) {
            var b = new app.FeedView({
                model: a
            });
            this.$el.append(b.render().el);
        }
    }), app.feedListViewyt = Backbone.View.extend({
        el: ".yt",
        initialize: function initialize() {
            this.renderyt();
        },
        renderyt: function renderyt() {
            this.$el.empty(), this.collection.each(function (a) {
                this.renderFeedyt(a);
            }, this);
        },
        renderFeedyt: function renderFeedyt(a) {
            var b = new app.FeedViewyt({
                model: a
            });
            this.$el.append(b.renderyt().el);
        }
    }), app.feedListViewfb = Backbone.View.extend({
        el: ".fb",
        initialize: function initialize() {
            /*        alert(exist);*/
            this.renderfb();
        },
        renderfb: function renderfb() {
            this.$el.empty(), this.collection.each(function (a) {
                this.renderFeedfb(a);
            }, this);
        },
        renderFeedfb: function renderFeedfb(a) {
            var b = new app.FeedViewfb({
                model: a
            });
            this.$el.append(b.renderfb().el);
        }
    }), $(function () {
        new app.Router();
        Backbone.history.start();
        var $sh1, $sh2;

        /**
         * show/hide social media divs on hover.
         * @constructor
         * @param {bool} block/none - Value represents visibility of the social popup
        */

        function showHide($sh1, $sh2) {
            $("#sh-twitter, #sh-twitter-popup").mouseenter(function () {
                $('#sh-twitter-popup').attr("style", "display:" + $sh1 + " !important");
            });

            $("#sh-twitter, #sh-twitter-popup").mouseleave(function () {
                $('#sh-twitter-popup').attr("style", "display: " + $sh2 + " !important");
            });

            $("#sh-google, #sh-google-popup").mouseenter(function () {
                $('#sh-google-popup').attr("style", "display: " + $sh1 + " !important");
            });

            $("#sh-google, #sh-google-popup").mouseleave(function () {
                $('#sh-google-popup').attr("style", "display: " + $sh2 + " none !important");
            });
        }

        /**
         * BxSlider template adjusted to show slidesNo.
         * @constructor
         * @param {number} slidesNo - Number of slides passed function to display on carousel
        */

        function displaySlidesNo(slidesNo) {
            $(".bxslider").bxSlider({
                minSlides: slidesNo,
                maxSlides: slidesNo,
                slideWidth: 170,
                slideMargin: 10,
                auto: !0,
                touchEnabled: !1,
                nextText: '<i class="icon-caret-right"></i>',
                prevText: '<i class="icon-caret-left"></i>',
                adaptiveHeight: !0,
                pager: !1,
                autoStart: false,
                speed: 500
            });
        }

        /**
         * checkDescLength function to count a string characteres amount
         * @constructor
         * @param {string} $char - Number of characters to count to from 0
        */
        function checkDescLength($char) {
            var $ar = [],
                $newStr;
            $span = $(".stripeBottomyt span a");
            $span.each(function (tag) {
                $str = $(this).text();
                $strLen = $str.length;
                if ($strLen >= $char) {
                    $newStr = $str.substring(0, $char);
                    $(this).text($newStr + "...");
                } else if ($strLen < $char) {
                    $(this).html($str);
                }
            });
        };

        /**
         * checkWidth function to check windows width
         * if checked do adjustments according to resolution detected
         * @constructor
        */
        function checkWidth() {
            var w = $(window).width();
            if (w >= "320" & w <= "479") {
                showHide("none", "none");
                displaySlidesNo(1);
                checkDescLength(55);
            } else if (w >= "480" & w <= "599") {
                showHide("none", "none");
                displaySlidesNo(2);
                checkDescLength(55);
            } else if (w >= "600" & w <= "766") {
                showHide("none", "none");
                displaySlidesNo(2);
                checkDescLength(55);
            } else if (w >= "767" & w <= "979") {
                showHide("none", "none");
                displaySlidesNo(3);
                checkDescLength(55);
            } else if (w >= "980" & w <= "1199") {
                showHide("block", "none");
                displaySlidesNo(3);
                checkDescLength(55);
            } else if (w >= "1200") {
                showHide("block", "none");
                displaySlidesNo(4);
                checkDescLength(60);
            } else {}
        }

        checkWidth();

        /* get facebook bx-wrapper container
        * @var bxwrapper = last occurence of bx-slider on the page
        */
        $bxwrapper = $(".bx-wrapper").filter(":last");

        /* check if facebook Json is empty - if it is hide else show */
        exist == 0 ? $bxwrapper.hide() : $bxwrapper.show();
    });
})();