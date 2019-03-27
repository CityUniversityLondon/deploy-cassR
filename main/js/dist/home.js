"use strict";

CASS.cassHome = function () {
    var $carousel = $(".home .carousel"),
        carouselOptions = {
        auto: false,
        autoControls: false,
        pager: false,
        pause: 15000,
        autoHover: true,
        touchEnabled: true,
        preventDefaultSwipeY: true,
        mode: "fade",
        nextText: "<span class=\"visuallyhidden\">Next slide</span><span class=\"fa-icon icon-chevron-right\"></span>",
        prevText: "<span class=\"visuallyhidden\">Previous slide</span><span class=\"fa-icon icon-chevron-left\"></span>",
        adaptiveHeight: true,
        onSliderLoad: function onSliderLoad() {}
    },
        tabs = function tabs() {
        var $uiTabs = $(".home-link-group--tabs");
        $uiTabs.tabs();
    },
        init = function init() {
        $carousel.bxSlider(carouselOptions);
        tabs();
    };

    return {
        init: init
    };
}();

CASS.cassHome.init();