/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * The main CASS wrapper object
	 * @author City Web Team
	 */
	
	"use strict";
	var $ = __webpack_require__(1),
	    Cookies = __webpack_require__(9),
	    CASS = (function(w, Modernizr, yepnope) {
	        var initCookieNotice = __webpack_require__(10),
	            //initCookieSurvey = require('./funcs/init-cookie-survey'),
	            initHeader = __webpack_require__(11),
	            imageCreditation = __webpack_require__(12),
	            /**
	             * The object to hold all loadable scripts, add an object here to allow it's loading in a page
	             *
	             * Each child object has three properties:
	             *   description: a short description of the script
	             *           src: the filename of the script
	             *       [async]: Whether to load the script asynchronously (assumed false unless given)
	             *
	             * @var Object
	             */
	            scripts = {
	                flowplayer: {
	                    description: "include flowplayer for pages with videos",
	                    src: "lib/flowplayer/flowplayer-3.2.4.min.js"
	                },
	                flowplayerEmbed: {
	                    description: "Embed code for flowplayer",
	                    src: "lib/flowplayer/flowplayer.embed-3.0.3.min.js"
	                },
	                swfobject: {
	                    description: "swfobject for youtube video(s)",
	                    src: "lib/swfobject/swfobject.js"
	                },
	                galleria: {
	                    description: "JQuery image gallery plugin",
	                    src: "lib/jquery/plugins/galleria/galleria-1.2.9/galleria-1.2.9.min.js"
	                },
	                galleriaTheme: {
	                    description: "city galleria theme",
	                    src: "lib/jquery/plugins/galleria/themes/city/galleria.city.min.js"
	                },
	                underscore: {
	                    description: "utility library",
	                    src: "lib/backbone/underscore.min.js"
	                },
	                hallway: {
	                    description: "scripts to run on hallway pages",
	                    src: "modules/hallway.js"
	                }
	            },
	            /***************************************************************************
	         * GLOBAL VARIABLES
	         ***************************************************************************/
	
	            /**
	             * What level of debugging is required (currently binary 0 or 1, no debug messages or all)
	             * @var Integer
	             */
	            debugLevel = 0,
	            /**
	             * cache window.location
	             */
	            windowLocation = w.location,
	            /**
	             * cache location.hash
	             */
	            locationHash = location.hash,
	            /**
	             * The location of external scripts (with trailing slash)
	             * @var String
	             */
	            srcPrefix =
	                "//" + windowLocation.hostname.replace(/www|intranet/, "s1").replace("cass.", "") + "/cassrmain/js/",
	            /**
	             * The version number to prepend to the file name, set in page
	             * @var String
	             */
	            version = w.CITY_VERSION || "123456789.",
	            /**
	         * used for detecting download filetypes by extension
	         */
	
	            /**
	             * are we on the Cass sub-domain?
	             */
	            isCass = windowLocation.hostname.indexOf("cass.city.ac.uk") !== -1,
	            /**
	             * are we on the Bunhill sub-domain?
	             */
	            isBunhill = windowLocation.hostname.indexOf("bunhill.city.ac.uk") !== -1,
	            /**
	             * Our design breakpoints as defined in _mixin_pages.scss
	             */
	            breakpoints = {
	                thin: 320,
	                medium: 768,
	                thinish: 480,
	                wide: 980,
	                wider: 1200
	            },
	            /**
	             * Screen size on load, set in initPage
	             */
	            screenSize,
	            /***************************************************************************
	         * USEFUL GLOBAL FUNCTIONS
	         ***************************************************************************/
	
	            /**
	             * Sends a message to the browser console (Gecko, Webkit) or into the <body> (IE)
	             * @param {String} message: the message to print out
	             */
	            debug = function(message) {
	                var debugContainer, elmt;
	
	                if (debugLevel > 0 || location.search.match("debug")) {
	                    try {
	                        //for Safari, Chrome, Firefox(w/ firebug)
	                        w.console.log(message);
	                    } catch (e) {
	                        try {
	                            //for Opera
	                            opera.postError.apply(opera, message);
	                        } catch (e1) {
	                            //for IE
	
	                            //create a debug container (if none exists)
	                            debugContainer = document.getElementById("debugContainer");
	                            if (!debugContainer) {
	                                debugContainer = document.createElement("div");
	                                debugContainer.setAttribute("id", "debugContainer");
	                                debugContainer.setAttribute("class", "hide");
	                                document
	                                    .getElementsByTagName("body")
	                                    .item(0)
	                                    .appendChild(debugContainer);
	                            }
	                            elmt = document.createElement("pre");
	                            elmt.setAttribute("class", "debug");
	                            elmt.appendChild(document.createTextNode(message));
	                            debugContainer.appendChild(elmt);
	                        }
	                    } //end IE catch block
	                }
	            },
	            /**
	             * Lazyload function, now proxies to yepnope
	             *
	             * @param {Object} jsHandle: The Object from CASS.scripts to load
	             * @param {String} callback: The name of the callback to be executed after this script has loaded
	             */
	            load = function(jsHandle, callback) {
	                //work out full path
	                var path = (function() {
	                    var script = scripts[jsHandle];
	
	                    if (/^https?:\/\//.test(script.src)) {
	                        return script.src;
	                    }
	
	                    return srcPrefix + (/plugins|lib/.test(script.src) ? "" : "modules/") + script.src;
	                })();
	
	                yepnope({
	                    load: path,
	                    callback: callback
	                });
	            },
	            setVersion = function(v) {
	                version = v;
	            },
	            /**
	             * returns the size of an object
	             */
	            objectSize = function(object) {
	                var size = 0,
	                    key;
	
	                for (key in object) {
	                    if (object.hasOwnProperty(key)) {
	                        size += 1;
	                    }
	                }
	
	                return size;
	            },
	            /**
	             * returns true if a number is even
	             * @param {Number} value
	             * @return {Boolean}
	             */
	            isEven = function(value) {
	                if (value % 2 === 0) {
	                    return true;
	                } else {
	                    return false;
	                }
	            },
	            /**
	             * Read a page's GET URL variables and return them as an associative array.
	             */
	            getUrlVars = function() {
	                var vars = [],
	                    hash,
	                    i = 0,
	                    hashes = windowLocation.href.slice(windowLocation.href.indexOf("?") + 1).split("&");
	
	                for (i; i < hashes.length; i = i + 1) {
	                    hash = hashes[i].split("=");
	                    vars.push(hash[0]);
	                    vars[hash[0]] = hash[1];
	                }
	
	                return vars;
	            },
	            /**
	             * return hash as array from url GET param
	             */
	            getUrlHash = function() {
	                var hashes;
	
	                if (locationHash.length !== 0) {
	                    hashes = locationHash.split("#")[1].split("&");
	                }
	
	                return hashes || "";
	            },
	            /**
	             * gets window width
	             * @param: {Object} - window object
	             * @return: {Number} - window width
	             */
	            getWindowWidth = function(w) {
	                return Math.round($(w).width());
	            },
	            /**
	             * adds a class of has-loaded to images
	             * @param: {Object} - html element
	             * @return: {Object} - the html element, with new class
	             */
	            imageLoaded = function(arg) {
	                var el = arg.target || arg;
	                $(el).addClass("has-loaded");
	                return el;
	            },
	            /**
	             * returns true if the viewport size has changed -
	             * useful in responsive layout, see
	             * snook.ca/archives/javascript/ie6_fires_onresize
	             */
	            viewportChanged = function() {
	                var changed = false,
	                    docEl = w.document.documentElement,
	                    coolOff = 20, //further calls within this window get
	                    //the same return value
	                    now = Date.now
	                        ? Date.now()
	                        : (function() {
	                              return new Date().valueOf();
	                          })();
	
	                //set up a holder object (if it doesn't exist)
	                w.viewport = w.viewport || {};
	
	                //these need zeroing before we begin (if not already set)
	                w.viewport.dimensions = w.viewport.dimensions || { height: null, width: null };
	
	                //need to handle the situation where many calls to this
	                //function happen in quick succession
	                if (w.viewport.timeStamp && now - w.viewport.timeStamp < coolOff) {
	                    debug("within window, returning " + w.viewport.storedResult);
	                    return w.viewport.storedResult;
	                }
	
	                //store the time of this call
	                w.viewport.timeStamp = now;
	
	                //have we changed viewport size?
	                if (
	                    w.viewport.dimensions.width !== docEl.clientWidth ||
	                    w.viewport.dimensions.height !== docEl.clientHeight
	                ) {
	                    changed = true;
	                }
	
	                //store new dimensions
	                w.viewport.dimensions.height = docEl.clientHeight;
	                w.viewport.dimensions.width = docEl.clientWidth;
	
	                //store this result in case of a re-call within coolOff
	                w.viewport.storedResult = changed;
	
	                debug("viewport changed: " + changed);
	
	                return changed;
	            },
	            /***************************************************************************
	         * BEGIN CASS MODULES
	         ***************************************************************************/
	
	            /*
	         * sets up a carousel on a page
	         * @param carouselObj : Object
	         *
	         */
	            createSlider = function($carouselObj) {
	                var data = w.sliderData,
	                    dataLength = data.length,
	                    tempObj = {},
	                    tempEl = "",
	                    items,
	                    item,
	                    compiledTmpl = [],
	                    i,
	                    initSlider = function() {
	                        var options = {
	                            auto: true,
	                            autoControls: true,
	                            pause: 15000,
	                            autoHover: true,
	                            touchEnabled: true,
	                            preventDefaultSwipeY: true,
	                            mode: "fade",
	                            startText: '<span class="visuallyhidden">Start Slider</span><i class="icon-play"></i>',
	                            stopText: '<span class="visuallyhidden">Pause Slider</span><i class="icon-pause"></i>',
	                            adaptiveHeight: true,
	                            onSliderLoad: function() {
	                                $carouselObj.removeClass("loading");
	                            }
	                        };
	
	                        $carouselObj.bxSlider(options);
	                    },
	                    /* jshint -W015 */
	                    tmpl = [
	                        '<li class="cf">',
	                        '<div class="carousel-media">',
	                        "<%= data.sliderMedia %>",
	                        "</div>",
	                        '<div class="carousel-text">',
	                        '<% if (data.sliderType === "event") { %>',
	                        '<div class="date">',
	                        '<p class="date-month"><%= data.sliderDateMonth %></p>',
	                        '<p class="date-day-no"><%= data.sliderDateDayNo %></p>',
	                        '<p class="date-day"><%= data.sliderDateDay %></p>',
	                        "</div>",
	                        "<% } %>",
	                        "<h2><%= data.sliderTitle %></h2>",
	                        "<%= data.sliderDescription %>",
	                        "</div>",
	                        "</li>"
	                    ].join("\n");
	                /* jshint +W015 */
	
	                //set up slider
	                if (dataLength < 1) {
	                    return;
	                }
	
	                // we don't need the first slide as it is already in th DOM
	                data.shift();
	                dataLength = data.length;
	
	                // enumerate array
	                for (i = 0; i < dataLength; i += 1) {
	                    // items is an object representing a carousel slide
	                    items = data[i];
	                    tempEl = _.template(tmpl, items, { variable: "data" });
	                    compiledTmpl.push(tempEl);
	                }
	
	                $carouselObj.append(compiledTmpl.join(""));
	
	                initSlider($carouselObj);
	            },
	            /**
	             * Create a image Gallery
	             *
	             * @param {Object} a jquery object representing a single instance of a gallery
	             * @param {Boolean} true if the gallery is in a widget, false if in main content body
	             * @return {Object || Undefined} returns the galleria jQuery object if
	             * successful else undefined - for instance if $gallery is not a jQuery object
	             *
	             */
	            createGallery = function($gallery) {
	                var data = {
	                        src: "/apis/galleries/galleria-json?root=",
	                        root: ""
	                    },
	                    $loader = $('<span class="loading">loading</span>'),
	                    $galleryInner,
	                    //some default options
	                    galleriaOptions = {
	                        height: 0.5625,
	                        lightbox: false,
	                        maxScaleRatio: 1,
	                        preload: 2,
	                        showInfo: false,
	                        imageCrop: false,
	                        debug: true,
	                        extend: function(/* defined but not used: options */) {
	                            if ("city" === $gallery.attr("data-theme")) {
	                                $gallery.prepend(
	                                    $("<div/>", {
	                                        class: "cg-caption"
	                                    })
	                                );
	
	                                /*loadstart is triggered every time galleria loads an image*/
	                                this.bind("loadstart", function(e) {
	                                    var data = this._data[e.index],
	                                        //$caption is refound here as it needs to be scoped to this gallery
	                                        $caption = $gallery.find(".cg-caption");
	
	                                    if (data.m_caption) {
	                                        $caption.html(data.m_caption);
	                                    } else {
	                                        $caption.html("&nbsp;");
	                                    }
	                                });
	                            }
	                        }
	                    },
	                    galleriaThemeCallback = function() {
	                        //get id of root from id of gallery div
	                        data.root = $gallery.attr("id").replace("gallery-", "");
	
	                        $.getJSON(data.src + data.root, function(data) {
	                            //remove loader
	                            $loader.hide();
	                            $gallery.css("opacity", "1");
	                            galleriaOptions.data_source = data;
	                            $galleryInner.galleria(galleriaOptions);
	                        });
	
	                        return $galleryInner;
	                    };
	                //end vars
	
	                //some checks before we go further
	                if (!$gallery || $gallery.length === 0) {
	                    debug("$gallery is undefined or not a jQuery object");
	                    return;
	                } else {
	                    $galleryInner = $gallery.find(".gallery-inner");
	                }
	
	                //return if no stage found
	                if ($galleryInner.length === 0) {
	                    debug("no stage found");
	                    return;
	                }
	
	                //set some options from $galleryInner classes - this are set as metadata on the gallery folder
	                if ($galleryInner.hasClass("lightbox")) {
	                    galleriaOptions.lightbox = true;
	                }
	
	                if ($galleryInner.hasClass("caption")) {
	                    galleriaOptions.showInfo = true;
	                }
	
	                //add loading gif
	                $gallery.prepend($loader);
	
	                yepnope({
	                    load: [
	                        "lib/jquery/plugins/galleria/galleria-1.4.2/galleria-1.4.2.min.js",
	                        "lib/jquery/plugins/galleria/galleria-1.4.2/themes/classic/galleria.classic.min.js"
	                    ],
	                    complete: galleriaThemeCallback
	                });
	            }, //end createGallery
	            /**
	             * adds autocomplete functionality to the main search bar, using jQuery UI
	             * @param: {Object} form - jQuery object for form to run autoSuggest on
	             * @param: {Object} input - jQuery object for input elements to run autoSuggest on
	             * @param: {String} collection - the name of the Funnelback collection to query
	             * @retun: {Undefined}
	             */
	            searchAutoComplete = function(form, input, collection) {
	                input.autocomplete({
	                    source: function(request, response) {
	                        $.ajax({
	                            url: "/fb/suggest.json?collection=" + collection + "&fmt=json",
	                            dataType: "json",
	                            data: {
	                                partial_query: request.term
	                            },
	                            success: function(data) {
	                                response(
	                                    $.map(data, function(item) {
	                                        return {
	                                            label: item
	                                        };
	                                    })
	                                );
	                            }
	                        }); //end $.ajax
	                    }, //end source function
	
	                    minLength: 2,
	                    delay: 20,
	
	                    //when you have selected something
	                    select: function(event, ui) {
	                        //close the drop down
	                        //need to create a dummy assignment, to please jslint
	                        //close is still performed
	
	                        var c = this.close;
	
	                        //make sure on click the selected value replaces the type value
	                        $(this).val(ui.item.value);
	                        form.submit();
	                    },
	                    //show the drop down
	                    open: function() {
	                        $(this)
	                            .removeClass("ui-corner-all")
	                            .addClass("ui-corner-top");
	                    },
	                    //close the drop down
	                    close: function() {
	                        $(this)
	                            .removeClass("ui-corner-top")
	                            .addClass("ui-corner-all");
	                    }
	                });
	            },
	            /**
	             * Finds any vid images on a page and replaces them with either a YouTube iframe or SWFObject for FMS vids
	             * @return: Undefined
	             */
	            videos = function() {
	                var $youtubeVids = $("img.youtube"),
	                    $fmsVids = $("img.fms"),
	                    /*
	                 * Replaces an image element with YouTube iFrame
	                 * @param: {Object} : $el - jQuery object for youTube images to be replaced
	                 * @retun: {Undefined}
	                 */
	                    embedYoutube = function($youtubeVids) {
	                        $youtubeVids.each(function(i, el) {
	                            var $el = $(el),
	                                vidWidth = 500, // default width
	                                vidHeight = 320, // default height
	                                videoID = $el.attr("id").replace("vid_", ""),
	                                load = function(autoplay) {
	                                    $el.replaceWith(
	                                        '<div class="embed-wrapper"><div class="embed-container"><iframe height=' +
	                                            vidHeight +
	                                            " width= " +
	                                            vidWidth +
	                                            ' src="https://www.youtube.com/embed/' +
	                                            videoID +
	                                            "?rel=0" +
	                                            (autoplay ? "&autoplay=1" : "") +
	                                            "\" frameborder='0' allowfullscreen></iframe></div></div>"
	                                    );
	                                },
	                                preview = $el.hasClass("preview");
	
	                            if (preview) {
	                                $el.click(function() {
	                                    load(true);
	                                });
	                            } else {
	                                load(false);
	                            }
	                        });
	                    },
	                    /*
	                 * Replaces an image element with SWF Object
	                 * @param: {Object} : $el - jQuery object for all fms images to be replaced
	                 * @retun: {Undefined}
	                 */
	                    embedFms = function($fmsVids) {
	                        var splashImages = {
	                            cassStandard:
	                                "//s1.city.ac.uk/cassrmain/i/video-overlays/flowplayer-cass-500x320.jpg?v=8105",
	                            cassStandardWs:
	                                "//s1.city.ac.uk/cassrmain/i/video-overlays/flowplayer-cass-687x419.jpg?v=8105",
	                            cassRetina:
	                                "//s1.city.ac.uk/cassrmain/i/video-overlays/flowplayer-cass-500x320@x2.jpg?v=8105",
	                            cassRetinaWs:
	                                "//s1.city.ac.uk/cassrmain/i/video-overlays/flowplayer-cass-687x419@x2.jpg?v=8105"
	                        };
	
	                        $fmsVids.each(function(i, el) {
	                            var $el = $(el),
	                                vidWidth = 687, //default width
	                                vidHeight = 419, // default height
	                                elId = $el.attr("id"),
	                                vidId = elId.replace("vid_", ""),
	                                expressInstall = "//s1.city.ac.uk/js/swfobject/expressInstall.swf",
	                                flashtargetversion = "9.0.28",
	                                flashvars = null,
	                                params = {
	                                    allowScriptAccess: "always",
	                                    allowfullscreen: "true",
	                                    wmode: "transparent"
	                                },
	                                splashImage,
	                                swfCallBack = function(e) {
	                                    $(e.ref).wrap(
	                                        '<div class="embed-wrapper" style="max-width:' +
	                                            vidWidth +
	                                            'px"><div class="embed-container"></div></div>'
	                                    );
	                                };
	
	                            //if video is included in the course description div of a course N page, width needs to be 419
	                            if ($el.parents(".course-description").length !== 0) {
	                                vidWidth = 419;
	                            }
	
	                            //vids have different sizes depending on the size of the content div and if they are widescreen on square
	                            if ($el.hasClass("widescreen")) {
	                                vidHeight = vidWidth * 0.61;
	                                splashImage = splashImages.cassStandardWs;
	                            } else {
	                                vidWidth = 500;
	                                vidHeight = 320;
	                                splashImage = splashImages.cassStandard;
	                            }
	
	                            if (!swfobject.hasFlashPlayerVersion(flashtargetversion)) {
	                                //explain why there is no video
	                                $el.after(
	                                    '<p class="notice-message"><i class="icon-warning-sign" style="color : #CCCC00"></i> You need to have flash player ' +
	                                        flashtargetversion +
	                                        " or greater installed to see the video.</p>" +
	                                        '<p><a href="http://get.adobe.com/flashplayer/">Get Flash Player</a></p>'
	                                );
	                            } else {
	                                //config has to be in a string and key and values have to be "quoted" - nightmare
	                                // construct all the variables to pass to the player -
	                                // tried to make this a proper json array, didn't work :(
	                                // IE doesn't like double quotes here so ignore JSHint error
	
	                                /* jshint -W018 */
	                                flashvars =
	                                    "{'clip': {'provider': 'rtmp'}, 'playlist': [{'url':'" +
	                                    splashImage +
	                                    "', 'autoPlay': true}, {'url': '" +
	                                    vidId.replace("vid_", "") +
	                                    "/Hi_bandwidth', 'autoPlay': false, 'scaling': 'fit'}], 'plugins': {'rtmp': {'url': 'https://s1.city.ac.uk/js/flowplayer/flowplayer.rtmp-3.2.3.swf', 'netConnectionUrl': 'rtmp://media.city.ac.uk/flowplayer', 'objectEncoding': '0', 'proxyType': 'none' }, 'controls': {'url': 'flowplayer.controls.swf'} } }";
	                                /* jshint +W018 */
	
	                                // initiate the player
	                                swfobject.embedSWF(
	                                    "https://s1.city.ac.uk/js/flowplayer/flowplayer-3.2.5.swf",
	                                    elId,
	                                    vidWidth,
	                                    vidHeight,
	                                    "9.0.0",
	                                    expressInstall,
	                                    { config: flashvars },
	                                    params,
	                                    false,
	                                    swfCallBack
	                                );
	                            } //end has flash if
	                        });
	                    };
	
	                if ($youtubeVids.length) {
	                    embedYoutube($youtubeVids);
	                }
	                if ($fmsVids.length) {
	                    yepnope({
	                        load: scripts.swfobject.src,
	                        callback: function(url, result, key) {
	                            embedFms($fmsVids);
	                        }
	                    });
	                }
	            }, // end videos
	            /**
	             * creates the You Tube module - a UI component featuring a carousel of videos and a featured video area. Clicking on one of the slides
	             * updates the featured video, plus the title, description, views and share links. Requires Underscore.js
	             * @param {Object} ytModule a jQuery Object representing the container for the ytModule.
	             * @return {Undefined}
	             */
	            ytModule = function($ytModule) {
	                var ytUrl,
	                    vl,
	                    fv,
	                    successCallback,
	                    /*
	                 * constructor for FeaturedVideo obj
	                 * @param {String} el - a jQuery selector for the FeaturedVideo container
	                 * @return {Object} Returns a newa FeaturedVideo obj
	                 * @constructor
	                 */
	                    FeaturedVideo = function(el) {
	                        if (!(this instanceof FeaturedVideo)) {
	                            return new FeaturedVideo(el);
	                        }
	                        this.el = el;
	                        this.$el = $(el);
	                        this.player = $("#yt-video-player");
	                        /* jshint -W015 */
	                        this.tmpl = [
	                            '<div class="span14">',
	                            '<div id="yt-video-player" class="yt-video-player">',
	                            '<div class="embed-wrapper">',
	                            '<div class="embed-container">',
	                            '<iframe src="https://www.youtube.com/embed/<%= data.id %>?rel=0" frameborder="0" allowfullscreen></iframe>',
	                            "</div>",
	                            "</div>",
	                            "</div>",
	                            "</div>",
	                            '<div class="span10">',
	                            '<div class="video-meta">',
	                            '<h2 class="video-title"><%= data.title %></h2>',
	                            '<p class="video-description"><%= data.description %></p>',
	                            '<p class="video-views">Views : <%= data.views %></p>',
	                            '<p class="social-flat-links">',
	                            '<span class="facebook social-btn"><a href="https://www.facebook.com/dialog/feed?app_id=141996839165515&amp;redirect_uri=<% window.location.href %>&amp;link=<%= data.player %>"><i class="icon-facebook"></i>Facebook</a></span>',
	                            '<span class="twitter social-btn"><a href="https://twitter.com/intent/tweet?url=<%= data.player %>&amp;title=<%= data.title %>"><i class="icon-twitter"></i>Twitter</a></span>',
	                            '<span class="google social-btn"><a href="https://plus.google.com/share?url=<%= data.player %>"><i class="icon-google-plus"></i>Google +</a></span>',
	                            "</p>",
	                            "</div>",
	                            "<div>"
	                        ].join("\n");
	                        /* jshint +W015 */
	
	                        return this;
	                    },
	                    /*
	                 * constructor for VideosList obj
	                 * @param {String} el - a jQuery selector for the VideosList container
	                 * @return {Object} Returns a new VideosList obj
	                 * @constructor
	                 */
	                    VideosList = function(el) {
	                        if (!(this instanceof VideosList)) {
	                            return new VideosList(el);
	                        }
	                        this.el = el;
	                        this.$el = $(el);
	                        /* jshint -W015 */
	                        this.tmpl = [
	                            '<li data-video-id="<%= data.id %>" data-video-title="<%= data.title %>" data-video-description="<%= data.description %>" data-video-player="<%= data.player %>" data-video-views="<%= data.views %>" class="video event event-video <%= data.activeClass %>">',
	                            '<a href="https://www.youtube.com/embed/<%= data.id %>" class="video-link">',
	                            '<img src="<%= data.thumbnail %>" />',
	                            "</a>",
	                            '<p class="video-title">',
	                            '<a href="https://www.youtube.com/embed/<%= data.id %>" class="video-link"><%= data.title %></a>',
	                            "</p>",
	                            '<p class="video-views"><span class="view-count"><%= data.views %></span> views</p>',
	                            "</li>"
	                        ].join("\n");
	                        /* jshint +W015 */
	
	                        return this;
	                    };
	
	                // end ytModule var
	
	                /*
	                 * @method
	                 * @param {Object} videoDate - updates the featured video
	                 */
	                FeaturedVideo.prototype.update = function(videoData) {
	                    var newFeatured = _.template(this.tmpl, videoData, { variable: "data" });
	
	                    this.$el
	                        .addClass("loading")
	                        .empty()
	                        .append(newFeatured)
	                        .removeClass("loading");
	                };
	                /*
	                 * @method
	                 * {Array} slidesArray - each element contains html for individual slides
	                 */
	                VideosList.prototype.buildList = function(slidesArray) {
	                    // attach to DOM
	                    this.$el.append('<ul class="yt-videos-list">' + slidesArray.join("") + "</ul>");
	
	                    // attach click handler
	                    this.videoLinks = this.$el.find(".video-link");
	
	                    this.$el.on("click", ".video-link", function(e) {
	                        var $self = $(this),
	                            $selfParent = $self.parents(".video"),
	                            videoData = {};
	
	                        e.preventDefault();
	
	                        videoData.title = $selfParent.data("video-title");
	                        videoData.description = $selfParent.data("video-description");
	                        videoData.views = $selfParent.data("video-views");
	                        videoData.src = $self.attr("href");
	                        videoData.id = $selfParent.data("video-id");
	                        videoData.player = $selfParent.data("video-player");
	
	                        $(".video-link").each(function() {
	                            $(this)
	                                .parent(".video")
	                                .removeClass("active");
	                        });
	
	                        $selfParent.addClass("active");
	
	                        // update feature vid object
	                        fv.update(videoData);
	
	                        //scroll up to player
	                        $("html, body").animate(
	                            {
	                                scrollTop: $("#yt-video-player").offset().top
	                            },
	                            500
	                        );
	                    });
	
	                    // init slider
	                    this.$el.find("ul").bxSlider({
	                        slideWidth: 200,
	                        minSlides: 2,
	                        maxSlides: 10,
	                        slideMargin: 10,
	                        moveSlides: 1,
	                        infiniteLoop: false,
	                        nextText:
	                            '<span class="visuallyhidden">Next set of slides</span><i class="icon-caret-right"></i>',
	                        prevText:
	                            '<span class="visuallyhidden">Previous set of slides</span><i class="icon-caret-left"></i>',
	                        touchEnabled: true,
	                        preventDefaultSwipeY: true,
	                        adaptiveHeight: true
	                    });
	                };
	
	                // begin
	
	                //bail if underscore.js isn't loaded
	                if (!window._) {
	                    CASS.debug("ytModule requires Underscore.js to be loaded");
	                    return;
	                }
	
	                $ytModule = $ytModule || $("#yt-module");
	                fv = new FeaturedVideo("#yt-featured-video");
	                vl = new VideosList("#yt-videos-list");
	                ytUrl = $ytModule.data("yt-playlist");
	
	                if (!ytUrl) {
	                    CASS.debug("Needs a YouTube playlist");
	                    return;
	                }
	
	                if (ytUrl.indexOf("/youtube/v3/") >= 0) {
	                    successCallback = function(data) {
	                        var items = data.items,
	                            itemsLength = items.length,
	                            tmpArray = [],
	                            compiled,
	                            dataForTemplate,
	                            i;
	
	                        for (i = 0; i < itemsLength; i++) {
	                            var snippet = items[i].snippet;
	                            // private videos won't have a thumbnail
	                            if (snippet.thumbnails && snippet.thumbnails.high) {
	                                dataForTemplate = {
	                                    title: snippet.title,
	                                    description: snippet.description,
	                                    id: snippet.resourceId.videoId,
	                                    player: "https://www.youtube.com/embed/" + snippet.resourceId.videoId + "?rel=0",
	                                    thumbnail: snippet.thumbnails.high.url,
	                                    activeClass: ""
	                                };
	                                if (i === 0) {
	                                    dataForTemplate.activeClass = "active";
	                                    // update featured vid DOM
	                                    fv.update(dataForTemplate);
	                                } else {
	                                    dataForTemplate.activeClass = "";
	                                }
	                                compiled = _.template(vl.tmpl, dataForTemplate, { variable: "data" });
	                                // add compiled string to array
	                                tmpArray[i] = compiled;
	                            }
	                        }
	                        // update videos list DOM
	                        vl.buildList(tmpArray);
	                    };
	                } else {
	                    successCallback = function(data) {
	                        var items = data.data.items,
	                            itemsLength = items.length,
	                            tmpArray = [],
	                            compiled,
	                            dataForTemplate,
	                            i;
	
	                        for (i = 0; i < itemsLength; i++) {
	                            // private videos won't have a thumbnail
	                            if (items[i].video.thumbnail) {
	                                dataForTemplate = {
	                                    title: items[i].video.title,
	                                    description: items[i].video.description,
	                                    views: items[i].video.viewCount,
	                                    id: items[i].video.id,
	                                    player: encodeURI(items[i].video.player["default"]),
	                                    thumbnail: items[i].video.thumbnail.hqDefault,
	                                    activeClass: ""
	                                };
	                                if (i === 0) {
	                                    dataForTemplate.activeClass = "active";
	                                    // update featured vid DOM
	                                    fv.update(dataForTemplate);
	                                } else {
	                                    dataForTemplate.activeClass = "";
	                                }
	                                compiled = _.template(vl.tmpl, dataForTemplate, { variable: "data" });
	                                // add compiled string to array
	                                tmpArray[i] = compiled;
	                            }
	                        }
	
	                        // update videos list DOM
	                        vl.buildList(tmpArray);
	                    };
	                }
	
	                $.ajax({
	                    url: ytUrl,
	                    dataType: "jsonp",
	                    success: successCallback,
	                    complete: function() {
	                        $ytModule.removeClass("loading");
	                    },
	                    error: function(jqXHR, textStatus, errorThrown) {
	                        CASS.debug(jqXHR, textStatus, errorThrown);
	                    }
	                });
	            },
	            /**
	             * creates and adds a function as the default error handler for jQuery ajax operations
	             */
	            initJsFailureNotifier = function() {
	                var webService = "//webapps.city.ac.uk/matrix/services/jQueryError.php",
	                    notify = function(event, jqXHR, ajaxSettings, errorThrown) {
	                        //insert an "image" which has a web service as the src,
	                        //the web service sends email to ucs-webteam
	                        $("<img />", {
	                            src:
	                                webService +
	                                "?u=" +
	                                escape(windowLocation.href) +
	                                "&s=" +
	                                escape(ajaxSettings.url) +
	                                "&t=" +
	                                ajaxSettings.type +
	                                "&e=" +
	                                escape(errorThrown),
	                            style: "display: none"
	                        }).appendTo("#footer");
	                    };
	
	                //register this as a global ajax event handler
	                $(document).ajaxError(notify);
	            },
	            /**
	             * This is our yepnope filter
	             *
	             * splices in the version string we have set up in setVersion
	             * prepends the correct s1 domain, where it hasn't been provided
	             *
	             * N.B. will fail if we have an s1 top level folder containing
	             * dots (see comment below)
	             *
	             */
	            yepnopeFilter = function(resource) {
	                var loc, lastItem;
	                /*
	                 If we are loading in an absolute url, don't touch it
	                 * this is the regex which fails on a top level folder with dots
	                 *
	                 * matches:
	                 * http://www.external.com/scripts/script.js
	                 * www.external.com/scripts/script.js
	                 * absolute.with.many.sub.domains.domain.com/scripts/script.js
	                 * https://absoulte.with.many.sub.domains.domain.com/scripts/script.js
	                 *
	                 * doesn't match:
	                 * modules/test.js
	                 * lib/subdir/script.js
	                 * lib/subdir.123/script.js
	                 *
	                 * will match when we don't want to:
	                 * toplevel.with.dots/script.js
	                 * lib.v2/jquery/script.js
	                 *
	                 * I think it's an unlikely issue, but if anyone can tweak the regex
	                 * to prevent this please do.
	                 *
	                 */
	
	                if (/^(https?:\/\/)?([^\/.]+\.)+[^\/]+\//.test(resource.url)) {
	                    return resource;
	                }
	
	                loc =
	                    //already contains s1? - don't add prefix
	                    ((/s1/.test(resource.url) ? "" : srcPrefix) + resource.url)
	                        //split for splicing
	                        .split("/");
	
	                //splice in version
	                lastItem = loc.length - 1;
	                loc[lastItem] = version + loc[lastItem];
	
	                resource.url = loc.join("/");
	
	                // if on prod and we are loading a module/.js file
	                // we want .min.js rather than .js
	                if (/s1\.city/.test(resource.url) && !/js\/lib/.test(resource.url)) {
	                    resource.url = resource.url.replace(/js$/, "min.js");
	                }
	
	                return resource;
	            },
	            /**
	             *
	             * What needs to happen after a bxslider carousel has finished loading:
	             * 1. inject controls into @widget. finds default bxslider controls, replace with font awesome icons and append in widget
	             * 2. add scrollable class to widget content
	             * 3. remove loading spinner
	             * @param jQuery widget: a jquery wrapped .widget (needed for widget controls)
	             * @param string middleButtonText: what to write on the middle button (defaults to "All") (needed for widget controls)
	             * @param string allLink: the "all" middle button href (needed for widget controls)
	             */
	            afterBxSliderLoaded = function($widget, allLink, middleButtonText) {
	                var // carousel controls
	                    previousButton = $widget.find(".bx-prev"),
	                    nextButton = $widget.find(".bx-next"),
	                    inputMiddleButtonText = middleButtonText ? middleButtonText : "All";
	
	                // remove widget loading spinner
	                $widget.removeClass("widget-loading");
	
	                // add the "all" button between previous and next buttons if it is needed
	                if (allLink) {
	                    previousButton.after('<a href="' + allLink + '" class="bx-all" >' + inputMiddleButtonText + "</a>");
	                }
	            },
	            /**
	             * creates a standard carousel widget, e.g. events, news
	             * @param Object - the widget container
	             */
	            standardCarouselWidget = function($widget, allLink, showAmount, wrap) {
	                var $list, widgetBxOptions;
	
	                if (!$widget) {
	                    return;
	                }
	
	                showAmount = showAmount || 3;
	                $list = $widget.find(".items");
	                wrap = wrap || false;
	
	                //reformat the content into column sizes based on determined size, if there are more than showAmount items
	                if ($list.find("> .item").size() > showAmount) {
	                    widgetBxOptions = {
	                        auto: false,
	                        autoControls: false,
	                        pause: 15000,
	                        autoHover: true,
	                        touchEnabled: false,
	                        pager: false,
	                        infiniteLoop: false,
	                        hideControlOnEnd: true,
	                        adaptiveHeight: true,
	                        nextText: '<span class="visuallyhidden">Next</span><i class="icon-caret-right"></i>',
	                        prevText: '<span class="visuallyhidden">Previous</span><i class="icon-caret-left"></i>',
	                        onSliderLoad: function() {
	                            afterBxSliderLoaded($widget, allLink);
	                        }
	                    };
	
	                    if (wrap) {
	                        //set up sortable
	                        $list.wrapChildren({
	                            childElem: "li",
	                            sets: showAmount
	                        });
	                    }
	
	                    $list.bxSlider(widgetBxOptions);
	                } else {
	                    //remove widget loading spinner, case where the carousel isn't needed
	                    $widget.removeClass("widget-loading");
	                }
	            },
	            /*
	         Taking this out as not convinced it still works, put it back if someone ever asks for a Flickr widget
	         initFlickr = function () {
	
	         var $widget = $("#flickr-widget"),
	         $slideWrapper = $widget.find("ul"),
	         loadedOtherPics,
	         bxSliderCallback = function () {
	
	         debug("flickr callback...");
	
	         $(".widget-content", $widget).each(function () {
	
	         //find the ul
	         var firstdiv = $("ul div:first-child", this),
	         //ul = $("ul", this), defined not used
	         thisJq = $(this),
	         height = firstdiv.height(),
	         width = firstdiv.width();
	
	         //add classes
	         thisJq.addClass("scrollable");
	
	         //add css to .widget-content
	         thisJq.stop().animate({
	         "min-height": height
	         });
	         thisJq.css("width", width);
	
	         //remove loading icon when the content is ready
	         $widget.removeClass("widget-loading");
	
	         });
	
	         afterBxSliderLoaded($widget);
	
	         };
	
	         //attach an event to init the rest of the pics
	         $widget.mouseenter(function () {
	
	         //we only want to run this once
	         if (loadedOtherPics) {
	         return;
	         }
	
	         loadedOtherPics = true;
	
	         //translate all the span.imageurl"s into actual images
	         //(saves some rendering time)
	         $("a .imageurl", $widget).each(function () {
	
	         var thisJq = $(this),
	         text = thisJq.text(),
	         imgTag = "<img src=\"" + text + "\" alt=\"\">";
	
	         thisJq.parent().text("").prepend(imgTag);
	
	         });
	
	         $("p .imageurl", $widget).each(function () {
	         var thisJq = $(this),
	         text = thisJq.text(),
	         styleAttr = "background-image: url(" + text + ");";
	
	         thisJq.parent().attr("style", styleAttr);
	         thisJq.remove();
	
	         });
	
	         });
	
	         //set up scrollable
	         $slideWrapper.bxSlider({
	         auto: false,
	         autoControls: false,
	         pause: 15000,
	         autoHover: true,
	         touchEnabled: false,
	         pager: false,
	         infiniteLoop: false,
	         hideControlOnEnd: true,
	         adaptiveHeight: true,
	         nextText : "<span class=\"visuallyhidden\">Next</span><i class=\"icon-caret-right\"></i>",
	         prevText : "<span class=\"visuallyhidden\">Previous</span><i class=\"icon-caret-left\"></i>",
	         onSliderLoad: function(){
	         bxSliderCallback();
	         }
	         });
	
	         },// end initFlickr*/
	
	            /**
	             * map widget
	             */
	            initMap = function() {
	                var googleMapsMarkers = {},
	                    $mapJsData = $(".mapJsData"),
	                    mapsCallback = function() {
	                        var dialogProperties = {
	                                autoOpen: false,
	                                modal: true,
	                                width: 500,
	                                height: 500,
	                                position: ["top", "right"],
	                                title: "Find Us",
	                                resizable: false
	                            },
	                            //register the long/lat for this page as a google maps LongLat object, take from first marker (should always be at least one)
	                            //thisLatLng = new google.maps.LatLng(googleMapsMarkers.marker0.geolat, googleMapsMarkers.marker0.geolong),
	                            thisLatLng,
	                            mapProperties = {
	                                zoom: 15,
	                                //center: thisLatLng,
	                                disableDefaultUI: true,
	                                navigationControl: true,
	                                scaleControl: true,
	                                mapTypeId: google.maps.MapTypeId.ROADMAP,
	                                streetViewControl: true
	                            },
	                            $mapOverlayPane = $("<div>", {
	                                text: "Map here!",
	                                id: "mapBig"
	                            });
	                        //end vars
	
	                        // begin
	
	                        //populate googleMapsMarkers object with geo vars from the page
	                        $mapJsData.each(function(i) {
	                            googleMapsMarkers["marker" + i] = {};
	
	                            $("li.map-param", this).each(function() {
	                                var elementName = $(this)
	                                    .attr("class")
	                                    .replace("asset_metadata_", "")
	                                    .replace(".", "")
	                                    .replace("map-param", "")
	                                    .replace(" ", "");
	
	                                if (elementName === "geodescription") {
	                                    googleMapsMarkers["marker" + i][elementName] = $(this).html();
	                                } else {
	                                    googleMapsMarkers["marker" + i][elementName] = $(this).text();
	                                }
	                            });
	                        });
	
	                        // register the long/lat for this page as a google maps LongLat object, take from first marker (should always be at least one)
	                        thisLatLng = new google.maps.LatLng(
	                            googleMapsMarkers.marker0.geolat,
	                            googleMapsMarkers.marker0.geolong
	                        );
	
	                        mapProperties.center = thisLatLng;
	
	                        $mapOverlayPane.appendTo("body").dialog(dialogProperties);
	
	                        //bind events
	                        $mapOverlayPane.on("dialogopen", function() {
	                            //probably not best that we do this on every open, but don't think
	                            //there is a google Map destructor and it doesn't seem to cause issues
	                            var map = new google.maps.Map(document.getElementById("mapBig"), mapProperties),
	                                //initlaise infoWindow
	                                infoWindow = new google.maps.InfoWindow({
	                                    maxWidth: 400
	                                }),
	                                //bind info window to marker
	                                bindInfoWindow = function(marker, description, map, infoWindow) {
	                                    google.maps.event.addListener(marker, "click", function() {
	                                        infoWindow.setContent(description);
	                                        infoWindow.open(map, marker);
	                                    });
	                                }, //end bind info window
	                                createMarker = function(point, name, description, icon, map, infoWindow) {
	                                    var marker = new google.maps.Marker({
	                                        map: map,
	                                        position: point,
	                                        icon: icon,
	                                        title: name
	                                    });
	
	                                    bindInfoWindow(marker, description, map, infoWindow);
	                                }; //end createMarker
	                            // end vars
	
	                            $.each(googleMapsMarkers, function() {
	                                var point = new google.maps.LatLng(this.geolat, this.geolong);
	
	                                createMarker(
	                                    point,
	                                    this.geoplacename,
	                                    this.geodescription,
	                                    this.geoiconUrl,
	                                    map,
	                                    infoWindow
	                                );
	                            });
	                        }); //end $mapOverlayPane.on
	
	                        //override the map clicks
	                        $(".widget .map").on("click", function(e) {
	                            e.preventDefault();
	                            $mapOverlayPane.dialog("open");
	                        });
	                    }; //end mapsCallback
	
	                if ($mapJsData.length) {
	                    mapsCallback();
	                }
	            },
	            /**
	             * courses widget
	             */
	            initCourses = function() {
	                var $widget = $("#courses-widget"),
	                    $widgetContent = $widget.find(".widget-content");
	
	                $widgetContent.accordion({
	                    heightStyle: "content",
	                    collapsible: true,
	                    active: false,
	                    animate: false,
	                    icons: false,
	                    create: function() {
	                        afterBxSliderLoaded($widget);
	                    }
	                });
	            }, //end initCourses
	            /**
	             * Call to action widget
	             */
	            initCallToAction = function() {
	                var start_date = $("#start_date").val(),
	                    end_date = $("#end_date").val(),
	                    sd = new Date(),
	                    ed = new Date(),
	                    cd,
	                    splitDate = function(dt, idt) {
	                        var dateArray = dt.split("/"),
	                            endofArray = dateArray[2].split(" ");
	
	                        idt.setFullYear(endofArray[0]);
	                        idt.setMonth(dateArray[1] - 1);
	                        idt.setDate(dateArray[0]);
	
	                        return idt;
	                    };
	
	                sd = splitDate(start_date, sd);
	                ed = splitDate(end_date, ed);
	
	                //current date
	                cd = new Date();
	
	                if (ed >= cd && sd <= cd) {
	                    //Show the on date
	                    $("#content_on_date").attr("class", "widget-content cta-widget-show");
	                    $("#content_out_of_date").attr("class", "cta-widget-hide");
	                } else {
	                    //Show out of date
	                    $("#content_out_of_date").attr("class", "widget-content cta-widget-show");
	                    $("#content_on_date").attr("class", "cta-widget-hide");
	                }
	            },
	            /**
	             * initiates an image gallery widget
	             *
	             * @return {object || undefined} returns the galleria jQuery object if
	             * successful else undefined - for instance if $gallery is not a jQuery object
	             *
	             */
	            initGallery = function() {
	                var $gallery = $("#gallery-widget .gallery");
	                return createGallery($gallery, true);
	            },
	            /**
	             * The master widget initialiser, calls all the other init{map,events...} functions
	             */
	            initWidgets = function() {
	                var widgets = {
	                        map: {
	                            f: initMap
	                        },
	                        courses: {
	                            f: initCourses
	                        },
	                        events: {
	                            f: standardCarouselWidget,
	                            allLink: "//www.cass.city.ac.uk/events",
	                            showAmount: 3,
	                            wrap: true
	                        },
	                        news: {
	                            f: standardCarouselWidget,
	                            allLink: "//www.cass.city.ac.uk/news",
	                            showAmount: 3,
	                            wrap: true
	                        },
	                        testimonials: {
	                            f: standardCarouselWidget,
	                            showAmount: 1,
	                            wrap: false
	                        },
	                        "spotlight-research": {
	                            f: standardCarouselWidget,
	                            showAmount: 1,
	                            wrap: false
	                        },
	                        rss: {
	                            f: standardCarouselWidget,
	                            showAmount: 1,
	                            wrap: false
	                        },
	                        profiles: {
	                            f: standardCarouselWidget,
	                            showAmount: 1,
	                            wrap: false
	                        },
	                        gallery: {
	                            f: initGallery
	                        },
	                        cta: {
	                            f: initCallToAction
	                        } /*,
	                         "flickr" : {
	                         f: initFlickr
	                         },*/
	                    },
	                    widget,
	                    currentWidget,
	                    initFn;
	
	                debug("init widget related scripts");
	
	                // loop through each widget type and init if present
	                for (widget in widgets) {
	                    if (typeof widgets[widget] !== "function") {
	                        //debug("searching for " + i);
	                        currentWidget = $("#" + widget + "-widget");
	
	                        //bail here if the widget is not present
	                        if (currentWidget.length === 0) {
	                            debug("no " + widget + " widget");
	                            continue;
	                        }
	
	                        initFn = widgets[widget].f;
	
	                        //bail here if we can't find init func
	                        if (typeof initFn !== "function") {
	                            debug("can't find init func of " + widget + " widget");
	                            continue;
	                        }
	
	                        // run the init
	                        debug("running init func of " + widget + " widget");
	
	                        if (initFn === standardCarouselWidget) {
	                            initFn.apply(this, [
	                                currentWidget,
	                                widgets[widget].allLink,
	                                widgets[widget].showAmount,
	                                widgets[widget].wrap
	                            ]);
	                        } else {
	                            initFn.apply();
	                        }
	                    }
	                }
	            }, // end initWidgets
	            /**
	             * Stuff needed on everypage - explore city, login etc.
	             */
	            initPage = function() {
	                var $windowObj = $(w),
	                    $body = $("body"),
	                    // search
	                    $form = $body.find(".header-search"),
	                    $query = $form.find(".header-search__query"),
	                    collection = "main-all",
	                    // navigation
	                    //VI $globalNav = $body.find("#global-nav"),
	                    $breadcrumbsNav = $("#breadcrumbs-nav"),
	                    $responsiveTogglers = $(".responsive-toggler"), // buttons to hide/show navigation menus
	                    //VI $togglees = $(".toggle"),                               // the areas to be shown/hidden when the above button is clicked
	                    /* VI $globalNavAccordionOptions = {
	                        header: ".header",
	                        active: false,
	                        collapsible: true,
	                        autoHeight: true,
	                        animate: false,
	                        icons: false
	                    },*/
	                    // in page UI elements
	                    $content = $("#content"),
	                    $carouselObj = $("#promo-area"), // carousel container
	                    $accordions = $body.find(".accordion"),
	                    $tabs = $body.find(".tabs"),
	                    $ytModule = $(".yt-module"),
	                    $galleries = $content.find(".gallery"),
	                    $images = $content.find("img");
	                //end initPage vars
	
	                // funky loading images
	                if ($images.complete) {
	                    imageLoaded($images);
	                }
	
	                $images.each(function() {
	                    if (this.complete) {
	                        imageLoaded(this);
	                    }
	                    $(this).on("load", imageLoaded);
	                });
	
	                // set screensize
	                screenSize = getWindowWidth(window) >= breakpoints.wide ? "wide" : "mobile";
	
	                // attach click events on mobile navigation togglers
	                $responsiveTogglers.on("click", function(e) {
	                    var $self = $(this),
	                        $toggle = $self.next(".toggle");
	
	                    e.preventDefault();
	                    $self.toggleClass("active");
	                    $toggle.toggleClass("active");
	
	                    //if ($self.hasClass("global-nav-bttn")) {
	                    //    // need to refesh to calculate height when accordion is visible
	                    //    $globalNav.accordion("refresh");
	                    //}
	                });
	
	                if (!Modernizr.svg) {
	                    $(".logo img").attr("src", function() {
	                        return $(this)
	                            .attr("src")
	                            .replace(".svg", ".png");
	                    });
	                }
	
	                // if current-page is first in the menu, it needs different padding
	                if ($breadcrumbsNav.find("li").length === 0) {
	                    $(".current-page").addClass("first");
	                    $breadcrumbsNav.remove();
	                }
	
	                // keyboard accessible dropdowns
	                /* VI
	                $globalNav.find("a").focus(function () {
	                    $(this).parents(".dd").addClass("hover");
	                }).blur(function () {
	                    $(this).parents(".dd").removeClass("hover");
	                });
	                */
	
	                // on page load if we start with wide sized browser we want
	                // the mega dropdowns
	                /* VI
	                if (screenSize === "wide") {
	
	                } else {
	                    $globalNav.data("ui", "accordion");
	                    $globalNav.accordion($globalNavAccordionOptions);
	                }
	                */
	
	                // attach resize event to window
	                /* VI
	                $windowObj.resize(function () {
	
	                    if (!viewportChanged()) {
	                        return;
	                    }
	
	                    if (getWindowWidth(window) >= breakpoints.wide) {
	                        //big to small?
	                        screenSize = "wide";
	                        //console.log("small to big, TODO: kill accordion");
	
	                        // destroy accordion
	                        if ($globalNav.data("ui") === "accordion") {
	                            $globalNav.data("ui", "");
	                            $globalNav.accordion("destroy");
	                        }
	
	                        // close any openers which were open before width change
	                        $responsiveTogglers.removeClass("active");
	                        $togglees.removeClass("active");
	
	                    } else {
	                        //console.log("big to small");
	                        screenSize = "mobile";
	                        $globalNav.data("ui", "accordion");
	                        $globalNav.accordion($globalNavAccordionOptions);
	
	                    }
	
	                });
	                */
	
	                // initalise any accordions found
	                $accordions.accordion({
	                    heightStyle: "content",
	                    collapsible: true,
	                    active: false,
	                    animate: false,
	                    icons: false
	                });
	
	                // initalise any tabs found
	                // make sure we trigger statefull tabs if needed
	                if ($tabs.hasClass("statefull-tabs")) {
	                    $tabs.tabs({
	                        create: function() {
	                            var hash = getUrlHash(),
	                                appendHash;
	                            if (hash.length === 1) {
	                                appendHash = parseInt(hash[0].split("=")[1]) - 1;
	                                $tabs.find("a:eq(" + parseInt(appendHash) + ")").click();
	                            }
	                        },
	                        activate: function(event, ui) {
	                            var newHash = "#courses-details=" + ($(ui.newTab[0]).index() + 1);
	                            if (history.pushState) {
	                                history.pushState(null, null, newHash);
	                            } else {
	                                location.hash = newHash;
	                            }
	                        }
	                    });
	                } else {
	                    $tabs.tabs();
	                }
	
	                // if we have a carousel - set it up
	                if ($carouselObj.length !== 0) {
	                    yepnope({
	                        load: scripts.underscore.src,
	                        callback: function() {
	                            createSlider($carouselObj);
	                        }
	                    });
	                }
	
	                // if a gallery is found invoke initGallery for each
	                if ($galleries.length !== 0) {
	                    $galleries.each(function() {
	                        createGallery($(this), false);
	                    });
	                }
	
	                // fallback for browsers that don't understand placeholder attribute
	                if (!Modernizr.input.placeholder) {
	                    $("[placeholder]")
	                        .focus(function() {
	                            var input = $(this);
	                            if (input.val() === input.attr("placeholder")) {
	                                input.val("");
	                                input.removeClass("placeholder");
	                            }
	                        })
	                        .blur(function() {
	                            var input = $(this);
	                            if (input.val() === "" || input.val() === input.attr("placeholder")) {
	                                input.addClass("placeholder");
	                                input.val(input.attr("placeholder"));
	                            }
	                        })
	                        .blur();
	                    $("[placeholder]")
	                        .parents("form")
	                        .submit(function() {
	                            $(this)
	                                .find("[placeholder]")
	                                .each(function() {
	                                    var input = $(this);
	                                    if (input.val() === input.attr("placeholder")) {
	                                        input.val("");
	                                    }
	                                });
	                        });
	                }
	
	                //set up autocomplete on search box
	                searchAutoComplete($form, $query, collection);
	
	                //catch any hallway style call to action or banner action
	                if ($content.find(".action-hallway, .banner-hallway").length) {
	                    CASS.load("hallway");
	                }
	
	                // catch any videos that have been manually input
	                $("iframe[src*='youtube']").each(function() {
	                    var $element = $(this),
	                        vidWidth = $element.outerWidth(),
	                        $parent = $element.parent();
	
	                    // don't double wrap an iframe
	                    if (!$parent.hasClass("embed-container")) {
	                        // for elastic objects, we need 2 (!) wrappers
	                        $element.wrap(
	                            '<div class="embed-wrapper" style="max-width:' +
	                                vidWidth +
	                                'px"><div class="embed-container"></div></div>'
	                        );
	                    }
	                });
	
	                // YouTube module
	                if ($ytModule.length) {
	                    yepnope({
	                        load: scripts.underscore.src,
	                        complete: function() {
	                            ytModule($ytModule);
	                        }
	                    });
	                }
	            }, //end initPage
	            /** deferred functions **/
	            initDeferred = function() {
	                if (typeof CITY_OPTIONS !== "undefined" && CITY_OPTIONS.defer) {
	                    for (var i = 0; i < CITY_OPTIONS.defer.length; i++) {
	                        CITY_OPTIONS.defer[i]();
	                    }
	                }
	            },
	            /**
	             * Initialisation function, called immediately after CASS declaration below
	             */
	            init = function() {
	                debug("CASS ready (we are in " + document.compatMode + ")");
	                yepnope.addFilter(yepnopeFilter);
	
	                // the following needs domready
	                $(function() {
	                    initPage();
	
	                    initHeader($);
	
	                    imageCreditation();
	
	                    initDeferred();
	
	                    initWidgets();
	
	                    //set up any videos on page
	                    videos();
	
	                    // set up shadowbox
	                    Shadowbox.init({ overlayOpacity: 0.9 });
	
	                    initCookieNotice($);
	
	                    //initCookieSurvey($);
	
	                    //while we are developing, lets include the devstuff
	                    // load("devStuff");
	
	                    //set up the js failure notification
	                    initJsFailureNotifier();
	                });
	            };
	
	        // end CASS var
	
	        /**
	         *  This literal defines what methods to make publicly accessible
	         *  outsite CASS
	         */
	        return {
	            init: init,
	            load: load,
	            debug: debug,
	            setVersion: setVersion,
	            isEven: isEven,
	            getUrlVars: getUrlVars,
	            objectSize: objectSize,
	            getWindowWidth: getWindowWidth,
	            s1Server: srcPrefix,
	            isCass: isCass,
	            isBunhill: isBunhill
	        };
	    })(window, Modernizr, yepnope);
	// end CASS
	
	window.CASS = CASS;
	window.Cookies = Cookies;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = function () {
	
	    var jQuery = __webpack_require__(2);
	    window.jQuery = window.$ = jQuery;
	    
	    __webpack_require__(4);
	    __webpack_require__(5);
	    __webpack_require__(6);
	
	    __webpack_require__(7)(window.jQuery);
	
	    __webpack_require__(8);
	
	    return window.jQuery;
	}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * jQuery JavaScript Library v1.10.2
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2013-07-03T13:48Z
	 */
	(function( window, undefined ) {
	
	// Can't do this because several apps including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	// Support: Firefox 18+
	//"use strict";
	    var
	    // The deferred used on DOM ready
	        readyList,
	
	    // A central reference to the root jQuery(document)
	        rootjQuery,
	
	    // Support: IE<10
	    // For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	        core_strundefined = typeof undefined,
	
	    // Use the correct document accordingly with window argument (sandbox)
	        location = window.location,
	        document = window.document,
	        docElem = document.documentElement,
	
	    // Map over jQuery in case of overwrite
	        _jQuery = window.jQuery,
	
	    // Map over the $ in case of overwrite
	        _$ = window.$,
	
	    // [[Class]] -> type pairs
	        class2type = {},
	
	    // List of deleted data cache ids, so we can reuse them
	        core_deletedIds = [],
	
	        core_version = "1.10.2",
	
	    // Save a reference to some core methods
	        core_concat = core_deletedIds.concat,
	        core_push = core_deletedIds.push,
	        core_slice = core_deletedIds.slice,
	        core_indexOf = core_deletedIds.indexOf,
	        core_toString = class2type.toString,
	        core_hasOwn = class2type.hasOwnProperty,
	        core_trim = core_version.trim,
	
	    // Define a local copy of jQuery
	        jQuery = function( selector, context ) {
	            // The jQuery object is actually just the init constructor 'enhanced'
	            return new jQuery.fn.init( selector, context, rootjQuery );
	        },
	
	    // Used for matching numbers
	        core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
	
	    // Used for splitting on whitespace
	        core_rnotwhite = /\S+/g,
	
	    // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	
	    // A simple way to check for HTML strings
	    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	    // Strict HTML recognition (#11290: must start with <)
	        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
	
	    // Match a standalone tag
	        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	
	    // JSON RegExp
	        rvalidchars = /^[\],:{}\s]*$/,
	        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
	
	    // Matches dashed string for camelizing
	        rmsPrefix = /^-ms-/,
	        rdashAlpha = /-([\da-z])/gi,
	
	    // Used by jQuery.camelCase as callback to replace()
	        fcamelCase = function( all, letter ) {
	            return letter.toUpperCase();
	        },
	
	    // The ready event handler
	        completed = function( event ) {
	
	            // readyState === "complete" is good enough for us to call the dom ready in oldIE
	            if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
	                detach();
	                jQuery.ready();
	            }
	        },
	    // Clean-up method for dom ready events
	        detach = function() {
	            if ( document.addEventListener ) {
	                document.removeEventListener( "DOMContentLoaded", completed, false );
	                window.removeEventListener( "load", completed, false );
	
	            } else {
	                document.detachEvent( "onreadystatechange", completed );
	                window.detachEvent( "onload", completed );
	            }
	        };
	
	    jQuery.fn = jQuery.prototype = {
	        // The current version of jQuery being used
	        jquery: core_version,
	
	        constructor: jQuery,
	        init: function( selector, context, rootjQuery ) {
	            var match, elem;
	
	            // HANDLE: $(""), $(null), $(undefined), $(false)
	            if ( !selector ) {
	                return this;
	            }
	
	            // Handle HTML strings
	            if ( typeof selector === "string" ) {
	                if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
	                    // Assume that strings that start and end with <> are HTML and skip the regex check
	                    match = [ null, selector, null ];
	
	                } else {
	                    match = rquickExpr.exec( selector );
	                }
	
	                // Match html or make sure no context is specified for #id
	                if ( match && (match[1] || !context) ) {
	
	                    // HANDLE: $(html) -> $(array)
	                    if ( match[1] ) {
	                        context = context instanceof jQuery ? context[0] : context;
	
	                        // scripts is true for back-compat
	                        jQuery.merge( this, jQuery.parseHTML(
	                            match[1],
	                            context && context.nodeType ? context.ownerDocument || context : document,
	                            true
	                        ) );
	
	                        // HANDLE: $(html, props)
	                        if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
	                            for ( match in context ) {
	                                // Properties of context are called as methods if possible
	                                if ( jQuery.isFunction( this[ match ] ) ) {
	                                    this[ match ]( context[ match ] );
	
	                                    // ...and otherwise set as attributes
	                                } else {
	                                    this.attr( match, context[ match ] );
	                                }
	                            }
	                        }
	
	                        return this;
	
	                        // HANDLE: $(#id)
	                    } else {
	                        elem = document.getElementById( match[2] );
	
	                        // Check parentNode to catch when Blackberry 4.6 returns
	                        // nodes that are no longer in the document #6963
	                        if ( elem && elem.parentNode ) {
	                            // Handle the case where IE and Opera return items
	                            // by name instead of ID
	                            if ( elem.id !== match[2] ) {
	                                return rootjQuery.find( selector );
	                            }
	
	                            // Otherwise, we inject the element directly into the jQuery object
	                            this.length = 1;
	                            this[0] = elem;
	                        }
	
	                        this.context = document;
	                        this.selector = selector;
	                        return this;
	                    }
	
	                    // HANDLE: $(expr, $(...))
	                } else if ( !context || context.jquery ) {
	                    return ( context || rootjQuery ).find( selector );
	
	                    // HANDLE: $(expr, context)
	                    // (which is just equivalent to: $(context).find(expr)
	                } else {
	                    return this.constructor( context ).find( selector );
	                }
	
	                // HANDLE: $(DOMElement)
	            } else if ( selector.nodeType ) {
	                this.context = this[0] = selector;
	                this.length = 1;
	                return this;
	
	                // HANDLE: $(function)
	                // Shortcut for document ready
	            } else if ( jQuery.isFunction( selector ) ) {
	                return rootjQuery.ready( selector );
	            }
	
	            if ( selector.selector !== undefined ) {
	                this.selector = selector.selector;
	                this.context = selector.context;
	            }
	
	            return jQuery.makeArray( selector, this );
	        },
	
	        // Start with an empty selector
	        selector: "",
	
	        // The default length of a jQuery object is 0
	        length: 0,
	
	        toArray: function() {
	            return core_slice.call( this );
	        },
	
	        // Get the Nth element in the matched element set OR
	        // Get the whole matched element set as a clean array
	        get: function( num ) {
	            return num == null ?
	
	                // Return a 'clean' array
	                this.toArray() :
	
	                // Return just the object
	                ( num < 0 ? this[ this.length + num ] : this[ num ] );
	        },
	
	        // Take an array of elements and push it onto the stack
	        // (returning the new matched element set)
	        pushStack: function( elems ) {
	
	            // Build a new jQuery matched element set
	            var ret = jQuery.merge( this.constructor(), elems );
	
	            // Add the old object onto the stack (as a reference)
	            ret.prevObject = this;
	            ret.context = this.context;
	
	            // Return the newly-formed element set
	            return ret;
	        },
	
	        // Execute a callback for every element in the matched set.
	        // (You can seed the arguments with an array of args, but this is
	        // only used internally.)
	        each: function( callback, args ) {
	            return jQuery.each( this, callback, args );
	        },
	
	        ready: function( fn ) {
	            // Add the callback
	            jQuery.ready.promise().done( fn );
	
	            return this;
	        },
	
	        slice: function() {
	            return this.pushStack( core_slice.apply( this, arguments ) );
	        },
	
	        first: function() {
	            return this.eq( 0 );
	        },
	
	        last: function() {
	            return this.eq( -1 );
	        },
	
	        eq: function( i ) {
	            var len = this.length,
	                j = +i + ( i < 0 ? len : 0 );
	            return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	        },
	
	        map: function( callback ) {
	            return this.pushStack( jQuery.map(this, function( elem, i ) {
	                return callback.call( elem, i, elem );
	            }));
	        },
	
	        end: function() {
	            return this.prevObject || this.constructor(null);
	        },
	
	        // For internal use only.
	        // Behaves like an Array's method, not like a jQuery method.
	        push: core_push,
	        sort: [].sort,
	        splice: [].splice
	    };
	
	// Give the init function the jQuery prototype for later instantiation
	    jQuery.fn.init.prototype = jQuery.fn;
	
	    jQuery.extend = jQuery.fn.extend = function() {
	        var src, copyIsArray, copy, name, options, clone,
	            target = arguments[0] || {},
	            i = 1,
	            length = arguments.length,
	            deep = false;
	
	        // Handle a deep copy situation
	        if ( typeof target === "boolean" ) {
	            deep = target;
	            target = arguments[1] || {};
	            // skip the boolean and the target
	            i = 2;
	        }
	
	        // Handle case when target is a string or something (possible in deep copy)
	        if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
	            target = {};
	        }
	
	        // extend jQuery itself if only one argument is passed
	        if ( length === i ) {
	            target = this;
	            --i;
	        }
	
	        for ( ; i < length; i++ ) {
	            // Only deal with non-null/undefined values
	            if ( (options = arguments[ i ]) != null ) {
	                // Extend the base object
	                for ( name in options ) {
	                    src = target[ name ];
	                    copy = options[ name ];
	
	                    // Prevent never-ending loop
	                    if ( target === copy ) {
	                        continue;
	                    }
	
	                    // Recurse if we're merging plain objects or arrays
	                    if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
	                        if ( copyIsArray ) {
	                            copyIsArray = false;
	                            clone = src && jQuery.isArray(src) ? src : [];
	
	                        } else {
	                            clone = src && jQuery.isPlainObject(src) ? src : {};
	                        }
	
	                        // Never move original objects, clone them
	                        target[ name ] = jQuery.extend( deep, clone, copy );
	
	                        // Don't bring in undefined values
	                    } else if ( copy !== undefined ) {
	                        target[ name ] = copy;
	                    }
	                }
	            }
	        }
	
	        // Return the modified object
	        return target;
	    };
	
	    jQuery.extend({
	        // Unique for each copy of jQuery on the page
	        // Non-digits removed to match rinlinejQuery
	        expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),
	
	        noConflict: function( deep ) {
	            if ( window.$ === jQuery ) {
	                window.$ = _$;
	            }
	
	            if ( deep && window.jQuery === jQuery ) {
	                window.jQuery = _jQuery;
	            }
	
	            return jQuery;
	        },
	
	        // Is the DOM ready to be used? Set to true once it occurs.
	        isReady: false,
	
	        // A counter to track how many items to wait for before
	        // the ready event fires. See #6781
	        readyWait: 1,
	
	        // Hold (or release) the ready event
	        holdReady: function( hold ) {
	            if ( hold ) {
	                jQuery.readyWait++;
	            } else {
	                jQuery.ready( true );
	            }
	        },
	
	        // Handle when the DOM is ready
	        ready: function( wait ) {
	
	            // Abort if there are pending holds or we're already ready
	            if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
	                return;
	            }
	
	            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
	            if ( !document.body ) {
	                return setTimeout( jQuery.ready );
	            }
	
	            // Remember that the DOM is ready
	            jQuery.isReady = true;
	
	            // If a normal DOM Ready event fired, decrement, and wait if need be
	            if ( wait !== true && --jQuery.readyWait > 0 ) {
	                return;
	            }
	
	            // If there are functions bound, to execute
	            readyList.resolveWith( document, [ jQuery ] );
	
	            // Trigger any bound ready events
	            if ( jQuery.fn.trigger ) {
	                jQuery( document ).trigger("ready").off("ready");
	            }
	        },
	
	        // See test/unit/core.js for details concerning isFunction.
	        // Since version 1.3, DOM methods and functions like alert
	        // aren't supported. They return false on IE (#2968).
	        isFunction: function( obj ) {
	            return jQuery.type(obj) === "function";
	        },
	
	        isArray: Array.isArray || function( obj ) {
	            return jQuery.type(obj) === "array";
	        },
	
	        isWindow: function( obj ) {
	            /* jshint eqeqeq: false */
	            return obj != null && obj == obj.window;
	        },
	
	        isNumeric: function( obj ) {
	            return !isNaN( parseFloat(obj) ) && isFinite( obj );
	        },
	
	        type: function( obj ) {
	            if ( obj == null ) {
	                return String( obj );
	            }
	            return typeof obj === "object" || typeof obj === "function" ?
	            class2type[ core_toString.call(obj) ] || "object" :
	                typeof obj;
	        },
	
	        isPlainObject: function( obj ) {
	            var key;
	
	            // Must be an Object.
	            // Because of IE, we also have to check the presence of the constructor property.
	            // Make sure that DOM nodes and window objects don't pass through, as well
	            if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
	                return false;
	            }
	
	            try {
	                // Not own constructor property must be Object
	                if ( obj.constructor &&
	                    !core_hasOwn.call(obj, "constructor") &&
	                    !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
	                    return false;
	                }
	            } catch ( e ) {
	                // IE8,9 Will throw exceptions on certain host objects #9897
	                return false;
	            }
	
	            // Support: IE<9
	            // Handle iteration over inherited properties before own properties.
	            if ( jQuery.support.ownLast ) {
	                for ( key in obj ) {
	                    return core_hasOwn.call( obj, key );
	                }
	            }
	
	            // Own properties are enumerated firstly, so to speed up,
	            // if last one is own, then all properties are own.
	            for ( key in obj ) {}
	
	            return key === undefined || core_hasOwn.call( obj, key );
	        },
	
	        isEmptyObject: function( obj ) {
	            var name;
	            for ( name in obj ) {
	                return false;
	            }
	            return true;
	        },
	
	        error: function( msg ) {
	            throw new Error( msg );
	        },
	
	        // data: string of html
	        // context (optional): If specified, the fragment will be created in this context, defaults to document
	        // keepScripts (optional): If true, will include scripts passed in the html string
	        parseHTML: function( data, context, keepScripts ) {
	            if ( !data || typeof data !== "string" ) {
	                return null;
	            }
	            if ( typeof context === "boolean" ) {
	                keepScripts = context;
	                context = false;
	            }
	            context = context || document;
	
	            var parsed = rsingleTag.exec( data ),
	                scripts = !keepScripts && [];
	
	            // Single tag
	            if ( parsed ) {
	                return [ context.createElement( parsed[1] ) ];
	            }
	
	            parsed = jQuery.buildFragment( [ data ], context, scripts );
	            if ( scripts ) {
	                jQuery( scripts ).remove();
	            }
	            return jQuery.merge( [], parsed.childNodes );
	        },
	
	        parseJSON: function( data ) {
	            // Attempt to parse using the native JSON parser first
	            if ( window.JSON && window.JSON.parse ) {
	                return window.JSON.parse( data );
	            }
	
	            if ( data === null ) {
	                return data;
	            }
	
	            if ( typeof data === "string" ) {
	
	                // Make sure leading/trailing whitespace is removed (IE can't handle it)
	                data = jQuery.trim( data );
	
	                if ( data ) {
	                    // Make sure the incoming data is actual JSON
	                    // Logic borrowed from http://json.org/json2.js
	                    if ( rvalidchars.test( data.replace( rvalidescape, "@" )
	                            .replace( rvalidtokens, "]" )
	                            .replace( rvalidbraces, "")) ) {
	
	                        return ( new Function( "return " + data ) )();
	                    }
	                }
	            }
	
	            jQuery.error( "Invalid JSON: " + data );
	        },
	
	        // Cross-browser xml parsing
	        parseXML: function( data ) {
	            var xml, tmp;
	            if ( !data || typeof data !== "string" ) {
	                return null;
	            }
	            try {
	                if ( window.DOMParser ) { // Standard
	                    tmp = new DOMParser();
	                    xml = tmp.parseFromString( data , "text/xml" );
	                } else { // IE
	                    xml = new ActiveXObject( "Microsoft.XMLDOM" );
	                    xml.async = "false";
	                    xml.loadXML( data );
	                }
	            } catch( e ) {
	                xml = undefined;
	            }
	            if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
	                jQuery.error( "Invalid XML: " + data );
	            }
	            return xml;
	        },
	
	        noop: function() {},
	
	        // Evaluates a script in a global context
	        // Workarounds based on findings by Jim Driscoll
	        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	        globalEval: function( data ) {
	            if ( data && jQuery.trim( data ) ) {
	                // We use execScript on Internet Explorer
	                // We use an anonymous function so that context is window
	                // rather than jQuery in Firefox
	                ( window.execScript || function( data ) {
	                    window[ "eval" ].call( window, data );
	                } )( data );
	            }
	        },
	
	        // Convert dashed to camelCase; used by the css and data modules
	        // Microsoft forgot to hump their vendor prefix (#9572)
	        camelCase: function( string ) {
	            return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	        },
	
	        nodeName: function( elem, name ) {
	            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	        },
	
	        // args is for internal usage only
	        each: function( obj, callback, args ) {
	            var value,
	                i = 0,
	                length = obj.length,
	                isArray = isArraylike( obj );
	
	            if ( args ) {
	                if ( isArray ) {
	                    for ( ; i < length; i++ ) {
	                        value = callback.apply( obj[ i ], args );
	
	                        if ( value === false ) {
	                            break;
	                        }
	                    }
	                } else {
	                    for ( i in obj ) {
	                        value = callback.apply( obj[ i ], args );
	
	                        if ( value === false ) {
	                            break;
	                        }
	                    }
	                }
	
	                // A special, fast, case for the most common use of each
	            } else {
	                if ( isArray ) {
	                    for ( ; i < length; i++ ) {
	                        value = callback.call( obj[ i ], i, obj[ i ] );
	
	                        if ( value === false ) {
	                            break;
	                        }
	                    }
	                } else {
	                    for ( i in obj ) {
	                        value = callback.call( obj[ i ], i, obj[ i ] );
	
	                        if ( value === false ) {
	                            break;
	                        }
	                    }
	                }
	            }
	
	            return obj;
	        },
	
	        // Use native String.trim function wherever possible
	        trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
	            function( text ) {
	                return text == null ?
	                    "" :
	                    core_trim.call( text );
	            } :
	
	            // Otherwise use our own trimming functionality
	            function( text ) {
	                return text == null ?
	                    "" :
	                    ( text + "" ).replace( rtrim, "" );
	            },
	
	        // results is for internal usage only
	        makeArray: function( arr, results ) {
	            var ret = results || [];
	
	            if ( arr != null ) {
	                if ( isArraylike( Object(arr) ) ) {
	                    jQuery.merge( ret,
	                        typeof arr === "string" ?
	                            [ arr ] : arr
	                    );
	                } else {
	                    core_push.call( ret, arr );
	                }
	            }
	
	            return ret;
	        },
	
	        inArray: function( elem, arr, i ) {
	            var len;
	
	            if ( arr ) {
	                if ( core_indexOf ) {
	                    return core_indexOf.call( arr, elem, i );
	                }
	
	                len = arr.length;
	                i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
	
	                for ( ; i < len; i++ ) {
	                    // Skip accessing in sparse arrays
	                    if ( i in arr && arr[ i ] === elem ) {
	                        return i;
	                    }
	                }
	            }
	
	            return -1;
	        },
	
	        merge: function( first, second ) {
	            var l = second.length,
	                i = first.length,
	                j = 0;
	
	            if ( typeof l === "number" ) {
	                for ( ; j < l; j++ ) {
	                    first[ i++ ] = second[ j ];
	                }
	            } else {
	                while ( second[j] !== undefined ) {
	                    first[ i++ ] = second[ j++ ];
	                }
	            }
	
	            first.length = i;
	
	            return first;
	        },
	
	        grep: function( elems, callback, inv ) {
	            var retVal,
	                ret = [],
	                i = 0,
	                length = elems.length;
	            inv = !!inv;
	
	            // Go through the array, only saving the items
	            // that pass the validator function
	            for ( ; i < length; i++ ) {
	                retVal = !!callback( elems[ i ], i );
	                if ( inv !== retVal ) {
	                    ret.push( elems[ i ] );
	                }
	            }
	
	            return ret;
	        },
	
	        // arg is for internal usage only
	        map: function( elems, callback, arg ) {
	            var value,
	                i = 0,
	                length = elems.length,
	                isArray = isArraylike( elems ),
	                ret = [];
	
	            // Go through the array, translating each of the items to their
	            if ( isArray ) {
	                for ( ; i < length; i++ ) {
	                    value = callback( elems[ i ], i, arg );
	
	                    if ( value != null ) {
	                        ret[ ret.length ] = value;
	                    }
	                }
	
	                // Go through every key on the object,
	            } else {
	                for ( i in elems ) {
	                    value = callback( elems[ i ], i, arg );
	
	                    if ( value != null ) {
	                        ret[ ret.length ] = value;
	                    }
	                }
	            }
	
	            // Flatten any nested arrays
	            return core_concat.apply( [], ret );
	        },
	
	        // A global GUID counter for objects
	        guid: 1,
	
	        // Bind a function to a context, optionally partially applying any
	        // arguments.
	        proxy: function( fn, context ) {
	            var args, proxy, tmp;
	
	            if ( typeof context === "string" ) {
	                tmp = fn[ context ];
	                context = fn;
	                fn = tmp;
	            }
	
	            // Quick check to determine if target is callable, in the spec
	            // this throws a TypeError, but we will just return undefined.
	            if ( !jQuery.isFunction( fn ) ) {
	                return undefined;
	            }
	
	            // Simulated bind
	            args = core_slice.call( arguments, 2 );
	            proxy = function() {
	                return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
	            };
	
	            // Set the guid of unique handler to the same of original handler, so it can be removed
	            proxy.guid = fn.guid = fn.guid || jQuery.guid++;
	
	            return proxy;
	        },
	
	        // Multifunctional method to get and set values of a collection
	        // The value/s can optionally be executed if it's a function
	        access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
	            var i = 0,
	                length = elems.length,
	                bulk = key == null;
	
	            // Sets many values
	            if ( jQuery.type( key ) === "object" ) {
	                chainable = true;
	                for ( i in key ) {
	                    jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
	                }
	
	                // Sets one value
	            } else if ( value !== undefined ) {
	                chainable = true;
	
	                if ( !jQuery.isFunction( value ) ) {
	                    raw = true;
	                }
	
	                if ( bulk ) {
	                    // Bulk operations run against the entire set
	                    if ( raw ) {
	                        fn.call( elems, value );
	                        fn = null;
	
	                        // ...except when executing function values
	                    } else {
	                        bulk = fn;
	                        fn = function( elem, key, value ) {
	                            return bulk.call( jQuery( elem ), value );
	                        };
	                    }
	                }
	
	                if ( fn ) {
	                    for ( ; i < length; i++ ) {
	                        fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
	                    }
	                }
	            }
	
	            return chainable ?
	                elems :
	
	                // Gets
	                bulk ?
	                    fn.call( elems ) :
	                    length ? fn( elems[0], key ) : emptyGet;
	        },
	
	        now: function() {
	            return ( new Date() ).getTime();
	        },
	
	        // A method for quickly swapping in/out CSS properties to get correct calculations.
	        // Note: this method belongs to the css module but it's needed here for the support module.
	        // If support gets modularized, this method should be moved back to the css module.
	        swap: function( elem, options, callback, args ) {
	            var ret, name,
	                old = {};
	
	            // Remember the old values, and insert the new ones
	            for ( name in options ) {
	                old[ name ] = elem.style[ name ];
	                elem.style[ name ] = options[ name ];
	            }
	
	            ret = callback.apply( elem, args || [] );
	
	            // Revert the old values
	            for ( name in options ) {
	                elem.style[ name ] = old[ name ];
	            }
	
	            return ret;
	        }
	    });
	
	    jQuery.ready.promise = function( obj ) {
	        if ( !readyList ) {
	
	            readyList = jQuery.Deferred();
	
	            // Catch cases where $(document).ready() is called after the browser event has already occurred.
	            // we once tried to use readyState "interactive" here, but it caused issues like the one
	            // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
	            if ( document.readyState === "complete" ) {
	                // Handle it asynchronously to allow scripts the opportunity to delay ready
	                setTimeout( jQuery.ready );
	
	                // Standards-based browsers support DOMContentLoaded
	            } else if ( document.addEventListener ) {
	                // Use the handy event callback
	                document.addEventListener( "DOMContentLoaded", completed, false );
	
	                // A fallback to window.onload, that will always work
	                window.addEventListener( "load", completed, false );
	
	                // If IE event model is used
	            } else {
	                // Ensure firing before onload, maybe late but safe also for iframes
	                document.attachEvent( "onreadystatechange", completed );
	
	                // A fallback to window.onload, that will always work
	                window.attachEvent( "onload", completed );
	
	                // If IE and not a frame
	                // continually check to see if the document is ready
	                var top = false;
	
	                try {
	                    top = window.frameElement == null && document.documentElement;
	                } catch(e) {}
	
	                if ( top && top.doScroll ) {
	                    (function doScrollCheck() {
	                        if ( !jQuery.isReady ) {
	
	                            try {
	                                // Use the trick by Diego Perini
	                                // http://javascript.nwbox.com/IEContentLoaded/
	                                top.doScroll("left");
	                            } catch(e) {
	                                return setTimeout( doScrollCheck, 50 );
	                            }
	
	                            // detach all dom ready events
	                            detach();
	
	                            // and execute any waiting functions
	                            jQuery.ready();
	                        }
	                    })();
	                }
	            }
	        }
	        return readyList.promise( obj );
	    };
	
	// Populate the class2type map
	    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	        class2type[ "[object " + name + "]" ] = name.toLowerCase();
	    });
	
	    function isArraylike( obj ) {
	        var length = obj.length,
	            type = jQuery.type( obj );
	
	        if ( jQuery.isWindow( obj ) ) {
	            return false;
	        }
	
	        if ( obj.nodeType === 1 && length ) {
	            return true;
	        }
	
	        return type === "array" || type !== "function" &&
	            ( length === 0 ||
	            typeof length === "number" && length > 0 && ( length - 1 ) in obj );
	    }
	
	// All jQuery objects should point back to these
	    rootjQuery = jQuery(document);
	    /*!
	     * Sizzle CSS Selector Engine v1.10.2
	     * http://sizzlejs.com/
	     *
	     * Copyright 2013 jQuery Foundation, Inc. and other contributors
	     * Released under the MIT license
	     * http://jquery.org/license
	     *
	     * Date: 2013-07-03
	     */
	    (function( window, undefined ) {
	
	        var i,
	            support,
	            cachedruns,
	            Expr,
	            getText,
	            isXML,
	            compile,
	            outermostContext,
	            sortInput,
	
	        // Local document vars
	            setDocument,
	            document,
	            docElem,
	            documentIsHTML,
	            rbuggyQSA,
	            rbuggyMatches,
	            matches,
	            contains,
	
	        // Instance-specific data
	            expando = "sizzle" + -(new Date()),
	            preferredDoc = window.document,
	            dirruns = 0,
	            done = 0,
	            classCache = createCache(),
	            tokenCache = createCache(),
	            compilerCache = createCache(),
	            hasDuplicate = false,
	            sortOrder = function( a, b ) {
	                if ( a === b ) {
	                    hasDuplicate = true;
	                    return 0;
	                }
	                return 0;
	            },
	
	        // General-purpose constants
	            strundefined = typeof undefined,
	            MAX_NEGATIVE = 1 << 31,
	
	        // Instance methods
	            hasOwn = ({}).hasOwnProperty,
	            arr = [],
	            pop = arr.pop,
	            push_native = arr.push,
	            push = arr.push,
	            slice = arr.slice,
	        // Use a stripped-down indexOf if we can't use a native one
	            indexOf = arr.indexOf || function( elem ) {
	                    var i = 0,
	                        len = this.length;
	                    for ( ; i < len; i++ ) {
	                        if ( this[i] === elem ) {
	                            return i;
	                        }
	                    }
	                    return -1;
	                },
	
	            booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
	
	        // Regular expressions
	
	        // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	            whitespace = "[\\x20\\t\\r\\n\\f]",
	        // http://www.w3.org/TR/css3-syntax/#characters
	            characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
	
	        // Loosely modeled on CSS identifier characters
	        // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	        // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	            identifier = characterEncoding.replace( "w", "w#" ),
	
	        // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	            attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
	                "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",
	
	        // Prefer arguments quoted,
	        //   then not containing pseudos/brackets,
	        //   then attribute selectors/non-parenthetical expressions,
	        //   then anything else
	        // These preferences are here to reduce the number of selectors
	        //   needing tokenize in the PSEUDO preFilter
	            pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",
	
	        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	            rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
	
	            rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	            rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	
	            rsibling = new RegExp( whitespace + "*[+~]" ),
	            rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),
	
	            rpseudo = new RegExp( pseudos ),
	            ridentifier = new RegExp( "^" + identifier + "$" ),
	
	            matchExpr = {
	                "ID": new RegExp( "^#(" + characterEncoding + ")" ),
	                "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
	                "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
	                "ATTR": new RegExp( "^" + attributes ),
	                "PSEUDO": new RegExp( "^" + pseudos ),
	                "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
	                    "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
	                    "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
	                "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
	                // For use in libraries implementing .is()
	                // We use this for POS matching in `select`
	                "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
	                    whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	            },
	
	            rnative = /^[^{]+\{\s*\[native \w/,
	
	        // Easily-parseable/retrievable ID or TAG or CLASS selectors
	            rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	
	            rinputs = /^(?:input|select|textarea|button)$/i,
	            rheader = /^h\d$/i,
	
	            rescape = /'|\\/g,
	
	        // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	            runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	            funescape = function( _, escaped, escapedWhitespace ) {
	                var high = "0x" + escaped - 0x10000;
	                // NaN means non-codepoint
	                // Support: Firefox
	                // Workaround erroneous numeric interpretation of +"0x"
	                return high !== high || escapedWhitespace ?
	                    escaped :
	                    // BMP codepoint
	                    high < 0 ?
	                        String.fromCharCode( high + 0x10000 ) :
	                        // Supplemental Plane codepoint (surrogate pair)
	                        String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	            };
	
	// Optimize for push.apply( _, NodeList )
	        try {
	            push.apply(
	                (arr = slice.call( preferredDoc.childNodes )),
	                preferredDoc.childNodes
	            );
	            // Support: Android<4.0
	            // Detect silently failing push.apply
	            arr[ preferredDoc.childNodes.length ].nodeType;
	        } catch ( e ) {
	            push = { apply: arr.length ?
	
	                // Leverage slice if possible
	                function( target, els ) {
	                    push_native.apply( target, slice.call(els) );
	                } :
	
	                // Support: IE<9
	                // Otherwise append directly
	                function( target, els ) {
	                    var j = target.length,
	                        i = 0;
	                    // Can't trust NodeList.length
	                    while ( (target[j++] = els[i++]) ) {}
	                    target.length = j - 1;
	                }
	            };
	        }
	
	        function Sizzle( selector, context, results, seed ) {
	            var match, elem, m, nodeType,
	            // QSA vars
	                i, groups, old, nid, newContext, newSelector;
	
	            if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
	                setDocument( context );
	            }
	
	            context = context || document;
	            results = results || [];
	
	            if ( !selector || typeof selector !== "string" ) {
	                return results;
	            }
	
	            if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
	                return [];
	            }
	
	            if ( documentIsHTML && !seed ) {
	
	                // Shortcuts
	                if ( (match = rquickExpr.exec( selector )) ) {
	                    // Speed-up: Sizzle("#ID")
	                    if ( (m = match[1]) ) {
	                        if ( nodeType === 9 ) {
	                            elem = context.getElementById( m );
	                            // Check parentNode to catch when Blackberry 4.6 returns
	                            // nodes that are no longer in the document #6963
	                            if ( elem && elem.parentNode ) {
	                                // Handle the case where IE, Opera, and Webkit return items
	                                // by name instead of ID
	                                if ( elem.id === m ) {
	                                    results.push( elem );
	                                    return results;
	                                }
	                            } else {
	                                return results;
	                            }
	                        } else {
	                            // Context is not a document
	                            if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
	                                contains( context, elem ) && elem.id === m ) {
	                                results.push( elem );
	                                return results;
	                            }
	                        }
	
	                        // Speed-up: Sizzle("TAG")
	                    } else if ( match[2] ) {
	                        push.apply( results, context.getElementsByTagName( selector ) );
	                        return results;
	
	                        // Speed-up: Sizzle(".CLASS")
	                    } else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
	                        push.apply( results, context.getElementsByClassName( m ) );
	                        return results;
	                    }
	                }
	
	                // QSA path
	                if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
	                    nid = old = expando;
	                    newContext = context;
	                    newSelector = nodeType === 9 && selector;
	
	                    // qSA works strangely on Element-rooted queries
	                    // We can work around this by specifying an extra ID on the root
	                    // and working up from there (Thanks to Andrew Dupont for the technique)
	                    // IE 8 doesn't work on object elements
	                    if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
	                        groups = tokenize( selector );
	
	                        if ( (old = context.getAttribute("id")) ) {
	                            nid = old.replace( rescape, "\\$&" );
	                        } else {
	                            context.setAttribute( "id", nid );
	                        }
	                        nid = "[id='" + nid + "'] ";
	
	                        i = groups.length;
	                        while ( i-- ) {
	                            groups[i] = nid + toSelector( groups[i] );
	                        }
	                        newContext = rsibling.test( selector ) && context.parentNode || context;
	                        newSelector = groups.join(",");
	                    }
	
	                    if ( newSelector ) {
	                        try {
	                            push.apply( results,
	                                newContext.querySelectorAll( newSelector )
	                            );
	                            return results;
	                        } catch(qsaError) {
	                        } finally {
	                            if ( !old ) {
	                                context.removeAttribute("id");
	                            }
	                        }
	                    }
	                }
	            }
	
	            // All others
	            return select( selector.replace( rtrim, "$1" ), context, results, seed );
	        }
	
	        /**
	         * Create key-value caches of limited size
	         * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
	         *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	         *	deleting the oldest entry
	         */
	        function createCache() {
	            var keys = [];
	
	            function cache( key, value ) {
	                // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
	                if ( keys.push( key += " " ) > Expr.cacheLength ) {
	                    // Only keep the most recent entries
	                    delete cache[ keys.shift() ];
	                }
	                return (cache[ key ] = value);
	            }
	            return cache;
	        }
	
	        /**
	         * Mark a function for special use by Sizzle
	         * @param {Function} fn The function to mark
	         */
	        function markFunction( fn ) {
	            fn[ expando ] = true;
	            return fn;
	        }
	
	        /**
	         * Support testing using an element
	         * @param {Function} fn Passed the created div and expects a boolean result
	         */
	        function assert( fn ) {
	            var div = document.createElement("div");
	
	            try {
	                return !!fn( div );
	            } catch (e) {
	                return false;
	            } finally {
	                // Remove from its parent by default
	                if ( div.parentNode ) {
	                    div.parentNode.removeChild( div );
	                }
	                // release memory in IE
	                div = null;
	            }
	        }
	
	        /**
	         * Adds the same handler for all of the specified attrs
	         * @param {String} attrs Pipe-separated list of attributes
	         * @param {Function} handler The method that will be applied
	         */
	        function addHandle( attrs, handler ) {
	            var arr = attrs.split("|"),
	                i = attrs.length;
	
	            while ( i-- ) {
	                Expr.attrHandle[ arr[i] ] = handler;
	            }
	        }
	
	        /**
	         * Checks document order of two siblings
	         * @param {Element} a
	         * @param {Element} b
	         * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	         */
	        function siblingCheck( a, b ) {
	            var cur = b && a,
	                diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
	                    ( ~b.sourceIndex || MAX_NEGATIVE ) -
	                    ( ~a.sourceIndex || MAX_NEGATIVE );
	
	            // Use IE sourceIndex if available on both nodes
	            if ( diff ) {
	                return diff;
	            }
	
	            // Check if b follows a
	            if ( cur ) {
	                while ( (cur = cur.nextSibling) ) {
	                    if ( cur === b ) {
	                        return -1;
	                    }
	                }
	            }
	
	            return a ? 1 : -1;
	        }
	
	        /**
	         * Returns a function to use in pseudos for input types
	         * @param {String} type
	         */
	        function createInputPseudo( type ) {
	            return function( elem ) {
	                var name = elem.nodeName.toLowerCase();
	                return name === "input" && elem.type === type;
	            };
	        }
	
	        /**
	         * Returns a function to use in pseudos for buttons
	         * @param {String} type
	         */
	        function createButtonPseudo( type ) {
	            return function( elem ) {
	                var name = elem.nodeName.toLowerCase();
	                return (name === "input" || name === "button") && elem.type === type;
	            };
	        }
	
	        /**
	         * Returns a function to use in pseudos for positionals
	         * @param {Function} fn
	         */
	        function createPositionalPseudo( fn ) {
	            return markFunction(function( argument ) {
	                argument = +argument;
	                return markFunction(function( seed, matches ) {
	                    var j,
	                        matchIndexes = fn( [], seed.length, argument ),
	                        i = matchIndexes.length;
	
	                    // Match elements found at the specified indexes
	                    while ( i-- ) {
	                        if ( seed[ (j = matchIndexes[i]) ] ) {
	                            seed[j] = !(matches[j] = seed[j]);
	                        }
	                    }
	                });
	            });
	        }
	
	        /**
	         * Detect xml
	         * @param {Element|Object} elem An element or a document
	         */
	        isXML = Sizzle.isXML = function( elem ) {
	            // documentElement is verified for cases where it doesn't yet exist
	            // (such as loading iframes in IE - #4833)
	            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	            return documentElement ? documentElement.nodeName !== "HTML" : false;
	        };
	
	// Expose support vars for convenience
	        support = Sizzle.support = {};
	
	        /**
	         * Sets document-related variables once based on the current document
	         * @param {Element|Object} [doc] An element or document object to use to set the document
	         * @returns {Object} Returns the current document
	         */
	        setDocument = Sizzle.setDocument = function( node ) {
	            var doc = node ? node.ownerDocument || node : preferredDoc,
	                parent = doc.defaultView;
	
	            // If no document and documentElement is available, return
	            if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
	                return document;
	            }
	
	            // Set our document
	            document = doc;
	            docElem = doc.documentElement;
	
	            // Support tests
	            documentIsHTML = !isXML( doc );
	
	            // Support: IE>8
	            // If iframe document is assigned to "document" variable and if iframe has been reloaded,
	            // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	            // IE6-8 do not support the defaultView property so parent will be undefined
	            if ( parent && parent.attachEvent && parent !== parent.top ) {
	                parent.attachEvent( "onbeforeunload", function() {
	                    setDocument();
	                });
	            }
	
	            /* Attributes
	             ---------------------------------------------------------------------- */
	
	            // Support: IE<8
	            // Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	            support.attributes = assert(function( div ) {
	                div.className = "i";
	                return !div.getAttribute("className");
	            });
	
	            /* getElement(s)By*
	             ---------------------------------------------------------------------- */
	
	            // Check if getElementsByTagName("*") returns only elements
	            support.getElementsByTagName = assert(function( div ) {
	                div.appendChild( doc.createComment("") );
	                return !div.getElementsByTagName("*").length;
	            });
	
	            // Check if getElementsByClassName can be trusted
	            support.getElementsByClassName = assert(function( div ) {
	                div.innerHTML = "<div class='a'></div><div class='a i'></div>";
	
	                // Support: Safari<4
	                // Catch class over-caching
	                div.firstChild.className = "i";
	                // Support: Opera<10
	                // Catch gEBCN failure to find non-leading classes
	                return div.getElementsByClassName("i").length === 2;
	            });
	
	            // Support: IE<10
	            // Check if getElementById returns elements by name
	            // The broken getElementById methods don't pick up programatically-set names,
	            // so use a roundabout getElementsByName test
	            support.getById = assert(function( div ) {
	                docElem.appendChild( div ).id = expando;
	                return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	            });
	
	            // ID find and filter
	            if ( support.getById ) {
	                Expr.find["ID"] = function( id, context ) {
	                    if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
	                        var m = context.getElementById( id );
	                        // Check parentNode to catch when Blackberry 4.6 returns
	                        // nodes that are no longer in the document #6963
	                        return m && m.parentNode ? [m] : [];
	                    }
	                };
	                Expr.filter["ID"] = function( id ) {
	                    var attrId = id.replace( runescape, funescape );
	                    return function( elem ) {
	                        return elem.getAttribute("id") === attrId;
	                    };
	                };
	            } else {
	                // Support: IE6/7
	                // getElementById is not reliable as a find shortcut
	                delete Expr.find["ID"];
	
	                Expr.filter["ID"] =  function( id ) {
	                    var attrId = id.replace( runescape, funescape );
	                    return function( elem ) {
	                        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
	                        return node && node.value === attrId;
	                    };
	                };
	            }
	
	            // Tag
	            Expr.find["TAG"] = support.getElementsByTagName ?
	                function( tag, context ) {
	                    if ( typeof context.getElementsByTagName !== strundefined ) {
	                        return context.getElementsByTagName( tag );
	                    }
	                } :
	                function( tag, context ) {
	                    var elem,
	                        tmp = [],
	                        i = 0,
	                        results = context.getElementsByTagName( tag );
	
	                    // Filter out possible comments
	                    if ( tag === "*" ) {
	                        while ( (elem = results[i++]) ) {
	                            if ( elem.nodeType === 1 ) {
	                                tmp.push( elem );
	                            }
	                        }
	
	                        return tmp;
	                    }
	                    return results;
	                };
	
	            // Class
	            Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
	                    if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
	                        return context.getElementsByClassName( className );
	                    }
	                };
	
	            /* QSA/matchesSelector
	             ---------------------------------------------------------------------- */
	
	            // QSA and matchesSelector support
	
	            // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	            rbuggyMatches = [];
	
	            // qSa(:focus) reports false when true (Chrome 21)
	            // We allow this because of a bug in IE8/9 that throws an error
	            // whenever `document.activeElement` is accessed on an iframe
	            // So, we allow :focus to pass through QSA all the time to avoid the IE error
	            // See http://bugs.jquery.com/ticket/13378
	            rbuggyQSA = [];
	
	            if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
	                // Build QSA regex
	                // Regex strategy adopted from Diego Perini
	                assert(function( div ) {
	                    // Select is set to empty string on purpose
	                    // This is to test IE's treatment of not explicitly
	                    // setting a boolean content attribute,
	                    // since its presence should be enough
	                    // http://bugs.jquery.com/ticket/12359
	                    div.innerHTML = "<select><option selected=''></option></select>";
	
	                    // Support: IE8
	                    // Boolean attributes and "value" are not treated correctly
	                    if ( !div.querySelectorAll("[selected]").length ) {
	                        rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
	                    }
	
	                    // Webkit/Opera - :checked should return selected option elements
	                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
	                    // IE8 throws error here and will not see later tests
	                    if ( !div.querySelectorAll(":checked").length ) {
	                        rbuggyQSA.push(":checked");
	                    }
	                });
	
	                assert(function( div ) {
	
	                    // Support: Opera 10-12/IE8
	                    // ^= $= *= and empty values
	                    // Should not select anything
	                    // Support: Windows 8 Native Apps
	                    // The type attribute is restricted during .innerHTML assignment
	                    var input = doc.createElement("input");
	                    input.setAttribute( "type", "hidden" );
	                    div.appendChild( input ).setAttribute( "t", "" );
	
	                    if ( div.querySelectorAll("[t^='']").length ) {
	                        rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
	                    }
	
	                    // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
	                    // IE8 throws error here and will not see later tests
	                    if ( !div.querySelectorAll(":enabled").length ) {
	                        rbuggyQSA.push( ":enabled", ":disabled" );
	                    }
	
	                    // Opera 10-11 does not throw on post-comma invalid pseudos
	                    div.querySelectorAll("*,:x");
	                    rbuggyQSA.push(",.*:");
	                });
	            }
	
	            if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
	                    docElem.mozMatchesSelector ||
	                    docElem.oMatchesSelector ||
	                    docElem.msMatchesSelector) )) ) {
	
	                assert(function( div ) {
	                    // Check to see if it's possible to do matchesSelector
	                    // on a disconnected node (IE 9)
	                    support.disconnectedMatch = matches.call( div, "div" );
	
	                    // This should fail with an exception
	                    // Gecko does not error, returns false instead
	                    matches.call( div, "[s!='']:x" );
	                    rbuggyMatches.push( "!=", pseudos );
	                });
	            }
	
	            rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	            rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
	
	            /* Contains
	             ---------------------------------------------------------------------- */
	
	            // Element contains another
	            // Purposefully does not implement inclusive descendent
	            // As in, an element does not contain itself
	            contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
	                function( a, b ) {
	                    var adown = a.nodeType === 9 ? a.documentElement : a,
	                        bup = b && b.parentNode;
	                    return a === bup || !!( bup && bup.nodeType === 1 && (
	                            adown.contains ?
	                                adown.contains( bup ) :
	                            a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
	                        ));
	                } :
	                function( a, b ) {
	                    if ( b ) {
	                        while ( (b = b.parentNode) ) {
	                            if ( b === a ) {
	                                return true;
	                            }
	                        }
	                    }
	                    return false;
	                };
	
	            /* Sorting
	             ---------------------------------------------------------------------- */
	
	            // Document order sorting
	            sortOrder = docElem.compareDocumentPosition ?
	                function( a, b ) {
	
	                    // Flag for duplicate removal
	                    if ( a === b ) {
	                        hasDuplicate = true;
	                        return 0;
	                    }
	
	                    var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );
	
	                    if ( compare ) {
	                        // Disconnected nodes
	                        if ( compare & 1 ||
	                            (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
	
	                            // Choose the first element that is related to our preferred document
	                            if ( a === doc || contains(preferredDoc, a) ) {
	                                return -1;
	                            }
	                            if ( b === doc || contains(preferredDoc, b) ) {
	                                return 1;
	                            }
	
	                            // Maintain original order
	                            return sortInput ?
	                                ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
	                                0;
	                        }
	
	                        return compare & 4 ? -1 : 1;
	                    }
	
	                    // Not directly comparable, sort on existence of method
	                    return a.compareDocumentPosition ? -1 : 1;
	                } :
	                function( a, b ) {
	                    var cur,
	                        i = 0,
	                        aup = a.parentNode,
	                        bup = b.parentNode,
	                        ap = [ a ],
	                        bp = [ b ];
	
	                    // Exit early if the nodes are identical
	                    if ( a === b ) {
	                        hasDuplicate = true;
	                        return 0;
	
	                        // Parentless nodes are either documents or disconnected
	                    } else if ( !aup || !bup ) {
	                        return a === doc ? -1 :
	                            b === doc ? 1 :
	                                aup ? -1 :
	                                    bup ? 1 :
	                                        sortInput ?
	                                            ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
	                                            0;
	
	                        // If the nodes are siblings, we can do a quick check
	                    } else if ( aup === bup ) {
	                        return siblingCheck( a, b );
	                    }
	
	                    // Otherwise we need full lists of their ancestors for comparison
	                    cur = a;
	                    while ( (cur = cur.parentNode) ) {
	                        ap.unshift( cur );
	                    }
	                    cur = b;
	                    while ( (cur = cur.parentNode) ) {
	                        bp.unshift( cur );
	                    }
	
	                    // Walk down the tree looking for a discrepancy
	                    while ( ap[i] === bp[i] ) {
	                        i++;
	                    }
	
	                    return i ?
	                        // Do a sibling check if the nodes have a common ancestor
	                        siblingCheck( ap[i], bp[i] ) :
	
	                        // Otherwise nodes in our document sort first
	                        ap[i] === preferredDoc ? -1 :
	                            bp[i] === preferredDoc ? 1 :
	                                0;
	                };
	
	            return doc;
	        };
	
	        Sizzle.matches = function( expr, elements ) {
	            return Sizzle( expr, null, null, elements );
	        };
	
	        Sizzle.matchesSelector = function( elem, expr ) {
	            // Set document vars if needed
	            if ( ( elem.ownerDocument || elem ) !== document ) {
	                setDocument( elem );
	            }
	
	            // Make sure that attribute selectors are quoted
	            expr = expr.replace( rattributeQuotes, "='$1']" );
	
	            if ( support.matchesSelector && documentIsHTML &&
	                ( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
	                ( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
	
	                try {
	                    var ret = matches.call( elem, expr );
	
	                    // IE 9's matchesSelector returns false on disconnected nodes
	                    if ( ret || support.disconnectedMatch ||
	                        // As well, disconnected nodes are said to be in a document
	                        // fragment in IE 9
	                        elem.document && elem.document.nodeType !== 11 ) {
	                        return ret;
	                    }
	                } catch(e) {}
	            }
	
	            return Sizzle( expr, document, null, [elem] ).length > 0;
	        };
	
	        Sizzle.contains = function( context, elem ) {
	            // Set document vars if needed
	            if ( ( context.ownerDocument || context ) !== document ) {
	                setDocument( context );
	            }
	            return contains( context, elem );
	        };
	
	        Sizzle.attr = function( elem, name ) {
	            // Set document vars if needed
	            if ( ( elem.ownerDocument || elem ) !== document ) {
	                setDocument( elem );
	            }
	
	            var fn = Expr.attrHandle[ name.toLowerCase() ],
	            // Don't get fooled by Object.prototype properties (jQuery #13807)
	                val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
	                    fn( elem, name, !documentIsHTML ) :
	                    undefined;
	
	            return val === undefined ?
	                support.attributes || !documentIsHTML ?
	                    elem.getAttribute( name ) :
	                    (val = elem.getAttributeNode(name)) && val.specified ?
	                        val.value :
	                        null :
	                val;
	        };
	
	        Sizzle.error = function( msg ) {
	            throw new Error( "Syntax error, unrecognized expression: " + msg );
	        };
	
	        /**
	         * Document sorting and removing duplicates
	         * @param {ArrayLike} results
	         */
	        Sizzle.uniqueSort = function( results ) {
	            var elem,
	                duplicates = [],
	                j = 0,
	                i = 0;
	
	            // Unless we *know* we can detect duplicates, assume their presence
	            hasDuplicate = !support.detectDuplicates;
	            sortInput = !support.sortStable && results.slice( 0 );
	            results.sort( sortOrder );
	
	            if ( hasDuplicate ) {
	                while ( (elem = results[i++]) ) {
	                    if ( elem === results[ i ] ) {
	                        j = duplicates.push( i );
	                    }
	                }
	                while ( j-- ) {
	                    results.splice( duplicates[ j ], 1 );
	                }
	            }
	
	            return results;
	        };
	
	        /**
	         * Utility function for retrieving the text value of an array of DOM nodes
	         * @param {Array|Element} elem
	         */
	        getText = Sizzle.getText = function( elem ) {
	            var node,
	                ret = "",
	                i = 0,
	                nodeType = elem.nodeType;
	
	            if ( !nodeType ) {
	                // If no nodeType, this is expected to be an array
	                for ( ; (node = elem[i]); i++ ) {
	                    // Do not traverse comment nodes
	                    ret += getText( node );
	                }
	            } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
	                // Use textContent for elements
	                // innerText usage removed for consistency of new lines (see #11153)
	                if ( typeof elem.textContent === "string" ) {
	                    return elem.textContent;
	                } else {
	                    // Traverse its children
	                    for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
	                        ret += getText( elem );
	                    }
	                }
	            } else if ( nodeType === 3 || nodeType === 4 ) {
	                return elem.nodeValue;
	            }
	            // Do not include comment or processing instruction nodes
	
	            return ret;
	        };
	
	        Expr = Sizzle.selectors = {
	
	            // Can be adjusted by the user
	            cacheLength: 50,
	
	            createPseudo: markFunction,
	
	            match: matchExpr,
	
	            attrHandle: {},
	
	            find: {},
	
	            relative: {
	                ">": { dir: "parentNode", first: true },
	                " ": { dir: "parentNode" },
	                "+": { dir: "previousSibling", first: true },
	                "~": { dir: "previousSibling" }
	            },
	
	            preFilter: {
	                "ATTR": function( match ) {
	                    match[1] = match[1].replace( runescape, funescape );
	
	                    // Move the given value to match[3] whether quoted or unquoted
	                    match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );
	
	                    if ( match[2] === "~=" ) {
	                        match[3] = " " + match[3] + " ";
	                    }
	
	                    return match.slice( 0, 4 );
	                },
	
	                "CHILD": function( match ) {
	                    /* matches from matchExpr["CHILD"]
	                     1 type (only|nth|...)
	                     2 what (child|of-type)
	                     3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
	                     4 xn-component of xn+y argument ([+-]?\d*n|)
	                     5 sign of xn-component
	                     6 x of xn-component
	                     7 sign of y-component
	                     8 y of y-component
	                     */
	                    match[1] = match[1].toLowerCase();
	
	                    if ( match[1].slice( 0, 3 ) === "nth" ) {
	                        // nth-* requires argument
	                        if ( !match[3] ) {
	                            Sizzle.error( match[0] );
	                        }
	
	                        // numeric x and y parameters for Expr.filter.CHILD
	                        // remember that false/true cast respectively to 0/1
	                        match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
	                        match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
	
	                        // other types prohibit arguments
	                    } else if ( match[3] ) {
	                        Sizzle.error( match[0] );
	                    }
	
	                    return match;
	                },
	
	                "PSEUDO": function( match ) {
	                    var excess,
	                        unquoted = !match[5] && match[2];
	
	                    if ( matchExpr["CHILD"].test( match[0] ) ) {
	                        return null;
	                    }
	
	                    // Accept quoted arguments as-is
	                    if ( match[3] && match[4] !== undefined ) {
	                        match[2] = match[4];
	
	                        // Strip excess characters from unquoted arguments
	                    } else if ( unquoted && rpseudo.test( unquoted ) &&
	                        // Get excess from tokenize (recursively)
	                        (excess = tokenize( unquoted, true )) &&
	                        // advance to the next closing parenthesis
	                        (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
	
	                        // excess is a negative index
	                        match[0] = match[0].slice( 0, excess );
	                        match[2] = unquoted.slice( 0, excess );
	                    }
	
	                    // Return only captures needed by the pseudo filter method (type and argument)
	                    return match.slice( 0, 3 );
	                }
	            },
	
	            filter: {
	
	                "TAG": function( nodeNameSelector ) {
	                    var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
	                    return nodeNameSelector === "*" ?
	                        function() { return true; } :
	                        function( elem ) {
	                            return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
	                        };
	                },
	
	                "CLASS": function( className ) {
	                    var pattern = classCache[ className + " " ];
	
	                    return pattern ||
	                        (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
	                        classCache( className, function( elem ) {
	                            return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
	                        });
	                },
	
	                "ATTR": function( name, operator, check ) {
	                    return function( elem ) {
	                        var result = Sizzle.attr( elem, name );
	
	                        if ( result == null ) {
	                            return operator === "!=";
	                        }
	                        if ( !operator ) {
	                            return true;
	                        }
	
	                        result += "";
	
	                        return operator === "=" ? result === check :
	                            operator === "!=" ? result !== check :
	                                operator === "^=" ? check && result.indexOf( check ) === 0 :
	                                    operator === "*=" ? check && result.indexOf( check ) > -1 :
	                                        operator === "$=" ? check && result.slice( -check.length ) === check :
	                                            operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
	                                                operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
	                                                    false;
	                    };
	                },
	
	                "CHILD": function( type, what, argument, first, last ) {
	                    var simple = type.slice( 0, 3 ) !== "nth",
	                        forward = type.slice( -4 ) !== "last",
	                        ofType = what === "of-type";
	
	                    return first === 1 && last === 0 ?
	
	                        // Shortcut for :nth-*(n)
	                        function( elem ) {
	                            return !!elem.parentNode;
	                        } :
	
	                        function( elem, context, xml ) {
	                            var cache, outerCache, node, diff, nodeIndex, start,
	                                dir = simple !== forward ? "nextSibling" : "previousSibling",
	                                parent = elem.parentNode,
	                                name = ofType && elem.nodeName.toLowerCase(),
	                                useCache = !xml && !ofType;
	
	                            if ( parent ) {
	
	                                // :(first|last|only)-(child|of-type)
	                                if ( simple ) {
	                                    while ( dir ) {
	                                        node = elem;
	                                        while ( (node = node[ dir ]) ) {
	                                            if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
	                                                return false;
	                                            }
	                                        }
	                                        // Reverse direction for :only-* (if we haven't yet done so)
	                                        start = dir = type === "only" && !start && "nextSibling";
	                                    }
	                                    return true;
	                                }
	
	                                start = [ forward ? parent.firstChild : parent.lastChild ];
	
	                                // non-xml :nth-child(...) stores cache data on `parent`
	                                if ( forward && useCache ) {
	                                    // Seek `elem` from a previously-cached index
	                                    outerCache = parent[ expando ] || (parent[ expando ] = {});
	                                    cache = outerCache[ type ] || [];
	                                    nodeIndex = cache[0] === dirruns && cache[1];
	                                    diff = cache[0] === dirruns && cache[2];
	                                    node = nodeIndex && parent.childNodes[ nodeIndex ];
	
	                                    while ( (node = ++nodeIndex && node && node[ dir ] ||
	
	                                        // Fallback to seeking `elem` from the start
	                                        (diff = nodeIndex = 0) || start.pop()) ) {
	
	                                        // When found, cache indexes on `parent` and break
	                                        if ( node.nodeType === 1 && ++diff && node === elem ) {
	                                            outerCache[ type ] = [ dirruns, nodeIndex, diff ];
	                                            break;
	                                        }
	                                    }
	
	                                    // Use previously-cached element index if available
	                                } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
	                                    diff = cache[1];
	
	                                    // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
	                                } else {
	                                    // Use the same loop as above to seek `elem` from the start
	                                    while ( (node = ++nodeIndex && node && node[ dir ] ||
	                                        (diff = nodeIndex = 0) || start.pop()) ) {
	
	                                        if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
	                                            // Cache the index of each encountered element
	                                            if ( useCache ) {
	                                                (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
	                                            }
	
	                                            if ( node === elem ) {
	                                                break;
	                                            }
	                                        }
	                                    }
	                                }
	
	                                // Incorporate the offset, then check against cycle size
	                                diff -= last;
	                                return diff === first || ( diff % first === 0 && diff / first >= 0 );
	                            }
	                        };
	                },
	
	                "PSEUDO": function( pseudo, argument ) {
	                    // pseudo-class names are case-insensitive
	                    // http://www.w3.org/TR/selectors/#pseudo-classes
	                    // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
	                    // Remember that setFilters inherits from pseudos
	                    var args,
	                        fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
	                            Sizzle.error( "unsupported pseudo: " + pseudo );
	
	                    // The user may use createPseudo to indicate that
	                    // arguments are needed to create the filter function
	                    // just as Sizzle does
	                    if ( fn[ expando ] ) {
	                        return fn( argument );
	                    }
	
	                    // But maintain support for old signatures
	                    if ( fn.length > 1 ) {
	                        args = [ pseudo, pseudo, "", argument ];
	                        return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
	                            markFunction(function( seed, matches ) {
	                                var idx,
	                                    matched = fn( seed, argument ),
	                                    i = matched.length;
	                                while ( i-- ) {
	                                    idx = indexOf.call( seed, matched[i] );
	                                    seed[ idx ] = !( matches[ idx ] = matched[i] );
	                                }
	                            }) :
	                            function( elem ) {
	                                return fn( elem, 0, args );
	                            };
	                    }
	
	                    return fn;
	                }
	            },
	
	            pseudos: {
	                // Potentially complex pseudos
	                "not": markFunction(function( selector ) {
	                    // Trim the selector passed to compile
	                    // to avoid treating leading and trailing
	                    // spaces as combinators
	                    var input = [],
	                        results = [],
	                        matcher = compile( selector.replace( rtrim, "$1" ) );
	
	                    return matcher[ expando ] ?
	                        markFunction(function( seed, matches, context, xml ) {
	                            var elem,
	                                unmatched = matcher( seed, null, xml, [] ),
	                                i = seed.length;
	
	                            // Match elements unmatched by `matcher`
	                            while ( i-- ) {
	                                if ( (elem = unmatched[i]) ) {
	                                    seed[i] = !(matches[i] = elem);
	                                }
	                            }
	                        }) :
	                        function( elem, context, xml ) {
	                            input[0] = elem;
	                            matcher( input, null, xml, results );
	                            return !results.pop();
	                        };
	                }),
	
	                "has": markFunction(function( selector ) {
	                    return function( elem ) {
	                        return Sizzle( selector, elem ).length > 0;
	                    };
	                }),
	
	                "contains": markFunction(function( text ) {
	                    return function( elem ) {
	                        return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
	                    };
	                }),
	
	                // "Whether an element is represented by a :lang() selector
	                // is based solely on the element's language value
	                // being equal to the identifier C,
	                // or beginning with the identifier C immediately followed by "-".
	                // The matching of C against the element's language value is performed case-insensitively.
	                // The identifier C does not have to be a valid language name."
	                // http://www.w3.org/TR/selectors/#lang-pseudo
	                "lang": markFunction( function( lang ) {
	                    // lang value must be a valid identifier
	                    if ( !ridentifier.test(lang || "") ) {
	                        Sizzle.error( "unsupported lang: " + lang );
	                    }
	                    lang = lang.replace( runescape, funescape ).toLowerCase();
	                    return function( elem ) {
	                        var elemLang;
	                        do {
	                            if ( (elemLang = documentIsHTML ?
	                                    elem.lang :
	                                elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
	
	                                elemLang = elemLang.toLowerCase();
	                                return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
	                            }
	                        } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
	                        return false;
	                    };
	                }),
	
	                // Miscellaneous
	                "target": function( elem ) {
	                    var hash = window.location && window.location.hash;
	                    return hash && hash.slice( 1 ) === elem.id;
	                },
	
	                "root": function( elem ) {
	                    return elem === docElem;
	                },
	
	                "focus": function( elem ) {
	                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
	                },
	
	                // Boolean properties
	                "enabled": function( elem ) {
	                    return elem.disabled === false;
	                },
	
	                "disabled": function( elem ) {
	                    return elem.disabled === true;
	                },
	
	                "checked": function( elem ) {
	                    // In CSS3, :checked should return both checked and selected elements
	                    // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
	                    var nodeName = elem.nodeName.toLowerCase();
	                    return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
	                },
	
	                "selected": function( elem ) {
	                    // Accessing this property makes selected-by-default
	                    // options in Safari work properly
	                    if ( elem.parentNode ) {
	                        elem.parentNode.selectedIndex;
	                    }
	
	                    return elem.selected === true;
	                },
	
	                // Contents
	                "empty": function( elem ) {
	                    // http://www.w3.org/TR/selectors/#empty-pseudo
	                    // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
	                    //   not comment, processing instructions, or others
	                    // Thanks to Diego Perini for the nodeName shortcut
	                    //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
	                    for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
	                        if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
	                            return false;
	                        }
	                    }
	                    return true;
	                },
	
	                "parent": function( elem ) {
	                    return !Expr.pseudos["empty"]( elem );
	                },
	
	                // Element/input types
	                "header": function( elem ) {
	                    return rheader.test( elem.nodeName );
	                },
	
	                "input": function( elem ) {
	                    return rinputs.test( elem.nodeName );
	                },
	
	                "button": function( elem ) {
	                    var name = elem.nodeName.toLowerCase();
	                    return name === "input" && elem.type === "button" || name === "button";
	                },
	
	                "text": function( elem ) {
	                    var attr;
	                    // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
	                    // use getAttribute instead to test this case
	                    return elem.nodeName.toLowerCase() === "input" &&
	                        elem.type === "text" &&
	                        ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
	                },
	
	                // Position-in-collection
	                "first": createPositionalPseudo(function() {
	                    return [ 0 ];
	                }),
	
	                "last": createPositionalPseudo(function( matchIndexes, length ) {
	                    return [ length - 1 ];
	                }),
	
	                "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
	                    return [ argument < 0 ? argument + length : argument ];
	                }),
	
	                "even": createPositionalPseudo(function( matchIndexes, length ) {
	                    var i = 0;
	                    for ( ; i < length; i += 2 ) {
	                        matchIndexes.push( i );
	                    }
	                    return matchIndexes;
	                }),
	
	                "odd": createPositionalPseudo(function( matchIndexes, length ) {
	                    var i = 1;
	                    for ( ; i < length; i += 2 ) {
	                        matchIndexes.push( i );
	                    }
	                    return matchIndexes;
	                }),
	
	                "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
	                    var i = argument < 0 ? argument + length : argument;
	                    for ( ; --i >= 0; ) {
	                        matchIndexes.push( i );
	                    }
	                    return matchIndexes;
	                }),
	
	                "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
	                    var i = argument < 0 ? argument + length : argument;
	                    for ( ; ++i < length; ) {
	                        matchIndexes.push( i );
	                    }
	                    return matchIndexes;
	                })
	            }
	        };
	
	        Expr.pseudos["nth"] = Expr.pseudos["eq"];
	
	// Add button/input type pseudos
	        for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	            Expr.pseudos[ i ] = createInputPseudo( i );
	        }
	        for ( i in { submit: true, reset: true } ) {
	            Expr.pseudos[ i ] = createButtonPseudo( i );
	        }
	
	// Easy API for creating new setFilters
	        function setFilters() {}
	        setFilters.prototype = Expr.filters = Expr.pseudos;
	        Expr.setFilters = new setFilters();
	
	        function tokenize( selector, parseOnly ) {
	            var matched, match, tokens, type,
	                soFar, groups, preFilters,
	                cached = tokenCache[ selector + " " ];
	
	            if ( cached ) {
	                return parseOnly ? 0 : cached.slice( 0 );
	            }
	
	            soFar = selector;
	            groups = [];
	            preFilters = Expr.preFilter;
	
	            while ( soFar ) {
	
	                // Comma and first run
	                if ( !matched || (match = rcomma.exec( soFar )) ) {
	                    if ( match ) {
	                        // Don't consume trailing commas as valid
	                        soFar = soFar.slice( match[0].length ) || soFar;
	                    }
	                    groups.push( tokens = [] );
	                }
	
	                matched = false;
	
	                // Combinators
	                if ( (match = rcombinators.exec( soFar )) ) {
	                    matched = match.shift();
	                    tokens.push({
	                        value: matched,
	                        // Cast descendant combinators to space
	                        type: match[0].replace( rtrim, " " )
	                    });
	                    soFar = soFar.slice( matched.length );
	                }
	
	                // Filters
	                for ( type in Expr.filter ) {
	                    if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
	                        (match = preFilters[ type ]( match ))) ) {
	                        matched = match.shift();
	                        tokens.push({
	                            value: matched,
	                            type: type,
	                            matches: match
	                        });
	                        soFar = soFar.slice( matched.length );
	                    }
	                }
	
	                if ( !matched ) {
	                    break;
	                }
	            }
	
	            // Return the length of the invalid excess
	            // if we're just parsing
	            // Otherwise, throw an error or return tokens
	            return parseOnly ?
	                soFar.length :
	                soFar ?
	                    Sizzle.error( selector ) :
	                    // Cache the tokens
	                    tokenCache( selector, groups ).slice( 0 );
	        }
	
	        function toSelector( tokens ) {
	            var i = 0,
	                len = tokens.length,
	                selector = "";
	            for ( ; i < len; i++ ) {
	                selector += tokens[i].value;
	            }
	            return selector;
	        }
	
	        function addCombinator( matcher, combinator, base ) {
	            var dir = combinator.dir,
	                checkNonElements = base && dir === "parentNode",
	                doneName = done++;
	
	            return combinator.first ?
	                // Check against closest ancestor/preceding element
	                function( elem, context, xml ) {
	                    while ( (elem = elem[ dir ]) ) {
	                        if ( elem.nodeType === 1 || checkNonElements ) {
	                            return matcher( elem, context, xml );
	                        }
	                    }
	                } :
	
	                // Check against all ancestor/preceding elements
	                function( elem, context, xml ) {
	                    var data, cache, outerCache,
	                        dirkey = dirruns + " " + doneName;
	
	                    // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
	                    if ( xml ) {
	                        while ( (elem = elem[ dir ]) ) {
	                            if ( elem.nodeType === 1 || checkNonElements ) {
	                                if ( matcher( elem, context, xml ) ) {
	                                    return true;
	                                }
	                            }
	                        }
	                    } else {
	                        while ( (elem = elem[ dir ]) ) {
	                            if ( elem.nodeType === 1 || checkNonElements ) {
	                                outerCache = elem[ expando ] || (elem[ expando ] = {});
	                                if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
	                                    if ( (data = cache[1]) === true || data === cachedruns ) {
	                                        return data === true;
	                                    }
	                                } else {
	                                    cache = outerCache[ dir ] = [ dirkey ];
	                                    cache[1] = matcher( elem, context, xml ) || cachedruns;
	                                    if ( cache[1] === true ) {
	                                        return true;
	                                    }
	                                }
	                            }
	                        }
	                    }
	                };
	        }
	
	        function elementMatcher( matchers ) {
	            return matchers.length > 1 ?
	                function( elem, context, xml ) {
	                    var i = matchers.length;
	                    while ( i-- ) {
	                        if ( !matchers[i]( elem, context, xml ) ) {
	                            return false;
	                        }
	                    }
	                    return true;
	                } :
	                matchers[0];
	        }
	
	        function condense( unmatched, map, filter, context, xml ) {
	            var elem,
	                newUnmatched = [],
	                i = 0,
	                len = unmatched.length,
	                mapped = map != null;
	
	            for ( ; i < len; i++ ) {
	                if ( (elem = unmatched[i]) ) {
	                    if ( !filter || filter( elem, context, xml ) ) {
	                        newUnmatched.push( elem );
	                        if ( mapped ) {
	                            map.push( i );
	                        }
	                    }
	                }
	            }
	
	            return newUnmatched;
	        }
	
	        function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	            if ( postFilter && !postFilter[ expando ] ) {
	                postFilter = setMatcher( postFilter );
	            }
	            if ( postFinder && !postFinder[ expando ] ) {
	                postFinder = setMatcher( postFinder, postSelector );
	            }
	            return markFunction(function( seed, results, context, xml ) {
	                var temp, i, elem,
	                    preMap = [],
	                    postMap = [],
	                    preexisting = results.length,
	
	                // Get initial elements from seed or context
	                    elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
	
	                // Prefilter to get matcher input, preserving a map for seed-results synchronization
	                    matcherIn = preFilter && ( seed || !selector ) ?
	                        condense( elems, preMap, preFilter, context, xml ) :
	                        elems,
	
	                    matcherOut = matcher ?
	                        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
	                        postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
	
	                            // ...intermediate processing is necessary
	                            [] :
	
	                            // ...otherwise use results directly
	                            results :
	                        matcherIn;
	
	                // Find primary matches
	                if ( matcher ) {
	                    matcher( matcherIn, matcherOut, context, xml );
	                }
	
	                // Apply postFilter
	                if ( postFilter ) {
	                    temp = condense( matcherOut, postMap );
	                    postFilter( temp, [], context, xml );
	
	                    // Un-match failing elements by moving them back to matcherIn
	                    i = temp.length;
	                    while ( i-- ) {
	                        if ( (elem = temp[i]) ) {
	                            matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
	                        }
	                    }
	                }
	
	                if ( seed ) {
	                    if ( postFinder || preFilter ) {
	                        if ( postFinder ) {
	                            // Get the final matcherOut by condensing this intermediate into postFinder contexts
	                            temp = [];
	                            i = matcherOut.length;
	                            while ( i-- ) {
	                                if ( (elem = matcherOut[i]) ) {
	                                    // Restore matcherIn since elem is not yet a final match
	                                    temp.push( (matcherIn[i] = elem) );
	                                }
	                            }
	                            postFinder( null, (matcherOut = []), temp, xml );
	                        }
	
	                        // Move matched elements from seed to results to keep them synchronized
	                        i = matcherOut.length;
	                        while ( i-- ) {
	                            if ( (elem = matcherOut[i]) &&
	                                (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {
	
	                                seed[temp] = !(results[temp] = elem);
	                            }
	                        }
	                    }
	
	                    // Add elements to results, through postFinder if defined
	                } else {
	                    matcherOut = condense(
	                        matcherOut === results ?
	                            matcherOut.splice( preexisting, matcherOut.length ) :
	                            matcherOut
	                    );
	                    if ( postFinder ) {
	                        postFinder( null, results, matcherOut, xml );
	                    } else {
	                        push.apply( results, matcherOut );
	                    }
	                }
	            });
	        }
	
	        function matcherFromTokens( tokens ) {
	            var checkContext, matcher, j,
	                len = tokens.length,
	                leadingRelative = Expr.relative[ tokens[0].type ],
	                implicitRelative = leadingRelative || Expr.relative[" "],
	                i = leadingRelative ? 1 : 0,
	
	            // The foundational matcher ensures that elements are reachable from top-level context(s)
	                matchContext = addCombinator( function( elem ) {
	                    return elem === checkContext;
	                }, implicitRelative, true ),
	                matchAnyContext = addCombinator( function( elem ) {
	                    return indexOf.call( checkContext, elem ) > -1;
	                }, implicitRelative, true ),
	                matchers = [ function( elem, context, xml ) {
	                    return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
	                            (checkContext = context).nodeType ?
	                                matchContext( elem, context, xml ) :
	                                matchAnyContext( elem, context, xml ) );
	                } ];
	
	            for ( ; i < len; i++ ) {
	                if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
	                    matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
	                } else {
	                    matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
	
	                    // Return special upon seeing a positional matcher
	                    if ( matcher[ expando ] ) {
	                        // Find the next relative operator (if any) for proper handling
	                        j = ++i;
	                        for ( ; j < len; j++ ) {
	                            if ( Expr.relative[ tokens[j].type ] ) {
	                                break;
	                            }
	                        }
	                        return setMatcher(
	                            i > 1 && elementMatcher( matchers ),
	                            i > 1 && toSelector(
	                                // If the preceding token was a descendant combinator, insert an implicit any-element `*`
	                                tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
	                            ).replace( rtrim, "$1" ),
	                            matcher,
	                            i < j && matcherFromTokens( tokens.slice( i, j ) ),
	                            j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
	                            j < len && toSelector( tokens )
	                        );
	                    }
	                    matchers.push( matcher );
	                }
	            }
	
	            return elementMatcher( matchers );
	        }
	
	        function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	            // A counter to specify which element is currently being matched
	            var matcherCachedRuns = 0,
	                bySet = setMatchers.length > 0,
	                byElement = elementMatchers.length > 0,
	                superMatcher = function( seed, context, xml, results, expandContext ) {
	                    var elem, j, matcher,
	                        setMatched = [],
	                        matchedCount = 0,
	                        i = "0",
	                        unmatched = seed && [],
	                        outermost = expandContext != null,
	                        contextBackup = outermostContext,
	                    // We must always have either seed elements or context
	                        elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
	                    // Use integer dirruns iff this is the outermost matcher
	                        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);
	
	                    if ( outermost ) {
	                        outermostContext = context !== document && context;
	                        cachedruns = matcherCachedRuns;
	                    }
	
	                    // Add elements passing elementMatchers directly to results
	                    // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
	                    for ( ; (elem = elems[i]) != null; i++ ) {
	                        if ( byElement && elem ) {
	                            j = 0;
	                            while ( (matcher = elementMatchers[j++]) ) {
	                                if ( matcher( elem, context, xml ) ) {
	                                    results.push( elem );
	                                    break;
	                                }
	                            }
	                            if ( outermost ) {
	                                dirruns = dirrunsUnique;
	                                cachedruns = ++matcherCachedRuns;
	                            }
	                        }
	
	                        // Track unmatched elements for set filters
	                        if ( bySet ) {
	                            // They will have gone through all possible matchers
	                            if ( (elem = !matcher && elem) ) {
	                                matchedCount--;
	                            }
	
	                            // Lengthen the array for every element, matched or not
	                            if ( seed ) {
	                                unmatched.push( elem );
	                            }
	                        }
	                    }
	
	                    // Apply set filters to unmatched elements
	                    matchedCount += i;
	                    if ( bySet && i !== matchedCount ) {
	                        j = 0;
	                        while ( (matcher = setMatchers[j++]) ) {
	                            matcher( unmatched, setMatched, context, xml );
	                        }
	
	                        if ( seed ) {
	                            // Reintegrate element matches to eliminate the need for sorting
	                            if ( matchedCount > 0 ) {
	                                while ( i-- ) {
	                                    if ( !(unmatched[i] || setMatched[i]) ) {
	                                        setMatched[i] = pop.call( results );
	                                    }
	                                }
	                            }
	
	                            // Discard index placeholder values to get only actual matches
	                            setMatched = condense( setMatched );
	                        }
	
	                        // Add matches to results
	                        push.apply( results, setMatched );
	
	                        // Seedless set matches succeeding multiple successful matchers stipulate sorting
	                        if ( outermost && !seed && setMatched.length > 0 &&
	                            ( matchedCount + setMatchers.length ) > 1 ) {
	
	                            Sizzle.uniqueSort( results );
	                        }
	                    }
	
	                    // Override manipulation of globals by nested matchers
	                    if ( outermost ) {
	                        dirruns = dirrunsUnique;
	                        outermostContext = contextBackup;
	                    }
	
	                    return unmatched;
	                };
	
	            return bySet ?
	                markFunction( superMatcher ) :
	                superMatcher;
	        }
	
	        compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	            var i,
	                setMatchers = [],
	                elementMatchers = [],
	                cached = compilerCache[ selector + " " ];
	
	            if ( !cached ) {
	                // Generate a function of recursive functions that can be used to check each element
	                if ( !group ) {
	                    group = tokenize( selector );
	                }
	                i = group.length;
	                while ( i-- ) {
	                    cached = matcherFromTokens( group[i] );
	                    if ( cached[ expando ] ) {
	                        setMatchers.push( cached );
	                    } else {
	                        elementMatchers.push( cached );
	                    }
	                }
	
	                // Cache the compiled function
	                cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	            }
	            return cached;
	        };
	
	        function multipleContexts( selector, contexts, results ) {
	            var i = 0,
	                len = contexts.length;
	            for ( ; i < len; i++ ) {
	                Sizzle( selector, contexts[i], results );
	            }
	            return results;
	        }
	
	        function select( selector, context, results, seed ) {
	            var i, tokens, token, type, find,
	                match = tokenize( selector );
	
	            if ( !seed ) {
	                // Try to minimize operations if there is only one group
	                if ( match.length === 1 ) {
	
	                    // Take a shortcut and set the context if the root selector is an ID
	                    tokens = match[0] = match[0].slice( 0 );
	                    if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
	                        support.getById && context.nodeType === 9 && documentIsHTML &&
	                        Expr.relative[ tokens[1].type ] ) {
	
	                        context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
	                        if ( !context ) {
	                            return results;
	                        }
	                        selector = selector.slice( tokens.shift().value.length );
	                    }
	
	                    // Fetch a seed set for right-to-left matching
	                    i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
	                    while ( i-- ) {
	                        token = tokens[i];
	
	                        // Abort if we hit a combinator
	                        if ( Expr.relative[ (type = token.type) ] ) {
	                            break;
	                        }
	                        if ( (find = Expr.find[ type ]) ) {
	                            // Search, expanding context for leading sibling combinators
	                            if ( (seed = find(
	                                    token.matches[0].replace( runescape, funescape ),
	                                    rsibling.test( tokens[0].type ) && context.parentNode || context
	                                )) ) {
	
	                                // If seed is empty or no tokens remain, we can return early
	                                tokens.splice( i, 1 );
	                                selector = seed.length && toSelector( tokens );
	                                if ( !selector ) {
	                                    push.apply( results, seed );
	                                    return results;
	                                }
	
	                                break;
	                            }
	                        }
	                    }
	                }
	            }
	
	            // Compile and execute a filtering function
	            // Provide `match` to avoid retokenization if we modified the selector above
	            compile( selector, match )(
	                seed,
	                context,
	                !documentIsHTML,
	                results,
	                rsibling.test( selector )
	            );
	            return results;
	        }
	
	// One-time assignments
	
	// Sort stability
	        support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
	
	// Support: Chrome<14
	// Always assume duplicates if they aren't passed to the comparison function
	        support.detectDuplicates = hasDuplicate;
	
	// Initialize against the default document
	        setDocument();
	
	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	        support.sortDetached = assert(function( div1 ) {
	            // Should return 1, but returns 4 (following)
	            return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	        });
	
	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	        if ( !assert(function( div ) {
	                div.innerHTML = "<a href='#'></a>";
	                return div.firstChild.getAttribute("href") === "#" ;
	            }) ) {
	            addHandle( "type|href|height|width", function( elem, name, isXML ) {
	                if ( !isXML ) {
	                    return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
	                }
	            });
	        }
	
	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	        if ( !support.attributes || !assert(function( div ) {
	                div.innerHTML = "<input/>";
	                div.firstChild.setAttribute( "value", "" );
	                return div.firstChild.getAttribute( "value" ) === "";
	            }) ) {
	            addHandle( "value", function( elem, name, isXML ) {
	                if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
	                    return elem.defaultValue;
	                }
	            });
	        }
	
	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	        if ( !assert(function( div ) {
	                return div.getAttribute("disabled") == null;
	            }) ) {
	            addHandle( booleans, function( elem, name, isXML ) {
	                var val;
	                if ( !isXML ) {
	                    return (val = elem.getAttributeNode( name )) && val.specified ?
	                        val.value :
	                        elem[ name ] === true ? name.toLowerCase() : null;
	                }
	            });
	        }
	
	        jQuery.find = Sizzle;
	        jQuery.expr = Sizzle.selectors;
	        jQuery.expr[":"] = jQuery.expr.pseudos;
	        jQuery.unique = Sizzle.uniqueSort;
	        jQuery.text = Sizzle.getText;
	        jQuery.isXMLDoc = Sizzle.isXML;
	        jQuery.contains = Sizzle.contains;
	
	
	    })( window );
	// String to Object options format cache
	    var optionsCache = {};
	
	// Convert String-formatted options into Object-formatted ones and store in cache
	    function createOptions( options ) {
	        var object = optionsCache[ options ] = {};
	        jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
	            object[ flag ] = true;
	        });
	        return object;
	    }
	
	    /*
	     * Create a callback list using the following parameters:
	     *
	     *	options: an optional list of space-separated options that will change how
	     *			the callback list behaves or a more traditional option object
	     *
	     * By default a callback list will act like an event callback list and can be
	     * "fired" multiple times.
	     *
	     * Possible options:
	     *
	     *	once:			will ensure the callback list can only be fired once (like a Deferred)
	     *
	     *	memory:			will keep track of previous values and will call any callback added
	     *					after the list has been fired right away with the latest "memorized"
	     *					values (like a Deferred)
	     *
	     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	     *
	     *	stopOnFalse:	interrupt callings when a callback returns false
	     *
	     */
	    jQuery.Callbacks = function( options ) {
	
	        // Convert options from String-formatted to Object-formatted if needed
	        // (we check in cache first)
	        options = typeof options === "string" ?
	            ( optionsCache[ options ] || createOptions( options ) ) :
	            jQuery.extend( {}, options );
	
	        var // Flag to know if list is currently firing
	            firing,
	        // Last fire value (for non-forgettable lists)
	            memory,
	        // Flag to know if list was already fired
	            fired,
	        // End of the loop when firing
	            firingLength,
	        // Index of currently firing callback (modified by remove if needed)
	            firingIndex,
	        // First callback to fire (used internally by add and fireWith)
	            firingStart,
	        // Actual callback list
	            list = [],
	        // Stack of fire calls for repeatable lists
	            stack = !options.once && [],
	        // Fire callbacks
	            fire = function( data ) {
	                memory = options.memory && data;
	                fired = true;
	                firingIndex = firingStart || 0;
	                firingStart = 0;
	                firingLength = list.length;
	                firing = true;
	                for ( ; list && firingIndex < firingLength; firingIndex++ ) {
	                    if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
	                        memory = false; // To prevent further calls using add
	                        break;
	                    }
	                }
	                firing = false;
	                if ( list ) {
	                    if ( stack ) {
	                        if ( stack.length ) {
	                            fire( stack.shift() );
	                        }
	                    } else if ( memory ) {
	                        list = [];
	                    } else {
	                        self.disable();
	                    }
	                }
	            },
	        // Actual Callbacks object
	            self = {
	                // Add a callback or a collection of callbacks to the list
	                add: function() {
	                    if ( list ) {
	                        // First, we save the current length
	                        var start = list.length;
	                        (function add( args ) {
	                            jQuery.each( args, function( _, arg ) {
	                                var type = jQuery.type( arg );
	                                if ( type === "function" ) {
	                                    if ( !options.unique || !self.has( arg ) ) {
	                                        list.push( arg );
	                                    }
	                                } else if ( arg && arg.length && type !== "string" ) {
	                                    // Inspect recursively
	                                    add( arg );
	                                }
	                            });
	                        })( arguments );
	                        // Do we need to add the callbacks to the
	                        // current firing batch?
	                        if ( firing ) {
	                            firingLength = list.length;
	                            // With memory, if we're not firing then
	                            // we should call right away
	                        } else if ( memory ) {
	                            firingStart = start;
	                            fire( memory );
	                        }
	                    }
	                    return this;
	                },
	                // Remove a callback from the list
	                remove: function() {
	                    if ( list ) {
	                        jQuery.each( arguments, function( _, arg ) {
	                            var index;
	                            while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
	                                list.splice( index, 1 );
	                                // Handle firing indexes
	                                if ( firing ) {
	                                    if ( index <= firingLength ) {
	                                        firingLength--;
	                                    }
	                                    if ( index <= firingIndex ) {
	                                        firingIndex--;
	                                    }
	                                }
	                            }
	                        });
	                    }
	                    return this;
	                },
	                // Check if a given callback is in the list.
	                // If no argument is given, return whether or not list has callbacks attached.
	                has: function( fn ) {
	                    return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
	                },
	                // Remove all callbacks from the list
	                empty: function() {
	                    list = [];
	                    firingLength = 0;
	                    return this;
	                },
	                // Have the list do nothing anymore
	                disable: function() {
	                    list = stack = memory = undefined;
	                    return this;
	                },
	                // Is it disabled?
	                disabled: function() {
	                    return !list;
	                },
	                // Lock the list in its current state
	                lock: function() {
	                    stack = undefined;
	                    if ( !memory ) {
	                        self.disable();
	                    }
	                    return this;
	                },
	                // Is it locked?
	                locked: function() {
	                    return !stack;
	                },
	                // Call all callbacks with the given context and arguments
	                fireWith: function( context, args ) {
	                    if ( list && ( !fired || stack ) ) {
	                        args = args || [];
	                        args = [ context, args.slice ? args.slice() : args ];
	                        if ( firing ) {
	                            stack.push( args );
	                        } else {
	                            fire( args );
	                        }
	                    }
	                    return this;
	                },
	                // Call all the callbacks with the given arguments
	                fire: function() {
	                    self.fireWith( this, arguments );
	                    return this;
	                },
	                // To know if the callbacks have already been called at least once
	                fired: function() {
	                    return !!fired;
	                }
	            };
	
	        return self;
	    };
	    jQuery.extend({
	
	        Deferred: function( func ) {
	            var tuples = [
	                    // action, add listener, listener list, final state
	                    [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
	                    [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
	                    [ "notify", "progress", jQuery.Callbacks("memory") ]
	                ],
	                state = "pending",
	                promise = {
	                    state: function() {
	                        return state;
	                    },
	                    always: function() {
	                        deferred.done( arguments ).fail( arguments );
	                        return this;
	                    },
	                    then: function( /* fnDone, fnFail, fnProgress */ ) {
	                        var fns = arguments;
	                        return jQuery.Deferred(function( newDefer ) {
	                            jQuery.each( tuples, function( i, tuple ) {
	                                var action = tuple[ 0 ],
	                                    fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
	                                // deferred[ done | fail | progress ] for forwarding actions to newDefer
	                                deferred[ tuple[1] ](function() {
	                                    var returned = fn && fn.apply( this, arguments );
	                                    if ( returned && jQuery.isFunction( returned.promise ) ) {
	                                        returned.promise()
	                                            .done( newDefer.resolve )
	                                            .fail( newDefer.reject )
	                                            .progress( newDefer.notify );
	                                    } else {
	                                        newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
	                                    }
	                                });
	                            });
	                            fns = null;
	                        }).promise();
	                    },
	                    // Get a promise for this deferred
	                    // If obj is provided, the promise aspect is added to the object
	                    promise: function( obj ) {
	                        return obj != null ? jQuery.extend( obj, promise ) : promise;
	                    }
	                },
	                deferred = {};
	
	            // Keep pipe for back-compat
	            promise.pipe = promise.then;
	
	            // Add list-specific methods
	            jQuery.each( tuples, function( i, tuple ) {
	                var list = tuple[ 2 ],
	                    stateString = tuple[ 3 ];
	
	                // promise[ done | fail | progress ] = list.add
	                promise[ tuple[1] ] = list.add;
	
	                // Handle state
	                if ( stateString ) {
	                    list.add(function() {
	                        // state = [ resolved | rejected ]
	                        state = stateString;
	
	                        // [ reject_list | resolve_list ].disable; progress_list.lock
	                    }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
	                }
	
	                // deferred[ resolve | reject | notify ]
	                deferred[ tuple[0] ] = function() {
	                    deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
	                    return this;
	                };
	                deferred[ tuple[0] + "With" ] = list.fireWith;
	            });
	
	            // Make the deferred a promise
	            promise.promise( deferred );
	
	            // Call given func if any
	            if ( func ) {
	                func.call( deferred, deferred );
	            }
	
	            // All done!
	            return deferred;
	        },
	
	        // Deferred helper
	        when: function( subordinate /* , ..., subordinateN */ ) {
	            var i = 0,
	                resolveValues = core_slice.call( arguments ),
	                length = resolveValues.length,
	
	            // the count of uncompleted subordinates
	                remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,
	
	            // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
	                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
	
	            // Update function for both resolve and progress values
	                updateFunc = function( i, contexts, values ) {
	                    return function( value ) {
	                        contexts[ i ] = this;
	                        values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
	                        if( values === progressValues ) {
	                            deferred.notifyWith( contexts, values );
	                        } else if ( !( --remaining ) ) {
	                            deferred.resolveWith( contexts, values );
	                        }
	                    };
	                },
	
	                progressValues, progressContexts, resolveContexts;
	
	            // add listeners to Deferred subordinates; treat others as resolved
	            if ( length > 1 ) {
	                progressValues = new Array( length );
	                progressContexts = new Array( length );
	                resolveContexts = new Array( length );
	                for ( ; i < length; i++ ) {
	                    if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
	                        resolveValues[ i ].promise()
	                            .done( updateFunc( i, resolveContexts, resolveValues ) )
	                            .fail( deferred.reject )
	                            .progress( updateFunc( i, progressContexts, progressValues ) );
	                    } else {
	                        --remaining;
	                    }
	                }
	            }
	
	            // if we're not waiting on anything, resolve the master
	            if ( !remaining ) {
	                deferred.resolveWith( resolveContexts, resolveValues );
	            }
	
	            return deferred.promise();
	        }
	    });
	    jQuery.support = (function( support ) {
	
	        var all, a, input, select, fragment, opt, eventName, isSupported, i,
	            div = document.createElement("div");
	
	        // Setup
	        div.setAttribute( "className", "t" );
	        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
	
	        // Finish early in limited (non-browser) environments
	        all = div.getElementsByTagName("*") || [];
	        a = div.getElementsByTagName("a")[ 0 ];
	        if ( !a || !a.style || !all.length ) {
	            return support;
	        }
	
	        // First batch of tests
	        select = document.createElement("select");
	        opt = select.appendChild( document.createElement("option") );
	        input = div.getElementsByTagName("input")[ 0 ];
	
	        a.style.cssText = "top:1px;float:left;opacity:.5";
	
	        // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	        support.getSetAttribute = div.className !== "t";
	
	        // IE strips leading whitespace when .innerHTML is used
	        support.leadingWhitespace = div.firstChild.nodeType === 3;
	
	        // Make sure that tbody elements aren't automatically inserted
	        // IE will insert them into empty tables
	        support.tbody = !div.getElementsByTagName("tbody").length;
	
	        // Make sure that link elements get serialized correctly by innerHTML
	        // This requires a wrapper element in IE
	        support.htmlSerialize = !!div.getElementsByTagName("link").length;
	
	        // Get the style information from getAttribute
	        // (IE uses .cssText instead)
	        support.style = /top/.test( a.getAttribute("style") );
	
	        // Make sure that URLs aren't manipulated
	        // (IE normalizes it by default)
	        support.hrefNormalized = a.getAttribute("href") === "/a";
	
	        // Make sure that element opacity exists
	        // (IE uses filter instead)
	        // Use a regex to work around a WebKit issue. See #5145
	        support.opacity = /^0.5/.test( a.style.opacity );
	
	        // Verify style float existence
	        // (IE uses styleFloat instead of cssFloat)
	        support.cssFloat = !!a.style.cssFloat;
	
	        // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	        support.checkOn = !!input.value;
	
	        // Make sure that a selected-by-default option has a working selected property.
	        // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	        support.optSelected = opt.selected;
	
	        // Tests for enctype support on a form (#6743)
	        support.enctype = !!document.createElement("form").enctype;
	
	        // Makes sure cloning an html5 element does not cause problems
	        // Where outerHTML is undefined, this still works
	        support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";
	
	        // Will be defined later
	        support.inlineBlockNeedsLayout = false;
	        support.shrinkWrapBlocks = false;
	        support.pixelPosition = false;
	        support.deleteExpando = true;
	        support.noCloneEvent = true;
	        support.reliableMarginRight = true;
	        support.boxSizingReliable = true;
	
	        // Make sure checked status is properly cloned
	        input.checked = true;
	        support.noCloneChecked = input.cloneNode( true ).checked;
	
	        // Make sure that the options inside disabled selects aren't marked as disabled
	        // (WebKit marks them as disabled)
	        select.disabled = true;
	        support.optDisabled = !opt.disabled;
	
	        // Support: IE<9
	        try {
	            delete div.test;
	        } catch( e ) {
	            support.deleteExpando = false;
	        }
	
	        // Check if we can trust getAttribute("value")
	        input = document.createElement("input");
	        input.setAttribute( "value", "" );
	        support.input = input.getAttribute( "value" ) === "";
	
	        // Check if an input maintains its value after becoming a radio
	        input.value = "t";
	        input.setAttribute( "type", "radio" );
	        support.radioValue = input.value === "t";
	
	        // #11217 - WebKit loses check when the name is after the checked attribute
	        input.setAttribute( "checked", "t" );
	        input.setAttribute( "name", "t" );
	
	        fragment = document.createDocumentFragment();
	        fragment.appendChild( input );
	
	        // Check if a disconnected checkbox will retain its checked
	        // value of true after appended to the DOM (IE6/7)
	        support.appendChecked = input.checked;
	
	        // WebKit doesn't clone checked state correctly in fragments
	        support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;
	
	        // Support: IE<9
	        // Opera does not clone events (and typeof div.attachEvent === undefined).
	        // IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	        if ( div.attachEvent ) {
	            div.attachEvent( "onclick", function() {
	                support.noCloneEvent = false;
	            });
	
	            div.cloneNode( true ).click();
	        }
	
	        // Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	        // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	        for ( i in { submit: true, change: true, focusin: true }) {
	            div.setAttribute( eventName = "on" + i, "t" );
	
	            support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	        }
	
	        div.style.backgroundClip = "content-box";
	        div.cloneNode( true ).style.backgroundClip = "";
	        support.clearCloneStyle = div.style.backgroundClip === "content-box";
	
	        // Support: IE<9
	        // Iteration over object's inherited properties before its own.
	        for ( i in jQuery( support ) ) {
	            break;
	        }
	        support.ownLast = i !== "0";
	
	        // Run tests that need a body at doc ready
	        jQuery(function() {
	            var container, marginDiv, tds,
	                divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
	                body = document.getElementsByTagName("body")[0];
	
	            if ( !body ) {
	                // Return for frameset docs that don't have a body
	                return;
	            }
	
	            container = document.createElement("div");
	            container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
	
	            body.appendChild( container ).appendChild( div );
	
	            // Support: IE8
	            // Check if table cells still have offsetWidth/Height when they are set
	            // to display:none and there are still other visible table cells in a
	            // table row; if so, offsetWidth/Height are not reliable for use when
	            // determining if an element has been hidden directly using
	            // display:none (it is still safe to use offsets if a parent element is
	            // hidden; don safety goggles and see bug #4512 for more information).
	            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
	            tds = div.getElementsByTagName("td");
	            tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
	            isSupported = ( tds[ 0 ].offsetHeight === 0 );
	
	            tds[ 0 ].style.display = "";
	            tds[ 1 ].style.display = "none";
	
	            // Support: IE8
	            // Check if empty table cells still have offsetWidth/Height
	            support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
	
	            // Check box-sizing and margin behavior.
	            div.innerHTML = "";
	            div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
	
	            // Workaround failing boxSizing test due to offsetWidth returning wrong value
	            // with some non-1 values of body zoom, ticket #13543
	            jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
	                support.boxSizing = div.offsetWidth === 4;
	            });
	
	            // Use window.getComputedStyle because jsdom on node.js will break without it.
	            if ( window.getComputedStyle ) {
	                support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
	                support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";
	
	                // Check if div with explicit width and no margin-right incorrectly
	                // gets computed margin-right based on width of container. (#3333)
	                // Fails in WebKit before Feb 2011 nightlies
	                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	                marginDiv = div.appendChild( document.createElement("div") );
	                marginDiv.style.cssText = div.style.cssText = divReset;
	                marginDiv.style.marginRight = marginDiv.style.width = "0";
	                div.style.width = "1px";
	
	                support.reliableMarginRight =
	                    !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
	            }
	
	            if ( typeof div.style.zoom !== core_strundefined ) {
	                // Support: IE<8
	                // Check if natively block-level elements act like inline-block
	                // elements when setting their display to 'inline' and giving
	                // them layout
	                div.innerHTML = "";
	                div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
	                support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );
	
	                // Support: IE6
	                // Check if elements with layout shrink-wrap their children
	                div.style.display = "block";
	                div.innerHTML = "<div></div>";
	                div.firstChild.style.width = "5px";
	                support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
	
	                if ( support.inlineBlockNeedsLayout ) {
	                    // Prevent IE 6 from affecting layout for positioned elements #11048
	                    // Prevent IE from shrinking the body in IE 7 mode #12869
	                    // Support: IE<8
	                    body.style.zoom = 1;
	                }
	            }
	
	            body.removeChild( container );
	
	            // Null elements to avoid leaks in IE
	            container = div = tds = marginDiv = null;
	        });
	
	        // Null elements to avoid leaks in IE
	        all = select = fragment = opt = a = input = null;
	
	        return support;
	    })({});
	
	    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	        rmultiDash = /([A-Z])/g;
	
	    function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	        if ( !jQuery.acceptData( elem ) ) {
	            return;
	        }
	
	        var ret, thisCache,
	            internalKey = jQuery.expando,
	
	        // We have to handle DOM nodes and JS objects differently because IE6-7
	        // can't GC object references properly across the DOM-JS boundary
	            isNode = elem.nodeType,
	
	        // Only DOM nodes need the global jQuery cache; JS object data is
	        // attached directly to the object so GC can occur automatically
	            cache = isNode ? jQuery.cache : elem,
	
	        // Only defining an ID for JS objects if its cache already exists allows
	        // the code to shortcut on the same path as a DOM node with no cache
	            id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;
	
	        // Avoid doing any more work than we need to when trying to get data on an
	        // object that has no data at all
	        if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
	            return;
	        }
	
	        if ( !id ) {
	            // Only DOM nodes need a new unique ID for each element since their data
	            // ends up in the global cache
	            if ( isNode ) {
	                id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
	            } else {
	                id = internalKey;
	            }
	        }
	
	        if ( !cache[ id ] ) {
	            // Avoid exposing jQuery metadata on plain JS objects when the object
	            // is serialized using JSON.stringify
	            cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	        }
	
	        // An object can be passed to jQuery.data instead of a key/value pair; this gets
	        // shallow copied over onto the existing cache
	        if ( typeof name === "object" || typeof name === "function" ) {
	            if ( pvt ) {
	                cache[ id ] = jQuery.extend( cache[ id ], name );
	            } else {
	                cache[ id ].data = jQuery.extend( cache[ id ].data, name );
	            }
	        }
	
	        thisCache = cache[ id ];
	
	        // jQuery data() is stored in a separate object inside the object's internal data
	        // cache in order to avoid key collisions between internal data and user-defined
	        // data.
	        if ( !pvt ) {
	            if ( !thisCache.data ) {
	                thisCache.data = {};
	            }
	
	            thisCache = thisCache.data;
	        }
	
	        if ( data !== undefined ) {
	            thisCache[ jQuery.camelCase( name ) ] = data;
	        }
	
	        // Check for both converted-to-camel and non-converted data property names
	        // If a data property was specified
	        if ( typeof name === "string" ) {
	
	            // First Try to find as-is property data
	            ret = thisCache[ name ];
	
	            // Test for null|undefined property data
	            if ( ret == null ) {
	
	                // Try to find the camelCased property
	                ret = thisCache[ jQuery.camelCase( name ) ];
	            }
	        } else {
	            ret = thisCache;
	        }
	
	        return ret;
	    }
	
	    function internalRemoveData( elem, name, pvt ) {
	        if ( !jQuery.acceptData( elem ) ) {
	            return;
	        }
	
	        var thisCache, i,
	            isNode = elem.nodeType,
	
	        // See jQuery.data for more information
	            cache = isNode ? jQuery.cache : elem,
	            id = isNode ? elem[ jQuery.expando ] : jQuery.expando;
	
	        // If there is already no cache entry for this object, there is no
	        // purpose in continuing
	        if ( !cache[ id ] ) {
	            return;
	        }
	
	        if ( name ) {
	
	            thisCache = pvt ? cache[ id ] : cache[ id ].data;
	
	            if ( thisCache ) {
	
	                // Support array or space separated string names for data keys
	                if ( !jQuery.isArray( name ) ) {
	
	                    // try the string as a key before any manipulation
	                    if ( name in thisCache ) {
	                        name = [ name ];
	                    } else {
	
	                        // split the camel cased version by spaces unless a key with the spaces exists
	                        name = jQuery.camelCase( name );
	                        if ( name in thisCache ) {
	                            name = [ name ];
	                        } else {
	                            name = name.split(" ");
	                        }
	                    }
	                } else {
	                    // If "name" is an array of keys...
	                    // When data is initially created, via ("key", "val") signature,
	                    // keys will be converted to camelCase.
	                    // Since there is no way to tell _how_ a key was added, remove
	                    // both plain key and camelCase key. #12786
	                    // This will only penalize the array argument path.
	                    name = name.concat( jQuery.map( name, jQuery.camelCase ) );
	                }
	
	                i = name.length;
	                while ( i-- ) {
	                    delete thisCache[ name[i] ];
	                }
	
	                // If there is no data left in the cache, we want to continue
	                // and let the cache object itself get destroyed
	                if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
	                    return;
	                }
	            }
	        }
	
	        // See jQuery.data for more information
	        if ( !pvt ) {
	            delete cache[ id ].data;
	
	            // Don't destroy the parent cache unless the internal data object
	            // had been the only thing left in it
	            if ( !isEmptyDataObject( cache[ id ] ) ) {
	                return;
	            }
	        }
	
	        // Destroy the cache
	        if ( isNode ) {
	            jQuery.cleanData( [ elem ], true );
	
	            // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	            /* jshint eqeqeq: false */
	        } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
	            /* jshint eqeqeq: true */
	            delete cache[ id ];
	
	            // When all else fails, null
	        } else {
	            cache[ id ] = null;
	        }
	    }
	
	    jQuery.extend({
	        cache: {},
	
	        // The following elements throw uncatchable exceptions if you
	        // attempt to add expando properties to them.
	        noData: {
	            "applet": true,
	            "embed": true,
	            // Ban all objects except for Flash (which handle expandos)
	            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	        },
	
	        hasData: function( elem ) {
	            elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
	            return !!elem && !isEmptyDataObject( elem );
	        },
	
	        data: function( elem, name, data ) {
	            return internalData( elem, name, data );
	        },
	
	        removeData: function( elem, name ) {
	            return internalRemoveData( elem, name );
	        },
	
	        // For internal use only.
	        _data: function( elem, name, data ) {
	            return internalData( elem, name, data, true );
	        },
	
	        _removeData: function( elem, name ) {
	            return internalRemoveData( elem, name, true );
	        },
	
	        // A method for determining if a DOM node can handle the data expando
	        acceptData: function( elem ) {
	            // Do not set data on non-element because it will not be cleared (#8335).
	            if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
	                return false;
	            }
	
	            var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];
	
	            // nodes accept data unless otherwise specified; rejection can be conditional
	            return !noData || noData !== true && elem.getAttribute("classid") === noData;
	        }
	    });
	
	    jQuery.fn.extend({
	        data: function( key, value ) {
	            var attrs, name,
	                data = null,
	                i = 0,
	                elem = this[0];
	
	            // Special expections of .data basically thwart jQuery.access,
	            // so implement the relevant behavior ourselves
	
	            // Gets all values
	            if ( key === undefined ) {
	                if ( this.length ) {
	                    data = jQuery.data( elem );
	
	                    if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
	                        attrs = elem.attributes;
	                        for ( ; i < attrs.length; i++ ) {
	                            name = attrs[i].name;
	
	                            if ( name.indexOf("data-") === 0 ) {
	                                name = jQuery.camelCase( name.slice(5) );
	
	                                dataAttr( elem, name, data[ name ] );
	                            }
	                        }
	                        jQuery._data( elem, "parsedAttrs", true );
	                    }
	                }
	
	                return data;
	            }
	
	            // Sets multiple values
	            if ( typeof key === "object" ) {
	                return this.each(function() {
	                    jQuery.data( this, key );
	                });
	            }
	
	            return arguments.length > 1 ?
	
	                // Sets one value
	                this.each(function() {
	                    jQuery.data( this, key, value );
	                }) :
	
	                // Gets one value
	                // Try to fetch any internally stored data first
	                elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	        },
	
	        removeData: function( key ) {
	            return this.each(function() {
	                jQuery.removeData( this, key );
	            });
	        }
	    });
	
	    function dataAttr( elem, key, data ) {
	        // If nothing was found internally, try to fetch any
	        // data from the HTML5 data-* attribute
	        if ( data === undefined && elem.nodeType === 1 ) {
	
	            var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
	
	            data = elem.getAttribute( name );
	
	            if ( typeof data === "string" ) {
	                try {
	                    data = data === "true" ? true :
	                        data === "false" ? false :
	                            data === "null" ? null :
	                                // Only convert to a number if it doesn't change the string
	                                +data + "" === data ? +data :
	                                    rbrace.test( data ) ? jQuery.parseJSON( data ) :
	                                        data;
	                } catch( e ) {}
	
	                // Make sure we set the data so it isn't changed later
	                jQuery.data( elem, key, data );
	
	            } else {
	                data = undefined;
	            }
	        }
	
	        return data;
	    }
	
	// checks a cache object for emptiness
	    function isEmptyDataObject( obj ) {
	        var name;
	        for ( name in obj ) {
	
	            // if the public data object is empty, the private is still empty
	            if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
	                continue;
	            }
	            if ( name !== "toJSON" ) {
	                return false;
	            }
	        }
	
	        return true;
	    }
	    jQuery.extend({
	        queue: function( elem, type, data ) {
	            var queue;
	
	            if ( elem ) {
	                type = ( type || "fx" ) + "queue";
	                queue = jQuery._data( elem, type );
	
	                // Speed up dequeue by getting out quickly if this is just a lookup
	                if ( data ) {
	                    if ( !queue || jQuery.isArray(data) ) {
	                        queue = jQuery._data( elem, type, jQuery.makeArray(data) );
	                    } else {
	                        queue.push( data );
	                    }
	                }
	                return queue || [];
	            }
	        },
	
	        dequeue: function( elem, type ) {
	            type = type || "fx";
	
	            var queue = jQuery.queue( elem, type ),
	                startLength = queue.length,
	                fn = queue.shift(),
	                hooks = jQuery._queueHooks( elem, type ),
	                next = function() {
	                    jQuery.dequeue( elem, type );
	                };
	
	            // If the fx queue is dequeued, always remove the progress sentinel
	            if ( fn === "inprogress" ) {
	                fn = queue.shift();
	                startLength--;
	            }
	
	            if ( fn ) {
	
	                // Add a progress sentinel to prevent the fx queue from being
	                // automatically dequeued
	                if ( type === "fx" ) {
	                    queue.unshift( "inprogress" );
	                }
	
	                // clear up the last queue stop function
	                delete hooks.stop;
	                fn.call( elem, next, hooks );
	            }
	
	            if ( !startLength && hooks ) {
	                hooks.empty.fire();
	            }
	        },
	
	        // not intended for public consumption - generates a queueHooks object, or returns the current one
	        _queueHooks: function( elem, type ) {
	            var key = type + "queueHooks";
	            return jQuery._data( elem, key ) || jQuery._data( elem, key, {
	                    empty: jQuery.Callbacks("once memory").add(function() {
	                        jQuery._removeData( elem, type + "queue" );
	                        jQuery._removeData( elem, key );
	                    })
	                });
	        }
	    });
	
	    jQuery.fn.extend({
	        queue: function( type, data ) {
	            var setter = 2;
	
	            if ( typeof type !== "string" ) {
	                data = type;
	                type = "fx";
	                setter--;
	            }
	
	            if ( arguments.length < setter ) {
	                return jQuery.queue( this[0], type );
	            }
	
	            return data === undefined ?
	                this :
	                this.each(function() {
	                    var queue = jQuery.queue( this, type, data );
	
	                    // ensure a hooks for this queue
	                    jQuery._queueHooks( this, type );
	
	                    if ( type === "fx" && queue[0] !== "inprogress" ) {
	                        jQuery.dequeue( this, type );
	                    }
	                });
	        },
	        dequeue: function( type ) {
	            return this.each(function() {
	                jQuery.dequeue( this, type );
	            });
	        },
	        // Based off of the plugin by Clint Helfers, with permission.
	        // http://blindsignals.com/index.php/2009/07/jquery-delay/
	        delay: function( time, type ) {
	            time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	            type = type || "fx";
	
	            return this.queue( type, function( next, hooks ) {
	                var timeout = setTimeout( next, time );
	                hooks.stop = function() {
	                    clearTimeout( timeout );
	                };
	            });
	        },
	        clearQueue: function( type ) {
	            return this.queue( type || "fx", [] );
	        },
	        // Get a promise resolved when queues of a certain type
	        // are emptied (fx is the type by default)
	        promise: function( type, obj ) {
	            var tmp,
	                count = 1,
	                defer = jQuery.Deferred(),
	                elements = this,
	                i = this.length,
	                resolve = function() {
	                    if ( !( --count ) ) {
	                        defer.resolveWith( elements, [ elements ] );
	                    }
	                };
	
	            if ( typeof type !== "string" ) {
	                obj = type;
	                type = undefined;
	            }
	            type = type || "fx";
	
	            while( i-- ) {
	                tmp = jQuery._data( elements[ i ], type + "queueHooks" );
	                if ( tmp && tmp.empty ) {
	                    count++;
	                    tmp.empty.add( resolve );
	                }
	            }
	            resolve();
	            return defer.promise( obj );
	        }
	    });
	    var nodeHook, boolHook,
	        rclass = /[\t\r\n\f]/g,
	        rreturn = /\r/g,
	        rfocusable = /^(?:input|select|textarea|button|object)$/i,
	        rclickable = /^(?:a|area)$/i,
	        ruseDefault = /^(?:checked|selected)$/i,
	        getSetAttribute = jQuery.support.getSetAttribute,
	        getSetInput = jQuery.support.input;
	
	    jQuery.fn.extend({
	        attr: function( name, value ) {
	            return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	        },
	
	        removeAttr: function( name ) {
	            return this.each(function() {
	                jQuery.removeAttr( this, name );
	            });
	        },
	
	        prop: function( name, value ) {
	            return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	        },
	
	        removeProp: function( name ) {
	            name = jQuery.propFix[ name ] || name;
	            return this.each(function() {
	                // try/catch handles cases where IE balks (such as removing a property on window)
	                try {
	                    this[ name ] = undefined;
	                    delete this[ name ];
	                } catch( e ) {}
	            });
	        },
	
	        addClass: function( value ) {
	            var classes, elem, cur, clazz, j,
	                i = 0,
	                len = this.length,
	                proceed = typeof value === "string" && value;
	
	            if ( jQuery.isFunction( value ) ) {
	                return this.each(function( j ) {
	                    jQuery( this ).addClass( value.call( this, j, this.className ) );
	                });
	            }
	
	            if ( proceed ) {
	                // The disjunction here is for better compressibility (see removeClass)
	                classes = ( value || "" ).match( core_rnotwhite ) || [];
	
	                for ( ; i < len; i++ ) {
	                    elem = this[ i ];
	                    cur = elem.nodeType === 1 && ( elem.className ?
	                                ( " " + elem.className + " " ).replace( rclass, " " ) :
	                                " "
	                        );
	
	                    if ( cur ) {
	                        j = 0;
	                        while ( (clazz = classes[j++]) ) {
	                            if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
	                                cur += clazz + " ";
	                            }
	                        }
	                        elem.className = jQuery.trim( cur );
	
	                    }
	                }
	            }
	
	            return this;
	        },
	
	        removeClass: function( value ) {
	            var classes, elem, cur, clazz, j,
	                i = 0,
	                len = this.length,
	                proceed = arguments.length === 0 || typeof value === "string" && value;
	
	            if ( jQuery.isFunction( value ) ) {
	                return this.each(function( j ) {
	                    jQuery( this ).removeClass( value.call( this, j, this.className ) );
	                });
	            }
	            if ( proceed ) {
	                classes = ( value || "" ).match( core_rnotwhite ) || [];
	
	                for ( ; i < len; i++ ) {
	                    elem = this[ i ];
	                    // This expression is here for better compressibility (see addClass)
	                    cur = elem.nodeType === 1 && ( elem.className ?
	                                ( " " + elem.className + " " ).replace( rclass, " " ) :
	                                ""
	                        );
	
	                    if ( cur ) {
	                        j = 0;
	                        while ( (clazz = classes[j++]) ) {
	                            // Remove *all* instances
	                            while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
	                                cur = cur.replace( " " + clazz + " ", " " );
	                            }
	                        }
	                        elem.className = value ? jQuery.trim( cur ) : "";
	                    }
	                }
	            }
	
	            return this;
	        },
	
	        toggleClass: function( value, stateVal ) {
	            var type = typeof value;
	
	            if ( typeof stateVal === "boolean" && type === "string" ) {
	                return stateVal ? this.addClass( value ) : this.removeClass( value );
	            }
	
	            if ( jQuery.isFunction( value ) ) {
	                return this.each(function( i ) {
	                    jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
	                });
	            }
	
	            return this.each(function() {
	                if ( type === "string" ) {
	                    // toggle individual class names
	                    var className,
	                        i = 0,
	                        self = jQuery( this ),
	                        classNames = value.match( core_rnotwhite ) || [];
	
	                    while ( (className = classNames[ i++ ]) ) {
	                        // check each className given, space separated list
	                        if ( self.hasClass( className ) ) {
	                            self.removeClass( className );
	                        } else {
	                            self.addClass( className );
	                        }
	                    }
	
	                    // Toggle whole class name
	                } else if ( type === core_strundefined || type === "boolean" ) {
	                    if ( this.className ) {
	                        // store className if set
	                        jQuery._data( this, "__className__", this.className );
	                    }
	
	                    // If the element has a class name or if we're passed "false",
	                    // then remove the whole classname (if there was one, the above saved it).
	                    // Otherwise bring back whatever was previously saved (if anything),
	                    // falling back to the empty string if nothing was stored.
	                    this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
	                }
	            });
	        },
	
	        hasClass: function( selector ) {
	            var className = " " + selector + " ",
	                i = 0,
	                l = this.length;
	            for ( ; i < l; i++ ) {
	                if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
	                    return true;
	                }
	            }
	
	            return false;
	        },
	
	        val: function( value ) {
	            var ret, hooks, isFunction,
	                elem = this[0];
	
	            if ( !arguments.length ) {
	                if ( elem ) {
	                    hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];
	
	                    if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
	                        return ret;
	                    }
	
	                    ret = elem.value;
	
	                    return typeof ret === "string" ?
	                        // handle most common string cases
	                        ret.replace(rreturn, "") :
	                        // handle cases where value is null/undef or number
	                        ret == null ? "" : ret;
	                }
	
	                return;
	            }
	
	            isFunction = jQuery.isFunction( value );
	
	            return this.each(function( i ) {
	                var val;
	
	                if ( this.nodeType !== 1 ) {
	                    return;
	                }
	
	                if ( isFunction ) {
	                    val = value.call( this, i, jQuery( this ).val() );
	                } else {
	                    val = value;
	                }
	
	                // Treat null/undefined as ""; convert numbers to string
	                if ( val == null ) {
	                    val = "";
	                } else if ( typeof val === "number" ) {
	                    val += "";
	                } else if ( jQuery.isArray( val ) ) {
	                    val = jQuery.map(val, function ( value ) {
	                        return value == null ? "" : value + "";
	                    });
	                }
	
	                hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
	
	                // If set returns undefined, fall back to normal setting
	                if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
	                    this.value = val;
	                }
	            });
	        }
	    });
	
	    jQuery.extend({
	        valHooks: {
	            option: {
	                get: function( elem ) {
	                    // Use proper attribute retrieval(#6932, #12072)
	                    var val = jQuery.find.attr( elem, "value" );
	                    return val != null ?
	                        val :
	                        elem.text;
	                }
	            },
	            select: {
	                get: function( elem ) {
	                    var value, option,
	                        options = elem.options,
	                        index = elem.selectedIndex,
	                        one = elem.type === "select-one" || index < 0,
	                        values = one ? null : [],
	                        max = one ? index + 1 : options.length,
	                        i = index < 0 ?
	                            max :
	                            one ? index : 0;
	
	                    // Loop through all the selected options
	                    for ( ; i < max; i++ ) {
	                        option = options[ i ];
	
	                        // oldIE doesn't update selected after form reset (#2551)
	                        if ( ( option.selected || i === index ) &&
	                            // Don't return options that are disabled or in a disabled optgroup
	                            ( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
	                            ( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
	
	                            // Get the specific value for the option
	                            value = jQuery( option ).val();
	
	                            // We don't need an array for one selects
	                            if ( one ) {
	                                return value;
	                            }
	
	                            // Multi-Selects return an array
	                            values.push( value );
	                        }
	                    }
	
	                    return values;
	                },
	
	                set: function( elem, value ) {
	                    var optionSet, option,
	                        options = elem.options,
	                        values = jQuery.makeArray( value ),
	                        i = options.length;
	
	                    while ( i-- ) {
	                        option = options[ i ];
	                        if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
	                            optionSet = true;
	                        }
	                    }
	
	                    // force browsers to behave consistently when non-matching value is set
	                    if ( !optionSet ) {
	                        elem.selectedIndex = -1;
	                    }
	                    return values;
	                }
	            }
	        },
	
	        attr: function( elem, name, value ) {
	            var hooks, ret,
	                nType = elem.nodeType;
	
	            // don't get/set attributes on text, comment and attribute nodes
	            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
	                return;
	            }
	
	            // Fallback to prop when attributes are not supported
	            if ( typeof elem.getAttribute === core_strundefined ) {
	                return jQuery.prop( elem, name, value );
	            }
	
	            // All attributes are lowercase
	            // Grab necessary hook if one is defined
	            if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
	                name = name.toLowerCase();
	                hooks = jQuery.attrHooks[ name ] ||
	                    ( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
	            }
	
	            if ( value !== undefined ) {
	
	                if ( value === null ) {
	                    jQuery.removeAttr( elem, name );
	
	                } else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
	                    return ret;
	
	                } else {
	                    elem.setAttribute( name, value + "" );
	                    return value;
	                }
	
	            } else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
	                return ret;
	
	            } else {
	                ret = jQuery.find.attr( elem, name );
	
	                // Non-existent attributes return null, we normalize to undefined
	                return ret == null ?
	                    undefined :
	                    ret;
	            }
	        },
	
	        removeAttr: function( elem, value ) {
	            var name, propName,
	                i = 0,
	                attrNames = value && value.match( core_rnotwhite );
	
	            if ( attrNames && elem.nodeType === 1 ) {
	                while ( (name = attrNames[i++]) ) {
	                    propName = jQuery.propFix[ name ] || name;
	
	                    // Boolean attributes get special treatment (#10870)
	                    if ( jQuery.expr.match.bool.test( name ) ) {
	                        // Set corresponding property to false
	                        if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
	                            elem[ propName ] = false;
	                            // Support: IE<9
	                            // Also clear defaultChecked/defaultSelected (if appropriate)
	                        } else {
	                            elem[ jQuery.camelCase( "default-" + name ) ] =
	                                elem[ propName ] = false;
	                        }
	
	                        // See #9699 for explanation of this approach (setting first, then removal)
	                    } else {
	                        jQuery.attr( elem, name, "" );
	                    }
	
	                    elem.removeAttribute( getSetAttribute ? name : propName );
	                }
	            }
	        },
	
	        attrHooks: {
	            type: {
	                set: function( elem, value ) {
	                    if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
	                        // Setting the type on a radio button after the value resets the value in IE6-9
	                        // Reset value to default in case type is set after value during creation
	                        var val = elem.value;
	                        elem.setAttribute( "type", value );
	                        if ( val ) {
	                            elem.value = val;
	                        }
	                        return value;
	                    }
	                }
	            }
	        },
	
	        propFix: {
	            "for": "htmlFor",
	            "class": "className"
	        },
	
	        prop: function( elem, name, value ) {
	            var ret, hooks, notxml,
	                nType = elem.nodeType;
	
	            // don't get/set properties on text, comment and attribute nodes
	            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
	                return;
	            }
	
	            notxml = nType !== 1 || !jQuery.isXMLDoc( elem );
	
	            if ( notxml ) {
	                // Fix name and attach hooks
	                name = jQuery.propFix[ name ] || name;
	                hooks = jQuery.propHooks[ name ];
	            }
	
	            if ( value !== undefined ) {
	                return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
	                    ret :
	                    ( elem[ name ] = value );
	
	            } else {
	                return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
	                    ret :
	                    elem[ name ];
	            }
	        },
	
	        propHooks: {
	            tabIndex: {
	                get: function( elem ) {
	                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
	                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
	                    // Use proper attribute retrieval(#12072)
	                    var tabindex = jQuery.find.attr( elem, "tabindex" );
	
	                    return tabindex ?
	                        parseInt( tabindex, 10 ) :
	                        rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
	                            0 :
	                            -1;
	                }
	            }
	        }
	    });
	
	// Hooks for boolean attributes
	    boolHook = {
	        set: function( elem, value, name ) {
	            if ( value === false ) {
	                // Remove boolean attributes when set to false
	                jQuery.removeAttr( elem, name );
	            } else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
	                // IE<8 needs the *property* name
	                elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );
	
	                // Use defaultChecked and defaultSelected for oldIE
	            } else {
	                elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
	            }
	
	            return name;
	        }
	    };
	    jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	        var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;
	
	        jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
	            function( elem, name, isXML ) {
	                var fn = jQuery.expr.attrHandle[ name ],
	                    ret = isXML ?
	                        undefined :
	                        /* jshint eqeqeq: false */
	                        (jQuery.expr.attrHandle[ name ] = undefined) !=
	                        getter( elem, name, isXML ) ?
	
	                            name.toLowerCase() :
	                            null;
	                jQuery.expr.attrHandle[ name ] = fn;
	                return ret;
	            } :
	            function( elem, name, isXML ) {
	                return isXML ?
	                    undefined :
	                    elem[ jQuery.camelCase( "default-" + name ) ] ?
	                        name.toLowerCase() :
	                        null;
	            };
	    });
	
	// fix oldIE attroperties
	    if ( !getSetInput || !getSetAttribute ) {
	        jQuery.attrHooks.value = {
	            set: function( elem, value, name ) {
	                if ( jQuery.nodeName( elem, "input" ) ) {
	                    // Does not return so that setAttribute is also used
	                    elem.defaultValue = value;
	                } else {
	                    // Use nodeHook if defined (#1954); otherwise setAttribute is fine
	                    return nodeHook && nodeHook.set( elem, value, name );
	                }
	            }
	        };
	    }
	
	// IE6/7 do not support getting/setting some attributes with get/setAttribute
	    if ( !getSetAttribute ) {
	
	        // Use this for any attribute in IE6/7
	        // This fixes almost every IE6/7 issue
	        nodeHook = {
	            set: function( elem, value, name ) {
	                // Set the existing or create a new attribute node
	                var ret = elem.getAttributeNode( name );
	                if ( !ret ) {
	                    elem.setAttributeNode(
	                        (ret = elem.ownerDocument.createAttribute( name ))
	                    );
	                }
	
	                ret.value = value += "";
	
	                // Break association with cloned elements by also using setAttribute (#9646)
	                return name === "value" || value === elem.getAttribute( name ) ?
	                    value :
	                    undefined;
	            }
	        };
	        jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
	            // Some attributes are constructed with empty-string values when not defined
	            function( elem, name, isXML ) {
	                var ret;
	                return isXML ?
	                    undefined :
	                    (ret = elem.getAttributeNode( name )) && ret.value !== "" ?
	                        ret.value :
	                        null;
	            };
	        jQuery.valHooks.button = {
	            get: function( elem, name ) {
	                var ret = elem.getAttributeNode( name );
	                return ret && ret.specified ?
	                    ret.value :
	                    undefined;
	            },
	            set: nodeHook.set
	        };
	
	        // Set contenteditable to false on removals(#10429)
	        // Setting to empty string throws an error as an invalid value
	        jQuery.attrHooks.contenteditable = {
	            set: function( elem, value, name ) {
	                nodeHook.set( elem, value === "" ? false : value, name );
	            }
	        };
	
	        // Set width and height to auto instead of 0 on empty string( Bug #8150 )
	        // This is for removals
	        jQuery.each([ "width", "height" ], function( i, name ) {
	            jQuery.attrHooks[ name ] = {
	                set: function( elem, value ) {
	                    if ( value === "" ) {
	                        elem.setAttribute( name, "auto" );
	                        return value;
	                    }
	                }
	            };
	        });
	    }
	
	
	// Some attributes require a special call on IE
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	    if ( !jQuery.support.hrefNormalized ) {
	        // href/src property should get the full normalized URL (#10299/#12915)
	        jQuery.each([ "href", "src" ], function( i, name ) {
	            jQuery.propHooks[ name ] = {
	                get: function( elem ) {
	                    return elem.getAttribute( name, 4 );
	                }
	            };
	        });
	    }
	
	    if ( !jQuery.support.style ) {
	        jQuery.attrHooks.style = {
	            get: function( elem ) {
	                // Return undefined in the case of empty string
	                // Note: IE uppercases css property names, but if we were to .toLowerCase()
	                // .cssText, that would destroy case senstitivity in URL's, like in "background"
	                return elem.style.cssText || undefined;
	            },
	            set: function( elem, value ) {
	                return ( elem.style.cssText = value + "" );
	            }
	        };
	    }
	
	// Safari mis-reports the default selected property of an option
	// Accessing the parent's selectedIndex property fixes it
	    if ( !jQuery.support.optSelected ) {
	        jQuery.propHooks.selected = {
	            get: function( elem ) {
	                var parent = elem.parentNode;
	
	                if ( parent ) {
	                    parent.selectedIndex;
	
	                    // Make sure that it also works with optgroups, see #5701
	                    if ( parent.parentNode ) {
	                        parent.parentNode.selectedIndex;
	                    }
	                }
	                return null;
	            }
	        };
	    }
	
	    jQuery.each([
	        "tabIndex",
	        "readOnly",
	        "maxLength",
	        "cellSpacing",
	        "cellPadding",
	        "rowSpan",
	        "colSpan",
	        "useMap",
	        "frameBorder",
	        "contentEditable"
	    ], function() {
	        jQuery.propFix[ this.toLowerCase() ] = this;
	    });
	
	// IE6/7 call enctype encoding
	    if ( !jQuery.support.enctype ) {
	        jQuery.propFix.enctype = "encoding";
	    }
	
	// Radios and checkboxes getter/setter
	    jQuery.each([ "radio", "checkbox" ], function() {
	        jQuery.valHooks[ this ] = {
	            set: function( elem, value ) {
	                if ( jQuery.isArray( value ) ) {
	                    return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
	                }
	            }
	        };
	        if ( !jQuery.support.checkOn ) {
	            jQuery.valHooks[ this ].get = function( elem ) {
	                // Support: Webkit
	                // "" is returned instead of "on" if a value isn't specified
	                return elem.getAttribute("value") === null ? "on" : elem.value;
	            };
	        }
	    });
	    var rformElems = /^(?:input|select|textarea)$/i,
	        rkeyEvent = /^key/,
	        rmouseEvent = /^(?:mouse|contextmenu)|click/,
	        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	        rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
	
	    function returnTrue() {
	        return true;
	    }
	
	    function returnFalse() {
	        return false;
	    }
	
	    function safeActiveElement() {
	        try {
	            return document.activeElement;
	        } catch ( err ) { }
	    }
	
	    /*
	     * Helper functions for managing events -- not part of the public interface.
	     * Props to Dean Edwards' addEvent library for many of the ideas.
	     */
	    jQuery.event = {
	
	        global: {},
	
	        add: function( elem, types, handler, data, selector ) {
	            var tmp, events, t, handleObjIn,
	                special, eventHandle, handleObj,
	                handlers, type, namespaces, origType,
	                elemData = jQuery._data( elem );
	
	            // Don't attach events to noData or text/comment nodes (but allow plain objects)
	            if ( !elemData ) {
	                return;
	            }
	
	            // Caller can pass in an object of custom data in lieu of the handler
	            if ( handler.handler ) {
	                handleObjIn = handler;
	                handler = handleObjIn.handler;
	                selector = handleObjIn.selector;
	            }
	
	            // Make sure that the handler has a unique ID, used to find/remove it later
	            if ( !handler.guid ) {
	                handler.guid = jQuery.guid++;
	            }
	
	            // Init the element's event structure and main handler, if this is the first
	            if ( !(events = elemData.events) ) {
	                events = elemData.events = {};
	            }
	            if ( !(eventHandle = elemData.handle) ) {
	                eventHandle = elemData.handle = function( e ) {
	                    // Discard the second event of a jQuery.event.trigger() and
	                    // when an event is called after a page has unloaded
	                    return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
	                        jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
	                        undefined;
	                };
	                // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
	                eventHandle.elem = elem;
	            }
	
	            // Handle multiple events separated by a space
	            types = ( types || "" ).match( core_rnotwhite ) || [""];
	            t = types.length;
	            while ( t-- ) {
	                tmp = rtypenamespace.exec( types[t] ) || [];
	                type = origType = tmp[1];
	                namespaces = ( tmp[2] || "" ).split( "." ).sort();
	
	                // There *must* be a type, no attaching namespace-only handlers
	                if ( !type ) {
	                    continue;
	                }
	
	                // If event changes its type, use the special event handlers for the changed type
	                special = jQuery.event.special[ type ] || {};
	
	                // If selector defined, determine special event api type, otherwise given type
	                type = ( selector ? special.delegateType : special.bindType ) || type;
	
	                // Update special based on newly reset type
	                special = jQuery.event.special[ type ] || {};
	
	                // handleObj is passed to all event handlers
	                handleObj = jQuery.extend({
	                    type: type,
	                    origType: origType,
	                    data: data,
	                    handler: handler,
	                    guid: handler.guid,
	                    selector: selector,
	                    needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
	                    namespace: namespaces.join(".")
	                }, handleObjIn );
	
	                // Init the event handler queue if we're the first
	                if ( !(handlers = events[ type ]) ) {
	                    handlers = events[ type ] = [];
	                    handlers.delegateCount = 0;
	
	                    // Only use addEventListener/attachEvent if the special events handler returns false
	                    if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
	                        // Bind the global event handler to the element
	                        if ( elem.addEventListener ) {
	                            elem.addEventListener( type, eventHandle, false );
	
	                        } else if ( elem.attachEvent ) {
	                            elem.attachEvent( "on" + type, eventHandle );
	                        }
	                    }
	                }
	
	                if ( special.add ) {
	                    special.add.call( elem, handleObj );
	
	                    if ( !handleObj.handler.guid ) {
	                        handleObj.handler.guid = handler.guid;
	                    }
	                }
	
	                // Add to the element's handler list, delegates in front
	                if ( selector ) {
	                    handlers.splice( handlers.delegateCount++, 0, handleObj );
	                } else {
	                    handlers.push( handleObj );
	                }
	
	                // Keep track of which events have ever been used, for event optimization
	                jQuery.event.global[ type ] = true;
	            }
	
	            // Nullify elem to prevent memory leaks in IE
	            elem = null;
	        },
	
	        // Detach an event or set of events from an element
	        remove: function( elem, types, handler, selector, mappedTypes ) {
	            var j, handleObj, tmp,
	                origCount, t, events,
	                special, handlers, type,
	                namespaces, origType,
	                elemData = jQuery.hasData( elem ) && jQuery._data( elem );
	
	            if ( !elemData || !(events = elemData.events) ) {
	                return;
	            }
	
	            // Once for each type.namespace in types; type may be omitted
	            types = ( types || "" ).match( core_rnotwhite ) || [""];
	            t = types.length;
	            while ( t-- ) {
	                tmp = rtypenamespace.exec( types[t] ) || [];
	                type = origType = tmp[1];
	                namespaces = ( tmp[2] || "" ).split( "." ).sort();
	
	                // Unbind all events (on this namespace, if provided) for the element
	                if ( !type ) {
	                    for ( type in events ) {
	                        jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
	                    }
	                    continue;
	                }
	
	                special = jQuery.event.special[ type ] || {};
	                type = ( selector ? special.delegateType : special.bindType ) || type;
	                handlers = events[ type ] || [];
	                tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );
	
	                // Remove matching events
	                origCount = j = handlers.length;
	                while ( j-- ) {
	                    handleObj = handlers[ j ];
	
	                    if ( ( mappedTypes || origType === handleObj.origType ) &&
	                        ( !handler || handler.guid === handleObj.guid ) &&
	                        ( !tmp || tmp.test( handleObj.namespace ) ) &&
	                        ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
	                        handlers.splice( j, 1 );
	
	                        if ( handleObj.selector ) {
	                            handlers.delegateCount--;
	                        }
	                        if ( special.remove ) {
	                            special.remove.call( elem, handleObj );
	                        }
	                    }
	                }
	
	                // Remove generic event handler if we removed something and no more handlers exist
	                // (avoids potential for endless recursion during removal of special event handlers)
	                if ( origCount && !handlers.length ) {
	                    if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
	                        jQuery.removeEvent( elem, type, elemData.handle );
	                    }
	
	                    delete events[ type ];
	                }
	            }
	
	            // Remove the expando if it's no longer used
	            if ( jQuery.isEmptyObject( events ) ) {
	                delete elemData.handle;
	
	                // removeData also checks for emptiness and clears the expando if empty
	                // so use it instead of delete
	                jQuery._removeData( elem, "events" );
	            }
	        },
	
	        trigger: function( event, data, elem, onlyHandlers ) {
	            var handle, ontype, cur,
	                bubbleType, special, tmp, i,
	                eventPath = [ elem || document ],
	                type = core_hasOwn.call( event, "type" ) ? event.type : event,
	                namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];
	
	            cur = tmp = elem = elem || document;
	
	            // Don't do events on text and comment nodes
	            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
	                return;
	            }
	
	            // focus/blur morphs to focusin/out; ensure we're not firing them right now
	            if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
	                return;
	            }
	
	            if ( type.indexOf(".") >= 0 ) {
	                // Namespaced trigger; create a regexp to match event type in handle()
	                namespaces = type.split(".");
	                type = namespaces.shift();
	                namespaces.sort();
	            }
	            ontype = type.indexOf(":") < 0 && "on" + type;
	
	            // Caller can pass in a jQuery.Event object, Object, or just an event type string
	            event = event[ jQuery.expando ] ?
	                event :
	                new jQuery.Event( type, typeof event === "object" && event );
	
	            // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
	            event.isTrigger = onlyHandlers ? 2 : 3;
	            event.namespace = namespaces.join(".");
	            event.namespace_re = event.namespace ?
	                new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
	                null;
	
	            // Clean up the event in case it is being reused
	            event.result = undefined;
	            if ( !event.target ) {
	                event.target = elem;
	            }
	
	            // Clone any incoming data and prepend the event, creating the handler arg list
	            data = data == null ?
	                [ event ] :
	                jQuery.makeArray( data, [ event ] );
	
	            // Allow special events to draw outside the lines
	            special = jQuery.event.special[ type ] || {};
	            if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
	                return;
	            }
	
	            // Determine event propagation path in advance, per W3C events spec (#9951)
	            // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
	            if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
	
	                bubbleType = special.delegateType || type;
	                if ( !rfocusMorph.test( bubbleType + type ) ) {
	                    cur = cur.parentNode;
	                }
	                for ( ; cur; cur = cur.parentNode ) {
	                    eventPath.push( cur );
	                    tmp = cur;
	                }
	
	                // Only add window if we got to document (e.g., not plain obj or detached DOM)
	                if ( tmp === (elem.ownerDocument || document) ) {
	                    eventPath.push( tmp.defaultView || tmp.parentWindow || window );
	                }
	            }
	
	            // Fire handlers on the event path
	            i = 0;
	            while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {
	
	                event.type = i > 1 ?
	                    bubbleType :
	                special.bindType || type;
	
	                // jQuery handler
	                handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
	                if ( handle ) {
	                    handle.apply( cur, data );
	                }
	
	                // Native handler
	                handle = ontype && cur[ ontype ];
	                if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
	                    event.preventDefault();
	                }
	            }
	            event.type = type;
	
	            // If nobody prevented the default action, do it now
	            if ( !onlyHandlers && !event.isDefaultPrevented() ) {
	
	                if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
	                    jQuery.acceptData( elem ) ) {
	
	                    // Call a native DOM method on the target with the same name name as the event.
	                    // Can't use an .isFunction() check here because IE6/7 fails that test.
	                    // Don't do default actions on window, that's where global variables be (#6170)
	                    if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {
	
	                        // Don't re-trigger an onFOO event when we call its FOO() method
	                        tmp = elem[ ontype ];
	
	                        if ( tmp ) {
	                            elem[ ontype ] = null;
	                        }
	
	                        // Prevent re-triggering of the same event, since we already bubbled it above
	                        jQuery.event.triggered = type;
	                        try {
	                            elem[ type ]();
	                        } catch ( e ) {
	                            // IE<9 dies on focus/blur to hidden element (#1486,#12518)
	                            // only reproducible on winXP IE8 native, not IE9 in IE8 mode
	                        }
	                        jQuery.event.triggered = undefined;
	
	                        if ( tmp ) {
	                            elem[ ontype ] = tmp;
	                        }
	                    }
	                }
	            }
	
	            return event.result;
	        },
	
	        dispatch: function( event ) {
	
	            // Make a writable jQuery.Event from the native event object
	            event = jQuery.event.fix( event );
	
	            var i, ret, handleObj, matched, j,
	                handlerQueue = [],
	                args = core_slice.call( arguments ),
	                handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
	                special = jQuery.event.special[ event.type ] || {};
	
	            // Use the fix-ed jQuery.Event rather than the (read-only) native event
	            args[0] = event;
	            event.delegateTarget = this;
	
	            // Call the preDispatch hook for the mapped type, and let it bail if desired
	            if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
	                return;
	            }
	
	            // Determine handlers
	            handlerQueue = jQuery.event.handlers.call( this, event, handlers );
	
	            // Run delegates first; they may want to stop propagation beneath us
	            i = 0;
	            while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
	                event.currentTarget = matched.elem;
	
	                j = 0;
	                while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {
	
	                    // Triggered event must either 1) have no namespace, or
	                    // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
	                    if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {
	
	                        event.handleObj = handleObj;
	                        event.data = handleObj.data;
	
	                        ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
	                            .apply( matched.elem, args );
	
	                        if ( ret !== undefined ) {
	                            if ( (event.result = ret) === false ) {
	                                event.preventDefault();
	                                event.stopPropagation();
	                            }
	                        }
	                    }
	                }
	            }
	
	            // Call the postDispatch hook for the mapped type
	            if ( special.postDispatch ) {
	                special.postDispatch.call( this, event );
	            }
	
	            return event.result;
	        },
	
	        handlers: function( event, handlers ) {
	            var sel, handleObj, matches, i,
	                handlerQueue = [],
	                delegateCount = handlers.delegateCount,
	                cur = event.target;
	
	            // Find delegate handlers
	            // Black-hole SVG <use> instance trees (#13180)
	            // Avoid non-left-click bubbling in Firefox (#3861)
	            if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {
	
	                /* jshint eqeqeq: false */
	                for ( ; cur != this; cur = cur.parentNode || this ) {
	                    /* jshint eqeqeq: true */
	
	                    // Don't check non-elements (#13208)
	                    // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
	                    if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
	                        matches = [];
	                        for ( i = 0; i < delegateCount; i++ ) {
	                            handleObj = handlers[ i ];
	
	                            // Don't conflict with Object.prototype properties (#13203)
	                            sel = handleObj.selector + " ";
	
	                            if ( matches[ sel ] === undefined ) {
	                                matches[ sel ] = handleObj.needsContext ?
	                                jQuery( sel, this ).index( cur ) >= 0 :
	                                    jQuery.find( sel, this, null, [ cur ] ).length;
	                            }
	                            if ( matches[ sel ] ) {
	                                matches.push( handleObj );
	                            }
	                        }
	                        if ( matches.length ) {
	                            handlerQueue.push({ elem: cur, handlers: matches });
	                        }
	                    }
	                }
	            }
	
	            // Add the remaining (directly-bound) handlers
	            if ( delegateCount < handlers.length ) {
	                handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
	            }
	
	            return handlerQueue;
	        },
	
	        fix: function( event ) {
	            if ( event[ jQuery.expando ] ) {
	                return event;
	            }
	
	            // Create a writable copy of the event object and normalize some properties
	            var i, prop, copy,
	                type = event.type,
	                originalEvent = event,
	                fixHook = this.fixHooks[ type ];
	
	            if ( !fixHook ) {
	                this.fixHooks[ type ] = fixHook =
	                    rmouseEvent.test( type ) ? this.mouseHooks :
	                        rkeyEvent.test( type ) ? this.keyHooks :
	                        {};
	            }
	            copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;
	
	            event = new jQuery.Event( originalEvent );
	
	            i = copy.length;
	            while ( i-- ) {
	                prop = copy[ i ];
	                event[ prop ] = originalEvent[ prop ];
	            }
	
	            // Support: IE<9
	            // Fix target property (#1925)
	            if ( !event.target ) {
	                event.target = originalEvent.srcElement || document;
	            }
	
	            // Support: Chrome 23+, Safari?
	            // Target should not be a text node (#504, #13143)
	            if ( event.target.nodeType === 3 ) {
	                event.target = event.target.parentNode;
	            }
	
	            // Support: IE<9
	            // For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
	            event.metaKey = !!event.metaKey;
	
	            return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	        },
	
	        // Includes some event props shared by KeyEvent and MouseEvent
	        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
	
	        fixHooks: {},
	
	        keyHooks: {
	            props: "char charCode key keyCode".split(" "),
	            filter: function( event, original ) {
	
	                // Add which for key events
	                if ( event.which == null ) {
	                    event.which = original.charCode != null ? original.charCode : original.keyCode;
	                }
	
	                return event;
	            }
	        },
	
	        mouseHooks: {
	            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
	            filter: function( event, original ) {
	                var body, eventDoc, doc,
	                    button = original.button,
	                    fromElement = original.fromElement;
	
	                // Calculate pageX/Y if missing and clientX/Y available
	                if ( event.pageX == null && original.clientX != null ) {
	                    eventDoc = event.target.ownerDocument || document;
	                    doc = eventDoc.documentElement;
	                    body = eventDoc.body;
	
	                    event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
	                    event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
	                }
	
	                // Add relatedTarget, if necessary
	                if ( !event.relatedTarget && fromElement ) {
	                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
	                }
	
	                // Add which for click: 1 === left; 2 === middle; 3 === right
	                // Note: button is not normalized, so don't use it
	                if ( !event.which && button !== undefined ) {
	                    event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
	                }
	
	                return event;
	            }
	        },
	
	        special: {
	            load: {
	                // Prevent triggered image.load events from bubbling to window.load
	                noBubble: true
	            },
	            focus: {
	                // Fire native event if possible so blur/focus sequence is correct
	                trigger: function() {
	                    if ( this !== safeActiveElement() && this.focus ) {
	                        try {
	                            this.focus();
	                            return false;
	                        } catch ( e ) {
	                            // Support: IE<9
	                            // If we error on focus to hidden element (#1486, #12518),
	                            // let .trigger() run the handlers
	                        }
	                    }
	                },
	                delegateType: "focusin"
	            },
	            blur: {
	                trigger: function() {
	                    if ( this === safeActiveElement() && this.blur ) {
	                        this.blur();
	                        return false;
	                    }
	                },
	                delegateType: "focusout"
	            },
	            click: {
	                // For checkbox, fire native event so checked state will be right
	                trigger: function() {
	                    if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
	                        this.click();
	                        return false;
	                    }
	                },
	
	                // For cross-browser consistency, don't fire native .click() on links
	                _default: function( event ) {
	                    return jQuery.nodeName( event.target, "a" );
	                }
	            },
	
	            beforeunload: {
	                postDispatch: function( event ) {
	
	                    // Even when returnValue equals to undefined Firefox will still show alert
	                    if ( event.result !== undefined ) {
	                        event.originalEvent.returnValue = event.result;
	                    }
	                }
	            }
	        },
	
	        simulate: function( type, elem, event, bubble ) {
	            // Piggyback on a donor event to simulate a different one.
	            // Fake originalEvent to avoid donor's stopPropagation, but if the
	            // simulated event prevents default then we do the same on the donor.
	            var e = jQuery.extend(
	                new jQuery.Event(),
	                event,
	                {
	                    type: type,
	                    isSimulated: true,
	                    originalEvent: {}
	                }
	            );
	            if ( bubble ) {
	                jQuery.event.trigger( e, null, elem );
	            } else {
	                jQuery.event.dispatch.call( elem, e );
	            }
	            if ( e.isDefaultPrevented() ) {
	                event.preventDefault();
	            }
	        }
	    };
	
	    jQuery.removeEvent = document.removeEventListener ?
	        function( elem, type, handle ) {
	            if ( elem.removeEventListener ) {
	                elem.removeEventListener( type, handle, false );
	            }
	        } :
	        function( elem, type, handle ) {
	            var name = "on" + type;
	
	            if ( elem.detachEvent ) {
	
	                // #8545, #7054, preventing memory leaks for custom events in IE6-8
	                // detachEvent needed property on element, by name of that event, to properly expose it to GC
	                if ( typeof elem[ name ] === core_strundefined ) {
	                    elem[ name ] = null;
	                }
	
	                elem.detachEvent( name, handle );
	            }
	        };
	
	    jQuery.Event = function( src, props ) {
	        // Allow instantiation without the 'new' keyword
	        if ( !(this instanceof jQuery.Event) ) {
	            return new jQuery.Event( src, props );
	        }
	
	        // Event object
	        if ( src && src.type ) {
	            this.originalEvent = src;
	            this.type = src.type;
	
	            // Events bubbling up the document may have been marked as prevented
	            // by a handler lower down the tree; reflect the correct value.
	            this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
	            src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;
	
	            // Event type
	        } else {
	            this.type = src;
	        }
	
	        // Put explicitly provided properties onto the event object
	        if ( props ) {
	            jQuery.extend( this, props );
	        }
	
	        // Create a timestamp if incoming event doesn't have one
	        this.timeStamp = src && src.timeStamp || jQuery.now();
	
	        // Mark it as fixed
	        this[ jQuery.expando ] = true;
	    };
	
	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	    jQuery.Event.prototype = {
	        isDefaultPrevented: returnFalse,
	        isPropagationStopped: returnFalse,
	        isImmediatePropagationStopped: returnFalse,
	
	        preventDefault: function() {
	            var e = this.originalEvent;
	
	            this.isDefaultPrevented = returnTrue;
	            if ( !e ) {
	                return;
	            }
	
	            // If preventDefault exists, run it on the original event
	            if ( e.preventDefault ) {
	                e.preventDefault();
	
	                // Support: IE
	                // Otherwise set the returnValue property of the original event to false
	            } else {
	                e.returnValue = false;
	            }
	        },
	        stopPropagation: function() {
	            var e = this.originalEvent;
	
	            this.isPropagationStopped = returnTrue;
	            if ( !e ) {
	                return;
	            }
	            // If stopPropagation exists, run it on the original event
	            if ( e.stopPropagation ) {
	                e.stopPropagation();
	            }
	
	            // Support: IE
	            // Set the cancelBubble property of the original event to true
	            e.cancelBubble = true;
	        },
	        stopImmediatePropagation: function() {
	            this.isImmediatePropagationStopped = returnTrue;
	            this.stopPropagation();
	        }
	    };
	
	// Create mouseenter/leave events using mouseover/out and event-time checks
	    jQuery.each({
	        mouseenter: "mouseover",
	        mouseleave: "mouseout"
	    }, function( orig, fix ) {
	        jQuery.event.special[ orig ] = {
	            delegateType: fix,
	            bindType: fix,
	
	            handle: function( event ) {
	                var ret,
	                    target = this,
	                    related = event.relatedTarget,
	                    handleObj = event.handleObj;
	
	                // For mousenter/leave call the handler if related is outside the target.
	                // NB: No relatedTarget if the mouse left/entered the browser window
	                if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
	                    event.type = handleObj.origType;
	                    ret = handleObj.handler.apply( this, arguments );
	                    event.type = fix;
	                }
	                return ret;
	            }
	        };
	    });
	
	// IE submit delegation
	    if ( !jQuery.support.submitBubbles ) {
	
	        jQuery.event.special.submit = {
	            setup: function() {
	                // Only need this for delegated form submit events
	                if ( jQuery.nodeName( this, "form" ) ) {
	                    return false;
	                }
	
	                // Lazy-add a submit handler when a descendant form may potentially be submitted
	                jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
	                    // Node name check avoids a VML-related crash in IE (#9807)
	                    var elem = e.target,
	                        form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
	                    if ( form && !jQuery._data( form, "submitBubbles" ) ) {
	                        jQuery.event.add( form, "submit._submit", function( event ) {
	                            event._submit_bubble = true;
	                        });
	                        jQuery._data( form, "submitBubbles", true );
	                    }
	                });
	                // return undefined since we don't need an event listener
	            },
	
	            postDispatch: function( event ) {
	                // If form was submitted by the user, bubble the event up the tree
	                if ( event._submit_bubble ) {
	                    delete event._submit_bubble;
	                    if ( this.parentNode && !event.isTrigger ) {
	                        jQuery.event.simulate( "submit", this.parentNode, event, true );
	                    }
	                }
	            },
	
	            teardown: function() {
	                // Only need this for delegated form submit events
	                if ( jQuery.nodeName( this, "form" ) ) {
	                    return false;
	                }
	
	                // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
	                jQuery.event.remove( this, "._submit" );
	            }
	        };
	    }
	
	// IE change delegation and checkbox/radio fix
	    if ( !jQuery.support.changeBubbles ) {
	
	        jQuery.event.special.change = {
	
	            setup: function() {
	
	                if ( rformElems.test( this.nodeName ) ) {
	                    // IE doesn't fire change on a check/radio until blur; trigger it on click
	                    // after a propertychange. Eat the blur-change in special.change.handle.
	                    // This still fires onchange a second time for check/radio after blur.
	                    if ( this.type === "checkbox" || this.type === "radio" ) {
	                        jQuery.event.add( this, "propertychange._change", function( event ) {
	                            if ( event.originalEvent.propertyName === "checked" ) {
	                                this._just_changed = true;
	                            }
	                        });
	                        jQuery.event.add( this, "click._change", function( event ) {
	                            if ( this._just_changed && !event.isTrigger ) {
	                                this._just_changed = false;
	                            }
	                            // Allow triggered, simulated change events (#11500)
	                            jQuery.event.simulate( "change", this, event, true );
	                        });
	                    }
	                    return false;
	                }
	                // Delegated event; lazy-add a change handler on descendant inputs
	                jQuery.event.add( this, "beforeactivate._change", function( e ) {
	                    var elem = e.target;
	
	                    if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
	                        jQuery.event.add( elem, "change._change", function( event ) {
	                            if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
	                                jQuery.event.simulate( "change", this.parentNode, event, true );
	                            }
	                        });
	                        jQuery._data( elem, "changeBubbles", true );
	                    }
	                });
	            },
	
	            handle: function( event ) {
	                var elem = event.target;
	
	                // Swallow native change events from checkbox/radio, we already triggered them above
	                if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
	                    return event.handleObj.handler.apply( this, arguments );
	                }
	            },
	
	            teardown: function() {
	                jQuery.event.remove( this, "._change" );
	
	                return !rformElems.test( this.nodeName );
	            }
	        };
	    }
	
	// Create "bubbling" focus and blur events
	    if ( !jQuery.support.focusinBubbles ) {
	        jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
	
	            // Attach a single capturing handler while someone wants focusin/focusout
	            var attaches = 0,
	                handler = function( event ) {
	                    jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
	                };
	
	            jQuery.event.special[ fix ] = {
	                setup: function() {
	                    if ( attaches++ === 0 ) {
	                        document.addEventListener( orig, handler, true );
	                    }
	                },
	                teardown: function() {
	                    if ( --attaches === 0 ) {
	                        document.removeEventListener( orig, handler, true );
	                    }
	                }
	            };
	        });
	    }
	
	    jQuery.fn.extend({
	
	        on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
	            var type, origFn;
	
	            // Types can be a map of types/handlers
	            if ( typeof types === "object" ) {
	                // ( types-Object, selector, data )
	                if ( typeof selector !== "string" ) {
	                    // ( types-Object, data )
	                    data = data || selector;
	                    selector = undefined;
	                }
	                for ( type in types ) {
	                    this.on( type, selector, data, types[ type ], one );
	                }
	                return this;
	            }
	
	            if ( data == null && fn == null ) {
	                // ( types, fn )
	                fn = selector;
	                data = selector = undefined;
	            } else if ( fn == null ) {
	                if ( typeof selector === "string" ) {
	                    // ( types, selector, fn )
	                    fn = data;
	                    data = undefined;
	                } else {
	                    // ( types, data, fn )
	                    fn = data;
	                    data = selector;
	                    selector = undefined;
	                }
	            }
	            if ( fn === false ) {
	                fn = returnFalse;
	            } else if ( !fn ) {
	                return this;
	            }
	
	            if ( one === 1 ) {
	                origFn = fn;
	                fn = function( event ) {
	                    // Can use an empty set, since event contains the info
	                    jQuery().off( event );
	                    return origFn.apply( this, arguments );
	                };
	                // Use same guid so caller can remove using origFn
	                fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	            }
	            return this.each( function() {
	                jQuery.event.add( this, types, fn, data, selector );
	            });
	        },
	        one: function( types, selector, data, fn ) {
	            return this.on( types, selector, data, fn, 1 );
	        },
	        off: function( types, selector, fn ) {
	            var handleObj, type;
	            if ( types && types.preventDefault && types.handleObj ) {
	                // ( event )  dispatched jQuery.Event
	                handleObj = types.handleObj;
	                jQuery( types.delegateTarget ).off(
	                    handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
	                    handleObj.selector,
	                    handleObj.handler
	                );
	                return this;
	            }
	            if ( typeof types === "object" ) {
	                // ( types-object [, selector] )
	                for ( type in types ) {
	                    this.off( type, selector, types[ type ] );
	                }
	                return this;
	            }
	            if ( selector === false || typeof selector === "function" ) {
	                // ( types [, fn] )
	                fn = selector;
	                selector = undefined;
	            }
	            if ( fn === false ) {
	                fn = returnFalse;
	            }
	            return this.each(function() {
	                jQuery.event.remove( this, types, fn, selector );
	            });
	        },
	
	        trigger: function( type, data ) {
	            return this.each(function() {
	                jQuery.event.trigger( type, data, this );
	            });
	        },
	        triggerHandler: function( type, data ) {
	            var elem = this[0];
	            if ( elem ) {
	                return jQuery.event.trigger( type, data, elem, true );
	            }
	        }
	    });
	    var isSimple = /^.[^:#\[\.,]*$/,
	        rparentsprev = /^(?:parents|prev(?:Until|All))/,
	        rneedsContext = jQuery.expr.match.needsContext,
	    // methods guaranteed to produce a unique set when starting from a unique set
	        guaranteedUnique = {
	            children: true,
	            contents: true,
	            next: true,
	            prev: true
	        };
	
	    jQuery.fn.extend({
	        find: function( selector ) {
	            var i,
	                ret = [],
	                self = this,
	                len = self.length;
	
	            if ( typeof selector !== "string" ) {
	                return this.pushStack( jQuery( selector ).filter(function() {
	                    for ( i = 0; i < len; i++ ) {
	                        if ( jQuery.contains( self[ i ], this ) ) {
	                            return true;
	                        }
	                    }
	                }) );
	            }
	
	            for ( i = 0; i < len; i++ ) {
	                jQuery.find( selector, self[ i ], ret );
	            }
	
	            // Needed because $( selector, context ) becomes $( context ).find( selector )
	            ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
	            ret.selector = this.selector ? this.selector + " " + selector : selector;
	            return ret;
	        },
	
	        has: function( target ) {
	            var i,
	                targets = jQuery( target, this ),
	                len = targets.length;
	
	            return this.filter(function() {
	                for ( i = 0; i < len; i++ ) {
	                    if ( jQuery.contains( this, targets[i] ) ) {
	                        return true;
	                    }
	                }
	            });
	        },
	
	        not: function( selector ) {
	            return this.pushStack( winnow(this, selector || [], true) );
	        },
	
	        filter: function( selector ) {
	            return this.pushStack( winnow(this, selector || [], false) );
	        },
	
	        is: function( selector ) {
	            return !!winnow(
	                this,
	
	                // If this is a positional/relative selector, check membership in the returned set
	                // so $("p:first").is("p:last") won't return true for a doc with two "p".
	                typeof selector === "string" && rneedsContext.test( selector ) ?
	                    jQuery( selector ) :
	                selector || [],
	                false
	            ).length;
	        },
	
	        closest: function( selectors, context ) {
	            var cur,
	                i = 0,
	                l = this.length,
	                ret = [],
	                pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
	                    jQuery( selectors, context || this.context ) :
	                    0;
	
	            for ( ; i < l; i++ ) {
	                for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
	                    // Always skip document fragments
	                    if ( cur.nodeType < 11 && (pos ?
	                        pos.index(cur) > -1 :
	
	                            // Don't pass non-elements to Sizzle
	                        cur.nodeType === 1 &&
	                        jQuery.find.matchesSelector(cur, selectors)) ) {
	
	                        cur = ret.push( cur );
	                        break;
	                    }
	                }
	            }
	
	            return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	        },
	
	        // Determine the position of an element within
	        // the matched set of elements
	        index: function( elem ) {
	
	            // No argument, return index in parent
	            if ( !elem ) {
	                return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
	            }
	
	            // index in selector
	            if ( typeof elem === "string" ) {
	                return jQuery.inArray( this[0], jQuery( elem ) );
	            }
	
	            // Locate the position of the desired element
	            return jQuery.inArray(
	                // If it receives a jQuery object, the first element is used
	                elem.jquery ? elem[0] : elem, this );
	        },
	
	        add: function( selector, context ) {
	            var set = typeof selector === "string" ?
	                    jQuery( selector, context ) :
	                    jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
	                all = jQuery.merge( this.get(), set );
	
	            return this.pushStack( jQuery.unique(all) );
	        },
	
	        addBack: function( selector ) {
	            return this.add( selector == null ?
	                this.prevObject : this.prevObject.filter(selector)
	            );
	        }
	    });
	
	    function sibling( cur, dir ) {
	        do {
	            cur = cur[ dir ];
	        } while ( cur && cur.nodeType !== 1 );
	
	        return cur;
	    }
	
	    jQuery.each({
	        parent: function( elem ) {
	            var parent = elem.parentNode;
	            return parent && parent.nodeType !== 11 ? parent : null;
	        },
	        parents: function( elem ) {
	            return jQuery.dir( elem, "parentNode" );
	        },
	        parentsUntil: function( elem, i, until ) {
	            return jQuery.dir( elem, "parentNode", until );
	        },
	        next: function( elem ) {
	            return sibling( elem, "nextSibling" );
	        },
	        prev: function( elem ) {
	            return sibling( elem, "previousSibling" );
	        },
	        nextAll: function( elem ) {
	            return jQuery.dir( elem, "nextSibling" );
	        },
	        prevAll: function( elem ) {
	            return jQuery.dir( elem, "previousSibling" );
	        },
	        nextUntil: function( elem, i, until ) {
	            return jQuery.dir( elem, "nextSibling", until );
	        },
	        prevUntil: function( elem, i, until ) {
	            return jQuery.dir( elem, "previousSibling", until );
	        },
	        siblings: function( elem ) {
	            return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	        },
	        children: function( elem ) {
	            return jQuery.sibling( elem.firstChild );
	        },
	        contents: function( elem ) {
	            return jQuery.nodeName( elem, "iframe" ) ?
	            elem.contentDocument || elem.contentWindow.document :
	                jQuery.merge( [], elem.childNodes );
	        }
	    }, function( name, fn ) {
	        jQuery.fn[ name ] = function( until, selector ) {
	            var ret = jQuery.map( this, fn, until );
	
	            if ( name.slice( -5 ) !== "Until" ) {
	                selector = until;
	            }
	
	            if ( selector && typeof selector === "string" ) {
	                ret = jQuery.filter( selector, ret );
	            }
	
	            if ( this.length > 1 ) {
	                // Remove duplicates
	                if ( !guaranteedUnique[ name ] ) {
	                    ret = jQuery.unique( ret );
	                }
	
	                // Reverse order for parents* and prev-derivatives
	                if ( rparentsprev.test( name ) ) {
	                    ret = ret.reverse();
	                }
	            }
	
	            return this.pushStack( ret );
	        };
	    });
	
	    jQuery.extend({
	        filter: function( expr, elems, not ) {
	            var elem = elems[ 0 ];
	
	            if ( not ) {
	                expr = ":not(" + expr + ")";
	            }
	
	            return elems.length === 1 && elem.nodeType === 1 ?
	                jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
	                jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
	                    return elem.nodeType === 1;
	                }));
	        },
	
	        dir: function( elem, dir, until ) {
	            var matched = [],
	                cur = elem[ dir ];
	
	            while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
	                if ( cur.nodeType === 1 ) {
	                    matched.push( cur );
	                }
	                cur = cur[dir];
	            }
	            return matched;
	        },
	
	        sibling: function( n, elem ) {
	            var r = [];
	
	            for ( ; n; n = n.nextSibling ) {
	                if ( n.nodeType === 1 && n !== elem ) {
	                    r.push( n );
	                }
	            }
	
	            return r;
	        }
	    });
	
	// Implement the identical functionality for filter and not
	    function winnow( elements, qualifier, not ) {
	        if ( jQuery.isFunction( qualifier ) ) {
	            return jQuery.grep( elements, function( elem, i ) {
	                /* jshint -W018 */
	                return !!qualifier.call( elem, i, elem ) !== not;
	            });
	
	        }
	
	        if ( qualifier.nodeType ) {
	            return jQuery.grep( elements, function( elem ) {
	                return ( elem === qualifier ) !== not;
	            });
	
	        }
	
	        if ( typeof qualifier === "string" ) {
	            if ( isSimple.test( qualifier ) ) {
	                return jQuery.filter( qualifier, elements, not );
	            }
	
	            qualifier = jQuery.filter( qualifier, elements );
	        }
	
	        return jQuery.grep( elements, function( elem ) {
	            return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	        });
	    }
	    function createSafeFragment( document ) {
	        var list = nodeNames.split( "|" ),
	            safeFrag = document.createDocumentFragment();
	
	        if ( safeFrag.createElement ) {
	            while ( list.length ) {
	                safeFrag.createElement(
	                    list.pop()
	                );
	            }
	        }
	        return safeFrag;
	    }
	
	    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
	            "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	        rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	        rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	        rleadingWhitespace = /^\s+/,
	        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	        rtagName = /<([\w:]+)/,
	        rtbody = /<tbody/i,
	        rhtml = /<|&#?\w+;/,
	        rnoInnerhtml = /<(?:script|style|link)/i,
	        manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	    // checked="checked" or checked
	        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	        rscriptType = /^$|\/(?:java|ecma)script/i,
	        rscriptTypeMasked = /^true\/(.*)/,
	        rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	
	    // We have to close these tags to support XHTML (#13200)
	        wrapMap = {
	            option: [ 1, "<select multiple='multiple'>", "</select>" ],
	            legend: [ 1, "<fieldset>", "</fieldset>" ],
	            area: [ 1, "<map>", "</map>" ],
	            param: [ 1, "<object>", "</object>" ],
	            thead: [ 1, "<table>", "</table>" ],
	            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
	            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
	
	            // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
	            // unless wrapped in a div with non-breaking characters in front of it.
	            _default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	        },
	        safeFragment = createSafeFragment( document ),
	        fragmentDiv = safeFragment.appendChild( document.createElement("div") );
	
	    wrapMap.optgroup = wrapMap.option;
	    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	    wrapMap.th = wrapMap.td;
	
	    jQuery.fn.extend({
	        text: function( value ) {
	            return jQuery.access( this, function( value ) {
	                return value === undefined ?
	                    jQuery.text( this ) :
	                    this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
	            }, null, value, arguments.length );
	        },
	
	        append: function() {
	            return this.domManip( arguments, function( elem ) {
	                if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
	                    var target = manipulationTarget( this, elem );
	                    target.appendChild( elem );
	                }
	            });
	        },
	
	        prepend: function() {
	            return this.domManip( arguments, function( elem ) {
	                if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
	                    var target = manipulationTarget( this, elem );
	                    target.insertBefore( elem, target.firstChild );
	                }
	            });
	        },
	
	        before: function() {
	            return this.domManip( arguments, function( elem ) {
	                if ( this.parentNode ) {
	                    this.parentNode.insertBefore( elem, this );
	                }
	            });
	        },
	
	        after: function() {
	            return this.domManip( arguments, function( elem ) {
	                if ( this.parentNode ) {
	                    this.parentNode.insertBefore( elem, this.nextSibling );
	                }
	            });
	        },
	
	        // keepData is for internal use only--do not document
	        remove: function( selector, keepData ) {
	            var elem,
	                elems = selector ? jQuery.filter( selector, this ) : this,
	                i = 0;
	
	            for ( ; (elem = elems[i]) != null; i++ ) {
	
	                if ( !keepData && elem.nodeType === 1 ) {
	                    jQuery.cleanData( getAll( elem ) );
	                }
	
	                if ( elem.parentNode ) {
	                    if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
	                        setGlobalEval( getAll( elem, "script" ) );
	                    }
	                    elem.parentNode.removeChild( elem );
	                }
	            }
	
	            return this;
	        },
	
	        empty: function() {
	            var elem,
	                i = 0;
	
	            for ( ; (elem = this[i]) != null; i++ ) {
	                // Remove element nodes and prevent memory leaks
	                if ( elem.nodeType === 1 ) {
	                    jQuery.cleanData( getAll( elem, false ) );
	                }
	
	                // Remove any remaining nodes
	                while ( elem.firstChild ) {
	                    elem.removeChild( elem.firstChild );
	                }
	
	                // If this is a select, ensure that it displays empty (#12336)
	                // Support: IE<9
	                if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
	                    elem.options.length = 0;
	                }
	            }
	
	            return this;
	        },
	
	        clone: function( dataAndEvents, deepDataAndEvents ) {
	            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
	            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
	
	            return this.map( function () {
	                return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
	            });
	        },
	
	        html: function( value ) {
	            return jQuery.access( this, function( value ) {
	                var elem = this[0] || {},
	                    i = 0,
	                    l = this.length;
	
	                if ( value === undefined ) {
	                    return elem.nodeType === 1 ?
	                        elem.innerHTML.replace( rinlinejQuery, "" ) :
	                        undefined;
	                }
	
	                // See if we can take a shortcut and just use innerHTML
	                if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
	                    ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
	                    ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
	                    !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {
	
	                    value = value.replace( rxhtmlTag, "<$1></$2>" );
	
	                    try {
	                        for (; i < l; i++ ) {
	                            // Remove element nodes and prevent memory leaks
	                            elem = this[i] || {};
	                            if ( elem.nodeType === 1 ) {
	                                jQuery.cleanData( getAll( elem, false ) );
	                                elem.innerHTML = value;
	                            }
	                        }
	
	                        elem = 0;
	
	                        // If using innerHTML throws an exception, use the fallback method
	                    } catch(e) {}
	                }
	
	                if ( elem ) {
	                    this.empty().append( value );
	                }
	            }, null, value, arguments.length );
	        },
	
	        replaceWith: function() {
	            var
	            // Snapshot the DOM in case .domManip sweeps something relevant into its fragment
	                args = jQuery.map( this, function( elem ) {
	                    return [ elem.nextSibling, elem.parentNode ];
	                }),
	                i = 0;
	
	            // Make the changes, replacing each context element with the new content
	            this.domManip( arguments, function( elem ) {
	                var next = args[ i++ ],
	                    parent = args[ i++ ];
	
	                if ( parent ) {
	                    // Don't use the snapshot next if it has moved (#13810)
	                    if ( next && next.parentNode !== parent ) {
	                        next = this.nextSibling;
	                    }
	                    jQuery( this ).remove();
	                    parent.insertBefore( elem, next );
	                }
	                // Allow new content to include elements from the context set
	            }, true );
	
	            // Force removal if there was no new content (e.g., from empty arguments)
	            return i ? this : this.remove();
	        },
	
	        detach: function( selector ) {
	            return this.remove( selector, true );
	        },
	
	        domManip: function( args, callback, allowIntersection ) {
	
	            // Flatten any nested arrays
	            args = core_concat.apply( [], args );
	
	            var first, node, hasScripts,
	                scripts, doc, fragment,
	                i = 0,
	                l = this.length,
	                set = this,
	                iNoClone = l - 1,
	                value = args[0],
	                isFunction = jQuery.isFunction( value );
	
	            // We can't cloneNode fragments that contain checked, in WebKit
	            if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
	                return this.each(function( index ) {
	                    var self = set.eq( index );
	                    if ( isFunction ) {
	                        args[0] = value.call( this, index, self.html() );
	                    }
	                    self.domManip( args, callback, allowIntersection );
	                });
	            }
	
	            if ( l ) {
	                fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
	                first = fragment.firstChild;
	
	                if ( fragment.childNodes.length === 1 ) {
	                    fragment = first;
	                }
	
	                if ( first ) {
	                    scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
	                    hasScripts = scripts.length;
	
	                    // Use the original fragment for the last item instead of the first because it can end up
	                    // being emptied incorrectly in certain situations (#8070).
	                    for ( ; i < l; i++ ) {
	                        node = fragment;
	
	                        if ( i !== iNoClone ) {
	                            node = jQuery.clone( node, true, true );
	
	                            // Keep references to cloned scripts for later restoration
	                            if ( hasScripts ) {
	                                jQuery.merge( scripts, getAll( node, "script" ) );
	                            }
	                        }
	
	                        callback.call( this[i], node, i );
	                    }
	
	                    if ( hasScripts ) {
	                        doc = scripts[ scripts.length - 1 ].ownerDocument;
	
	                        // Reenable scripts
	                        jQuery.map( scripts, restoreScript );
	
	                        // Evaluate executable scripts on first document insertion
	                        for ( i = 0; i < hasScripts; i++ ) {
	                            node = scripts[ i ];
	                            if ( rscriptType.test( node.type || "" ) &&
	                                !jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {
	
	                                if ( node.src ) {
	                                    // Hope ajax is available...
	                                    jQuery._evalUrl( node.src );
	                                } else {
	                                    jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
	                                }
	                            }
	                        }
	                    }
	
	                    // Fix #11809: Avoid leaking memory
	                    fragment = first = null;
	                }
	            }
	
	            return this;
	        }
	    });
	
	// Support: IE<8
	// Manipulating tables requires a tbody
	    function manipulationTarget( elem, content ) {
	        return jQuery.nodeName( elem, "table" ) &&
	        jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?
	
	        elem.getElementsByTagName("tbody")[0] ||
	        elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
	            elem;
	    }
	
	// Replace/restore the type attribute of script elements for safe DOM manipulation
	    function disableScript( elem ) {
	        elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	        return elem;
	    }
	    function restoreScript( elem ) {
	        var match = rscriptTypeMasked.exec( elem.type );
	        if ( match ) {
	            elem.type = match[1];
	        } else {
	            elem.removeAttribute("type");
	        }
	        return elem;
	    }
	
	// Mark scripts as having already been evaluated
	    function setGlobalEval( elems, refElements ) {
	        var elem,
	            i = 0;
	        for ( ; (elem = elems[i]) != null; i++ ) {
	            jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	        }
	    }
	
	    function cloneCopyEvent( src, dest ) {
	
	        if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
	            return;
	        }
	
	        var type, i, l,
	            oldData = jQuery._data( src ),
	            curData = jQuery._data( dest, oldData ),
	            events = oldData.events;
	
	        if ( events ) {
	            delete curData.handle;
	            curData.events = {};
	
	            for ( type in events ) {
	                for ( i = 0, l = events[ type ].length; i < l; i++ ) {
	                    jQuery.event.add( dest, type, events[ type ][ i ] );
	                }
	            }
	        }
	
	        // make the cloned public data object a copy from the original
	        if ( curData.data ) {
	            curData.data = jQuery.extend( {}, curData.data );
	        }
	    }
	
	    function fixCloneNodeIssues( src, dest ) {
	        var nodeName, e, data;
	
	        // We do not need to do anything for non-Elements
	        if ( dest.nodeType !== 1 ) {
	            return;
	        }
	
	        nodeName = dest.nodeName.toLowerCase();
	
	        // IE6-8 copies events bound via attachEvent when using cloneNode.
	        if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
	            data = jQuery._data( dest );
	
	            for ( e in data.events ) {
	                jQuery.removeEvent( dest, e, data.handle );
	            }
	
	            // Event data gets referenced instead of copied if the expando gets copied too
	            dest.removeAttribute( jQuery.expando );
	        }
	
	        // IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	        if ( nodeName === "script" && dest.text !== src.text ) {
	            disableScript( dest ).text = src.text;
	            restoreScript( dest );
	
	            // IE6-10 improperly clones children of object elements using classid.
	            // IE10 throws NoModificationAllowedError if parent is null, #12132.
	        } else if ( nodeName === "object" ) {
	            if ( dest.parentNode ) {
	                dest.outerHTML = src.outerHTML;
	            }
	
	            // This path appears unavoidable for IE9. When cloning an object
	            // element in IE9, the outerHTML strategy above is not sufficient.
	            // If the src has innerHTML and the destination does not,
	            // copy the src.innerHTML into the dest.innerHTML. #10324
	            if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
	                dest.innerHTML = src.innerHTML;
	            }
	
	        } else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
	            // IE6-8 fails to persist the checked state of a cloned checkbox
	            // or radio button. Worse, IE6-7 fail to give the cloned element
	            // a checked appearance if the defaultChecked value isn't also set
	
	            dest.defaultChecked = dest.checked = src.checked;
	
	            // IE6-7 get confused and end up setting the value of a cloned
	            // checkbox/radio button to an empty string instead of "on"
	            if ( dest.value !== src.value ) {
	                dest.value = src.value;
	            }
	
	            // IE6-8 fails to return the selected option to the default selected
	            // state when cloning options
	        } else if ( nodeName === "option" ) {
	            dest.defaultSelected = dest.selected = src.defaultSelected;
	
	            // IE6-8 fails to set the defaultValue to the correct value when
	            // cloning other types of input fields
	        } else if ( nodeName === "input" || nodeName === "textarea" ) {
	            dest.defaultValue = src.defaultValue;
	        }
	    }
	
	    jQuery.each({
	        appendTo: "append",
	        prependTo: "prepend",
	        insertBefore: "before",
	        insertAfter: "after",
	        replaceAll: "replaceWith"
	    }, function( name, original ) {
	        jQuery.fn[ name ] = function( selector ) {
	            var elems,
	                i = 0,
	                ret = [],
	                insert = jQuery( selector ),
	                last = insert.length - 1;
	
	            for ( ; i <= last; i++ ) {
	                elems = i === last ? this : this.clone(true);
	                jQuery( insert[i] )[ original ]( elems );
	
	                // Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
	                core_push.apply( ret, elems.get() );
	            }
	
	            return this.pushStack( ret );
	        };
	    });
	
	    function getAll( context, tag ) {
	        var elems, elem,
	            i = 0,
	            found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
	                typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
	                    undefined;
	
	        if ( !found ) {
	            for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
	                if ( !tag || jQuery.nodeName( elem, tag ) ) {
	                    found.push( elem );
	                } else {
	                    jQuery.merge( found, getAll( elem, tag ) );
	                }
	            }
	        }
	
	        return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
	            jQuery.merge( [ context ], found ) :
	            found;
	    }
	
	// Used in buildFragment, fixes the defaultChecked property
	    function fixDefaultChecked( elem ) {
	        if ( manipulation_rcheckableType.test( elem.type ) ) {
	            elem.defaultChecked = elem.checked;
	        }
	    }
	
	    jQuery.extend({
	        clone: function( elem, dataAndEvents, deepDataAndEvents ) {
	            var destElements, node, clone, i, srcElements,
	                inPage = jQuery.contains( elem.ownerDocument, elem );
	
	            if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
	                clone = elem.cloneNode( true );
	
	                // IE<=8 does not properly clone detached, unknown element nodes
	            } else {
	                fragmentDiv.innerHTML = elem.outerHTML;
	                fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
	            }
	
	            if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
	                (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
	
	                // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
	                destElements = getAll( clone );
	                srcElements = getAll( elem );
	
	                // Fix all IE cloning issues
	                for ( i = 0; (node = srcElements[i]) != null; ++i ) {
	                    // Ensure that the destination node is not null; Fixes #9587
	                    if ( destElements[i] ) {
	                        fixCloneNodeIssues( node, destElements[i] );
	                    }
	                }
	            }
	
	            // Copy the events from the original to the clone
	            if ( dataAndEvents ) {
	                if ( deepDataAndEvents ) {
	                    srcElements = srcElements || getAll( elem );
	                    destElements = destElements || getAll( clone );
	
	                    for ( i = 0; (node = srcElements[i]) != null; i++ ) {
	                        cloneCopyEvent( node, destElements[i] );
	                    }
	                } else {
	                    cloneCopyEvent( elem, clone );
	                }
	            }
	
	            // Preserve script evaluation history
	            destElements = getAll( clone, "script" );
	            if ( destElements.length > 0 ) {
	                setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
	            }
	
	            destElements = srcElements = node = null;
	
	            // Return the cloned set
	            return clone;
	        },
	
	        buildFragment: function( elems, context, scripts, selection ) {
	            var j, elem, contains,
	                tmp, tag, tbody, wrap,
	                l = elems.length,
	
	            // Ensure a safe fragment
	                safe = createSafeFragment( context ),
	
	                nodes = [],
	                i = 0;
	
	            for ( ; i < l; i++ ) {
	                elem = elems[ i ];
	
	                if ( elem || elem === 0 ) {
	
	                    // Add nodes directly
	                    if ( jQuery.type( elem ) === "object" ) {
	                        jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
	
	                        // Convert non-html into a text node
	                    } else if ( !rhtml.test( elem ) ) {
	                        nodes.push( context.createTextNode( elem ) );
	
	                        // Convert html into DOM nodes
	                    } else {
	                        tmp = tmp || safe.appendChild( context.createElement("div") );
	
	                        // Deserialize a standard representation
	                        tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
	                        wrap = wrapMap[ tag ] || wrapMap._default;
	
	                        tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];
	
	                        // Descend through wrappers to the right content
	                        j = wrap[0];
	                        while ( j-- ) {
	                            tmp = tmp.lastChild;
	                        }
	
	                        // Manually add leading whitespace removed by IE
	                        if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
	                            nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
	                        }
	
	                        // Remove IE's autoinserted <tbody> from table fragments
	                        if ( !jQuery.support.tbody ) {
	
	                            // String was a <table>, *may* have spurious <tbody>
	                            elem = tag === "table" && !rtbody.test( elem ) ?
	                                tmp.firstChild :
	
	                                // String was a bare <thead> or <tfoot>
	                                wrap[1] === "<table>" && !rtbody.test( elem ) ?
	                                    tmp :
	                                    0;
	
	                            j = elem && elem.childNodes.length;
	                            while ( j-- ) {
	                                if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
	                                    elem.removeChild( tbody );
	                                }
	                            }
	                        }
	
	                        jQuery.merge( nodes, tmp.childNodes );
	
	                        // Fix #12392 for WebKit and IE > 9
	                        tmp.textContent = "";
	
	                        // Fix #12392 for oldIE
	                        while ( tmp.firstChild ) {
	                            tmp.removeChild( tmp.firstChild );
	                        }
	
	                        // Remember the top-level container for proper cleanup
	                        tmp = safe.lastChild;
	                    }
	                }
	            }
	
	            // Fix #11356: Clear elements from fragment
	            if ( tmp ) {
	                safe.removeChild( tmp );
	            }
	
	            // Reset defaultChecked for any radios and checkboxes
	            // about to be appended to the DOM in IE 6/7 (#8060)
	            if ( !jQuery.support.appendChecked ) {
	                jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
	            }
	
	            i = 0;
	            while ( (elem = nodes[ i++ ]) ) {
	
	                // #4087 - If origin and destination elements are the same, and this is
	                // that element, do not do anything
	                if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
	                    continue;
	                }
	
	                contains = jQuery.contains( elem.ownerDocument, elem );
	
	                // Append to fragment
	                tmp = getAll( safe.appendChild( elem ), "script" );
	
	                // Preserve script evaluation history
	                if ( contains ) {
	                    setGlobalEval( tmp );
	                }
	
	                // Capture executables
	                if ( scripts ) {
	                    j = 0;
	                    while ( (elem = tmp[ j++ ]) ) {
	                        if ( rscriptType.test( elem.type || "" ) ) {
	                            scripts.push( elem );
	                        }
	                    }
	                }
	            }
	
	            tmp = null;
	
	            return safe;
	        },
	
	        cleanData: function( elems, /* internal */ acceptData ) {
	            var elem, type, id, data,
	                i = 0,
	                internalKey = jQuery.expando,
	                cache = jQuery.cache,
	                deleteExpando = jQuery.support.deleteExpando,
	                special = jQuery.event.special;
	
	            for ( ; (elem = elems[i]) != null; i++ ) {
	
	                if ( acceptData || jQuery.acceptData( elem ) ) {
	
	                    id = elem[ internalKey ];
	                    data = id && cache[ id ];
	
	                    if ( data ) {
	                        if ( data.events ) {
	                            for ( type in data.events ) {
	                                if ( special[ type ] ) {
	                                    jQuery.event.remove( elem, type );
	
	                                    // This is a shortcut to avoid jQuery.event.remove's overhead
	                                } else {
	                                    jQuery.removeEvent( elem, type, data.handle );
	                                }
	                            }
	                        }
	
	                        // Remove cache only if it was not already removed by jQuery.event.remove
	                        if ( cache[ id ] ) {
	
	                            delete cache[ id ];
	
	                            // IE does not allow us to delete expando properties from nodes,
	                            // nor does it have a removeAttribute function on Document nodes;
	                            // we must handle all of these cases
	                            if ( deleteExpando ) {
	                                delete elem[ internalKey ];
	
	                            } else if ( typeof elem.removeAttribute !== core_strundefined ) {
	                                elem.removeAttribute( internalKey );
	
	                            } else {
	                                elem[ internalKey ] = null;
	                            }
	
	                            core_deletedIds.push( id );
	                        }
	                    }
	                }
	            }
	        },
	
	        _evalUrl: function( url ) {
	            return jQuery.ajax({
	                url: url,
	                type: "GET",
	                dataType: "script",
	                async: false,
	                global: false,
	                "throws": true
	            });
	        }
	    });
	    jQuery.fn.extend({
	        wrapAll: function( html ) {
	            if ( jQuery.isFunction( html ) ) {
	                return this.each(function(i) {
	                    jQuery(this).wrapAll( html.call(this, i) );
	                });
	            }
	
	            if ( this[0] ) {
	                // The elements to wrap the target around
	                var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);
	
	                if ( this[0].parentNode ) {
	                    wrap.insertBefore( this[0] );
	                }
	
	                wrap.map(function() {
	                    var elem = this;
	
	                    while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
	                        elem = elem.firstChild;
	                    }
	
	                    return elem;
	                }).append( this );
	            }
	
	            return this;
	        },
	
	        wrapInner: function( html ) {
	            if ( jQuery.isFunction( html ) ) {
	                return this.each(function(i) {
	                    jQuery(this).wrapInner( html.call(this, i) );
	                });
	            }
	
	            return this.each(function() {
	                var self = jQuery( this ),
	                    contents = self.contents();
	
	                if ( contents.length ) {
	                    contents.wrapAll( html );
	
	                } else {
	                    self.append( html );
	                }
	            });
	        },
	
	        wrap: function( html ) {
	            var isFunction = jQuery.isFunction( html );
	
	            return this.each(function(i) {
	                jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
	            });
	        },
	
	        unwrap: function() {
	            return this.parent().each(function() {
	                if ( !jQuery.nodeName( this, "body" ) ) {
	                    jQuery( this ).replaceWith( this.childNodes );
	                }
	            }).end();
	        }
	    });
	    var iframe, getStyles, curCSS,
	        ralpha = /alpha\([^)]*\)/i,
	        ropacity = /opacity\s*=\s*([^)]*)/,
	        rposition = /^(top|right|bottom|left)$/,
	    // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	    // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	        rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	        rmargin = /^margin/,
	        rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	        rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	        rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	        elemdisplay = { BODY: "block" },
	
	        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	        cssNormalTransform = {
	            letterSpacing: 0,
	            fontWeight: 400
	        },
	
	        cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	        cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
	
	// return a css property mapped to a potentially vendor prefixed property
	    function vendorPropName( style, name ) {
	
	        // shortcut for names that are not vendor prefixed
	        if ( name in style ) {
	            return name;
	        }
	
	        // check for vendor prefixed names
	        var capName = name.charAt(0).toUpperCase() + name.slice(1),
	            origName = name,
	            i = cssPrefixes.length;
	
	        while ( i-- ) {
	            name = cssPrefixes[ i ] + capName;
	            if ( name in style ) {
	                return name;
	            }
	        }
	
	        return origName;
	    }
	
	    function isHidden( elem, el ) {
	        // isHidden might be called from jQuery#filter function;
	        // in that case, element will be second argument
	        elem = el || elem;
	        return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	    }
	
	    function showHide( elements, show ) {
	        var display, elem, hidden,
	            values = [],
	            index = 0,
	            length = elements.length;
	
	        for ( ; index < length; index++ ) {
	            elem = elements[ index ];
	            if ( !elem.style ) {
	                continue;
	            }
	
	            values[ index ] = jQuery._data( elem, "olddisplay" );
	            display = elem.style.display;
	            if ( show ) {
	                // Reset the inline display of this element to learn if it is
	                // being hidden by cascaded rules or not
	                if ( !values[ index ] && display === "none" ) {
	                    elem.style.display = "";
	                }
	
	                // Set elements which have been overridden with display: none
	                // in a stylesheet to whatever the default browser style is
	                // for such an element
	                if ( elem.style.display === "" && isHidden( elem ) ) {
	                    values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
	                }
	            } else {
	
	                if ( !values[ index ] ) {
	                    hidden = isHidden( elem );
	
	                    if ( display && display !== "none" || !hidden ) {
	                        jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
	                    }
	                }
	            }
	        }
	
	        // Set the display of most of the elements in a second loop
	        // to avoid the constant reflow
	        for ( index = 0; index < length; index++ ) {
	            elem = elements[ index ];
	            if ( !elem.style ) {
	                continue;
	            }
	            if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
	                elem.style.display = show ? values[ index ] || "" : "none";
	            }
	        }
	
	        return elements;
	    }
	
	    jQuery.fn.extend({
	        css: function( name, value ) {
	            return jQuery.access( this, function( elem, name, value ) {
	                var len, styles,
	                    map = {},
	                    i = 0;
	
	                if ( jQuery.isArray( name ) ) {
	                    styles = getStyles( elem );
	                    len = name.length;
	
	                    for ( ; i < len; i++ ) {
	                        map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
	                    }
	
	                    return map;
	                }
	
	                return value !== undefined ?
	                    jQuery.style( elem, name, value ) :
	                    jQuery.css( elem, name );
	            }, name, value, arguments.length > 1 );
	        },
	        show: function() {
	            return showHide( this, true );
	        },
	        hide: function() {
	            return showHide( this );
	        },
	        toggle: function( state ) {
	            if ( typeof state === "boolean" ) {
	                return state ? this.show() : this.hide();
	            }
	
	            return this.each(function() {
	                if ( isHidden( this ) ) {
	                    jQuery( this ).show();
	                } else {
	                    jQuery( this ).hide();
	                }
	            });
	        }
	    });
	
	    jQuery.extend({
	        // Add in style property hooks for overriding the default
	        // behavior of getting and setting a style property
	        cssHooks: {
	            opacity: {
	                get: function( elem, computed ) {
	                    if ( computed ) {
	                        // We should always get a number back from opacity
	                        var ret = curCSS( elem, "opacity" );
	                        return ret === "" ? "1" : ret;
	                    }
	                }
	            }
	        },
	
	        // Don't automatically add "px" to these possibly-unitless properties
	        cssNumber: {
	            "columnCount": true,
	            "fillOpacity": true,
	            "fontWeight": true,
	            "lineHeight": true,
	            "opacity": true,
	            "order": true,
	            "orphans": true,
	            "widows": true,
	            "zIndex": true,
	            "zoom": true
	        },
	
	        // Add in properties whose names you wish to fix before
	        // setting or getting the value
	        cssProps: {
	            // normalize float css property
	            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	        },
	
	        // Get and set the style property on a DOM Node
	        style: function( elem, name, value, extra ) {
	            // Don't set styles on text and comment nodes
	            if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
	                return;
	            }
	
	            // Make sure that we're working with the right name
	            var ret, type, hooks,
	                origName = jQuery.camelCase( name ),
	                style = elem.style;
	
	            name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );
	
	            // gets hook for the prefixed version
	            // followed by the unprefixed version
	            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
	            // Check if we're setting a value
	            if ( value !== undefined ) {
	                type = typeof value;
	
	                // convert relative number strings (+= or -=) to relative numbers. #7345
	                if ( type === "string" && (ret = rrelNum.exec( value )) ) {
	                    value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
	                    // Fixes bug #9237
	                    type = "number";
	                }
	
	                // Make sure that NaN and null values aren't set. See: #7116
	                if ( value == null || type === "number" && isNaN( value ) ) {
	                    return;
	                }
	
	                // If a number was passed in, add 'px' to the (except for certain CSS properties)
	                if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
	                    value += "px";
	                }
	
	                // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
	                // but it would mean to define eight (for every problematic property) identical functions
	                if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
	                    style[ name ] = "inherit";
	                }
	
	                // If a hook was provided, use that value, otherwise just set the specified value
	                if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
	
	                    // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
	                    // Fixes bug #5509
	                    try {
	                        style[ name ] = value;
	                    } catch(e) {}
	                }
	
	            } else {
	                // If a hook was provided get the non-computed value from there
	                if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
	                    return ret;
	                }
	
	                // Otherwise just get the value from the style object
	                return style[ name ];
	            }
	        },
	
	        css: function( elem, name, extra, styles ) {
	            var num, val, hooks,
	                origName = jQuery.camelCase( name );
	
	            // Make sure that we're working with the right name
	            name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );
	
	            // gets hook for the prefixed version
	            // followed by the unprefixed version
	            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
	            // If a hook was provided get the computed value from there
	            if ( hooks && "get" in hooks ) {
	                val = hooks.get( elem, true, extra );
	            }
	
	            // Otherwise, if a way to get the computed value exists, use that
	            if ( val === undefined ) {
	                val = curCSS( elem, name, styles );
	            }
	
	            //convert "normal" to computed value
	            if ( val === "normal" && name in cssNormalTransform ) {
	                val = cssNormalTransform[ name ];
	            }
	
	            // Return, converting to number if forced or a qualifier was provided and val looks numeric
	            if ( extra === "" || extra ) {
	                num = parseFloat( val );
	                return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
	            }
	            return val;
	        }
	    });
	
	// NOTE: we've included the "window" in window.getComputedStyle
	// because jsdom on node.js will break without it.
	    if ( window.getComputedStyle ) {
	        getStyles = function( elem ) {
	            return window.getComputedStyle( elem, null );
	        };
	
	        curCSS = function( elem, name, _computed ) {
	            var width, minWidth, maxWidth,
	                computed = _computed || getStyles( elem ),
	
	            // getPropertyValue is only needed for .css('filter') in IE9, see #12537
	                ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
	                style = elem.style;
	
	            if ( computed ) {
	
	                if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
	                    ret = jQuery.style( elem, name );
	                }
	
	                // A tribute to the "awesome hack by Dean Edwards"
	                // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
	                // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
	                // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
	                if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
	
	                    // Remember the original values
	                    width = style.width;
	                    minWidth = style.minWidth;
	                    maxWidth = style.maxWidth;
	
	                    // Put in the new values to get a computed value out
	                    style.minWidth = style.maxWidth = style.width = ret;
	                    ret = computed.width;
	
	                    // Revert the changed values
	                    style.width = width;
	                    style.minWidth = minWidth;
	                    style.maxWidth = maxWidth;
	                }
	            }
	
	            return ret;
	        };
	    } else if ( document.documentElement.currentStyle ) {
	        getStyles = function( elem ) {
	            return elem.currentStyle;
	        };
	
	        curCSS = function( elem, name, _computed ) {
	            var left, rs, rsLeft,
	                computed = _computed || getStyles( elem ),
	                ret = computed ? computed[ name ] : undefined,
	                style = elem.style;
	
	            // Avoid setting ret to empty string here
	            // so we don't default to auto
	            if ( ret == null && style && style[ name ] ) {
	                ret = style[ name ];
	            }
	
	            // From the awesome hack by Dean Edwards
	            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
	
	            // If we're not dealing with a regular pixel number
	            // but a number that has a weird ending, we need to convert it to pixels
	            // but not position css attributes, as those are proportional to the parent element instead
	            // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
	            if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {
	
	                // Remember the original values
	                left = style.left;
	                rs = elem.runtimeStyle;
	                rsLeft = rs && rs.left;
	
	                // Put in the new values to get a computed value out
	                if ( rsLeft ) {
	                    rs.left = elem.currentStyle.left;
	                }
	                style.left = name === "fontSize" ? "1em" : ret;
	                ret = style.pixelLeft + "px";
	
	                // Revert the changed values
	                style.left = left;
	                if ( rsLeft ) {
	                    rs.left = rsLeft;
	                }
	            }
	
	            return ret === "" ? "auto" : ret;
	        };
	    }
	
	    function setPositiveNumber( elem, value, subtract ) {
	        var matches = rnumsplit.exec( value );
	        return matches ?
	            // Guard against undefined "subtract", e.g., when used as in cssHooks
	        Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
	            value;
	    }
	
	    function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	        var i = extra === ( isBorderBox ? "border" : "content" ) ?
	                // If we already have the right measurement, avoid augmentation
	                4 :
	                // Otherwise initialize for horizontal or vertical properties
	                name === "width" ? 1 : 0,
	
	            val = 0;
	
	        for ( ; i < 4; i += 2 ) {
	            // both box models exclude margin, so add it if we want it
	            if ( extra === "margin" ) {
	                val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
	            }
	
	            if ( isBorderBox ) {
	                // border-box includes padding, so remove it if we want content
	                if ( extra === "content" ) {
	                    val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
	                }
	
	                // at this point, extra isn't border nor margin, so remove border
	                if ( extra !== "margin" ) {
	                    val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
	                }
	            } else {
	                // at this point, extra isn't content, so add padding
	                val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
	
	                // at this point, extra isn't content nor padding, so add border
	                if ( extra !== "padding" ) {
	                    val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
	                }
	            }
	        }
	
	        return val;
	    }
	
	    function getWidthOrHeight( elem, name, extra ) {
	
	        // Start with offset property, which is equivalent to the border-box value
	        var valueIsBorderBox = true,
	            val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
	            styles = getStyles( elem ),
	            isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
	
	        // some non-html elements return undefined for offsetWidth, so check for null/undefined
	        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	        if ( val <= 0 || val == null ) {
	            // Fall back to computed then uncomputed css if necessary
	            val = curCSS( elem, name, styles );
	            if ( val < 0 || val == null ) {
	                val = elem.style[ name ];
	            }
	
	            // Computed unit is not pixels. Stop here and return.
	            if ( rnumnonpx.test(val) ) {
	                return val;
	            }
	
	            // we need the check for style in case a browser which returns unreliable values
	            // for getComputedStyle silently falls back to the reliable elem.style
	            valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );
	
	            // Normalize "", auto, and prepare for extra
	            val = parseFloat( val ) || 0;
	        }
	
	        // use the active box-sizing model to add/subtract irrelevant styles
	        return ( val +
	                augmentWidthOrHeight(
	                    elem,
	                    name,
	                    extra || ( isBorderBox ? "border" : "content" ),
	                    valueIsBorderBox,
	                    styles
	                )
	            ) + "px";
	    }
	
	// Try to determine the default display value of an element
	    function css_defaultDisplay( nodeName ) {
	        var doc = document,
	            display = elemdisplay[ nodeName ];
	
	        if ( !display ) {
	            display = actualDisplay( nodeName, doc );
	
	            // If the simple way fails, read from inside an iframe
	            if ( display === "none" || !display ) {
	                // Use the already-created iframe if possible
	                iframe = ( iframe ||
	                    jQuery("<iframe frameborder='0' width='0' height='0'/>")
	                        .css( "cssText", "display:block !important" )
	                ).appendTo( doc.documentElement );
	
	                // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
	                doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
	                doc.write("<!doctype html><html><body>");
	                doc.close();
	
	                display = actualDisplay( nodeName, doc );
	                iframe.detach();
	            }
	
	            // Store the correct default display
	            elemdisplay[ nodeName ] = display;
	        }
	
	        return display;
	    }
	
	// Called ONLY from within css_defaultDisplay
	    function actualDisplay( name, doc ) {
	        var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
	            display = jQuery.css( elem[0], "display" );
	        elem.remove();
	        return display;
	    }
	
	    jQuery.each([ "height", "width" ], function( i, name ) {
	        jQuery.cssHooks[ name ] = {
	            get: function( elem, computed, extra ) {
	                if ( computed ) {
	                    // certain elements can have dimension info if we invisibly show them
	                    // however, it must have a current display style that would benefit from this
	                    return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
	                        jQuery.swap( elem, cssShow, function() {
	                            return getWidthOrHeight( elem, name, extra );
	                        }) :
	                        getWidthOrHeight( elem, name, extra );
	                }
	            },
	
	            set: function( elem, value, extra ) {
	                var styles = extra && getStyles( elem );
	                return setPositiveNumber( elem, value, extra ?
	                    augmentWidthOrHeight(
	                        elem,
	                        name,
	                        extra,
	                        jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
	                        styles
	                    ) : 0
	                );
	            }
	        };
	    });
	
	    if ( !jQuery.support.opacity ) {
	        jQuery.cssHooks.opacity = {
	            get: function( elem, computed ) {
	                // IE uses filters for opacity
	                return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
	                ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
	                    computed ? "1" : "";
	            },
	
	            set: function( elem, value ) {
	                var style = elem.style,
	                    currentStyle = elem.currentStyle,
	                    opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
	                    filter = currentStyle && currentStyle.filter || style.filter || "";
	
	                // IE has trouble with opacity if it does not have layout
	                // Force it by setting the zoom level
	                style.zoom = 1;
	
	                // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
	                // if value === "", then remove inline opacity #12685
	                if ( ( value >= 1 || value === "" ) &&
	                    jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
	                    style.removeAttribute ) {
	
	                    // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
	                    // if "filter:" is present at all, clearType is disabled, we want to avoid this
	                    // style.removeAttribute is IE Only, but so apparently is this code path...
	                    style.removeAttribute( "filter" );
	
	                    // if there is no filter style applied in a css rule or unset inline opacity, we are done
	                    if ( value === "" || currentStyle && !currentStyle.filter ) {
	                        return;
	                    }
	                }
	
	                // otherwise, set new filter values
	                style.filter = ralpha.test( filter ) ?
	                    filter.replace( ralpha, opacity ) :
	                filter + " " + opacity;
	            }
	        };
	    }
	
	// These hooks cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	    jQuery(function() {
	        if ( !jQuery.support.reliableMarginRight ) {
	            jQuery.cssHooks.marginRight = {
	                get: function( elem, computed ) {
	                    if ( computed ) {
	                        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	                        // Work around by temporarily setting element display to inline-block
	                        return jQuery.swap( elem, { "display": "inline-block" },
	                            curCSS, [ elem, "marginRight" ] );
	                    }
	                }
	            };
	        }
	
	        // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	        // getComputedStyle returns percent when specified for top/left/bottom/right
	        // rather than make the css module depend on the offset module, we just check for it here
	        if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
	            jQuery.each( [ "top", "left" ], function( i, prop ) {
	                jQuery.cssHooks[ prop ] = {
	                    get: function( elem, computed ) {
	                        if ( computed ) {
	                            computed = curCSS( elem, prop );
	                            // if curCSS returns percentage, fallback to offset
	                            return rnumnonpx.test( computed ) ?
	                            jQuery( elem ).position()[ prop ] + "px" :
	                                computed;
	                        }
	                    }
	                };
	            });
	        }
	
	    });
	
	    if ( jQuery.expr && jQuery.expr.filters ) {
	        jQuery.expr.filters.hidden = function( elem ) {
	            // Support: Opera <= 12.12
	            // Opera reports offsetWidths and offsetHeights less than zero on some elements
	            return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
	                (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	        };
	
	        jQuery.expr.filters.visible = function( elem ) {
	            return !jQuery.expr.filters.hidden( elem );
	        };
	    }
	
	// These hooks are used by animate to expand properties
	    jQuery.each({
	        margin: "",
	        padding: "",
	        border: "Width"
	    }, function( prefix, suffix ) {
	        jQuery.cssHooks[ prefix + suffix ] = {
	            expand: function( value ) {
	                var i = 0,
	                    expanded = {},
	
	                // assumes a single number if not a string
	                    parts = typeof value === "string" ? value.split(" ") : [ value ];
	
	                for ( ; i < 4; i++ ) {
	                    expanded[ prefix + cssExpand[ i ] + suffix ] =
	                        parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
	                }
	
	                return expanded;
	            }
	        };
	
	        if ( !rmargin.test( prefix ) ) {
	            jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	        }
	    });
	    var r20 = /%20/g,
	        rbracket = /\[\]$/,
	        rCRLF = /\r?\n/g,
	        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	        rsubmittable = /^(?:input|select|textarea|keygen)/i;
	
	    jQuery.fn.extend({
	        serialize: function() {
	            return jQuery.param( this.serializeArray() );
	        },
	        serializeArray: function() {
	            return this.map(function(){
	                    // Can add propHook for "elements" to filter or add form elements
	                    var elements = jQuery.prop( this, "elements" );
	                    return elements ? jQuery.makeArray( elements ) : this;
	                })
	                .filter(function(){
	                    var type = this.type;
	                    // Use .is(":disabled") so that fieldset[disabled] works
	                    return this.name && !jQuery( this ).is( ":disabled" ) &&
	                        rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
	                        ( this.checked || !manipulation_rcheckableType.test( type ) );
	                })
	                .map(function( i, elem ){
	                    var val = jQuery( this ).val();
	
	                    return val == null ?
	                        null :
	                        jQuery.isArray( val ) ?
	                            jQuery.map( val, function( val ){
	                                return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
	                            }) :
	                        { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
	                }).get();
	        }
	    });
	
	//Serialize an array of form elements or a set of
	//key/values into a query string
	    jQuery.param = function( a, traditional ) {
	        var prefix,
	            s = [],
	            add = function( key, value ) {
	                // If value is a function, invoke it and return its value
	                value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
	                s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
	            };
	
	        // Set traditional to true for jQuery <= 1.3.2 behavior.
	        if ( traditional === undefined ) {
	            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	        }
	
	        // If an array was passed in, assume that it is an array of form elements.
	        if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
	            // Serialize the form elements
	            jQuery.each( a, function() {
	                add( this.name, this.value );
	            });
	
	        } else {
	            // If traditional, encode the "old" way (the way 1.3.2 or older
	            // did it), otherwise encode params recursively.
	            for ( prefix in a ) {
	                buildParams( prefix, a[ prefix ], traditional, add );
	            }
	        }
	
	        // Return the resulting serialization
	        return s.join( "&" ).replace( r20, "+" );
	    };
	
	    function buildParams( prefix, obj, traditional, add ) {
	        var name;
	
	        if ( jQuery.isArray( obj ) ) {
	            // Serialize array item.
	            jQuery.each( obj, function( i, v ) {
	                if ( traditional || rbracket.test( prefix ) ) {
	                    // Treat each array item as a scalar.
	                    add( prefix, v );
	
	                } else {
	                    // Item is non-scalar (array or object), encode its numeric index.
	                    buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
	                }
	            });
	
	        } else if ( !traditional && jQuery.type( obj ) === "object" ) {
	            // Serialize object item.
	            for ( name in obj ) {
	                buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
	            }
	
	        } else {
	            // Serialize scalar item.
	            add( prefix, obj );
	        }
	    }
	    jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	    "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {
	
	        // Handle event binding
	        jQuery.fn[ name ] = function( data, fn ) {
	            return arguments.length > 0 ?
	                this.on( name, null, data, fn ) :
	                this.trigger( name );
	        };
	    });
	
	    jQuery.fn.extend({
	        hover: function( fnOver, fnOut ) {
	            return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	        },
	
	        bind: function( types, data, fn ) {
	            return this.on( types, null, data, fn );
	        },
	        unbind: function( types, fn ) {
	            return this.off( types, null, fn );
	        },
	
	        delegate: function( selector, types, data, fn ) {
	            return this.on( types, selector, data, fn );
	        },
	        undelegate: function( selector, types, fn ) {
	            // ( namespace ) or ( selector, types [, fn] )
	            return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	        }
	    });
	    var
	    // Document location
	        ajaxLocParts,
	        ajaxLocation,
	        ajax_nonce = jQuery.now(),
	
	        ajax_rquery = /\?/,
	        rhash = /#.*$/,
	        rts = /([?&])_=[^&]*/,
	        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	    // #7653, #8125, #8152: local protocol detection
	        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	        rnoContent = /^(?:GET|HEAD)$/,
	        rprotocol = /^\/\//,
	        rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
	
	    // Keep a copy of the old load method
	        _load = jQuery.fn.load,
	
	    /* Prefilters
	     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	     * 2) These are called:
	     *    - BEFORE asking for a transport
	     *    - AFTER param serialization (s.data is a string if s.processData is true)
	     * 3) key is the dataType
	     * 4) the catchall symbol "*" can be used
	     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	     */
	        prefilters = {},
	
	    /* Transports bindings
	     * 1) key is the dataType
	     * 2) the catchall symbol "*" can be used
	     * 3) selection will start with transport dataType and THEN go to "*" if needed
	     */
	        transports = {},
	
	    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	        allTypes = "*/".concat("*");
	
	// #8138, IE may throw an exception when accessing
	// a field from window.location if document.domain has been set
	    try {
	        ajaxLocation = location.href;
	    } catch( e ) {
	        // Use the href attribute of an A element
	        // since IE will modify it given document.location
	        ajaxLocation = document.createElement( "a" );
	        ajaxLocation.href = "";
	        ajaxLocation = ajaxLocation.href;
	    }
	
	// Segment location into parts
	    ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];
	
	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	    function addToPrefiltersOrTransports( structure ) {
	
	        // dataTypeExpression is optional and defaults to "*"
	        return function( dataTypeExpression, func ) {
	
	            if ( typeof dataTypeExpression !== "string" ) {
	                func = dataTypeExpression;
	                dataTypeExpression = "*";
	            }
	
	            var dataType,
	                i = 0,
	                dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];
	
	            if ( jQuery.isFunction( func ) ) {
	                // For each dataType in the dataTypeExpression
	                while ( (dataType = dataTypes[i++]) ) {
	                    // Prepend if requested
	                    if ( dataType[0] === "+" ) {
	                        dataType = dataType.slice( 1 ) || "*";
	                        (structure[ dataType ] = structure[ dataType ] || []).unshift( func );
	
	                        // Otherwise append
	                    } else {
	                        (structure[ dataType ] = structure[ dataType ] || []).push( func );
	                    }
	                }
	            }
	        };
	    }
	
	// Base inspection function for prefilters and transports
	    function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
	
	        var inspected = {},
	            seekingTransport = ( structure === transports );
	
	        function inspect( dataType ) {
	            var selected;
	            inspected[ dataType ] = true;
	            jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
	                var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
	                if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
	                    options.dataTypes.unshift( dataTypeOrTransport );
	                    inspect( dataTypeOrTransport );
	                    return false;
	                } else if ( seekingTransport ) {
	                    return !( selected = dataTypeOrTransport );
	                }
	            });
	            return selected;
	        }
	
	        return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	    }
	
	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	    function ajaxExtend( target, src ) {
	        var deep, key,
	            flatOptions = jQuery.ajaxSettings.flatOptions || {};
	
	        for ( key in src ) {
	            if ( src[ key ] !== undefined ) {
	                ( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
	            }
	        }
	        if ( deep ) {
	            jQuery.extend( true, target, deep );
	        }
	
	        return target;
	    }
	
	    jQuery.fn.load = function( url, params, callback ) {
	        if ( typeof url !== "string" && _load ) {
	            return _load.apply( this, arguments );
	        }
	
	        var selector, response, type,
	            self = this,
	            off = url.indexOf(" ");
	
	        if ( off >= 0 ) {
	            selector = url.slice( off, url.length );
	            url = url.slice( 0, off );
	        }
	
	        // If it's a function
	        if ( jQuery.isFunction( params ) ) {
	
	            // We assume that it's the callback
	            callback = params;
	            params = undefined;
	
	            // Otherwise, build a param string
	        } else if ( params && typeof params === "object" ) {
	            type = "POST";
	        }
	
	        // If we have elements to modify, make the request
	        if ( self.length > 0 ) {
	            jQuery.ajax({
	                url: url,
	
	                // if "type" variable is undefined, then "GET" method will be used
	                type: type,
	                dataType: "html",
	                data: params
	            }).done(function( responseText ) {
	
	                // Save response for use in complete callback
	                response = arguments;
	
	                self.html( selector ?
	
	                    // If a selector was specified, locate the right elements in a dummy div
	                    // Exclude scripts to avoid IE 'Permission Denied' errors
	                    jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :
	
	                    // Otherwise use the full result
	                    responseText );
	
	            }).complete( callback && function( jqXHR, status ) {
	                    self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
	                });
	        }
	
	        return this;
	    };
	
	// Attach a bunch of functions for handling common AJAX events
	    jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	        jQuery.fn[ type ] = function( fn ){
	            return this.on( type, fn );
	        };
	    });
	
	    jQuery.extend({
	
	        // Counter for holding the number of active queries
	        active: 0,
	
	        // Last-Modified header cache for next request
	        lastModified: {},
	        etag: {},
	
	        ajaxSettings: {
	            url: ajaxLocation,
	            type: "GET",
	            isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
	            global: true,
	            processData: true,
	            async: true,
	            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
	            /*
	             timeout: 0,
	             data: null,
	             dataType: null,
	             username: null,
	             password: null,
	             cache: null,
	             throws: false,
	             traditional: false,
	             headers: {},
	             */
	
	            accepts: {
	                "*": allTypes,
	                text: "text/plain",
	                html: "text/html",
	                xml: "application/xml, text/xml",
	                json: "application/json, text/javascript"
	            },
	
	            contents: {
	                xml: /xml/,
	                html: /html/,
	                json: /json/
	            },
	
	            responseFields: {
	                xml: "responseXML",
	                text: "responseText",
	                json: "responseJSON"
	            },
	
	            // Data converters
	            // Keys separate source (or catchall "*") and destination types with a single space
	            converters: {
	
	                // Convert anything to text
	                "* text": String,
	
	                // Text to html (true = no transformation)
	                "text html": true,
	
	                // Evaluate text as a json expression
	                "text json": jQuery.parseJSON,
	
	                // Parse text as xml
	                "text xml": jQuery.parseXML
	            },
	
	            // For options that shouldn't be deep extended:
	            // you can add your own custom options here if
	            // and when you create one that shouldn't be
	            // deep extended (see ajaxExtend)
	            flatOptions: {
	                url: true,
	                context: true
	            }
	        },
	
	        // Creates a full fledged settings object into target
	        // with both ajaxSettings and settings fields.
	        // If target is omitted, writes into ajaxSettings.
	        ajaxSetup: function( target, settings ) {
	            return settings ?
	
	                // Building a settings object
	                ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
	
	                // Extending ajaxSettings
	                ajaxExtend( jQuery.ajaxSettings, target );
	        },
	
	        ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	        ajaxTransport: addToPrefiltersOrTransports( transports ),
	
	        // Main method
	        ajax: function( url, options ) {
	
	            // If url is an object, simulate pre-1.5 signature
	            if ( typeof url === "object" ) {
	                options = url;
	                url = undefined;
	            }
	
	            // Force options to be an object
	            options = options || {};
	
	            var // Cross-domain detection vars
	                parts,
	            // Loop variable
	                i,
	            // URL without anti-cache param
	                cacheURL,
	            // Response headers as string
	                responseHeadersString,
	            // timeout handle
	                timeoutTimer,
	
	            // To know if global events are to be dispatched
	                fireGlobals,
	
	                transport,
	            // Response headers
	                responseHeaders,
	            // Create the final options object
	                s = jQuery.ajaxSetup( {}, options ),
	            // Callbacks context
	                callbackContext = s.context || s,
	            // Context for global events is callbackContext if it is a DOM node or jQuery collection
	                globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
	                    jQuery( callbackContext ) :
	                    jQuery.event,
	            // Deferreds
	                deferred = jQuery.Deferred(),
	                completeDeferred = jQuery.Callbacks("once memory"),
	            // Status-dependent callbacks
	                statusCode = s.statusCode || {},
	            // Headers (they are sent all at once)
	                requestHeaders = {},
	                requestHeadersNames = {},
	            // The jqXHR state
	                state = 0,
	            // Default abort message
	                strAbort = "canceled",
	            // Fake xhr
	                jqXHR = {
	                    readyState: 0,
	
	                    // Builds headers hashtable if needed
	                    getResponseHeader: function( key ) {
	                        var match;
	                        if ( state === 2 ) {
	                            if ( !responseHeaders ) {
	                                responseHeaders = {};
	                                while ( (match = rheaders.exec( responseHeadersString )) ) {
	                                    responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
	                                }
	                            }
	                            match = responseHeaders[ key.toLowerCase() ];
	                        }
	                        return match == null ? null : match;
	                    },
	
	                    // Raw string
	                    getAllResponseHeaders: function() {
	                        return state === 2 ? responseHeadersString : null;
	                    },
	
	                    // Caches the header
	                    setRequestHeader: function( name, value ) {
	                        var lname = name.toLowerCase();
	                        if ( !state ) {
	                            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
	                            requestHeaders[ name ] = value;
	                        }
	                        return this;
	                    },
	
	                    // Overrides response content-type header
	                    overrideMimeType: function( type ) {
	                        if ( !state ) {
	                            s.mimeType = type;
	                        }
	                        return this;
	                    },
	
	                    // Status-dependent callbacks
	                    statusCode: function( map ) {
	                        var code;
	                        if ( map ) {
	                            if ( state < 2 ) {
	                                for ( code in map ) {
	                                    // Lazy-add the new callback in a way that preserves old ones
	                                    statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
	                                }
	                            } else {
	                                // Execute the appropriate callbacks
	                                jqXHR.always( map[ jqXHR.status ] );
	                            }
	                        }
	                        return this;
	                    },
	
	                    // Cancel the request
	                    abort: function( statusText ) {
	                        var finalText = statusText || strAbort;
	                        if ( transport ) {
	                            transport.abort( finalText );
	                        }
	                        done( 0, finalText );
	                        return this;
	                    }
	                };
	
	            // Attach deferreds
	            deferred.promise( jqXHR ).complete = completeDeferred.add;
	            jqXHR.success = jqXHR.done;
	            jqXHR.error = jqXHR.fail;
	
	            // Remove hash character (#7531: and string promotion)
	            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
	            // Handle falsy url in the settings object (#10093: consistency with old signature)
	            // We also use the url parameter if available
	            s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );
	
	            // Alias method option to type as per ticket #12004
	            s.type = options.method || options.type || s.method || s.type;
	
	            // Extract dataTypes list
	            s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];
	
	            // A cross-domain request is in order when we have a protocol:host:port mismatch
	            if ( s.crossDomain == null ) {
	                parts = rurl.exec( s.url.toLowerCase() );
	                s.crossDomain = !!( parts &&
	                    ( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
	                    ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
	                    ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
	                );
	            }
	
	            // Convert data if not already a string
	            if ( s.data && s.processData && typeof s.data !== "string" ) {
	                s.data = jQuery.param( s.data, s.traditional );
	            }
	
	            // Apply prefilters
	            inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
	
	            // If request was aborted inside a prefilter, stop there
	            if ( state === 2 ) {
	                return jqXHR;
	            }
	
	            // We can fire global events as of now if asked to
	            fireGlobals = s.global;
	
	            // Watch for a new set of requests
	            if ( fireGlobals && jQuery.active++ === 0 ) {
	                jQuery.event.trigger("ajaxStart");
	            }
	
	            // Uppercase the type
	            s.type = s.type.toUpperCase();
	
	            // Determine if request has content
	            s.hasContent = !rnoContent.test( s.type );
	
	            // Save the URL in case we're toying with the If-Modified-Since
	            // and/or If-None-Match header later on
	            cacheURL = s.url;
	
	            // More options handling for requests with no content
	            if ( !s.hasContent ) {
	
	                // If data is available, append data to url
	                if ( s.data ) {
	                    cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
	                    // #9682: remove data so that it's not used in an eventual retry
	                    delete s.data;
	                }
	
	                // Add anti-cache in url if needed
	                if ( s.cache === false ) {
	                    s.url = rts.test( cacheURL ) ?
	
	                        // If there is already a '_' parameter, set its value
	                        cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :
	
	                        // Otherwise add one to the end
	                    cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
	                }
	            }
	
	            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
	            if ( s.ifModified ) {
	                if ( jQuery.lastModified[ cacheURL ] ) {
	                    jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
	                }
	                if ( jQuery.etag[ cacheURL ] ) {
	                    jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
	                }
	            }
	
	            // Set the correct header, if data is being sent
	            if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
	                jqXHR.setRequestHeader( "Content-Type", s.contentType );
	            }
	
	            // Set the Accepts header for the server, depending on the dataType
	            jqXHR.setRequestHeader(
	                "Accept",
	                s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
	                s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
	                    s.accepts[ "*" ]
	            );
	
	            // Check for headers option
	            for ( i in s.headers ) {
	                jqXHR.setRequestHeader( i, s.headers[ i ] );
	            }
	
	            // Allow custom headers/mimetypes and early abort
	            if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
	                // Abort if not done already and return
	                return jqXHR.abort();
	            }
	
	            // aborting is no longer a cancellation
	            strAbort = "abort";
	
	            // Install callbacks on deferreds
	            for ( i in { success: 1, error: 1, complete: 1 } ) {
	                jqXHR[ i ]( s[ i ] );
	            }
	
	            // Get transport
	            transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
	
	            // If no transport, we auto-abort
	            if ( !transport ) {
	                done( -1, "No Transport" );
	            } else {
	                jqXHR.readyState = 1;
	
	                // Send global event
	                if ( fireGlobals ) {
	                    globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
	                }
	                // Timeout
	                if ( s.async && s.timeout > 0 ) {
	                    timeoutTimer = setTimeout(function() {
	                        jqXHR.abort("timeout");
	                    }, s.timeout );
	                }
	
	                try {
	                    state = 1;
	                    transport.send( requestHeaders, done );
	                } catch ( e ) {
	                    // Propagate exception as error if not done
	                    if ( state < 2 ) {
	                        done( -1, e );
	                        // Simply rethrow otherwise
	                    } else {
	                        throw e;
	                    }
	                }
	            }
	
	            // Callback for when everything is done
	            function done( status, nativeStatusText, responses, headers ) {
	                var isSuccess, success, error, response, modified,
	                    statusText = nativeStatusText;
	
	                // Called once
	                if ( state === 2 ) {
	                    return;
	                }
	
	                // State is "done" now
	                state = 2;
	
	                // Clear timeout if it exists
	                if ( timeoutTimer ) {
	                    clearTimeout( timeoutTimer );
	                }
	
	                // Dereference transport for early garbage collection
	                // (no matter how long the jqXHR object will be used)
	                transport = undefined;
	
	                // Cache response headers
	                responseHeadersString = headers || "";
	
	                // Set readyState
	                jqXHR.readyState = status > 0 ? 4 : 0;
	
	                // Determine if successful
	                isSuccess = status >= 200 && status < 300 || status === 304;
	
	                // Get response data
	                if ( responses ) {
	                    response = ajaxHandleResponses( s, jqXHR, responses );
	                }
	
	                // Convert no matter what (that way responseXXX fields are always set)
	                response = ajaxConvert( s, response, jqXHR, isSuccess );
	
	                // If successful, handle type chaining
	                if ( isSuccess ) {
	
	                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
	                    if ( s.ifModified ) {
	                        modified = jqXHR.getResponseHeader("Last-Modified");
	                        if ( modified ) {
	                            jQuery.lastModified[ cacheURL ] = modified;
	                        }
	                        modified = jqXHR.getResponseHeader("etag");
	                        if ( modified ) {
	                            jQuery.etag[ cacheURL ] = modified;
	                        }
	                    }
	
	                    // if no content
	                    if ( status === 204 || s.type === "HEAD" ) {
	                        statusText = "nocontent";
	
	                        // if not modified
	                    } else if ( status === 304 ) {
	                        statusText = "notmodified";
	
	                        // If we have data, let's convert it
	                    } else {
	                        statusText = response.state;
	                        success = response.data;
	                        error = response.error;
	                        isSuccess = !error;
	                    }
	                } else {
	                    // We extract error from statusText
	                    // then normalize statusText and status for non-aborts
	                    error = statusText;
	                    if ( status || !statusText ) {
	                        statusText = "error";
	                        if ( status < 0 ) {
	                            status = 0;
	                        }
	                    }
	                }
	
	                // Set data for the fake xhr object
	                jqXHR.status = status;
	                jqXHR.statusText = ( nativeStatusText || statusText ) + "";
	
	                // Success/Error
	                if ( isSuccess ) {
	                    deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
	                } else {
	                    deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
	                }
	
	                // Status-dependent callbacks
	                jqXHR.statusCode( statusCode );
	                statusCode = undefined;
	
	                if ( fireGlobals ) {
	                    globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
	                        [ jqXHR, s, isSuccess ? success : error ] );
	                }
	
	                // Complete
	                completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
	
	                if ( fireGlobals ) {
	                    globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
	                    // Handle the global AJAX counter
	                    if ( !( --jQuery.active ) ) {
	                        jQuery.event.trigger("ajaxStop");
	                    }
	                }
	            }
	
	            return jqXHR;
	        },
	
	        getJSON: function( url, data, callback ) {
	            return jQuery.get( url, data, callback, "json" );
	        },
	
	        getScript: function( url, callback ) {
	            return jQuery.get( url, undefined, callback, "script" );
	        }
	    });
	
	    jQuery.each( [ "get", "post" ], function( i, method ) {
	        jQuery[ method ] = function( url, data, callback, type ) {
	            // shift arguments if data argument was omitted
	            if ( jQuery.isFunction( data ) ) {
	                type = type || callback;
	                callback = data;
	                data = undefined;
	            }
	
	            return jQuery.ajax({
	                url: url,
	                type: method,
	                dataType: type,
	                data: data,
	                success: callback
	            });
	        };
	    });
	
	    /* Handles responses to an ajax request:
	     * - finds the right dataType (mediates between content-type and expected dataType)
	     * - returns the corresponding response
	     */
	    function ajaxHandleResponses( s, jqXHR, responses ) {
	        var firstDataType, ct, finalDataType, type,
	            contents = s.contents,
	            dataTypes = s.dataTypes;
	
	        // Remove auto dataType and get content-type in the process
	        while( dataTypes[ 0 ] === "*" ) {
	            dataTypes.shift();
	            if ( ct === undefined ) {
	                ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
	            }
	        }
	
	        // Check if we're dealing with a known content-type
	        if ( ct ) {
	            for ( type in contents ) {
	                if ( contents[ type ] && contents[ type ].test( ct ) ) {
	                    dataTypes.unshift( type );
	                    break;
	                }
	            }
	        }
	
	        // Check to see if we have a response for the expected dataType
	        if ( dataTypes[ 0 ] in responses ) {
	            finalDataType = dataTypes[ 0 ];
	        } else {
	            // Try convertible dataTypes
	            for ( type in responses ) {
	                if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
	                    finalDataType = type;
	                    break;
	                }
	                if ( !firstDataType ) {
	                    firstDataType = type;
	                }
	            }
	            // Or just use first one
	            finalDataType = finalDataType || firstDataType;
	        }
	
	        // If we found a dataType
	        // We add the dataType to the list if needed
	        // and return the corresponding response
	        if ( finalDataType ) {
	            if ( finalDataType !== dataTypes[ 0 ] ) {
	                dataTypes.unshift( finalDataType );
	            }
	            return responses[ finalDataType ];
	        }
	    }
	
	    /* Chain conversions given the request and the original response
	     * Also sets the responseXXX fields on the jqXHR instance
	     */
	    function ajaxConvert( s, response, jqXHR, isSuccess ) {
	        var conv2, current, conv, tmp, prev,
	            converters = {},
	        // Work with a copy of dataTypes in case we need to modify it for conversion
	            dataTypes = s.dataTypes.slice();
	
	        // Create converters map with lowercased keys
	        if ( dataTypes[ 1 ] ) {
	            for ( conv in s.converters ) {
	                converters[ conv.toLowerCase() ] = s.converters[ conv ];
	            }
	        }
	
	        current = dataTypes.shift();
	
	        // Convert to each sequential dataType
	        while ( current ) {
	
	            if ( s.responseFields[ current ] ) {
	                jqXHR[ s.responseFields[ current ] ] = response;
	            }
	
	            // Apply the dataFilter if provided
	            if ( !prev && isSuccess && s.dataFilter ) {
	                response = s.dataFilter( response, s.dataType );
	            }
	
	            prev = current;
	            current = dataTypes.shift();
	
	            if ( current ) {
	
	                // There's only work to do if current dataType is non-auto
	                if ( current === "*" ) {
	
	                    current = prev;
	
	                    // Convert response if prev dataType is non-auto and differs from current
	                } else if ( prev !== "*" && prev !== current ) {
	
	                    // Seek a direct converter
	                    conv = converters[ prev + " " + current ] || converters[ "* " + current ];
	
	                    // If none found, seek a pair
	                    if ( !conv ) {
	                        for ( conv2 in converters ) {
	
	                            // If conv2 outputs current
	                            tmp = conv2.split( " " );
	                            if ( tmp[ 1 ] === current ) {
	
	                                // If prev can be converted to accepted input
	                                conv = converters[ prev + " " + tmp[ 0 ] ] ||
	                                    converters[ "* " + tmp[ 0 ] ];
	                                if ( conv ) {
	                                    // Condense equivalence converters
	                                    if ( conv === true ) {
	                                        conv = converters[ conv2 ];
	
	                                        // Otherwise, insert the intermediate dataType
	                                    } else if ( converters[ conv2 ] !== true ) {
	                                        current = tmp[ 0 ];
	                                        dataTypes.unshift( tmp[ 1 ] );
	                                    }
	                                    break;
	                                }
	                            }
	                        }
	                    }
	
	                    // Apply converter (if not an equivalence)
	                    if ( conv !== true ) {
	
	                        // Unless errors are allowed to bubble, catch and return them
	                        if ( conv && s[ "throws" ] ) {
	                            response = conv( response );
	                        } else {
	                            try {
	                                response = conv( response );
	                            } catch ( e ) {
	                                return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
	                            }
	                        }
	                    }
	                }
	            }
	        }
	
	        return { state: "success", data: response };
	    }
	// Install script dataType
	    jQuery.ajaxSetup({
	        accepts: {
	            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	        },
	        contents: {
	            script: /(?:java|ecma)script/
	        },
	        converters: {
	            "text script": function( text ) {
	                jQuery.globalEval( text );
	                return text;
	            }
	        }
	    });
	
	// Handle cache's special case and global
	    jQuery.ajaxPrefilter( "script", function( s ) {
	        if ( s.cache === undefined ) {
	            s.cache = false;
	        }
	        if ( s.crossDomain ) {
	            s.type = "GET";
	            s.global = false;
	        }
	    });
	
	// Bind script tag hack transport
	    jQuery.ajaxTransport( "script", function(s) {
	
	        // This transport only deals with cross domain requests
	        if ( s.crossDomain ) {
	
	            var script,
	                head = document.head || jQuery("head")[0] || document.documentElement;
	
	            return {
	
	                send: function( _, callback ) {
	
	                    script = document.createElement("script");
	
	                    script.async = true;
	
	                    if ( s.scriptCharset ) {
	                        script.charset = s.scriptCharset;
	                    }
	
	                    script.src = s.url;
	
	                    // Attach handlers for all browsers
	                    script.onload = script.onreadystatechange = function( _, isAbort ) {
	
	                        if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {
	
	                            // Handle memory leak in IE
	                            script.onload = script.onreadystatechange = null;
	
	                            // Remove the script
	                            if ( script.parentNode ) {
	                                script.parentNode.removeChild( script );
	                            }
	
	                            // Dereference the script
	                            script = null;
	
	                            // Callback if not abort
	                            if ( !isAbort ) {
	                                callback( 200, "success" );
	                            }
	                        }
	                    };
	
	                    // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
	                    // Use native DOM manipulation to avoid our domManip AJAX trickery
	                    head.insertBefore( script, head.firstChild );
	                },
	
	                abort: function() {
	                    if ( script ) {
	                        script.onload( undefined, true );
	                    }
	                }
	            };
	        }
	    });
	    var oldCallbacks = [],
	        rjsonp = /(=)\?(?=&|$)|\?\?/;
	
	// Default jsonp settings
	    jQuery.ajaxSetup({
	        jsonp: "callback",
	        jsonpCallback: function() {
	            var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
	            this[ callback ] = true;
	            return callback;
	        }
	    });
	
	// Detect, normalize options and install callbacks for jsonp requests
	    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
	
	        var callbackName, overwritten, responseContainer,
	            jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
	                        "url" :
	                    typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
	                );
	
	        // Handle iff the expected data type is "jsonp" or we have a parameter to set
	        if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
	
	            // Get callback name, remembering preexisting value associated with it
	            callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
	                s.jsonpCallback() :
	                s.jsonpCallback;
	
	            // Insert callback into url or form data
	            if ( jsonProp ) {
	                s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
	            } else if ( s.jsonp !== false ) {
	                s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
	            }
	
	            // Use data converter to retrieve json after script execution
	            s.converters["script json"] = function() {
	                if ( !responseContainer ) {
	                    jQuery.error( callbackName + " was not called" );
	                }
	                return responseContainer[ 0 ];
	            };
	
	            // force json dataType
	            s.dataTypes[ 0 ] = "json";
	
	            // Install callback
	            overwritten = window[ callbackName ];
	            window[ callbackName ] = function() {
	                responseContainer = arguments;
	            };
	
	            // Clean-up function (fires after converters)
	            jqXHR.always(function() {
	                // Restore preexisting value
	                window[ callbackName ] = overwritten;
	
	                // Save back as free
	                if ( s[ callbackName ] ) {
	                    // make sure that re-using the options doesn't screw things around
	                    s.jsonpCallback = originalSettings.jsonpCallback;
	
	                    // save the callback name for future use
	                    oldCallbacks.push( callbackName );
	                }
	
	                // Call if it was a function and we have a response
	                if ( responseContainer && jQuery.isFunction( overwritten ) ) {
	                    overwritten( responseContainer[ 0 ] );
	                }
	
	                responseContainer = overwritten = undefined;
	            });
	
	            // Delegate to script
	            return "script";
	        }
	    });
	    var xhrCallbacks, xhrSupported,
	        xhrId = 0,
	    // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	        xhrOnUnloadAbort = window.ActiveXObject && function() {
	                // Abort all pending requests
	                var key;
	                for ( key in xhrCallbacks ) {
	                    xhrCallbacks[ key ]( undefined, true );
	                }
	            };
	
	// Functions to create xhrs
	    function createStandardXHR() {
	        try {
	            return new window.XMLHttpRequest();
	        } catch( e ) {}
	    }
	
	    function createActiveXHR() {
	        try {
	            return new window.ActiveXObject("Microsoft.XMLHTTP");
	        } catch( e ) {}
	    }
	
	// Create the request object
	// (This is still attached to ajaxSettings for backward compatibility)
	    jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	        /* Microsoft failed to properly
	         * implement the XMLHttpRequest in IE7 (can't request local files),
	         * so we use the ActiveXObject when it is available
	         * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	         * we need a fallback.
	         */
	        function() {
	            return !this.isLocal && createStandardXHR() || createActiveXHR();
	        } :
	        // For all other browsers, use the standard XMLHttpRequest object
	        createStandardXHR;
	
	// Determine support properties
	    xhrSupported = jQuery.ajaxSettings.xhr();
	    jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	    xhrSupported = jQuery.support.ajax = !!xhrSupported;
	
	// Create transport if the browser can provide an xhr
	    if ( xhrSupported ) {
	
	        jQuery.ajaxTransport(function( s ) {
	            // Cross domain only allowed if supported through XMLHttpRequest
	            if ( !s.crossDomain || jQuery.support.cors ) {
	
	                var callback;
	
	                return {
	                    send: function( headers, complete ) {
	
	                        // Get a new xhr
	                        var handle, i,
	                            xhr = s.xhr();
	
	                        // Open the socket
	                        // Passing null username, generates a login popup on Opera (#2865)
	                        if ( s.username ) {
	                            xhr.open( s.type, s.url, s.async, s.username, s.password );
	                        } else {
	                            xhr.open( s.type, s.url, s.async );
	                        }
	
	                        // Apply custom fields if provided
	                        if ( s.xhrFields ) {
	                            for ( i in s.xhrFields ) {
	                                xhr[ i ] = s.xhrFields[ i ];
	                            }
	                        }
	
	                        // Override mime type if needed
	                        if ( s.mimeType && xhr.overrideMimeType ) {
	                            xhr.overrideMimeType( s.mimeType );
	                        }
	
	                        // X-Requested-With header
	                        // For cross-domain requests, seeing as conditions for a preflight are
	                        // akin to a jigsaw puzzle, we simply never set it to be sure.
	                        // (it can always be set on a per-request basis or even using ajaxSetup)
	                        // For same-domain requests, won't change header if already provided.
	                        if ( !s.crossDomain && !headers["X-Requested-With"] ) {
	                            headers["X-Requested-With"] = "XMLHttpRequest";
	                        }
	
	                        // Need an extra try/catch for cross domain requests in Firefox 3
	                        try {
	                            for ( i in headers ) {
	                                xhr.setRequestHeader( i, headers[ i ] );
	                            }
	                        } catch( err ) {}
	
	                        // Do send the request
	                        // This may raise an exception which is actually
	                        // handled in jQuery.ajax (so no try/catch here)
	                        xhr.send( ( s.hasContent && s.data ) || null );
	
	                        // Listener
	                        callback = function( _, isAbort ) {
	                            var status, responseHeaders, statusText, responses;
	
	                            // Firefox throws exceptions when accessing properties
	                            // of an xhr when a network error occurred
	                            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
	                            try {
	
	                                // Was never called and is aborted or complete
	                                if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
	
	                                    // Only called once
	                                    callback = undefined;
	
	                                    // Do not keep as active anymore
	                                    if ( handle ) {
	                                        xhr.onreadystatechange = jQuery.noop;
	                                        if ( xhrOnUnloadAbort ) {
	                                            delete xhrCallbacks[ handle ];
	                                        }
	                                    }
	
	                                    // If it's an abort
	                                    if ( isAbort ) {
	                                        // Abort it manually if needed
	                                        if ( xhr.readyState !== 4 ) {
	                                            xhr.abort();
	                                        }
	                                    } else {
	                                        responses = {};
	                                        status = xhr.status;
	                                        responseHeaders = xhr.getAllResponseHeaders();
	
	                                        // When requesting binary data, IE6-9 will throw an exception
	                                        // on any attempt to access responseText (#11426)
	                                        if ( typeof xhr.responseText === "string" ) {
	                                            responses.text = xhr.responseText;
	                                        }
	
	                                        // Firefox throws an exception when accessing
	                                        // statusText for faulty cross-domain requests
	                                        try {
	                                            statusText = xhr.statusText;
	                                        } catch( e ) {
	                                            // We normalize with Webkit giving an empty statusText
	                                            statusText = "";
	                                        }
	
	                                        // Filter status for non standard behaviors
	
	                                        // If the request is local and we have data: assume a success
	                                        // (success with no data won't get notified, that's the best we
	                                        // can do given current implementations)
	                                        if ( !status && s.isLocal && !s.crossDomain ) {
	                                            status = responses.text ? 200 : 404;
	                                            // IE - #1450: sometimes returns 1223 when it should be 204
	                                        } else if ( status === 1223 ) {
	                                            status = 204;
	                                        }
	                                    }
	                                }
	                            } catch( firefoxAccessException ) {
	                                if ( !isAbort ) {
	                                    complete( -1, firefoxAccessException );
	                                }
	                            }
	
	                            // Call complete if needed
	                            if ( responses ) {
	                                complete( status, statusText, responses, responseHeaders );
	                            }
	                        };
	
	                        if ( !s.async ) {
	                            // if we're in sync mode we fire the callback
	                            callback();
	                        } else if ( xhr.readyState === 4 ) {
	                            // (IE6 & IE7) if it's in cache and has been
	                            // retrieved directly we need to fire the callback
	                            setTimeout( callback );
	                        } else {
	                            handle = ++xhrId;
	                            if ( xhrOnUnloadAbort ) {
	                                // Create the active xhrs callbacks list if needed
	                                // and attach the unload handler
	                                if ( !xhrCallbacks ) {
	                                    xhrCallbacks = {};
	                                    jQuery( window ).unload( xhrOnUnloadAbort );
	                                }
	                                // Add to list of active xhrs callbacks
	                                xhrCallbacks[ handle ] = callback;
	                            }
	                            xhr.onreadystatechange = callback;
	                        }
	                    },
	
	                    abort: function() {
	                        if ( callback ) {
	                            callback( undefined, true );
	                        }
	                    }
	                };
	            }
	        });
	    }
	    var fxNow, timerId,
	        rfxtypes = /^(?:toggle|show|hide)$/,
	        rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	        rrun = /queueHooks$/,
	        animationPrefilters = [ defaultPrefilter ],
	        tweeners = {
	            "*": [function( prop, value ) {
	                var tween = this.createTween( prop, value ),
	                    target = tween.cur(),
	                    parts = rfxnum.exec( value ),
	                    unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
	
	                // Starting value computation is required for potential unit mismatches
	                    start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
	                        rfxnum.exec( jQuery.css( tween.elem, prop ) ),
	                    scale = 1,
	                    maxIterations = 20;
	
	                if ( start && start[ 3 ] !== unit ) {
	                    // Trust units reported by jQuery.css
	                    unit = unit || start[ 3 ];
	
	                    // Make sure we update the tween properties later on
	                    parts = parts || [];
	
	                    // Iteratively approximate from a nonzero starting point
	                    start = +target || 1;
	
	                    do {
	                        // If previous iteration zeroed out, double until we get *something*
	                        // Use a string for doubling factor so we don't accidentally see scale as unchanged below
	                        scale = scale || ".5";
	
	                        // Adjust and apply
	                        start = start / scale;
	                        jQuery.style( tween.elem, prop, start + unit );
	
	                        // Update scale, tolerating zero or NaN from tween.cur()
	                        // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
	                    } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
	                }
	
	                // Update tween properties
	                if ( parts ) {
	                    start = tween.start = +start || +target || 0;
	                    tween.unit = unit;
	                    // If a +=/-= token was provided, we're doing a relative animation
	                    tween.end = parts[ 1 ] ?
	                    start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
	                        +parts[ 2 ];
	                }
	
	                return tween;
	            }]
	        };
	
	// Animations created synchronously will run synchronously
	    function createFxNow() {
	        setTimeout(function() {
	            fxNow = undefined;
	        });
	        return ( fxNow = jQuery.now() );
	    }
	
	    function createTween( value, prop, animation ) {
	        var tween,
	            collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
	            index = 0,
	            length = collection.length;
	        for ( ; index < length; index++ ) {
	            if ( (tween = collection[ index ].call( animation, prop, value )) ) {
	
	                // we're done with this property
	                return tween;
	            }
	        }
	    }
	
	    function Animation( elem, properties, options ) {
	        var result,
	            stopped,
	            index = 0,
	            length = animationPrefilters.length,
	            deferred = jQuery.Deferred().always( function() {
	                // don't match elem in the :animated selector
	                delete tick.elem;
	            }),
	            tick = function() {
	                if ( stopped ) {
	                    return false;
	                }
	                var currentTime = fxNow || createFxNow(),
	                    remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
	                // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
	                    temp = remaining / animation.duration || 0,
	                    percent = 1 - temp,
	                    index = 0,
	                    length = animation.tweens.length;
	
	                for ( ; index < length ; index++ ) {
	                    animation.tweens[ index ].run( percent );
	                }
	
	                deferred.notifyWith( elem, [ animation, percent, remaining ]);
	
	                if ( percent < 1 && length ) {
	                    return remaining;
	                } else {
	                    deferred.resolveWith( elem, [ animation ] );
	                    return false;
	                }
	            },
	            animation = deferred.promise({
	                elem: elem,
	                props: jQuery.extend( {}, properties ),
	                opts: jQuery.extend( true, { specialEasing: {} }, options ),
	                originalProperties: properties,
	                originalOptions: options,
	                startTime: fxNow || createFxNow(),
	                duration: options.duration,
	                tweens: [],
	                createTween: function( prop, end ) {
	                    var tween = jQuery.Tween( elem, animation.opts, prop, end,
	                        animation.opts.specialEasing[ prop ] || animation.opts.easing );
	                    animation.tweens.push( tween );
	                    return tween;
	                },
	                stop: function( gotoEnd ) {
	                    var index = 0,
	                    // if we are going to the end, we want to run all the tweens
	                    // otherwise we skip this part
	                        length = gotoEnd ? animation.tweens.length : 0;
	                    if ( stopped ) {
	                        return this;
	                    }
	                    stopped = true;
	                    for ( ; index < length ; index++ ) {
	                        animation.tweens[ index ].run( 1 );
	                    }
	
	                    // resolve when we played the last frame
	                    // otherwise, reject
	                    if ( gotoEnd ) {
	                        deferred.resolveWith( elem, [ animation, gotoEnd ] );
	                    } else {
	                        deferred.rejectWith( elem, [ animation, gotoEnd ] );
	                    }
	                    return this;
	                }
	            }),
	            props = animation.props;
	
	        propFilter( props, animation.opts.specialEasing );
	
	        for ( ; index < length ; index++ ) {
	            result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
	            if ( result ) {
	                return result;
	            }
	        }
	
	        jQuery.map( props, createTween, animation );
	
	        if ( jQuery.isFunction( animation.opts.start ) ) {
	            animation.opts.start.call( elem, animation );
	        }
	
	        jQuery.fx.timer(
	            jQuery.extend( tick, {
	                elem: elem,
	                anim: animation,
	                queue: animation.opts.queue
	            })
	        );
	
	        // attach callbacks from options
	        return animation.progress( animation.opts.progress )
	            .done( animation.opts.done, animation.opts.complete )
	            .fail( animation.opts.fail )
	            .always( animation.opts.always );
	    }
	
	    function propFilter( props, specialEasing ) {
	        var index, name, easing, value, hooks;
	
	        // camelCase, specialEasing and expand cssHook pass
	        for ( index in props ) {
	            name = jQuery.camelCase( index );
	            easing = specialEasing[ name ];
	            value = props[ index ];
	            if ( jQuery.isArray( value ) ) {
	                easing = value[ 1 ];
	                value = props[ index ] = value[ 0 ];
	            }
	
	            if ( index !== name ) {
	                props[ name ] = value;
	                delete props[ index ];
	            }
	
	            hooks = jQuery.cssHooks[ name ];
	            if ( hooks && "expand" in hooks ) {
	                value = hooks.expand( value );
	                delete props[ name ];
	
	                // not quite $.extend, this wont overwrite keys already present.
	                // also - reusing 'index' from above because we have the correct "name"
	                for ( index in value ) {
	                    if ( !( index in props ) ) {
	                        props[ index ] = value[ index ];
	                        specialEasing[ index ] = easing;
	                    }
	                }
	            } else {
	                specialEasing[ name ] = easing;
	            }
	        }
	    }
	
	    jQuery.Animation = jQuery.extend( Animation, {
	
	        tweener: function( props, callback ) {
	            if ( jQuery.isFunction( props ) ) {
	                callback = props;
	                props = [ "*" ];
	            } else {
	                props = props.split(" ");
	            }
	
	            var prop,
	                index = 0,
	                length = props.length;
	
	            for ( ; index < length ; index++ ) {
	                prop = props[ index ];
	                tweeners[ prop ] = tweeners[ prop ] || [];
	                tweeners[ prop ].unshift( callback );
	            }
	        },
	
	        prefilter: function( callback, prepend ) {
	            if ( prepend ) {
	                animationPrefilters.unshift( callback );
	            } else {
	                animationPrefilters.push( callback );
	            }
	        }
	    });
	
	    function defaultPrefilter( elem, props, opts ) {
	        /* jshint validthis: true */
	        var prop, value, toggle, tween, hooks, oldfire,
	            anim = this,
	            orig = {},
	            style = elem.style,
	            hidden = elem.nodeType && isHidden( elem ),
	            dataShow = jQuery._data( elem, "fxshow" );
	
	        // handle queue: false promises
	        if ( !opts.queue ) {
	            hooks = jQuery._queueHooks( elem, "fx" );
	            if ( hooks.unqueued == null ) {
	                hooks.unqueued = 0;
	                oldfire = hooks.empty.fire;
	                hooks.empty.fire = function() {
	                    if ( !hooks.unqueued ) {
	                        oldfire();
	                    }
	                };
	            }
	            hooks.unqueued++;
	
	            anim.always(function() {
	                // doing this makes sure that the complete handler will be called
	                // before this completes
	                anim.always(function() {
	                    hooks.unqueued--;
	                    if ( !jQuery.queue( elem, "fx" ).length ) {
	                        hooks.empty.fire();
	                    }
	                });
	            });
	        }
	
	        // height/width overflow pass
	        if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
	            // Make sure that nothing sneaks out
	            // Record all 3 overflow attributes because IE does not
	            // change the overflow attribute when overflowX and
	            // overflowY are set to the same value
	            opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
	
	            // Set display property to inline-block for height/width
	            // animations on inline elements that are having width/height animated
	            if ( jQuery.css( elem, "display" ) === "inline" &&
	                jQuery.css( elem, "float" ) === "none" ) {
	
	                // inline-level elements accept inline-block;
	                // block-level elements need to be inline with layout
	                if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
	                    style.display = "inline-block";
	
	                } else {
	                    style.zoom = 1;
	                }
	            }
	        }
	
	        if ( opts.overflow ) {
	            style.overflow = "hidden";
	            if ( !jQuery.support.shrinkWrapBlocks ) {
	                anim.always(function() {
	                    style.overflow = opts.overflow[ 0 ];
	                    style.overflowX = opts.overflow[ 1 ];
	                    style.overflowY = opts.overflow[ 2 ];
	                });
	            }
	        }
	
	
	        // show/hide pass
	        for ( prop in props ) {
	            value = props[ prop ];
	            if ( rfxtypes.exec( value ) ) {
	                delete props[ prop ];
	                toggle = toggle || value === "toggle";
	                if ( value === ( hidden ? "hide" : "show" ) ) {
	                    continue;
	                }
	                orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
	            }
	        }
	
	        if ( !jQuery.isEmptyObject( orig ) ) {
	            if ( dataShow ) {
	                if ( "hidden" in dataShow ) {
	                    hidden = dataShow.hidden;
	                }
	            } else {
	                dataShow = jQuery._data( elem, "fxshow", {} );
	            }
	
	            // store state if its toggle - enables .stop().toggle() to "reverse"
	            if ( toggle ) {
	                dataShow.hidden = !hidden;
	            }
	            if ( hidden ) {
	                jQuery( elem ).show();
	            } else {
	                anim.done(function() {
	                    jQuery( elem ).hide();
	                });
	            }
	            anim.done(function() {
	                var prop;
	                jQuery._removeData( elem, "fxshow" );
	                for ( prop in orig ) {
	                    jQuery.style( elem, prop, orig[ prop ] );
	                }
	            });
	            for ( prop in orig ) {
	                tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
	
	                if ( !( prop in dataShow ) ) {
	                    dataShow[ prop ] = tween.start;
	                    if ( hidden ) {
	                        tween.end = tween.start;
	                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
	                    }
	                }
	            }
	        }
	    }
	
	    function Tween( elem, options, prop, end, easing ) {
	        return new Tween.prototype.init( elem, options, prop, end, easing );
	    }
	    jQuery.Tween = Tween;
	
	    Tween.prototype = {
	        constructor: Tween,
	        init: function( elem, options, prop, end, easing, unit ) {
	            this.elem = elem;
	            this.prop = prop;
	            this.easing = easing || "swing";
	            this.options = options;
	            this.start = this.now = this.cur();
	            this.end = end;
	            this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	        },
	        cur: function() {
	            var hooks = Tween.propHooks[ this.prop ];
	
	            return hooks && hooks.get ?
	                hooks.get( this ) :
	                Tween.propHooks._default.get( this );
	        },
	        run: function( percent ) {
	            var eased,
	                hooks = Tween.propHooks[ this.prop ];
	
	            if ( this.options.duration ) {
	                this.pos = eased = jQuery.easing[ this.easing ](
	                    percent, this.options.duration * percent, 0, 1, this.options.duration
	                );
	            } else {
	                this.pos = eased = percent;
	            }
	            this.now = ( this.end - this.start ) * eased + this.start;
	
	            if ( this.options.step ) {
	                this.options.step.call( this.elem, this.now, this );
	            }
	
	            if ( hooks && hooks.set ) {
	                hooks.set( this );
	            } else {
	                Tween.propHooks._default.set( this );
	            }
	            return this;
	        }
	    };
	
	    Tween.prototype.init.prototype = Tween.prototype;
	
	    Tween.propHooks = {
	        _default: {
	            get: function( tween ) {
	                var result;
	
	                if ( tween.elem[ tween.prop ] != null &&
	                    (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
	                    return tween.elem[ tween.prop ];
	                }
	
	                // passing an empty string as a 3rd parameter to .css will automatically
	                // attempt a parseFloat and fallback to a string if the parse fails
	                // so, simple values such as "10px" are parsed to Float.
	                // complex values such as "rotate(1rad)" are returned as is.
	                result = jQuery.css( tween.elem, tween.prop, "" );
	                // Empty strings, null, undefined and "auto" are converted to 0.
	                return !result || result === "auto" ? 0 : result;
	            },
	            set: function( tween ) {
	                // use step hook for back compat - use cssHook if its there - use .style if its
	                // available and use plain properties where available
	                if ( jQuery.fx.step[ tween.prop ] ) {
	                    jQuery.fx.step[ tween.prop ]( tween );
	                } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
	                    jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
	                } else {
	                    tween.elem[ tween.prop ] = tween.now;
	                }
	            }
	        }
	    };
	
	// Support: IE <=9
	// Panic based approach to setting things on disconnected nodes
	
	    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	        set: function( tween ) {
	            if ( tween.elem.nodeType && tween.elem.parentNode ) {
	                tween.elem[ tween.prop ] = tween.now;
	            }
	        }
	    };
	
	    jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	        var cssFn = jQuery.fn[ name ];
	        jQuery.fn[ name ] = function( speed, easing, callback ) {
	            return speed == null || typeof speed === "boolean" ?
	                cssFn.apply( this, arguments ) :
	                this.animate( genFx( name, true ), speed, easing, callback );
	        };
	    });
	
	    jQuery.fn.extend({
	        fadeTo: function( speed, to, easing, callback ) {
	
	            // show any hidden elements after setting opacity to 0
	            return this.filter( isHidden ).css( "opacity", 0 ).show()
	
	                // animate to the value specified
	                .end().animate({ opacity: to }, speed, easing, callback );
	        },
	        animate: function( prop, speed, easing, callback ) {
	            var empty = jQuery.isEmptyObject( prop ),
	                optall = jQuery.speed( speed, easing, callback ),
	                doAnimation = function() {
	                    // Operate on a copy of prop so per-property easing won't be lost
	                    var anim = Animation( this, jQuery.extend( {}, prop ), optall );
	
	                    // Empty animations, or finishing resolves immediately
	                    if ( empty || jQuery._data( this, "finish" ) ) {
	                        anim.stop( true );
	                    }
	                };
	            doAnimation.finish = doAnimation;
	
	            return empty || optall.queue === false ?
	                this.each( doAnimation ) :
	                this.queue( optall.queue, doAnimation );
	        },
	        stop: function( type, clearQueue, gotoEnd ) {
	            var stopQueue = function( hooks ) {
	                var stop = hooks.stop;
	                delete hooks.stop;
	                stop( gotoEnd );
	            };
	
	            if ( typeof type !== "string" ) {
	                gotoEnd = clearQueue;
	                clearQueue = type;
	                type = undefined;
	            }
	            if ( clearQueue && type !== false ) {
	                this.queue( type || "fx", [] );
	            }
	
	            return this.each(function() {
	                var dequeue = true,
	                    index = type != null && type + "queueHooks",
	                    timers = jQuery.timers,
	                    data = jQuery._data( this );
	
	                if ( index ) {
	                    if ( data[ index ] && data[ index ].stop ) {
	                        stopQueue( data[ index ] );
	                    }
	                } else {
	                    for ( index in data ) {
	                        if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
	                            stopQueue( data[ index ] );
	                        }
	                    }
	                }
	
	                for ( index = timers.length; index--; ) {
	                    if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
	                        timers[ index ].anim.stop( gotoEnd );
	                        dequeue = false;
	                        timers.splice( index, 1 );
	                    }
	                }
	
	                // start the next in the queue if the last step wasn't forced
	                // timers currently will call their complete callbacks, which will dequeue
	                // but only if they were gotoEnd
	                if ( dequeue || !gotoEnd ) {
	                    jQuery.dequeue( this, type );
	                }
	            });
	        },
	        finish: function( type ) {
	            if ( type !== false ) {
	                type = type || "fx";
	            }
	            return this.each(function() {
	                var index,
	                    data = jQuery._data( this ),
	                    queue = data[ type + "queue" ],
	                    hooks = data[ type + "queueHooks" ],
	                    timers = jQuery.timers,
	                    length = queue ? queue.length : 0;
	
	                // enable finishing flag on private data
	                data.finish = true;
	
	                // empty the queue first
	                jQuery.queue( this, type, [] );
	
	                if ( hooks && hooks.stop ) {
	                    hooks.stop.call( this, true );
	                }
	
	                // look for any active animations, and finish them
	                for ( index = timers.length; index--; ) {
	                    if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
	                        timers[ index ].anim.stop( true );
	                        timers.splice( index, 1 );
	                    }
	                }
	
	                // look for any animations in the old queue and finish them
	                for ( index = 0; index < length; index++ ) {
	                    if ( queue[ index ] && queue[ index ].finish ) {
	                        queue[ index ].finish.call( this );
	                    }
	                }
	
	                // turn off finishing flag
	                delete data.finish;
	            });
	        }
	    });
	
	// Generate parameters to create a standard animation
	    function genFx( type, includeWidth ) {
	        var which,
	            attrs = { height: type },
	            i = 0;
	
	        // if we include width, step value is 1 to do all cssExpand values,
	        // if we don't include width, step value is 2 to skip over Left and Right
	        includeWidth = includeWidth? 1 : 0;
	        for( ; i < 4 ; i += 2 - includeWidth ) {
	            which = cssExpand[ i ];
	            attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	        }
	
	        if ( includeWidth ) {
	            attrs.opacity = attrs.width = type;
	        }
	
	        return attrs;
	    }
	
	// Generate shortcuts for custom animations
	    jQuery.each({
	        slideDown: genFx("show"),
	        slideUp: genFx("hide"),
	        slideToggle: genFx("toggle"),
	        fadeIn: { opacity: "show" },
	        fadeOut: { opacity: "hide" },
	        fadeToggle: { opacity: "toggle" }
	    }, function( name, props ) {
	        jQuery.fn[ name ] = function( speed, easing, callback ) {
	            return this.animate( props, speed, easing, callback );
	        };
	    });
	
	    jQuery.speed = function( speed, easing, fn ) {
	        var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
	            complete: fn || !fn && easing ||
	            jQuery.isFunction( speed ) && speed,
	            duration: speed,
	            easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	        };
	
	        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
	            opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;
	
	        // normalize opt.queue - true/undefined/null -> "fx"
	        if ( opt.queue == null || opt.queue === true ) {
	            opt.queue = "fx";
	        }
	
	        // Queueing
	        opt.old = opt.complete;
	
	        opt.complete = function() {
	            if ( jQuery.isFunction( opt.old ) ) {
	                opt.old.call( this );
	            }
	
	            if ( opt.queue ) {
	                jQuery.dequeue( this, opt.queue );
	            }
	        };
	
	        return opt;
	    };
	
	    jQuery.easing = {
	        linear: function( p ) {
	            return p;
	        },
	        swing: function( p ) {
	            return 0.5 - Math.cos( p*Math.PI ) / 2;
	        }
	    };
	
	    jQuery.timers = [];
	    jQuery.fx = Tween.prototype.init;
	    jQuery.fx.tick = function() {
	        var timer,
	            timers = jQuery.timers,
	            i = 0;
	
	        fxNow = jQuery.now();
	
	        for ( ; i < timers.length; i++ ) {
	            timer = timers[ i ];
	            // Checks the timer has not already been removed
	            if ( !timer() && timers[ i ] === timer ) {
	                timers.splice( i--, 1 );
	            }
	        }
	
	        if ( !timers.length ) {
	            jQuery.fx.stop();
	        }
	        fxNow = undefined;
	    };
	
	    jQuery.fx.timer = function( timer ) {
	        if ( timer() && jQuery.timers.push( timer ) ) {
	            jQuery.fx.start();
	        }
	    };
	
	    jQuery.fx.interval = 13;
	
	    jQuery.fx.start = function() {
	        if ( !timerId ) {
	            timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	        }
	    };
	
	    jQuery.fx.stop = function() {
	        clearInterval( timerId );
	        timerId = null;
	    };
	
	    jQuery.fx.speeds = {
	        slow: 600,
	        fast: 200,
	        // Default speed
	        _default: 400
	    };
	
	// Back Compat <1.8 extension point
	    jQuery.fx.step = {};
	
	    if ( jQuery.expr && jQuery.expr.filters ) {
	        jQuery.expr.filters.animated = function( elem ) {
	            return jQuery.grep(jQuery.timers, function( fn ) {
	                return elem === fn.elem;
	            }).length;
	        };
	    }
	    jQuery.fn.offset = function( options ) {
	        if ( arguments.length ) {
	            return options === undefined ?
	                this :
	                this.each(function( i ) {
	                    jQuery.offset.setOffset( this, options, i );
	                });
	        }
	
	        var docElem, win,
	            box = { top: 0, left: 0 },
	            elem = this[ 0 ],
	            doc = elem && elem.ownerDocument;
	
	        if ( !doc ) {
	            return;
	        }
	
	        docElem = doc.documentElement;
	
	        // Make sure it's not a disconnected DOM node
	        if ( !jQuery.contains( docElem, elem ) ) {
	            return box;
	        }
	
	        // If we don't have gBCR, just use 0,0 rather than error
	        // BlackBerry 5, iOS 3 (original iPhone)
	        if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
	            box = elem.getBoundingClientRect();
	        }
	        win = getWindow( doc );
	        return {
	            top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
	            left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	        };
	    };
	
	    jQuery.offset = {
	
	        setOffset: function( elem, options, i ) {
	            var position = jQuery.css( elem, "position" );
	
	            // set position first, in-case top/left are set even on static elem
	            if ( position === "static" ) {
	                elem.style.position = "relative";
	            }
	
	            var curElem = jQuery( elem ),
	                curOffset = curElem.offset(),
	                curCSSTop = jQuery.css( elem, "top" ),
	                curCSSLeft = jQuery.css( elem, "left" ),
	                calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
	                props = {}, curPosition = {}, curTop, curLeft;
	
	            // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
	            if ( calculatePosition ) {
	                curPosition = curElem.position();
	                curTop = curPosition.top;
	                curLeft = curPosition.left;
	            } else {
	                curTop = parseFloat( curCSSTop ) || 0;
	                curLeft = parseFloat( curCSSLeft ) || 0;
	            }
	
	            if ( jQuery.isFunction( options ) ) {
	                options = options.call( elem, i, curOffset );
	            }
	
	            if ( options.top != null ) {
	                props.top = ( options.top - curOffset.top ) + curTop;
	            }
	            if ( options.left != null ) {
	                props.left = ( options.left - curOffset.left ) + curLeft;
	            }
	
	            if ( "using" in options ) {
	                options.using.call( elem, props );
	            } else {
	                curElem.css( props );
	            }
	        }
	    };
	
	
	    jQuery.fn.extend({
	
	        position: function() {
	            if ( !this[ 0 ] ) {
	                return;
	            }
	
	            var offsetParent, offset,
	                parentOffset = { top: 0, left: 0 },
	                elem = this[ 0 ];
	
	            // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
	            if ( jQuery.css( elem, "position" ) === "fixed" ) {
	                // we assume that getBoundingClientRect is available when computed position is fixed
	                offset = elem.getBoundingClientRect();
	            } else {
	                // Get *real* offsetParent
	                offsetParent = this.offsetParent();
	
	                // Get correct offsets
	                offset = this.offset();
	                if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
	                    parentOffset = offsetParent.offset();
	                }
	
	                // Add offsetParent borders
	                parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
	                parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
	            }
	
	            // Subtract parent offsets and element margins
	            // note: when an element has margin: auto the offsetLeft and marginLeft
	            // are the same in Safari causing offset.left to incorrectly be 0
	            return {
	                top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
	                left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
	            };
	        },
	
	        offsetParent: function() {
	            return this.map(function() {
	                var offsetParent = this.offsetParent || docElem;
	                while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
	                    offsetParent = offsetParent.offsetParent;
	                }
	                return offsetParent || docElem;
	            });
	        }
	    });
	
	
	// Create scrollLeft and scrollTop methods
	    jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	        var top = /Y/.test( prop );
	
	        jQuery.fn[ method ] = function( val ) {
	            return jQuery.access( this, function( elem, method, val ) {
	                var win = getWindow( elem );
	
	                if ( val === undefined ) {
	                    return win ? (prop in win) ? win[ prop ] :
	                        win.document.documentElement[ method ] :
	                        elem[ method ];
	                }
	
	                if ( win ) {
	                    win.scrollTo(
	                        !top ? val : jQuery( win ).scrollLeft(),
	                        top ? val : jQuery( win ).scrollTop()
	                    );
	
	                } else {
	                    elem[ method ] = val;
	                }
	            }, method, val, arguments.length, null );
	        };
	    });
	
	    function getWindow( elem ) {
	        return jQuery.isWindow( elem ) ?
	            elem :
	            elem.nodeType === 9 ?
	            elem.defaultView || elem.parentWindow :
	                false;
	    }
	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	    jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	        jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
	            // margin is only for outerHeight, outerWidth
	            jQuery.fn[ funcName ] = function( margin, value ) {
	                var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
	                    extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
	
	                return jQuery.access( this, function( elem, type, value ) {
	                    var doc;
	
	                    if ( jQuery.isWindow( elem ) ) {
	                        // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
	                        // isn't a whole lot we can do. See pull request at this URL for discussion:
	                        // https://github.com/jquery/jquery/pull/764
	                        return elem.document.documentElement[ "client" + name ];
	                    }
	
	                    // Get document width or height
	                    if ( elem.nodeType === 9 ) {
	                        doc = elem.documentElement;
	
	                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
	                        // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
	                        return Math.max(
	                            elem.body[ "scroll" + name ], doc[ "scroll" + name ],
	                            elem.body[ "offset" + name ], doc[ "offset" + name ],
	                            doc[ "client" + name ]
	                        );
	                    }
	
	                    return value === undefined ?
	                        // Get width or height on the element, requesting but not forcing parseFloat
	                        jQuery.css( elem, type, extra ) :
	
	                        // Set width or height on the element
	                        jQuery.style( elem, type, value, extra );
	                }, type, chainable ? margin : undefined, chainable, null );
	            };
	        });
	    });
	// Limit scope pollution from any deprecated API
	// (function() {
	
	// The number of elements contained in the matched element set
	    jQuery.fn.size = function() {
	        return this.length;
	    };
	
	    jQuery.fn.andSelf = jQuery.fn.addBack;
	
	// })();
	    if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	        // Expose jQuery as module.exports in loaders that implement the Node
	        // module pattern (including browserify). Do not create the global, since
	        // the user will be storing it themselves locally, and globals are frowned
	        // upon in the Node module world.
	        module.exports = jQuery;
	    } else {
	        // Otherwise expose jQuery to the global object as usual
	        window.jQuery = window.$ = jQuery;
	
	        // Register as a named AMD module, since jQuery can be concatenated with other
	        // files that may use define, but not via a proper concatenation script that
	        // understands anonymous AMD modules. A named AMD is safest and most robust
	        // way to register. Lowercase jquery is used because AMD module names are
	        // derived from file names, and jQuery is normally delivered in a lowercase
	        // file name. Do this after creating the global so that if an AMD module wants
	        // to call noConflict to hide this version of jQuery, it will work.
	        if ( true ) {
	            !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () { return jQuery; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	        }
	    }
	
	})( window );
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	/*! jQuery UI - v1.10.3 - 2013-11-18
	* http://jqueryui.com
	* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.resizable.js, jquery.ui.accordion.js, jquery.ui.autocomplete.js, jquery.ui.button.js, jquery.ui.datepicker.js, jquery.ui.dialog.js, jquery.ui.menu.js, jquery.ui.tabs.js
	* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */
	
	(function(e,t){function i(t,i){var s,n,r,o=t.nodeName.toLowerCase();return"area"===o?(s=t.parentNode,n=s.name,t.href&&n&&"map"===s.nodeName.toLowerCase()?(r=e("img[usemap=#"+n+"]")[0],!!r&&a(r)):!1):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&a(t)}function a(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var s=0,n=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,a){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),a&&a.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var a,s,n=e(this[0]);n.length&&n[0]!==document;){if(a=n.css("position"),("absolute"===a||"relative"===a||"fixed"===a)&&(s=parseInt(n.css("zIndex"),10),!isNaN(s)&&0!==s))return s;n=n.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++s)})},removeUniqueId:function(){return this.each(function(){n.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,a){return!!e.data(t,a[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var a=e.attr(t,"tabindex"),s=isNaN(a);return(s||a>=0)&&i(t,!s)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,a){function s(t,i,a,s){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,a&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===a?["Left","Right"]:["Top","Bottom"],r=a.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+a]=function(i){return i===t?o["inner"+a].call(this):this.each(function(){e(this).css(r,s(this,i)+"px")})},e.fn["outer"+a]=function(t,i){return"number"!=typeof t?o["outer"+a].call(this,t):this.each(function(){e(this).css(r,s(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,a){var s,n=e.ui[t].prototype;for(s in a)n.plugins[s]=n.plugins[s]||[],n.plugins[s].push([i,a[s]])},call:function(e,t,i){var a,s=e.plugins[t];if(s&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(a=0;s.length>a;a++)e.options[s[a][0]]&&s[a][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var a=i&&"left"===i?"scrollLeft":"scrollTop",s=!1;return t[a]>0?!0:(t[a]=1,s=t[a]>0,t[a]=0,s)}})})(jQuery);(function(e,t){var i=0,s=Array.prototype.slice,a=e.cleanData;e.cleanData=function(t){for(var i,s=0;null!=(i=t[s]);s++)try{e(i).triggerHandler("remove")}catch(n){}a(t)},e.widget=function(i,s,a){var n,r,o,h,l={},u=i.split(".")[0];i=i.split(".")[1],n=u+"-"+i,a||(a=s,s=e.Widget),e.expr[":"][n.toLowerCase()]=function(t){return!!e.data(t,n)},e[u]=e[u]||{},r=e[u][i],o=e[u][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new o(e,i)},e.extend(o,r,{version:a.version,_proto:e.extend({},a),_childConstructors:[]}),h=new s,h.options=e.widget.extend({},h.options),e.each(a,function(i,a){return e.isFunction(a)?(l[i]=function(){var e=function(){return s.prototype[i].apply(this,arguments)},t=function(e){return s.prototype[i].apply(this,e)};return function(){var i,s=this._super,n=this._superApply;return this._super=e,this._superApply=t,i=a.apply(this,arguments),this._super=s,this._superApply=n,i}}(),t):(l[i]=a,t)}),o.prototype=e.widget.extend(h,{widgetEventPrefix:r?h.widgetEventPrefix:i},l,{constructor:o,namespace:u,widgetName:i,widgetFullName:n}),r?(e.each(r._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete r._childConstructors):s._childConstructors.push(o),e.widget.bridge(i,o)},e.widget.extend=function(i){for(var a,n,r=s.call(arguments,1),o=0,h=r.length;h>o;o++)for(a in r[o])n=r[o][a],r[o].hasOwnProperty(a)&&n!==t&&(i[a]=e.isPlainObject(n)?e.isPlainObject(i[a])?e.widget.extend({},i[a],n):e.widget.extend({},n):n);return i},e.widget.bridge=function(i,a){var n=a.prototype.widgetFullName||i;e.fn[i]=function(r){var o="string"==typeof r,h=s.call(arguments,1),l=this;return r=!o&&h.length?e.widget.extend.apply(null,[r].concat(h)):r,o?this.each(function(){var s,a=e.data(this,n);return a?e.isFunction(a[r])&&"_"!==r.charAt(0)?(s=a[r].apply(a,h),s!==a&&s!==t?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):t):e.error("no such method '"+r+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+r+"'")}):this.each(function(){var t=e.data(this,n);t?t.option(r||{})._init():e.data(this,n,new a(r,this))}),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,s){var a,n,r,o=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(o={},a=i.split("."),i=a.shift(),a.length){for(n=o[i]=e.widget.extend({},this.options[i]),r=0;a.length-1>r;r++)n[a[r]]=n[a[r]]||{},n=n[a[r]];if(i=a.pop(),s===t)return n[i]===t?null:n[i];n[i]=s}else{if(s===t)return this.options[i]===t?null:this.options[i];o[i]=s}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,a){var n,r=this;"boolean"!=typeof i&&(a=s,s=i,i=!1),a?(s=n=e(s),this.bindings=this.bindings.add(s)):(a=s,s=this.element,n=this.widget()),e.each(a,function(a,o){function h(){return i||r.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?r[o]:o).apply(r,arguments):t}"string"!=typeof o&&(h.guid=o.guid=o.guid||h.guid||e.guid++);var l=a.match(/^(\w+)\s*(.*)$/),u=l[1]+r.eventNamespace,c=l[2];c?n.delegate(c,u,h):s.bind(u,h)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var a,n,r=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],n=i.originalEvent)for(a in n)a in i||(i[a]=n[a]);return this.element.trigger(i,s),!(e.isFunction(r)&&r.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,a,n){"string"==typeof a&&(a={effect:a});var r,o=a?a===!0||"number"==typeof a?i:a.effect||i:t;a=a||{},"number"==typeof a&&(a={duration:a}),r=!e.isEmptyObject(a),a.complete=n,a.delay&&s.delay(a.delay),r&&e.effects&&e.effects.effect[o]?s[t](a):o!==t&&s[o]?s[o](a.duration,a.easing,n):s.queue(function(i){e(this)[t](),n&&n.call(s[0]),i()})}})})(jQuery);(function(e){var t=!1;e(document).mouseup(function(){t=!1}),e.widget("ui.mouse",{version:"1.10.3",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):undefined}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(i){if(!t){this._mouseStarted&&this._mouseUp(i),this._mouseDownEvent=i;var s=this,a=1===i.which,n="string"==typeof this.options.cancel&&i.target.nodeName?e(i.target).closest(this.options.cancel).length:!1;return a&&!n&&this._mouseCapture(i)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){s.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(i)&&this._mouseDelayMet(i)&&(this._mouseStarted=this._mouseStart(i)!==!1,!this._mouseStarted)?(i.preventDefault(),!0):(!0===e.data(i.target,this.widgetName+".preventClickEvent")&&e.removeData(i.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return s._mouseMove(e)},this._mouseUpDelegate=function(e){return s._mouseUp(e)},e(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),i.preventDefault(),t=!0,!0)):!0}},_mouseMove:function(t){return e.ui.ie&&(!document.documentMode||9>document.documentMode)&&!t.button?this._mouseUp(t):this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted)},_mouseUp:function(t){return e(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})})(jQuery);(function(e,t){function i(e,t,i){return[parseFloat(e[0])*(p.test(e[0])?t/100:1),parseFloat(e[1])*(p.test(e[1])?i/100:1)]}function s(t,i){return parseInt(e.css(t,i),10)||0}function a(t){var i=t[0];return 9===i.nodeType?{width:t.width(),height:t.height(),offset:{top:0,left:0}}:e.isWindow(i)?{width:t.width(),height:t.height(),offset:{top:t.scrollTop(),left:t.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:t.outerWidth(),height:t.outerHeight(),offset:t.offset()}}e.ui=e.ui||{};var n,r=Math.max,o=Math.abs,h=Math.round,l=/left|center|right/,u=/top|center|bottom/,c=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=e.fn.position;e.position={scrollbarWidth:function(){if(n!==t)return n;var i,s,a=e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),r=a.children()[0];return e("body").append(a),i=r.offsetWidth,a.css("overflow","scroll"),s=r.offsetWidth,i===s&&(s=a[0].clientWidth),a.remove(),n=i-s},getScrollInfo:function(t){var i=t.isWindow?"":t.element.css("overflow-x"),s=t.isWindow?"":t.element.css("overflow-y"),a="scroll"===i||"auto"===i&&t.width<t.element[0].scrollWidth,n="scroll"===s||"auto"===s&&t.height<t.element[0].scrollHeight;return{width:n?e.position.scrollbarWidth():0,height:a?e.position.scrollbarWidth():0}},getWithinInfo:function(t){var i=e(t||window),s=e.isWindow(i[0]);return{element:i,isWindow:s,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},e.fn.position=function(t){if(!t||!t.of)return f.apply(this,arguments);t=e.extend({},t);var n,p,m,g,v,y,b=e(t.of),_=e.position.getWithinInfo(t.within),x=e.position.getScrollInfo(_),k=(t.collision||"flip").split(" "),w={};return y=a(b),b[0].preventDefault&&(t.at="left top"),p=y.width,m=y.height,g=y.offset,v=e.extend({},g),e.each(["my","at"],function(){var e,i,s=(t[this]||"").split(" ");1===s.length&&(s=l.test(s[0])?s.concat(["center"]):u.test(s[0])?["center"].concat(s):["center","center"]),s[0]=l.test(s[0])?s[0]:"center",s[1]=u.test(s[1])?s[1]:"center",e=c.exec(s[0]),i=c.exec(s[1]),w[this]=[e?e[0]:0,i?i[0]:0],t[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===k.length&&(k[1]=k[0]),"right"===t.at[0]?v.left+=p:"center"===t.at[0]&&(v.left+=p/2),"bottom"===t.at[1]?v.top+=m:"center"===t.at[1]&&(v.top+=m/2),n=i(w.at,p,m),v.left+=n[0],v.top+=n[1],this.each(function(){var a,l,u=e(this),c=u.outerWidth(),d=u.outerHeight(),f=s(this,"marginLeft"),y=s(this,"marginTop"),D=c+f+s(this,"marginRight")+x.width,T=d+y+s(this,"marginBottom")+x.height,M=e.extend({},v),S=i(w.my,u.outerWidth(),u.outerHeight());"right"===t.my[0]?M.left-=c:"center"===t.my[0]&&(M.left-=c/2),"bottom"===t.my[1]?M.top-=d:"center"===t.my[1]&&(M.top-=d/2),M.left+=S[0],M.top+=S[1],e.support.offsetFractions||(M.left=h(M.left),M.top=h(M.top)),a={marginLeft:f,marginTop:y},e.each(["left","top"],function(i,s){e.ui.position[k[i]]&&e.ui.position[k[i]][s](M,{targetWidth:p,targetHeight:m,elemWidth:c,elemHeight:d,collisionPosition:a,collisionWidth:D,collisionHeight:T,offset:[n[0]+S[0],n[1]+S[1]],my:t.my,at:t.at,within:_,elem:u})}),t.using&&(l=function(e){var i=g.left-M.left,s=i+p-c,a=g.top-M.top,n=a+m-d,h={target:{element:b,left:g.left,top:g.top,width:p,height:m},element:{element:u,left:M.left,top:M.top,width:c,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>n?"top":a>0?"bottom":"middle"};c>p&&p>o(i+s)&&(h.horizontal="center"),d>m&&m>o(a+n)&&(h.vertical="middle"),h.important=r(o(i),o(s))>r(o(a),o(n))?"horizontal":"vertical",t.using.call(this,e,h)}),u.offset(e.extend(M,{using:l}))})},e.ui.position={fit:{left:function(e,t){var i,s=t.within,a=s.isWindow?s.scrollLeft:s.offset.left,n=s.width,o=e.left-t.collisionPosition.marginLeft,h=a-o,l=o+t.collisionWidth-n-a;t.collisionWidth>n?h>0&&0>=l?(i=e.left+h+t.collisionWidth-n-a,e.left+=h-i):e.left=l>0&&0>=h?a:h>l?a+n-t.collisionWidth:a:h>0?e.left+=h:l>0?e.left-=l:e.left=r(e.left-o,e.left)},top:function(e,t){var i,s=t.within,a=s.isWindow?s.scrollTop:s.offset.top,n=t.within.height,o=e.top-t.collisionPosition.marginTop,h=a-o,l=o+t.collisionHeight-n-a;t.collisionHeight>n?h>0&&0>=l?(i=e.top+h+t.collisionHeight-n-a,e.top+=h-i):e.top=l>0&&0>=h?a:h>l?a+n-t.collisionHeight:a:h>0?e.top+=h:l>0?e.top-=l:e.top=r(e.top-o,e.top)}},flip:{left:function(e,t){var i,s,a=t.within,n=a.offset.left+a.scrollLeft,r=a.width,h=a.isWindow?a.scrollLeft:a.offset.left,l=e.left-t.collisionPosition.marginLeft,u=l-h,c=l+t.collisionWidth-r-h,d="left"===t.my[0]?-t.elemWidth:"right"===t.my[0]?t.elemWidth:0,p="left"===t.at[0]?t.targetWidth:"right"===t.at[0]?-t.targetWidth:0,f=-2*t.offset[0];0>u?(i=e.left+d+p+f+t.collisionWidth-r-n,(0>i||o(u)>i)&&(e.left+=d+p+f)):c>0&&(s=e.left-t.collisionPosition.marginLeft+d+p+f-h,(s>0||c>o(s))&&(e.left+=d+p+f))},top:function(e,t){var i,s,a=t.within,n=a.offset.top+a.scrollTop,r=a.height,h=a.isWindow?a.scrollTop:a.offset.top,l=e.top-t.collisionPosition.marginTop,u=l-h,c=l+t.collisionHeight-r-h,d="top"===t.my[1],p=d?-t.elemHeight:"bottom"===t.my[1]?t.elemHeight:0,f="top"===t.at[1]?t.targetHeight:"bottom"===t.at[1]?-t.targetHeight:0,m=-2*t.offset[1];0>u?(s=e.top+p+f+m+t.collisionHeight-r-n,e.top+p+f+m>u&&(0>s||o(u)>s)&&(e.top+=p+f+m)):c>0&&(i=e.top-t.collisionPosition.marginTop+p+f+m-h,e.top+p+f+m>c&&(i>0||c>o(i))&&(e.top+=p+f+m))}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments)},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments)}}},function(){var t,i,s,a,n,r=document.getElementsByTagName("body")[0],o=document.createElement("div");t=document.createElement(r?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},r&&e.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(n in s)t.style[n]=s[n];t.appendChild(o),i=r||document.documentElement,i.insertBefore(t,i.firstChild),o.style.cssText="position: absolute; left: 10.7432222px;",a=e(o).offset().left,e.support.offsetFractions=a>10&&11>a,t.innerHTML="",i.removeChild(t)}()})(jQuery);(function(e){e.widget("ui.draggable",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1,drag:null,start:null,stop:null},_create:function(){"original"!==this.options.helper||/^(?:r|a|f)/.test(this.element.css("position"))||(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy()},_mouseCapture:function(t){var i=this.options;return this.helper||i.disabled||e(t.target).closest(".ui-resizable-handle").length>0?!1:(this.handle=this._getHandle(t),this.handle?(e(i.iframeFix===!0?"iframe":i.iframeFix).each(function(){e("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(e(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(t){var i=this.options;return this.helper=this._createHelper(t),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),e.ui.ddmanager&&(e.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offsetParent=this.helper.offsetParent(),this.offsetParentCssPosition=this.offsetParent.css("position"),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},this.offset.scroll=!1,e.extend(this.offset,{click:{left:t.pageX-this.offset.left,top:t.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(t),this.originalPageX=t.pageX,this.originalPageY=t.pageY,i.cursorAt&&this._adjustOffsetFromHelper(i.cursorAt),this._setContainment(),this._trigger("start",t)===!1?(this._clear(),!1):(this._cacheHelperProportions(),e.ui.ddmanager&&!i.dropBehaviour&&e.ui.ddmanager.prepareOffsets(this,t),this._mouseDrag(t,!0),e.ui.ddmanager&&e.ui.ddmanager.dragStart(this,t),!0)},_mouseDrag:function(t,i){if("fixed"===this.offsetParentCssPosition&&(this.offset.parent=this._getParentOffset()),this.position=this._generatePosition(t),this.positionAbs=this._convertPositionTo("absolute"),!i){var a=this._uiHash();if(this._trigger("drag",t,a)===!1)return this._mouseUp({}),!1;this.position=a.position}return this.options.axis&&"y"===this.options.axis||(this.helper[0].style.left=this.position.left+"px"),this.options.axis&&"x"===this.options.axis||(this.helper[0].style.top=this.position.top+"px"),e.ui.ddmanager&&e.ui.ddmanager.drag(this,t),!1},_mouseStop:function(t){var i=this,a=!1;return e.ui.ddmanager&&!this.options.dropBehaviour&&(a=e.ui.ddmanager.drop(this,t)),this.dropped&&(a=this.dropped,this.dropped=!1),"original"!==this.options.helper||e.contains(this.element[0].ownerDocument,this.element[0])?("invalid"===this.options.revert&&!a||"valid"===this.options.revert&&a||this.options.revert===!0||e.isFunction(this.options.revert)&&this.options.revert.call(this.element,a)?e(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){i._trigger("stop",t)!==!1&&i._clear()}):this._trigger("stop",t)!==!1&&this._clear(),!1):!1},_mouseUp:function(t){return e("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),e.ui.ddmanager&&e.ui.ddmanager.dragStop(this,t),e.ui.mouse.prototype._mouseUp.call(this,t)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(t){return this.options.handle?!!e(t.target).closest(this.element.find(this.options.handle)).length:!0},_createHelper:function(t){var i=this.options,a=e.isFunction(i.helper)?e(i.helper.apply(this.element[0],[t])):"clone"===i.helper?this.element.clone().removeAttr("id"):this.element;return a.parents("body").length||a.appendTo("parent"===i.appendTo?this.element[0].parentNode:i.appendTo),a[0]===this.element[0]||/(fixed|absolute)/.test(a.css("position"))||a.css("position","absolute"),a},_adjustOffsetFromHelper:function(t){"string"==typeof t&&(t=t.split(" ")),e.isArray(t)&&(t={left:+t[0],top:+t[1]||0}),"left"in t&&(this.offset.click.left=t.left+this.margins.left),"right"in t&&(this.offset.click.left=this.helperProportions.width-t.right+this.margins.left),"top"in t&&(this.offset.click.top=t.top+this.margins.top),"bottom"in t&&(this.offset.click.top=this.helperProportions.height-t.bottom+this.margins.top)},_getParentOffset:function(){var t=this.offsetParent.offset();return"absolute"===this.cssPosition&&this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])&&(t.left+=this.scrollParent.scrollLeft(),t.top+=this.scrollParent.scrollTop()),(this.offsetParent[0]===document.body||this.offsetParent[0].tagName&&"html"===this.offsetParent[0].tagName.toLowerCase()&&e.ui.ie)&&(t={top:0,left:0}),{top:t.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:t.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if("relative"===this.cssPosition){var e=this.element.position();return{top:e.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:e.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var t,i,a,s=this.options;return s.containment?"window"===s.containment?(this.containment=[e(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,e(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,e(window).scrollLeft()+e(window).width()-this.helperProportions.width-this.margins.left,e(window).scrollTop()+(e(window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):"document"===s.containment?(this.containment=[0,0,e(document).width()-this.helperProportions.width-this.margins.left,(e(document).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top],undefined):s.containment.constructor===Array?(this.containment=s.containment,undefined):("parent"===s.containment&&(s.containment=this.helper[0].parentNode),i=e(s.containment),a=i[0],a&&(t="hidden"!==i.css("overflow"),this.containment=[(parseInt(i.css("borderLeftWidth"),10)||0)+(parseInt(i.css("paddingLeft"),10)||0),(parseInt(i.css("borderTopWidth"),10)||0)+(parseInt(i.css("paddingTop"),10)||0),(t?Math.max(a.scrollWidth,a.offsetWidth):a.offsetWidth)-(parseInt(i.css("borderRightWidth"),10)||0)-(parseInt(i.css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(t?Math.max(a.scrollHeight,a.offsetHeight):a.offsetHeight)-(parseInt(i.css("borderBottomWidth"),10)||0)-(parseInt(i.css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=i),undefined):(this.containment=null,undefined)},_convertPositionTo:function(t,i){i||(i=this.position);var a="absolute"===t?1:-1,s="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent;return this.offset.scroll||(this.offset.scroll={top:s.scrollTop(),left:s.scrollLeft()}),{top:i.top+this.offset.relative.top*a+this.offset.parent.top*a-("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top)*a,left:i.left+this.offset.relative.left*a+this.offset.parent.left*a-("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)*a}},_generatePosition:function(t){var i,a,s,n,r=this.options,o="absolute"!==this.cssPosition||this.scrollParent[0]!==document&&e.contains(this.scrollParent[0],this.offsetParent[0])?this.scrollParent:this.offsetParent,l=t.pageX,h=t.pageY;return this.offset.scroll||(this.offset.scroll={top:o.scrollTop(),left:o.scrollLeft()}),this.originalPosition&&(this.containment&&(this.relative_container?(a=this.relative_container.offset(),i=[this.containment[0]+a.left,this.containment[1]+a.top,this.containment[2]+a.left,this.containment[3]+a.top]):i=this.containment,t.pageX-this.offset.click.left<i[0]&&(l=i[0]+this.offset.click.left),t.pageY-this.offset.click.top<i[1]&&(h=i[1]+this.offset.click.top),t.pageX-this.offset.click.left>i[2]&&(l=i[2]+this.offset.click.left),t.pageY-this.offset.click.top>i[3]&&(h=i[3]+this.offset.click.top)),r.grid&&(s=r.grid[1]?this.originalPageY+Math.round((h-this.originalPageY)/r.grid[1])*r.grid[1]:this.originalPageY,h=i?s-this.offset.click.top>=i[1]||s-this.offset.click.top>i[3]?s:s-this.offset.click.top>=i[1]?s-r.grid[1]:s+r.grid[1]:s,n=r.grid[0]?this.originalPageX+Math.round((l-this.originalPageX)/r.grid[0])*r.grid[0]:this.originalPageX,l=i?n-this.offset.click.left>=i[0]||n-this.offset.click.left>i[2]?n:n-this.offset.click.left>=i[0]?n-r.grid[0]:n+r.grid[0]:n)),{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+("fixed"===this.cssPosition?-this.scrollParent.scrollTop():this.offset.scroll.top),left:l-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+("fixed"===this.cssPosition?-this.scrollParent.scrollLeft():this.offset.scroll.left)}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]===this.element[0]||this.cancelHelperRemoval||this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(t,i,a){return a=a||this._uiHash(),e.ui.plugin.call(this,t,[i,a]),"drag"===t&&(this.positionAbs=this._convertPositionTo("absolute")),e.Widget.prototype._trigger.call(this,t,i,a)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),e.ui.plugin.add("draggable","connectToSortable",{start:function(t,i){var a=e(this).data("ui-draggable"),s=a.options,n=e.extend({},i,{item:a.element});a.sortables=[],e(s.connectToSortable).each(function(){var i=e.data(this,"ui-sortable");i&&!i.options.disabled&&(a.sortables.push({instance:i,shouldRevert:i.options.revert}),i.refreshPositions(),i._trigger("activate",t,n))})},stop:function(t,i){var a=e(this).data("ui-draggable"),s=e.extend({},i,{item:a.element});e.each(a.sortables,function(){this.instance.isOver?(this.instance.isOver=0,a.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=this.shouldRevert),this.instance._mouseStop(t),this.instance.options.helper=this.instance.options._helper,"original"===a.options.helper&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",t,s))})},drag:function(t,i){var a=e(this).data("ui-draggable"),s=this;e.each(a.sortables,function(){var n=!1,r=this;this.instance.positionAbs=a.positionAbs,this.instance.helperProportions=a.helperProportions,this.instance.offset.click=a.offset.click,this.instance._intersectsWith(this.instance.containerCache)&&(n=!0,e.each(a.sortables,function(){return this.instance.positionAbs=a.positionAbs,this.instance.helperProportions=a.helperProportions,this.instance.offset.click=a.offset.click,this!==r&&this.instance._intersectsWith(this.instance.containerCache)&&e.contains(r.instance.element[0],this.instance.element[0])&&(n=!1),n})),n?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=e(s).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return i.helper[0]},t.target=this.instance.currentItem[0],this.instance._mouseCapture(t,!0),this.instance._mouseStart(t,!0,!0),this.instance.offset.click.top=a.offset.click.top,this.instance.offset.click.left=a.offset.click.left,this.instance.offset.parent.left-=a.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=a.offset.parent.top-this.instance.offset.parent.top,a._trigger("toSortable",t),a.dropped=this.instance.element,a.currentItem=a.element,this.instance.fromOutside=a),this.instance.currentItem&&this.instance._mouseDrag(t)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",t,this.instance._uiHash(this.instance)),this.instance._mouseStop(t,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),a._trigger("fromSortable",t),a.dropped=!1)})}}),e.ui.plugin.add("draggable","cursor",{start:function(){var t=e("body"),i=e(this).data("ui-draggable").options;t.css("cursor")&&(i._cursor=t.css("cursor")),t.css("cursor",i.cursor)},stop:function(){var t=e(this).data("ui-draggable").options;t._cursor&&e("body").css("cursor",t._cursor)}}),e.ui.plugin.add("draggable","opacity",{start:function(t,i){var a=e(i.helper),s=e(this).data("ui-draggable").options;a.css("opacity")&&(s._opacity=a.css("opacity")),a.css("opacity",s.opacity)},stop:function(t,i){var a=e(this).data("ui-draggable").options;a._opacity&&e(i.helper).css("opacity",a._opacity)}}),e.ui.plugin.add("draggable","scroll",{start:function(){var t=e(this).data("ui-draggable");t.scrollParent[0]!==document&&"HTML"!==t.scrollParent[0].tagName&&(t.overflowOffset=t.scrollParent.offset())},drag:function(t){var i=e(this).data("ui-draggable"),a=i.options,s=!1;i.scrollParent[0]!==document&&"HTML"!==i.scrollParent[0].tagName?(a.axis&&"x"===a.axis||(i.overflowOffset.top+i.scrollParent[0].offsetHeight-t.pageY<a.scrollSensitivity?i.scrollParent[0].scrollTop=s=i.scrollParent[0].scrollTop+a.scrollSpeed:t.pageY-i.overflowOffset.top<a.scrollSensitivity&&(i.scrollParent[0].scrollTop=s=i.scrollParent[0].scrollTop-a.scrollSpeed)),a.axis&&"y"===a.axis||(i.overflowOffset.left+i.scrollParent[0].offsetWidth-t.pageX<a.scrollSensitivity?i.scrollParent[0].scrollLeft=s=i.scrollParent[0].scrollLeft+a.scrollSpeed:t.pageX-i.overflowOffset.left<a.scrollSensitivity&&(i.scrollParent[0].scrollLeft=s=i.scrollParent[0].scrollLeft-a.scrollSpeed))):(a.axis&&"x"===a.axis||(t.pageY-e(document).scrollTop()<a.scrollSensitivity?s=e(document).scrollTop(e(document).scrollTop()-a.scrollSpeed):e(window).height()-(t.pageY-e(document).scrollTop())<a.scrollSensitivity&&(s=e(document).scrollTop(e(document).scrollTop()+a.scrollSpeed))),a.axis&&"y"===a.axis||(t.pageX-e(document).scrollLeft()<a.scrollSensitivity?s=e(document).scrollLeft(e(document).scrollLeft()-a.scrollSpeed):e(window).width()-(t.pageX-e(document).scrollLeft())<a.scrollSensitivity&&(s=e(document).scrollLeft(e(document).scrollLeft()+a.scrollSpeed)))),s!==!1&&e.ui.ddmanager&&!a.dropBehaviour&&e.ui.ddmanager.prepareOffsets(i,t)}}),e.ui.plugin.add("draggable","snap",{start:function(){var t=e(this).data("ui-draggable"),i=t.options;t.snapElements=[],e(i.snap.constructor!==String?i.snap.items||":data(ui-draggable)":i.snap).each(function(){var i=e(this),a=i.offset();this!==t.element[0]&&t.snapElements.push({item:this,width:i.outerWidth(),height:i.outerHeight(),top:a.top,left:a.left})})},drag:function(t,i){var a,s,n,r,o,l,h,u,d,c,p=e(this).data("ui-draggable"),f=p.options,m=f.snapTolerance,g=i.offset.left,v=g+p.helperProportions.width,y=i.offset.top,b=y+p.helperProportions.height;for(d=p.snapElements.length-1;d>=0;d--)o=p.snapElements[d].left,l=o+p.snapElements[d].width,h=p.snapElements[d].top,u=h+p.snapElements[d].height,o-m>v||g>l+m||h-m>b||y>u+m||!e.contains(p.snapElements[d].item.ownerDocument,p.snapElements[d].item)?(p.snapElements[d].snapping&&p.options.snap.release&&p.options.snap.release.call(p.element,t,e.extend(p._uiHash(),{snapItem:p.snapElements[d].item})),p.snapElements[d].snapping=!1):("inner"!==f.snapMode&&(a=m>=Math.abs(h-b),s=m>=Math.abs(u-y),n=m>=Math.abs(o-v),r=m>=Math.abs(l-g),a&&(i.position.top=p._convertPositionTo("relative",{top:h-p.helperProportions.height,left:0}).top-p.margins.top),s&&(i.position.top=p._convertPositionTo("relative",{top:u,left:0}).top-p.margins.top),n&&(i.position.left=p._convertPositionTo("relative",{top:0,left:o-p.helperProportions.width}).left-p.margins.left),r&&(i.position.left=p._convertPositionTo("relative",{top:0,left:l}).left-p.margins.left)),c=a||s||n||r,"outer"!==f.snapMode&&(a=m>=Math.abs(h-y),s=m>=Math.abs(u-b),n=m>=Math.abs(o-g),r=m>=Math.abs(l-v),a&&(i.position.top=p._convertPositionTo("relative",{top:h,left:0}).top-p.margins.top),s&&(i.position.top=p._convertPositionTo("relative",{top:u-p.helperProportions.height,left:0}).top-p.margins.top),n&&(i.position.left=p._convertPositionTo("relative",{top:0,left:o}).left-p.margins.left),r&&(i.position.left=p._convertPositionTo("relative",{top:0,left:l-p.helperProportions.width}).left-p.margins.left)),!p.snapElements[d].snapping&&(a||s||n||r||c)&&p.options.snap.snap&&p.options.snap.snap.call(p.element,t,e.extend(p._uiHash(),{snapItem:p.snapElements[d].item})),p.snapElements[d].snapping=a||s||n||r||c)}}),e.ui.plugin.add("draggable","stack",{start:function(){var t,i=this.data("ui-draggable").options,a=e.makeArray(e(i.stack)).sort(function(t,i){return(parseInt(e(t).css("zIndex"),10)||0)-(parseInt(e(i).css("zIndex"),10)||0)});a.length&&(t=parseInt(e(a[0]).css("zIndex"),10)||0,e(a).each(function(i){e(this).css("zIndex",t+i)}),this.css("zIndex",t+a.length))}}),e.ui.plugin.add("draggable","zIndex",{start:function(t,i){var a=e(i.helper),s=e(this).data("ui-draggable").options;a.css("zIndex")&&(s._zIndex=a.css("zIndex")),a.css("zIndex",s.zIndex)},stop:function(t,i){var a=e(this).data("ui-draggable").options;a._zIndex&&e(i.helper).css("zIndex",a._zIndex)}})})(jQuery);(function(e){function t(e){return parseInt(e,10)||0}function i(e){return!isNaN(parseInt(e,10))}e.widget("ui.resizable",e.ui.mouse,{version:"1.10.3",widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:90,resize:null,start:null,stop:null},_create:function(){var t,i,s,a,n,r=this,o=this.options;if(this.element.addClass("ui-resizable"),e.extend(this,{_aspectRatio:!!o.aspectRatio,aspectRatio:o.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:o.helper||o.ghost||o.animate?o.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(e("<div class='ui-wrapper' style='overflow: hidden;'></div>").css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("ui-resizable",this.element.data("ui-resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=o.handles||(e(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se"),this.handles.constructor===String)for("all"===this.handles&&(this.handles="n,e,s,w,se,sw,ne,nw"),t=this.handles.split(","),this.handles={},i=0;t.length>i;i++)s=e.trim(t[i]),n="ui-resizable-"+s,a=e("<div class='ui-resizable-handle "+n+"'></div>"),a.css({zIndex:o.zIndex}),"se"===s&&a.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[s]=".ui-resizable-"+s,this.element.append(a);this._renderAxis=function(t){var i,s,a,n;t=t||this.element;for(i in this.handles)this.handles[i].constructor===String&&(this.handles[i]=e(this.handles[i],this.element).show()),this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)&&(s=e(this.handles[i],this.element),n=/sw|ne|nw|se|n|s/.test(i)?s.outerHeight():s.outerWidth(),a=["padding",/ne|nw|n/.test(i)?"Top":/se|sw|s/.test(i)?"Bottom":/^e$/.test(i)?"Right":"Left"].join(""),t.css(a,n),this._proportionallyResize()),e(this.handles[i]).length},this._renderAxis(this.element),this._handles=e(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){r.resizing||(this.className&&(a=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)),r.axis=a&&a[1]?a[1]:"se")}),o.autoHide&&(this._handles.hide(),e(this.element).addClass("ui-resizable-autohide").mouseenter(function(){o.disabled||(e(this).removeClass("ui-resizable-autohide"),r._handles.show())}).mouseleave(function(){o.disabled||r.resizing||(e(this).addClass("ui-resizable-autohide"),r._handles.hide())})),this._mouseInit()},_destroy:function(){this._mouseDestroy();var t,i=function(t){e(t).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};return this.elementIsWrapper&&(i(this.element),t=this.element,this.originalElement.css({position:t.css("position"),width:t.outerWidth(),height:t.outerHeight(),top:t.css("top"),left:t.css("left")}).insertAfter(t),t.remove()),this.originalElement.css("resize",this.originalResizeStyle),i(this.originalElement),this},_mouseCapture:function(t){var i,s,a=!1;for(i in this.handles)s=e(this.handles[i])[0],(s===t.target||e.contains(s,t.target))&&(a=!0);return!this.options.disabled&&a},_mouseStart:function(i){var s,a,n,r=this.options,o=this.element.position(),h=this.element;return this.resizing=!0,/absolute/.test(h.css("position"))?h.css({position:"absolute",top:h.css("top"),left:h.css("left")}):h.is(".ui-draggable")&&h.css({position:"absolute",top:o.top,left:o.left}),this._renderProxy(),s=t(this.helper.css("left")),a=t(this.helper.css("top")),r.containment&&(s+=e(r.containment).scrollLeft()||0,a+=e(r.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:s,top:a},this.size=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalSize=this._helper?{width:h.outerWidth(),height:h.outerHeight()}:{width:h.width(),height:h.height()},this.originalPosition={left:s,top:a},this.sizeDiff={width:h.outerWidth()-h.width(),height:h.outerHeight()-h.height()},this.originalMousePosition={left:i.pageX,top:i.pageY},this.aspectRatio="number"==typeof r.aspectRatio?r.aspectRatio:this.originalSize.width/this.originalSize.height||1,n=e(".ui-resizable-"+this.axis).css("cursor"),e("body").css("cursor","auto"===n?this.axis+"-resize":n),h.addClass("ui-resizable-resizing"),this._propagate("start",i),!0},_mouseDrag:function(t){var i,s=this.helper,a={},n=this.originalMousePosition,r=this.axis,o=this.position.top,h=this.position.left,l=this.size.width,u=this.size.height,c=t.pageX-n.left||0,d=t.pageY-n.top||0,p=this._change[r];return p?(i=p.apply(this,[t,c,d]),this._updateVirtualBoundaries(t.shiftKey),(this._aspectRatio||t.shiftKey)&&(i=this._updateRatio(i,t)),i=this._respectSize(i,t),this._updateCache(i),this._propagate("resize",t),this.position.top!==o&&(a.top=this.position.top+"px"),this.position.left!==h&&(a.left=this.position.left+"px"),this.size.width!==l&&(a.width=this.size.width+"px"),this.size.height!==u&&(a.height=this.size.height+"px"),s.css(a),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),e.isEmptyObject(a)||this._trigger("resize",t,this.ui()),!1):!1},_mouseStop:function(t){this.resizing=!1;var i,s,a,n,r,o,h,l=this.options,u=this;return this._helper&&(i=this._proportionallyResizeElements,s=i.length&&/textarea/i.test(i[0].nodeName),a=s&&e.ui.hasScroll(i[0],"left")?0:u.sizeDiff.height,n=s?0:u.sizeDiff.width,r={width:u.helper.width()-n,height:u.helper.height()-a},o=parseInt(u.element.css("left"),10)+(u.position.left-u.originalPosition.left)||null,h=parseInt(u.element.css("top"),10)+(u.position.top-u.originalPosition.top)||null,l.animate||this.element.css(e.extend(r,{top:h,left:o})),u.helper.height(u.size.height),u.helper.width(u.size.width),this._helper&&!l.animate&&this._proportionallyResize()),e("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",t),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(e){var t,s,a,n,r,o=this.options;r={minWidth:i(o.minWidth)?o.minWidth:0,maxWidth:i(o.maxWidth)?o.maxWidth:1/0,minHeight:i(o.minHeight)?o.minHeight:0,maxHeight:i(o.maxHeight)?o.maxHeight:1/0},(this._aspectRatio||e)&&(t=r.minHeight*this.aspectRatio,a=r.minWidth/this.aspectRatio,s=r.maxHeight*this.aspectRatio,n=r.maxWidth/this.aspectRatio,t>r.minWidth&&(r.minWidth=t),a>r.minHeight&&(r.minHeight=a),r.maxWidth>s&&(r.maxWidth=s),r.maxHeight>n&&(r.maxHeight=n)),this._vBoundaries=r},_updateCache:function(e){this.offset=this.helper.offset(),i(e.left)&&(this.position.left=e.left),i(e.top)&&(this.position.top=e.top),i(e.height)&&(this.size.height=e.height),i(e.width)&&(this.size.width=e.width)},_updateRatio:function(e){var t=this.position,s=this.size,a=this.axis;return i(e.height)?e.width=e.height*this.aspectRatio:i(e.width)&&(e.height=e.width/this.aspectRatio),"sw"===a&&(e.left=t.left+(s.width-e.width),e.top=null),"nw"===a&&(e.top=t.top+(s.height-e.height),e.left=t.left+(s.width-e.width)),e},_respectSize:function(e){var t=this._vBoundaries,s=this.axis,a=i(e.width)&&t.maxWidth&&t.maxWidth<e.width,n=i(e.height)&&t.maxHeight&&t.maxHeight<e.height,r=i(e.width)&&t.minWidth&&t.minWidth>e.width,o=i(e.height)&&t.minHeight&&t.minHeight>e.height,h=this.originalPosition.left+this.originalSize.width,l=this.position.top+this.size.height,u=/sw|nw|w/.test(s),c=/nw|ne|n/.test(s);return r&&(e.width=t.minWidth),o&&(e.height=t.minHeight),a&&(e.width=t.maxWidth),n&&(e.height=t.maxHeight),r&&u&&(e.left=h-t.minWidth),a&&u&&(e.left=h-t.maxWidth),o&&c&&(e.top=l-t.minHeight),n&&c&&(e.top=l-t.maxHeight),e.width||e.height||e.left||!e.top?e.width||e.height||e.top||!e.left||(e.left=null):e.top=null,e},_proportionallyResize:function(){if(this._proportionallyResizeElements.length){var e,t,i,s,a,n=this.helper||this.element;for(e=0;this._proportionallyResizeElements.length>e;e++){if(a=this._proportionallyResizeElements[e],!this.borderDif)for(this.borderDif=[],i=[a.css("borderTopWidth"),a.css("borderRightWidth"),a.css("borderBottomWidth"),a.css("borderLeftWidth")],s=[a.css("paddingTop"),a.css("paddingRight"),a.css("paddingBottom"),a.css("paddingLeft")],t=0;i.length>t;t++)this.borderDif[t]=(parseInt(i[t],10)||0)+(parseInt(s[t],10)||0);a.css({height:n.height()-this.borderDif[0]-this.borderDif[2]||0,width:n.width()-this.borderDif[1]-this.borderDif[3]||0})}}},_renderProxy:function(){var t=this.element,i=this.options;this.elementOffset=t.offset(),this._helper?(this.helper=this.helper||e("<div style='overflow:hidden;'></div>"),this.helper.addClass(this._helper).css({width:this.element.outerWidth()-1,height:this.element.outerHeight()-1,position:"absolute",left:this.elementOffset.left+"px",top:this.elementOffset.top+"px",zIndex:++i.zIndex}),this.helper.appendTo("body").disableSelection()):this.helper=this.element},_change:{e:function(e,t){return{width:this.originalSize.width+t}},w:function(e,t){var i=this.originalSize,s=this.originalPosition;return{left:s.left+t,width:i.width-t}},n:function(e,t,i){var s=this.originalSize,a=this.originalPosition;return{top:a.top+i,height:s.height-i}},s:function(e,t,i){return{height:this.originalSize.height+i}},se:function(t,i,s){return e.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[t,i,s]))},sw:function(t,i,s){return e.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[t,i,s]))},ne:function(t,i,s){return e.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[t,i,s]))},nw:function(t,i,s){return e.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[t,i,s]))}},_propagate:function(t,i){e.ui.plugin.call(this,t,[i,this.ui()]),"resize"!==t&&this._trigger(t,i,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),e.ui.plugin.add("resizable","animate",{stop:function(t){var i=e(this).data("ui-resizable"),s=i.options,a=i._proportionallyResizeElements,n=a.length&&/textarea/i.test(a[0].nodeName),r=n&&e.ui.hasScroll(a[0],"left")?0:i.sizeDiff.height,o=n?0:i.sizeDiff.width,h={width:i.size.width-o,height:i.size.height-r},l=parseInt(i.element.css("left"),10)+(i.position.left-i.originalPosition.left)||null,u=parseInt(i.element.css("top"),10)+(i.position.top-i.originalPosition.top)||null;i.element.animate(e.extend(h,u&&l?{top:u,left:l}:{}),{duration:s.animateDuration,easing:s.animateEasing,step:function(){var s={width:parseInt(i.element.css("width"),10),height:parseInt(i.element.css("height"),10),top:parseInt(i.element.css("top"),10),left:parseInt(i.element.css("left"),10)};a&&a.length&&e(a[0]).css({width:s.width,height:s.height}),i._updateCache(s),i._propagate("resize",t)}})}}),e.ui.plugin.add("resizable","containment",{start:function(){var i,s,a,n,r,o,h,l=e(this).data("ui-resizable"),u=l.options,c=l.element,d=u.containment,p=d instanceof e?d.get(0):/parent/.test(d)?c.parent().get(0):d;p&&(l.containerElement=e(p),/document/.test(d)||d===document?(l.containerOffset={left:0,top:0},l.containerPosition={left:0,top:0},l.parentData={element:e(document),left:0,top:0,width:e(document).width(),height:e(document).height()||document.body.parentNode.scrollHeight}):(i=e(p),s=[],e(["Top","Right","Left","Bottom"]).each(function(e,a){s[e]=t(i.css("padding"+a))}),l.containerOffset=i.offset(),l.containerPosition=i.position(),l.containerSize={height:i.innerHeight()-s[3],width:i.innerWidth()-s[1]},a=l.containerOffset,n=l.containerSize.height,r=l.containerSize.width,o=e.ui.hasScroll(p,"left")?p.scrollWidth:r,h=e.ui.hasScroll(p)?p.scrollHeight:n,l.parentData={element:p,left:a.left,top:a.top,width:o,height:h}))},resize:function(t){var i,s,a,n,r=e(this).data("ui-resizable"),o=r.options,h=r.containerOffset,l=r.position,u=r._aspectRatio||t.shiftKey,c={top:0,left:0},d=r.containerElement;d[0]!==document&&/static/.test(d.css("position"))&&(c=h),l.left<(r._helper?h.left:0)&&(r.size.width=r.size.width+(r._helper?r.position.left-h.left:r.position.left-c.left),u&&(r.size.height=r.size.width/r.aspectRatio),r.position.left=o.helper?h.left:0),l.top<(r._helper?h.top:0)&&(r.size.height=r.size.height+(r._helper?r.position.top-h.top:r.position.top),u&&(r.size.width=r.size.height*r.aspectRatio),r.position.top=r._helper?h.top:0),r.offset.left=r.parentData.left+r.position.left,r.offset.top=r.parentData.top+r.position.top,i=Math.abs((r._helper?r.offset.left-c.left:r.offset.left-c.left)+r.sizeDiff.width),s=Math.abs((r._helper?r.offset.top-c.top:r.offset.top-h.top)+r.sizeDiff.height),a=r.containerElement.get(0)===r.element.parent().get(0),n=/relative|absolute/.test(r.containerElement.css("position")),a&&n&&(i-=r.parentData.left),i+r.size.width>=r.parentData.width&&(r.size.width=r.parentData.width-i,u&&(r.size.height=r.size.width/r.aspectRatio)),s+r.size.height>=r.parentData.height&&(r.size.height=r.parentData.height-s,u&&(r.size.width=r.size.height*r.aspectRatio))},stop:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.containerOffset,a=t.containerPosition,n=t.containerElement,r=e(t.helper),o=r.offset(),h=r.outerWidth()-t.sizeDiff.width,l=r.outerHeight()-t.sizeDiff.height;t._helper&&!i.animate&&/relative/.test(n.css("position"))&&e(this).css({left:o.left-a.left-s.left,width:h,height:l}),t._helper&&!i.animate&&/static/.test(n.css("position"))&&e(this).css({left:o.left-a.left-s.left,width:h,height:l})}}),e.ui.plugin.add("resizable","alsoResize",{start:function(){var t=e(this).data("ui-resizable"),i=t.options,s=function(t){e(t).each(function(){var t=e(this);t.data("ui-resizable-alsoresize",{width:parseInt(t.width(),10),height:parseInt(t.height(),10),left:parseInt(t.css("left"),10),top:parseInt(t.css("top"),10)})})};"object"!=typeof i.alsoResize||i.alsoResize.parentNode?s(i.alsoResize):i.alsoResize.length?(i.alsoResize=i.alsoResize[0],s(i.alsoResize)):e.each(i.alsoResize,function(e){s(e)})},resize:function(t,i){var s=e(this).data("ui-resizable"),a=s.options,n=s.originalSize,r=s.originalPosition,o={height:s.size.height-n.height||0,width:s.size.width-n.width||0,top:s.position.top-r.top||0,left:s.position.left-r.left||0},h=function(t,s){e(t).each(function(){var t=e(this),a=e(this).data("ui-resizable-alsoresize"),n={},r=s&&s.length?s:t.parents(i.originalElement[0]).length?["width","height"]:["width","height","top","left"];e.each(r,function(e,t){var i=(a[t]||0)+(o[t]||0);i&&i>=0&&(n[t]=i||null)}),t.css(n)})};"object"!=typeof a.alsoResize||a.alsoResize.nodeType?h(a.alsoResize):e.each(a.alsoResize,function(e,t){h(e,t)})},stop:function(){e(this).removeData("resizable-alsoresize")}}),e.ui.plugin.add("resizable","ghost",{start:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.size;t.ghost=t.originalElement.clone(),t.ghost.css({opacity:.25,display:"block",position:"relative",height:s.height,width:s.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass("string"==typeof i.ghost?i.ghost:""),t.ghost.appendTo(t.helper)},resize:function(){var t=e(this).data("ui-resizable");t.ghost&&t.ghost.css({position:"relative",height:t.size.height,width:t.size.width})},stop:function(){var t=e(this).data("ui-resizable");t.ghost&&t.helper&&t.helper.get(0).removeChild(t.ghost.get(0))}}),e.ui.plugin.add("resizable","grid",{resize:function(){var t=e(this).data("ui-resizable"),i=t.options,s=t.size,a=t.originalSize,n=t.originalPosition,r=t.axis,o="number"==typeof i.grid?[i.grid,i.grid]:i.grid,h=o[0]||1,l=o[1]||1,u=Math.round((s.width-a.width)/h)*h,c=Math.round((s.height-a.height)/l)*l,d=a.width+u,p=a.height+c,f=i.maxWidth&&d>i.maxWidth,m=i.maxHeight&&p>i.maxHeight,g=i.minWidth&&i.minWidth>d,v=i.minHeight&&i.minHeight>p;i.grid=o,g&&(d+=h),v&&(p+=l),f&&(d-=h),m&&(p-=l),/^(se|s|e)$/.test(r)?(t.size.width=d,t.size.height=p):/^(ne)$/.test(r)?(t.size.width=d,t.size.height=p,t.position.top=n.top-c):/^(sw)$/.test(r)?(t.size.width=d,t.size.height=p,t.position.left=n.left-u):(t.size.width=d,t.size.height=p,t.position.top=n.top-c,t.position.left=n.left-u)}})})(jQuery);(function(e){var t=0,i={},a={};i.height=i.paddingTop=i.paddingBottom=i.borderTopWidth=i.borderBottomWidth="hide",a.height=a.paddingTop=a.paddingBottom=a.borderTopWidth=a.borderBottomWidth="show",e.widget("ui.accordion",{version:"1.10.3",options:{active:0,animate:{},collapsible:!1,event:"click",header:"> li > :first-child,> :not(li):even",heightStyle:"auto",icons:{activeHeader:"ui-icon-triangle-1-s",header:"ui-icon-triangle-1-e"},activate:null,beforeActivate:null},_create:function(){var t=this.options;this.prevShow=this.prevHide=e(),this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role","tablist"),t.collapsible||t.active!==!1&&null!=t.active||(t.active=0),this._processPanels(),0>t.active&&(t.active+=this.headers.length),this._refresh()},_getCreateEventData:function(){return{header:this.active,panel:this.active.length?this.active.next():e(),content:this.active.length?this.active.next():e()}},_createIcons:function(){var t=this.options.icons;t&&(e("<span>").addClass("ui-accordion-header-icon ui-icon "+t.header).prependTo(this.headers),this.active.children(".ui-accordion-header-icon").removeClass(t.header).addClass(t.activeHeader),this.headers.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()},_destroy:function(){var e;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),this._destroyIcons(),e=this.headers.next().css("display","").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").each(function(){/^ui-accordion/.test(this.id)&&this.removeAttribute("id")}),"content"!==this.options.heightStyle&&e.css("height","")},_setOption:function(e,t){return"active"===e?(this._activate(t),undefined):("event"===e&&(this.options.event&&this._off(this.headers,this.options.event),this._setupEvents(t)),this._super(e,t),"collapsible"!==e||t||this.options.active!==!1||this._activate(0),"icons"===e&&(this._destroyIcons(),t&&this._createIcons()),"disabled"===e&&this.headers.add(this.headers.next()).toggleClass("ui-state-disabled",!!t),undefined)},_keydown:function(t){if(!t.altKey&&!t.ctrlKey){var i=e.ui.keyCode,a=this.headers.length,s=this.headers.index(t.target),n=!1;switch(t.keyCode){case i.RIGHT:case i.DOWN:n=this.headers[(s+1)%a];break;case i.LEFT:case i.UP:n=this.headers[(s-1+a)%a];break;case i.SPACE:case i.ENTER:this._eventHandler(t);break;case i.HOME:n=this.headers[0];break;case i.END:n=this.headers[a-1]}n&&(e(t.target).attr("tabIndex",-1),e(n).attr("tabIndex",0),n.focus(),t.preventDefault())}},_panelKeyDown:function(t){t.keyCode===e.ui.keyCode.UP&&t.ctrlKey&&e(t.currentTarget).prev().focus()},refresh:function(){var t=this.options;this._processPanels(),t.active===!1&&t.collapsible===!0||!this.headers.length?(t.active=!1,this.active=e()):t.active===!1?this._activate(0):this.active.length&&!e.contains(this.element[0],this.active[0])?this.headers.length===this.headers.find(".ui-state-disabled").length?(t.active=!1,this.active=e()):this._activate(Math.max(0,t.active-1)):t.active=this.headers.index(this.active),this._destroyIcons(),this._refresh()},_processPanels:function(){this.headers=this.element.find(this.options.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all"),this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide()},_refresh:function(){var i,a=this.options,s=a.heightStyle,n=this.element.parent(),r=this.accordionId="ui-accordion-"+(this.element.attr("id")||++t);this.active=this._findActive(a.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all"),this.active.next().addClass("ui-accordion-content-active").show(),this.headers.attr("role","tab").each(function(t){var i=e(this),a=i.attr("id"),s=i.next(),n=s.attr("id");a||(a=r+"-header-"+t,i.attr("id",a)),n||(n=r+"-panel-"+t,s.attr("id",n)),i.attr("aria-controls",n),s.attr("aria-labelledby",a)}).next().attr("role","tabpanel"),this.headers.not(this.active).attr({"aria-selected":"false",tabIndex:-1}).next().attr({"aria-expanded":"false","aria-hidden":"true"}).hide(),this.active.length?this.active.attr({"aria-selected":"true",tabIndex:0}).next().attr({"aria-expanded":"true","aria-hidden":"false"}):this.headers.eq(0).attr("tabIndex",0),this._createIcons(),this._setupEvents(a.event),"fill"===s?(i=n.height(),this.element.siblings(":visible").each(function(){var t=e(this),a=t.css("position");"absolute"!==a&&"fixed"!==a&&(i-=t.outerHeight(!0))}),this.headers.each(function(){i-=e(this).outerHeight(!0)}),this.headers.next().each(function(){e(this).height(Math.max(0,i-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):"auto"===s&&(i=0,this.headers.next().each(function(){i=Math.max(i,e(this).css("height","").height())}).height(i))},_activate:function(t){var i=this._findActive(t)[0];i!==this.active[0]&&(i=i||this.active[0],this._eventHandler({target:i,currentTarget:i,preventDefault:e.noop}))},_findActive:function(t){return"number"==typeof t?this.headers.eq(t):e()},_setupEvents:function(t){var i={keydown:"_keydown"};t&&e.each(t.split(" "),function(e,t){i[t]="_eventHandler"}),this._off(this.headers.add(this.headers.next())),this._on(this.headers,i),this._on(this.headers.next(),{keydown:"_panelKeyDown"}),this._hoverable(this.headers),this._focusable(this.headers)},_eventHandler:function(t){var i=this.options,a=this.active,s=e(t.currentTarget),n=s[0]===a[0],r=n&&i.collapsible,o=r?e():s.next(),h=a.next(),l={oldHeader:a,oldPanel:h,newHeader:r?e():s,newPanel:o};t.preventDefault(),n&&!i.collapsible||this._trigger("beforeActivate",t,l)===!1||(i.active=r?!1:this.headers.index(s),this.active=n?e():s,this._toggle(l),a.removeClass("ui-accordion-header-active ui-state-active"),i.icons&&a.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header),n||(s.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"),i.icons&&s.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader),s.next().addClass("ui-accordion-content-active")))},_toggle:function(t){var i=t.newPanel,a=this.prevShow.length?this.prevShow:t.oldPanel;this.prevShow.add(this.prevHide).stop(!0,!0),this.prevShow=i,this.prevHide=a,this.options.animate?this._animate(i,a,t):(a.hide(),i.show(),this._toggleComplete(t)),a.attr({"aria-expanded":"false","aria-hidden":"true"}),a.prev().attr("aria-selected","false"),i.length&&a.length?a.prev().attr("tabIndex",-1):i.length&&this.headers.filter(function(){return 0===e(this).attr("tabIndex")}).attr("tabIndex",-1),i.attr({"aria-expanded":"true","aria-hidden":"false"}).prev().attr({"aria-selected":"true",tabIndex:0})},_animate:function(e,t,s){var n,r,o,h=this,l=0,u=e.length&&(!t.length||e.index()<t.index()),d=this.options.animate||{},c=u&&d.down||d,p=function(){h._toggleComplete(s)};return"number"==typeof c&&(o=c),"string"==typeof c&&(r=c),r=r||c.easing||d.easing,o=o||c.duration||d.duration,t.length?e.length?(n=e.show().outerHeight(),t.animate(i,{duration:o,easing:r,step:function(e,t){t.now=Math.round(e)}}),e.hide().animate(a,{duration:o,easing:r,complete:p,step:function(e,i){i.now=Math.round(e),"height"!==i.prop?l+=i.now:"content"!==h.options.heightStyle&&(i.now=Math.round(n-t.outerHeight()-l),l=0)}}),undefined):t.animate(i,o,r,p):e.animate(a,o,r,p)},_toggleComplete:function(e){var t=e.oldPanel;t.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all"),t.length&&(t.parent()[0].className=t.parent()[0].className),this._trigger("activate",null,e)}})})(jQuery);(function(e){var t=0;e.widget("ui.autocomplete",{version:"1.10.3",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var t,i,a,s=this.element[0].nodeName.toLowerCase(),n="textarea"===s,r="input"===s;this.isMultiLine=n?!0:r?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[n||r?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(s){if(this.element.prop("readOnly"))return t=!0,a=!0,i=!0,undefined;t=!1,a=!1,i=!1;var n=e.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:t=!0,this._move("previousPage",s);break;case n.PAGE_DOWN:t=!0,this._move("nextPage",s);break;case n.UP:t=!0,this._keyEvent("previous",s);break;case n.DOWN:t=!0,this._keyEvent("next",s);break;case n.ENTER:case n.NUMPAD_ENTER:this.menu.active&&(t=!0,s.preventDefault(),this.menu.select(s));break;case n.TAB:this.menu.active&&this.menu.select(s);break;case n.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(s),s.preventDefault());break;default:i=!0,this._searchTimeout(s)}},keypress:function(a){if(t)return t=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&a.preventDefault(),undefined;if(!i){var s=e.ui.keyCode;switch(a.keyCode){case s.PAGE_UP:this._move("previousPage",a);break;case s.PAGE_DOWN:this._move("nextPage",a);break;case s.UP:this._keyEvent("previous",a);break;case s.DOWN:this._keyEvent("next",a)}}},input:function(e){return a?(a=!1,e.preventDefault(),undefined):(this._searchTimeout(e),undefined)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(e){return this.cancelBlur?(delete this.cancelBlur,undefined):(clearTimeout(this.searching),this.close(e),this._change(e),undefined)}}),this._initSource(),this.menu=e("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().data("ui-menu"),this._on(this.menu.element,{mousedown:function(t){t.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];e(t.target).closest(".ui-menu-item").length||this._delay(function(){var t=this;this.document.one("mousedown",function(a){a.target===t.element[0]||a.target===i||e.contains(i,a.target)||t.close()})})},menufocus:function(t,i){if(this.isNewMenu&&(this.isNewMenu=!1,t.originalEvent&&/^mouse/.test(t.originalEvent.type)))return this.menu.blur(),this.document.one("mousemove",function(){e(t.target).trigger(t.originalEvent)}),undefined;var a=i.item.data("ui-autocomplete-item");!1!==this._trigger("focus",t,{item:a})?t.originalEvent&&/^key/.test(t.originalEvent.type)&&this._value(a.value):this.liveRegion.text(a.value)},menuselect:function(e,t){var i=t.item.data("ui-autocomplete-item"),a=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=a,this._delay(function(){this.previous=a,this.selectedItem=i})),!1!==this._trigger("select",e,{item:i})&&this._value(i.value),this.term=this._value(),this.close(e),this.selectedItem=i}}),this.liveRegion=e("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertBefore(this.element),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(e,t){this._super(e,t),"source"===e&&this._initSource(),"appendTo"===e&&this.menu.element.appendTo(this._appendTo()),"disabled"===e&&t&&this.xhr&&this.xhr.abort()},_appendTo:function(){var t=this.options.appendTo;return t&&(t=t.jquery||t.nodeType?e(t):this.document.find(t).eq(0)),t||(t=this.element.closest(".ui-front")),t.length||(t=this.document[0].body),t},_initSource:function(){var t,i,a=this;e.isArray(this.options.source)?(t=this.options.source,this.source=function(i,a){a(e.ui.autocomplete.filter(t,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(t,s){a.xhr&&a.xhr.abort(),a.xhr=e.ajax({url:i,data:t,dataType:"json",success:function(e){s(e)},error:function(){s([])}})}):this.source=this.options.source},_searchTimeout:function(e){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,e))},this.options.delay)},search:function(e,t){return e=null!=e?e:this._value(),this.term=this._value(),e.length<this.options.minLength?this.close(t):this._trigger("search",t)!==!1?this._search(e):undefined},_search:function(e){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:e},this._response())},_response:function(){var e=this,i=++t;return function(a){i===t&&e.__response(a),e.pending--,e.pending||e.element.removeClass("ui-autocomplete-loading")}},__response:function(e){e&&(e=this._normalize(e)),this._trigger("response",null,{content:e}),!this.options.disabled&&e&&e.length&&!this.cancelSearch?(this._suggest(e),this._trigger("open")):this._close()},close:function(e){this.cancelSearch=!0,this._close(e)},_close:function(e){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",e))},_change:function(e){this.previous!==this._value()&&this._trigger("change",e,{item:this.selectedItem})},_normalize:function(t){return t.length&&t[0].label&&t[0].value?t:e.map(t,function(t){return"string"==typeof t?{label:t,value:t}:e.extend({label:t.label||t.value,value:t.value||t.label},t)})},_suggest:function(t){var i=this.menu.element.empty();this._renderMenu(i,t),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(e.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var e=this.menu.element;e.outerWidth(Math.max(e.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(t,i){var a=this;e.each(i,function(e,i){a._renderItemData(t,i)})},_renderItemData:function(e,t){return this._renderItem(e,t).data("ui-autocomplete-item",t)},_renderItem:function(t,i){return e("<li>").append(e("<a>").text(i.label)).appendTo(t)},_move:function(e,t){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(e)||this.menu.isLastItem()&&/^next/.test(e)?(this._value(this.term),this.menu.blur(),undefined):(this.menu[e](t),undefined):(this.search(null,t),undefined)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(e,t){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(e,t),t.preventDefault())}}),e.extend(e.ui.autocomplete,{escapeRegex:function(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(t,i){var a=RegExp(e.ui.autocomplete.escapeRegex(i),"i");return e.grep(t,function(e){return a.test(e.label||e.value||e)})}}),e.widget("ui.autocomplete",e.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(e){return e+(e>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(e){var t;this._superApply(arguments),this.options.disabled||this.cancelSearch||(t=e&&e.length?this.options.messages.results(e.length):this.options.messages.noResults,this.liveRegion.text(t))}})})(jQuery);(function(e){var t,i,a,s,n="ui-button ui-widget ui-state-default ui-corner-all",r="ui-state-hover ui-state-active ",o="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",h=function(){var t=e(this);setTimeout(function(){t.find(":ui-button").button("refresh")},1)},l=function(t){var i=t.name,a=t.form,s=e([]);return i&&(i=i.replace(/'/g,"\\'"),s=a?e(a).find("[name='"+i+"']"):e("[name='"+i+"']",t.ownerDocument).filter(function(){return!this.form})),s};e.widget("ui.button",{version:"1.10.3",defaultElement:"<button>",options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset"+this.eventNamespace).bind("reset"+this.eventNamespace,h),"boolean"!=typeof this.options.disabled?this.options.disabled=!!this.element.prop("disabled"):this.element.prop("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var r=this,o=this.options,u="checkbox"===this.type||"radio"===this.type,d=u?"":"ui-state-active",c="ui-state-focus";null===o.label&&(o.label="input"===this.type?this.buttonElement.val():this.buttonElement.html()),this._hoverable(this.buttonElement),this.buttonElement.addClass(n).attr("role","button").bind("mouseenter"+this.eventNamespace,function(){o.disabled||this===t&&e(this).addClass("ui-state-active")}).bind("mouseleave"+this.eventNamespace,function(){o.disabled||e(this).removeClass(d)}).bind("click"+this.eventNamespace,function(e){o.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}),this.element.bind("focus"+this.eventNamespace,function(){r.buttonElement.addClass(c)}).bind("blur"+this.eventNamespace,function(){r.buttonElement.removeClass(c)}),u&&(this.element.bind("change"+this.eventNamespace,function(){s||r.refresh()}),this.buttonElement.bind("mousedown"+this.eventNamespace,function(e){o.disabled||(s=!1,i=e.pageX,a=e.pageY)}).bind("mouseup"+this.eventNamespace,function(e){o.disabled||(i!==e.pageX||a!==e.pageY)&&(s=!0)})),"checkbox"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){return o.disabled||s?!1:undefined}):"radio"===this.type?this.buttonElement.bind("click"+this.eventNamespace,function(){if(o.disabled||s)return!1;e(this).addClass("ui-state-active"),r.buttonElement.attr("aria-pressed","true");var t=r.element[0];l(t).not(t).map(function(){return e(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown"+this.eventNamespace,function(){return o.disabled?!1:(e(this).addClass("ui-state-active"),t=this,r.document.one("mouseup",function(){t=null}),undefined)}).bind("mouseup"+this.eventNamespace,function(){return o.disabled?!1:(e(this).removeClass("ui-state-active"),undefined)}).bind("keydown"+this.eventNamespace,function(t){return o.disabled?!1:((t.keyCode===e.ui.keyCode.SPACE||t.keyCode===e.ui.keyCode.ENTER)&&e(this).addClass("ui-state-active"),undefined)}).bind("keyup"+this.eventNamespace+" blur"+this.eventNamespace,function(){e(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(t){t.keyCode===e.ui.keyCode.SPACE&&e(this).click()})),this._setOption("disabled",o.disabled),this._resetButton()},_determineButtonType:function(){var e,t,i;this.type=this.element.is("[type=checkbox]")?"checkbox":this.element.is("[type=radio]")?"radio":this.element.is("input")?"input":"button","checkbox"===this.type||"radio"===this.type?(e=this.element.parents().last(),t="label[for='"+this.element.attr("id")+"']",this.buttonElement=e.find(t),this.buttonElement.length||(e=e.length?e.siblings():this.element.siblings(),this.buttonElement=e.filter(t),this.buttonElement.length||(this.buttonElement=e.find(t))),this.element.addClass("ui-helper-hidden-accessible"),i=this.element.is(":checked"),i&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.prop("aria-pressed",i)):this.buttonElement=this.element},widget:function(){return this.buttonElement},_destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(n+" "+r+" "+o).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title")},_setOption:function(e,t){return this._super(e,t),"disabled"===e?(t?this.element.prop("disabled",!0):this.element.prop("disabled",!1),undefined):(this._resetButton(),undefined)},refresh:function(){var t=this.element.is("input, button")?this.element.is(":disabled"):this.element.hasClass("ui-button-disabled");t!==this.options.disabled&&this._setOption("disabled",t),"radio"===this.type?l(this.element[0]).each(function(){e(this).is(":checked")?e(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):e(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):"checkbox"===this.type&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if("input"===this.type)return this.options.label&&this.element.val(this.options.label),undefined;var t=this.buttonElement.removeClass(o),i=e("<span></span>",this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(t.empty()).text(),a=this.options.icons,s=a.primary&&a.secondary,n=[];a.primary||a.secondary?(this.options.text&&n.push("ui-button-text-icon"+(s?"s":a.primary?"-primary":"-secondary")),a.primary&&t.prepend("<span class='ui-button-icon-primary ui-icon "+a.primary+"'></span>"),a.secondary&&t.append("<span class='ui-button-icon-secondary ui-icon "+a.secondary+"'></span>"),this.options.text||(n.push(s?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||t.attr("title",e.trim(i)))):n.push("ui-button-text-only"),t.addClass(n.join(" "))}}),e.widget("ui.buttonset",{version:"1.10.3",options:{items:"button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(e,t){"disabled"===e&&this.buttons.button("option",e,t),this._super(e,t)},refresh:function(){var t="rtl"===this.element.css("direction");this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(t?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(t?"ui-corner-left":"ui-corner-right").end().end()},_destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return e(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy")}})})(jQuery);(function(e,t){function i(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},e.extend(this._defaults,this.regional[""]),this.dpDiv=a(e("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function a(t){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return t.delegate(i,"mouseout",function(){e(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&e(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&e(this).removeClass("ui-datepicker-next-hover")}).delegate(i,"mouseover",function(){e.datepicker._isDisabledDatepicker(n.inline?t.parent()[0]:n.input[0])||(e(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),e(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&e(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&e(this).addClass("ui-datepicker-next-hover"))})}function s(t,i){e.extend(t,i);for(var a in i)null==i[a]&&(t[a]=i[a]);return t}e.extend(e.ui,{datepicker:{version:"1.10.3"}});var n,r="datepicker";e.extend(i.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(e){return s(this._defaults,e||{}),this},_attachDatepicker:function(t,i){var a,s,n;a=t.nodeName.toLowerCase(),s="div"===a||"span"===a,t.id||(this.uuid+=1,t.id="dp"+this.uuid),n=this._newInst(e(t),s),n.settings=e.extend({},i||{}),"input"===a?this._connectDatepicker(t,n):s&&this._inlineDatepicker(t,n)},_newInst:function(t,i){var s=t[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:s,input:t,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?a(e("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(t,i){var a=e(t);i.append=e([]),i.trigger=e([]),a.hasClass(this.markerClassName)||(this._attachments(a,i),a.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(i),e.data(t,r,i),i.settings.disabled&&this._disableDatepicker(t))},_attachments:function(t,i){var a,s,n,r=this._get(i,"appendText"),o=this._get(i,"isRTL");i.append&&i.append.remove(),r&&(i.append=e("<span class='"+this._appendClass+"'>"+r+"</span>"),t[o?"before":"after"](i.append)),t.unbind("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),a=this._get(i,"showOn"),("focus"===a||"both"===a)&&t.focus(this._showDatepicker),("button"===a||"both"===a)&&(s=this._get(i,"buttonText"),n=this._get(i,"buttonImage"),i.trigger=e(this._get(i,"buttonImageOnly")?e("<img/>").addClass(this._triggerClass).attr({src:n,alt:s,title:s}):e("<button type='button'></button>").addClass(this._triggerClass).html(n?e("<img/>").attr({src:n,alt:s,title:s}):s)),t[o?"before":"after"](i.trigger),i.trigger.click(function(){return e.datepicker._datepickerShowing&&e.datepicker._lastInput===t[0]?e.datepicker._hideDatepicker():e.datepicker._datepickerShowing&&e.datepicker._lastInput!==t[0]?(e.datepicker._hideDatepicker(),e.datepicker._showDatepicker(t[0])):e.datepicker._showDatepicker(t[0]),!1}))},_autoSize:function(e){if(this._get(e,"autoSize")&&!e.inline){var t,i,a,s,n=new Date(2009,11,20),r=this._get(e,"dateFormat");r.match(/[DM]/)&&(t=function(e){for(i=0,a=0,s=0;e.length>s;s++)e[s].length>i&&(i=e[s].length,a=s);return a},n.setMonth(t(this._get(e,r.match(/MM/)?"monthNames":"monthNamesShort"))),n.setDate(t(this._get(e,r.match(/DD/)?"dayNames":"dayNamesShort"))+20-n.getDay())),e.input.attr("size",this._formatDate(e,n).length)}},_inlineDatepicker:function(t,i){var a=e(t);a.hasClass(this.markerClassName)||(a.addClass(this.markerClassName).append(i.dpDiv),e.data(t,r,i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(t),i.dpDiv.css("display","block"))},_dialogDatepicker:function(t,i,a,n,o){var h,l,u,d,c,p=this._dialogInst;return p||(this.uuid+=1,h="dp"+this.uuid,this._dialogInput=e("<input type='text' id='"+h+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),e("body").append(this._dialogInput),p=this._dialogInst=this._newInst(this._dialogInput,!1),p.settings={},e.data(this._dialogInput[0],r,p)),s(p.settings,n||{}),i=i&&i.constructor===Date?this._formatDate(p,i):i,this._dialogInput.val(i),this._pos=o?o.length?o:[o.pageX,o.pageY]:null,this._pos||(l=document.documentElement.clientWidth,u=document.documentElement.clientHeight,d=document.documentElement.scrollLeft||document.body.scrollLeft,c=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[l/2-100+d,u/2-150+c]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),p.settings.onSelect=a,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),e.blockUI&&e.blockUI(this.dpDiv),e.data(this._dialogInput[0],r,p),this},_destroyDatepicker:function(t){var i,a=e(t),s=e.data(t,r);a.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),e.removeData(t,r),"input"===i?(s.append.remove(),s.trigger.remove(),a.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):("div"===i||"span"===i)&&a.removeClass(this.markerClassName).empty())},_enableDatepicker:function(t){var i,a,s=e(t),n=e.data(t,r);s.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),"input"===i?(t.disabled=!1,n.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(a=s.children("."+this._inlineClass),a.children().removeClass("ui-state-disabled"),a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=e.map(this._disabledInputs,function(e){return e===t?null:e}))},_disableDatepicker:function(t){var i,a,s=e(t),n=e.data(t,r);s.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),"input"===i?(t.disabled=!0,n.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(a=s.children("."+this._inlineClass),a.children().addClass("ui-state-disabled"),a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=e.map(this._disabledInputs,function(e){return e===t?null:e}),this._disabledInputs[this._disabledInputs.length]=t)},_isDisabledDatepicker:function(e){if(!e)return!1;for(var t=0;this._disabledInputs.length>t;t++)if(this._disabledInputs[t]===e)return!0;return!1},_getInst:function(t){try{return e.data(t,r)}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(i,a,n){var r,o,h,l,u=this._getInst(i);return 2===arguments.length&&"string"==typeof a?"defaults"===a?e.extend({},e.datepicker._defaults):u?"all"===a?e.extend({},u.settings):this._get(u,a):null:(r=a||{},"string"==typeof a&&(r={},r[a]=n),u&&(this._curInst===u&&this._hideDatepicker(),o=this._getDateDatepicker(i,!0),h=this._getMinMaxDate(u,"min"),l=this._getMinMaxDate(u,"max"),s(u.settings,r),null!==h&&r.dateFormat!==t&&r.minDate===t&&(u.settings.minDate=this._formatDate(u,h)),null!==l&&r.dateFormat!==t&&r.maxDate===t&&(u.settings.maxDate=this._formatDate(u,l)),"disabled"in r&&(r.disabled?this._disableDatepicker(i):this._enableDatepicker(i)),this._attachments(e(i),u),this._autoSize(u),this._setDate(u,o),this._updateAlternate(u),this._updateDatepicker(u)),t)},_changeDatepicker:function(e,t,i){this._optionDatepicker(e,t,i)},_refreshDatepicker:function(e){var t=this._getInst(e);t&&this._updateDatepicker(t)},_setDateDatepicker:function(e,t){var i=this._getInst(e);i&&(this._setDate(i,t),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(e,t){var i=this._getInst(e);return i&&!i.inline&&this._setDateFromField(i,t),i?this._getDate(i):null},_doKeyDown:function(t){var i,a,s,n=e.datepicker._getInst(t.target),r=!0,o=n.dpDiv.is(".ui-datepicker-rtl");if(n._keyEvent=!0,e.datepicker._datepickerShowing)switch(t.keyCode){case 9:e.datepicker._hideDatepicker(),r=!1;break;case 13:return s=e("td."+e.datepicker._dayOverClass+":not(."+e.datepicker._currentClass+")",n.dpDiv),s[0]&&e.datepicker._selectDay(t.target,n.selectedMonth,n.selectedYear,s[0]),i=e.datepicker._get(n,"onSelect"),i?(a=e.datepicker._formatDate(n),i.apply(n.input?n.input[0]:null,[a,n])):e.datepicker._hideDatepicker(),!1;case 27:e.datepicker._hideDatepicker();break;case 33:e.datepicker._adjustDate(t.target,t.ctrlKey?-e.datepicker._get(n,"stepBigMonths"):-e.datepicker._get(n,"stepMonths"),"M");break;case 34:e.datepicker._adjustDate(t.target,t.ctrlKey?+e.datepicker._get(n,"stepBigMonths"):+e.datepicker._get(n,"stepMonths"),"M");break;case 35:(t.ctrlKey||t.metaKey)&&e.datepicker._clearDate(t.target),r=t.ctrlKey||t.metaKey;break;case 36:(t.ctrlKey||t.metaKey)&&e.datepicker._gotoToday(t.target),r=t.ctrlKey||t.metaKey;break;case 37:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,o?1:-1,"D"),r=t.ctrlKey||t.metaKey,t.originalEvent.altKey&&e.datepicker._adjustDate(t.target,t.ctrlKey?-e.datepicker._get(n,"stepBigMonths"):-e.datepicker._get(n,"stepMonths"),"M");break;case 38:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,-7,"D"),r=t.ctrlKey||t.metaKey;break;case 39:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,o?-1:1,"D"),r=t.ctrlKey||t.metaKey,t.originalEvent.altKey&&e.datepicker._adjustDate(t.target,t.ctrlKey?+e.datepicker._get(n,"stepBigMonths"):+e.datepicker._get(n,"stepMonths"),"M");break;case 40:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,7,"D"),r=t.ctrlKey||t.metaKey;break;default:r=!1}else 36===t.keyCode&&t.ctrlKey?e.datepicker._showDatepicker(this):r=!1;r&&(t.preventDefault(),t.stopPropagation())},_doKeyPress:function(i){var a,s,n=e.datepicker._getInst(i.target);return e.datepicker._get(n,"constrainInput")?(a=e.datepicker._possibleChars(e.datepicker._get(n,"dateFormat")),s=String.fromCharCode(null==i.charCode?i.keyCode:i.charCode),i.ctrlKey||i.metaKey||" ">s||!a||a.indexOf(s)>-1):t},_doKeyUp:function(t){var i,a=e.datepicker._getInst(t.target);if(a.input.val()!==a.lastVal)try{i=e.datepicker.parseDate(e.datepicker._get(a,"dateFormat"),a.input?a.input.val():null,e.datepicker._getFormatConfig(a)),i&&(e.datepicker._setDateFromField(a),e.datepicker._updateAlternate(a),e.datepicker._updateDatepicker(a))}catch(s){}return!0},_showDatepicker:function(t){if(t=t.target||t,"input"!==t.nodeName.toLowerCase()&&(t=e("input",t.parentNode)[0]),!e.datepicker._isDisabledDatepicker(t)&&e.datepicker._lastInput!==t){var i,a,n,r,o,h,l;i=e.datepicker._getInst(t),e.datepicker._curInst&&e.datepicker._curInst!==i&&(e.datepicker._curInst.dpDiv.stop(!0,!0),i&&e.datepicker._datepickerShowing&&e.datepicker._hideDatepicker(e.datepicker._curInst.input[0])),a=e.datepicker._get(i,"beforeShow"),n=a?a.apply(t,[t,i]):{},n!==!1&&(s(i.settings,n),i.lastVal=null,e.datepicker._lastInput=t,e.datepicker._setDateFromField(i),e.datepicker._inDialog&&(t.value=""),e.datepicker._pos||(e.datepicker._pos=e.datepicker._findPos(t),e.datepicker._pos[1]+=t.offsetHeight),r=!1,e(t).parents().each(function(){return r|="fixed"===e(this).css("position"),!r}),o={left:e.datepicker._pos[0],top:e.datepicker._pos[1]},e.datepicker._pos=null,i.dpDiv.empty(),i.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),e.datepicker._updateDatepicker(i),o=e.datepicker._checkOffset(i,o,r),i.dpDiv.css({position:e.datepicker._inDialog&&e.blockUI?"static":r?"fixed":"absolute",display:"none",left:o.left+"px",top:o.top+"px"}),i.inline||(h=e.datepicker._get(i,"showAnim"),l=e.datepicker._get(i,"duration"),i.dpDiv.zIndex(e(t).zIndex()+1),e.datepicker._datepickerShowing=!0,e.effects&&e.effects.effect[h]?i.dpDiv.show(h,e.datepicker._get(i,"showOptions"),l):i.dpDiv[h||"show"](h?l:null),e.datepicker._shouldFocusInput(i)&&i.input.focus(),e.datepicker._curInst=i))}},_updateDatepicker:function(t){this.maxRows=4,n=t,t.dpDiv.empty().append(this._generateHTML(t)),this._attachHandlers(t),t.dpDiv.find("."+this._dayOverClass+" a").mouseover();var i,a=this._getNumberOfMonths(t),s=a[1],r=17;t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),s>1&&t.dpDiv.addClass("ui-datepicker-multi-"+s).css("width",r*s+"em"),t.dpDiv[(1!==a[0]||1!==a[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),t.dpDiv[(this._get(t,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),t===e.datepicker._curInst&&e.datepicker._datepickerShowing&&e.datepicker._shouldFocusInput(t)&&t.input.focus(),t.yearshtml&&(i=t.yearshtml,setTimeout(function(){i===t.yearshtml&&t.yearshtml&&t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml),i=t.yearshtml=null},0))},_shouldFocusInput:function(e){return e.input&&e.input.is(":visible")&&!e.input.is(":disabled")&&!e.input.is(":focus")},_checkOffset:function(t,i,a){var s=t.dpDiv.outerWidth(),n=t.dpDiv.outerHeight(),r=t.input?t.input.outerWidth():0,o=t.input?t.input.outerHeight():0,h=document.documentElement.clientWidth+(a?0:e(document).scrollLeft()),l=document.documentElement.clientHeight+(a?0:e(document).scrollTop());return i.left-=this._get(t,"isRTL")?s-r:0,i.left-=a&&i.left===t.input.offset().left?e(document).scrollLeft():0,i.top-=a&&i.top===t.input.offset().top+o?e(document).scrollTop():0,i.left-=Math.min(i.left,i.left+s>h&&h>s?Math.abs(i.left+s-h):0),i.top-=Math.min(i.top,i.top+n>l&&l>n?Math.abs(n+o):0),i},_findPos:function(t){for(var i,a=this._getInst(t),s=this._get(a,"isRTL");t&&("hidden"===t.type||1!==t.nodeType||e.expr.filters.hidden(t));)t=t[s?"previousSibling":"nextSibling"];return i=e(t).offset(),[i.left,i.top]},_hideDatepicker:function(t){var i,a,s,n,o=this._curInst;!o||t&&o!==e.data(t,r)||this._datepickerShowing&&(i=this._get(o,"showAnim"),a=this._get(o,"duration"),s=function(){e.datepicker._tidyDialog(o)},e.effects&&(e.effects.effect[i]||e.effects[i])?o.dpDiv.hide(i,e.datepicker._get(o,"showOptions"),a,s):o.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?a:null,s),i||s(),this._datepickerShowing=!1,n=this._get(o,"onClose"),n&&n.apply(o.input?o.input[0]:null,[o.input?o.input.val():"",o]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),e.blockUI&&(e.unblockUI(),e("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(e){e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(t){if(e.datepicker._curInst){var i=e(t.target),a=e.datepicker._getInst(i[0]);(i[0].id!==e.datepicker._mainDivId&&0===i.parents("#"+e.datepicker._mainDivId).length&&!i.hasClass(e.datepicker.markerClassName)&&!i.closest("."+e.datepicker._triggerClass).length&&e.datepicker._datepickerShowing&&(!e.datepicker._inDialog||!e.blockUI)||i.hasClass(e.datepicker.markerClassName)&&e.datepicker._curInst!==a)&&e.datepicker._hideDatepicker()}},_adjustDate:function(t,i,a){var s=e(t),n=this._getInst(s[0]);this._isDisabledDatepicker(s[0])||(this._adjustInstDate(n,i+("M"===a?this._get(n,"showCurrentAtPos"):0),a),this._updateDatepicker(n))},_gotoToday:function(t){var i,a=e(t),s=this._getInst(a[0]);this._get(s,"gotoCurrent")&&s.currentDay?(s.selectedDay=s.currentDay,s.drawMonth=s.selectedMonth=s.currentMonth,s.drawYear=s.selectedYear=s.currentYear):(i=new Date,s.selectedDay=i.getDate(),s.drawMonth=s.selectedMonth=i.getMonth(),s.drawYear=s.selectedYear=i.getFullYear()),this._notifyChange(s),this._adjustDate(a)},_selectMonthYear:function(t,i,a){var s=e(t),n=this._getInst(s[0]);n["selected"+("M"===a?"Month":"Year")]=n["draw"+("M"===a?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(n),this._adjustDate(s)},_selectDay:function(t,i,a,s){var n,r=e(t);e(s).hasClass(this._unselectableClass)||this._isDisabledDatepicker(r[0])||(n=this._getInst(r[0]),n.selectedDay=n.currentDay=e("a",s).html(),n.selectedMonth=n.currentMonth=i,n.selectedYear=n.currentYear=a,this._selectDate(t,this._formatDate(n,n.currentDay,n.currentMonth,n.currentYear)))},_clearDate:function(t){var i=e(t);this._selectDate(i,"")},_selectDate:function(t,i){var a,s=e(t),n=this._getInst(s[0]);i=null!=i?i:this._formatDate(n),n.input&&n.input.val(i),this._updateAlternate(n),a=this._get(n,"onSelect"),a?a.apply(n.input?n.input[0]:null,[i,n]):n.input&&n.input.trigger("change"),n.inline?this._updateDatepicker(n):(this._hideDatepicker(),this._lastInput=n.input[0],"object"!=typeof n.input[0]&&n.input.focus(),this._lastInput=null)},_updateAlternate:function(t){var i,a,s,n=this._get(t,"altField");n&&(i=this._get(t,"altFormat")||this._get(t,"dateFormat"),a=this._getDate(t),s=this.formatDate(i,a,this._getFormatConfig(t)),e(n).each(function(){e(this).val(s)}))},noWeekends:function(e){var t=e.getDay();return[t>0&&6>t,""]},iso8601Week:function(e){var t,i=new Date(e.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),t=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((t-i)/864e5)/7)+1},parseDate:function(i,a,s){if(null==i||null==a)throw"Invalid arguments";if(a="object"==typeof a?""+a:a+"",""===a)return null;var n,r,o,h,l=0,u=(s?s.shortYearCutoff:null)||this._defaults.shortYearCutoff,d="string"!=typeof u?u:(new Date).getFullYear()%100+parseInt(u,10),c=(s?s.dayNamesShort:null)||this._defaults.dayNamesShort,p=(s?s.dayNames:null)||this._defaults.dayNames,m=(s?s.monthNamesShort:null)||this._defaults.monthNamesShort,f=(s?s.monthNames:null)||this._defaults.monthNames,g=-1,v=-1,y=-1,b=-1,_=!1,k=function(e){var t=i.length>n+1&&i.charAt(n+1)===e;return t&&n++,t},x=function(e){var t=k(e),i="@"===e?14:"!"===e?20:"y"===e&&t?4:"o"===e?3:2,s=RegExp("^\\d{1,"+i+"}"),n=a.substring(l).match(s);if(!n)throw"Missing number at position "+l;return l+=n[0].length,parseInt(n[0],10)},D=function(i,s,n){var r=-1,o=e.map(k(i)?n:s,function(e,t){return[[t,e]]}).sort(function(e,t){return-(e[1].length-t[1].length)});if(e.each(o,function(e,i){var s=i[1];return a.substr(l,s.length).toLowerCase()===s.toLowerCase()?(r=i[0],l+=s.length,!1):t}),-1!==r)return r+1;throw"Unknown name at position "+l},w=function(){if(a.charAt(l)!==i.charAt(n))throw"Unexpected literal at position "+l;l++};for(n=0;i.length>n;n++)if(_)"'"!==i.charAt(n)||k("'")?w():_=!1;else switch(i.charAt(n)){case"d":y=x("d");break;case"D":D("D",c,p);break;case"o":b=x("o");break;case"m":v=x("m");break;case"M":v=D("M",m,f);break;case"y":g=x("y");break;case"@":h=new Date(x("@")),g=h.getFullYear(),v=h.getMonth()+1,y=h.getDate();break;case"!":h=new Date((x("!")-this._ticksTo1970)/1e4),g=h.getFullYear(),v=h.getMonth()+1,y=h.getDate();break;case"'":k("'")?w():_=!0;break;default:w()}if(a.length>l&&(o=a.substr(l),!/^\s+/.test(o)))throw"Extra/unparsed characters found in date: "+o;if(-1===g?g=(new Date).getFullYear():100>g&&(g+=(new Date).getFullYear()-(new Date).getFullYear()%100+(d>=g?0:-100)),b>-1)for(v=1,y=b;;){if(r=this._getDaysInMonth(g,v-1),r>=y)break;v++,y-=r}if(h=this._daylightSavingAdjust(new Date(g,v-1,y)),h.getFullYear()!==g||h.getMonth()+1!==v||h.getDate()!==y)throw"Invalid date";return h},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:1e7*60*60*24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),formatDate:function(e,t,i){if(!t)return"";var a,s=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,n=(i?i.dayNames:null)||this._defaults.dayNames,r=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,o=(i?i.monthNames:null)||this._defaults.monthNames,h=function(t){var i=e.length>a+1&&e.charAt(a+1)===t;return i&&a++,i},l=function(e,t,i){var a=""+t;if(h(e))for(;i>a.length;)a="0"+a;return a},u=function(e,t,i,a){return h(e)?a[t]:i[t]},d="",c=!1;if(t)for(a=0;e.length>a;a++)if(c)"'"!==e.charAt(a)||h("'")?d+=e.charAt(a):c=!1;else switch(e.charAt(a)){case"d":d+=l("d",t.getDate(),2);break;case"D":d+=u("D",t.getDay(),s,n);break;case"o":d+=l("o",Math.round((new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()-new Date(t.getFullYear(),0,0).getTime())/864e5),3);break;case"m":d+=l("m",t.getMonth()+1,2);break;case"M":d+=u("M",t.getMonth(),r,o);break;case"y":d+=h("y")?t.getFullYear():(10>t.getYear()%100?"0":"")+t.getYear()%100;break;case"@":d+=t.getTime();break;case"!":d+=1e4*t.getTime()+this._ticksTo1970;break;case"'":h("'")?d+="'":c=!0;break;default:d+=e.charAt(a)}return d},_possibleChars:function(e){var t,i="",a=!1,s=function(i){var a=e.length>t+1&&e.charAt(t+1)===i;return a&&t++,a};for(t=0;e.length>t;t++)if(a)"'"!==e.charAt(t)||s("'")?i+=e.charAt(t):a=!1;else switch(e.charAt(t)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":s("'")?i+="'":a=!0;break;default:i+=e.charAt(t)}return i},_get:function(e,i){return e.settings[i]!==t?e.settings[i]:this._defaults[i]},_setDateFromField:function(e,t){if(e.input.val()!==e.lastVal){var i=this._get(e,"dateFormat"),a=e.lastVal=e.input?e.input.val():null,s=this._getDefaultDate(e),n=s,r=this._getFormatConfig(e);try{n=this.parseDate(i,a,r)||s}catch(o){a=t?"":a}e.selectedDay=n.getDate(),e.drawMonth=e.selectedMonth=n.getMonth(),e.drawYear=e.selectedYear=n.getFullYear(),e.currentDay=a?n.getDate():0,e.currentMonth=a?n.getMonth():0,e.currentYear=a?n.getFullYear():0,this._adjustInstDate(e)}},_getDefaultDate:function(e){return this._restrictMinMax(e,this._determineDate(e,this._get(e,"defaultDate"),new Date))},_determineDate:function(t,i,a){var s=function(e){var t=new Date;return t.setDate(t.getDate()+e),t},n=function(i){try{return e.datepicker.parseDate(e.datepicker._get(t,"dateFormat"),i,e.datepicker._getFormatConfig(t))}catch(a){}for(var s=(i.toLowerCase().match(/^c/)?e.datepicker._getDate(t):null)||new Date,n=s.getFullYear(),r=s.getMonth(),o=s.getDate(),h=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,l=h.exec(i);l;){switch(l[2]||"d"){case"d":case"D":o+=parseInt(l[1],10);break;case"w":case"W":o+=7*parseInt(l[1],10);break;case"m":case"M":r+=parseInt(l[1],10),o=Math.min(o,e.datepicker._getDaysInMonth(n,r));break;case"y":case"Y":n+=parseInt(l[1],10),o=Math.min(o,e.datepicker._getDaysInMonth(n,r))}l=h.exec(i)}return new Date(n,r,o)},r=null==i||""===i?a:"string"==typeof i?n(i):"number"==typeof i?isNaN(i)?a:s(i):new Date(i.getTime());return r=r&&"Invalid Date"==""+r?a:r,r&&(r.setHours(0),r.setMinutes(0),r.setSeconds(0),r.setMilliseconds(0)),this._daylightSavingAdjust(r)},_daylightSavingAdjust:function(e){return e?(e.setHours(e.getHours()>12?e.getHours()+2:0),e):null},_setDate:function(e,t,i){var a=!t,s=e.selectedMonth,n=e.selectedYear,r=this._restrictMinMax(e,this._determineDate(e,t,new Date));e.selectedDay=e.currentDay=r.getDate(),e.drawMonth=e.selectedMonth=e.currentMonth=r.getMonth(),e.drawYear=e.selectedYear=e.currentYear=r.getFullYear(),s===e.selectedMonth&&n===e.selectedYear||i||this._notifyChange(e),this._adjustInstDate(e),e.input&&e.input.val(a?"":this._formatDate(e))},_getDate:function(e){var t=!e.currentYear||e.input&&""===e.input.val()?null:this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return t},_attachHandlers:function(t){var i=this._get(t,"stepMonths"),a="#"+t.id.replace(/\\\\/g,"\\");t.dpDiv.find("[data-handler]").map(function(){var t={prev:function(){e.datepicker._adjustDate(a,-i,"M")},next:function(){e.datepicker._adjustDate(a,+i,"M")},hide:function(){e.datepicker._hideDatepicker()},today:function(){e.datepicker._gotoToday(a)},selectDay:function(){return e.datepicker._selectDay(a,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return e.datepicker._selectMonthYear(a,this,"M"),!1},selectYear:function(){return e.datepicker._selectMonthYear(a,this,"Y"),!1}};e(this).bind(this.getAttribute("data-event"),t[this.getAttribute("data-handler")])})},_generateHTML:function(e){var t,i,a,s,n,r,o,h,l,u,d,c,p,m,f,g,v,y,b,_,k,x,D,w,T,M,S,N,C,A,P,I,F,j,H,E,z,L,O,R=new Date,W=this._daylightSavingAdjust(new Date(R.getFullYear(),R.getMonth(),R.getDate())),Y=this._get(e,"isRTL"),J=this._get(e,"showButtonPanel"),$=this._get(e,"hideIfNoPrevNext"),Q=this._get(e,"navigationAsDateFormat"),B=this._getNumberOfMonths(e),K=this._get(e,"showCurrentAtPos"),V=this._get(e,"stepMonths"),U=1!==B[0]||1!==B[1],G=this._daylightSavingAdjust(e.currentDay?new Date(e.currentYear,e.currentMonth,e.currentDay):new Date(9999,9,9)),q=this._getMinMaxDate(e,"min"),X=this._getMinMaxDate(e,"max"),Z=e.drawMonth-K,et=e.drawYear;if(0>Z&&(Z+=12,et--),X)for(t=this._daylightSavingAdjust(new Date(X.getFullYear(),X.getMonth()-B[0]*B[1]+1,X.getDate())),t=q&&q>t?q:t;this._daylightSavingAdjust(new Date(et,Z,1))>t;)Z--,0>Z&&(Z=11,et--);for(e.drawMonth=Z,e.drawYear=et,i=this._get(e,"prevText"),i=Q?this.formatDate(i,this._daylightSavingAdjust(new Date(et,Z-V,1)),this._getFormatConfig(e)):i,a=this._canAdjustMonth(e,-1,et,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>":$?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>",s=this._get(e,"nextText"),s=Q?this.formatDate(s,this._daylightSavingAdjust(new Date(et,Z+V,1)),this._getFormatConfig(e)):s,n=this._canAdjustMonth(e,1,et,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+s+"</span></a>":$?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+s+"</span></a>",r=this._get(e,"currentText"),o=this._get(e,"gotoCurrent")&&e.currentDay?G:W,r=Q?this.formatDate(r,o,this._getFormatConfig(e)):r,h=e.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(e,"closeText")+"</button>",l=J?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(Y?h:"")+(this._isInRange(e,o)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+r+"</button>":"")+(Y?"":h)+"</div>":"",u=parseInt(this._get(e,"firstDay"),10),u=isNaN(u)?0:u,d=this._get(e,"showWeek"),c=this._get(e,"dayNames"),p=this._get(e,"dayNamesMin"),m=this._get(e,"monthNames"),f=this._get(e,"monthNamesShort"),g=this._get(e,"beforeShowDay"),v=this._get(e,"showOtherMonths"),y=this._get(e,"selectOtherMonths"),b=this._getDefaultDate(e),_="",x=0;B[0]>x;x++){for(D="",this.maxRows=4,w=0;B[1]>w;w++){if(T=this._daylightSavingAdjust(new Date(et,Z,e.selectedDay)),M=" ui-corner-all",S="",U){if(S+="<div class='ui-datepicker-group",B[1]>1)switch(w){case 0:S+=" ui-datepicker-group-first",M=" ui-corner-"+(Y?"right":"left");break;case B[1]-1:S+=" ui-datepicker-group-last",M=" ui-corner-"+(Y?"left":"right");break;default:S+=" ui-datepicker-group-middle",M=""}S+="'>"}for(S+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+M+"'>"+(/all|left/.test(M)&&0===x?Y?n:a:"")+(/all|right/.test(M)&&0===x?Y?a:n:"")+this._generateMonthYearHeader(e,Z,et,q,X,x>0||w>0,m,f)+"</div><table class='ui-datepicker-calendar'><thead>"+"<tr>",N=d?"<th class='ui-datepicker-week-col'>"+this._get(e,"weekHeader")+"</th>":"",k=0;7>k;k++)C=(k+u)%7,N+="<th"+((k+u+6)%7>=5?" class='ui-datepicker-week-end'":"")+">"+"<span title='"+c[C]+"'>"+p[C]+"</span></th>";for(S+=N+"</tr></thead><tbody>",A=this._getDaysInMonth(et,Z),et===e.selectedYear&&Z===e.selectedMonth&&(e.selectedDay=Math.min(e.selectedDay,A)),P=(this._getFirstDayOfMonth(et,Z)-u+7)%7,I=Math.ceil((P+A)/7),F=U?this.maxRows>I?this.maxRows:I:I,this.maxRows=F,j=this._daylightSavingAdjust(new Date(et,Z,1-P)),H=0;F>H;H++){for(S+="<tr>",E=d?"<td class='ui-datepicker-week-col'>"+this._get(e,"calculateWeek")(j)+"</td>":"",k=0;7>k;k++)z=g?g.apply(e.input?e.input[0]:null,[j]):[!0,""],L=j.getMonth()!==Z,O=L&&!y||!z[0]||q&&q>j||X&&j>X,E+="<td class='"+((k+u+6)%7>=5?" ui-datepicker-week-end":"")+(L?" ui-datepicker-other-month":"")+(j.getTime()===T.getTime()&&Z===e.selectedMonth&&e._keyEvent||b.getTime()===j.getTime()&&b.getTime()===T.getTime()?" "+this._dayOverClass:"")+(O?" "+this._unselectableClass+" ui-state-disabled":"")+(L&&!v?"":" "+z[1]+(j.getTime()===G.getTime()?" "+this._currentClass:"")+(j.getTime()===W.getTime()?" ui-datepicker-today":""))+"'"+(L&&!v||!z[2]?"":" title='"+z[2].replace(/'/g,"&#39;")+"'")+(O?"":" data-handler='selectDay' data-event='click' data-month='"+j.getMonth()+"' data-year='"+j.getFullYear()+"'")+">"+(L&&!v?"&#xa0;":O?"<span class='ui-state-default'>"+j.getDate()+"</span>":"<a class='ui-state-default"+(j.getTime()===W.getTime()?" ui-state-highlight":"")+(j.getTime()===G.getTime()?" ui-state-active":"")+(L?" ui-priority-secondary":"")+"' href='#'>"+j.getDate()+"</a>")+"</td>",j.setDate(j.getDate()+1),j=this._daylightSavingAdjust(j);S+=E+"</tr>"}Z++,Z>11&&(Z=0,et++),S+="</tbody></table>"+(U?"</div>"+(B[0]>0&&w===B[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),D+=S}_+=D}return _+=l,e._keyEvent=!1,_},_generateMonthYearHeader:function(e,t,i,a,s,n,r,o){var h,l,u,d,c,p,m,f,g=this._get(e,"changeMonth"),v=this._get(e,"changeYear"),y=this._get(e,"showMonthAfterYear"),b="<div class='ui-datepicker-title'>",_="";if(n||!g)_+="<span class='ui-datepicker-month'>"+r[t]+"</span>";else{for(h=a&&a.getFullYear()===i,l=s&&s.getFullYear()===i,_+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",u=0;12>u;u++)(!h||u>=a.getMonth())&&(!l||s.getMonth()>=u)&&(_+="<option value='"+u+"'"+(u===t?" selected='selected'":"")+">"+o[u]+"</option>");_+="</select>"}if(y||(b+=_+(!n&&g&&v?"":"&#xa0;")),!e.yearshtml)if(e.yearshtml="",n||!v)b+="<span class='ui-datepicker-year'>"+i+"</span>";else{for(d=this._get(e,"yearRange").split(":"),c=(new Date).getFullYear(),p=function(e){var t=e.match(/c[+\-].*/)?i+parseInt(e.substring(1),10):e.match(/[+\-].*/)?c+parseInt(e,10):parseInt(e,10);
	return isNaN(t)?c:t},m=p(d[0]),f=Math.max(m,p(d[1]||"")),m=a?Math.max(m,a.getFullYear()):m,f=s?Math.min(f,s.getFullYear()):f,e.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";f>=m;m++)e.yearshtml+="<option value='"+m+"'"+(m===i?" selected='selected'":"")+">"+m+"</option>";e.yearshtml+="</select>",b+=e.yearshtml,e.yearshtml=null}return b+=this._get(e,"yearSuffix"),y&&(b+=(!n&&g&&v?"":"&#xa0;")+_),b+="</div>"},_adjustInstDate:function(e,t,i){var a=e.drawYear+("Y"===i?t:0),s=e.drawMonth+("M"===i?t:0),n=Math.min(e.selectedDay,this._getDaysInMonth(a,s))+("D"===i?t:0),r=this._restrictMinMax(e,this._daylightSavingAdjust(new Date(a,s,n)));e.selectedDay=r.getDate(),e.drawMonth=e.selectedMonth=r.getMonth(),e.drawYear=e.selectedYear=r.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(e)},_restrictMinMax:function(e,t){var i=this._getMinMaxDate(e,"min"),a=this._getMinMaxDate(e,"max"),s=i&&i>t?i:t;return a&&s>a?a:s},_notifyChange:function(e){var t=this._get(e,"onChangeMonthYear");t&&t.apply(e.input?e.input[0]:null,[e.selectedYear,e.selectedMonth+1,e])},_getNumberOfMonths:function(e){var t=this._get(e,"numberOfMonths");return null==t?[1,1]:"number"==typeof t?[1,t]:t},_getMinMaxDate:function(e,t){return this._determineDate(e,this._get(e,t+"Date"),null)},_getDaysInMonth:function(e,t){return 32-this._daylightSavingAdjust(new Date(e,t,32)).getDate()},_getFirstDayOfMonth:function(e,t){return new Date(e,t,1).getDay()},_canAdjustMonth:function(e,t,i,a){var s=this._getNumberOfMonths(e),n=this._daylightSavingAdjust(new Date(i,a+(0>t?t:s[0]*s[1]),1));return 0>t&&n.setDate(this._getDaysInMonth(n.getFullYear(),n.getMonth())),this._isInRange(e,n)},_isInRange:function(e,t){var i,a,s=this._getMinMaxDate(e,"min"),n=this._getMinMaxDate(e,"max"),r=null,o=null,h=this._get(e,"yearRange");return h&&(i=h.split(":"),a=(new Date).getFullYear(),r=parseInt(i[0],10),o=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(r+=a),i[1].match(/[+\-].*/)&&(o+=a)),(!s||t.getTime()>=s.getTime())&&(!n||t.getTime()<=n.getTime())&&(!r||t.getFullYear()>=r)&&(!o||o>=t.getFullYear())},_getFormatConfig:function(e){var t=this._get(e,"shortYearCutoff");return t="string"!=typeof t?t:(new Date).getFullYear()%100+parseInt(t,10),{shortYearCutoff:t,dayNamesShort:this._get(e,"dayNamesShort"),dayNames:this._get(e,"dayNames"),monthNamesShort:this._get(e,"monthNamesShort"),monthNames:this._get(e,"monthNames")}},_formatDate:function(e,t,i,a){t||(e.currentDay=e.selectedDay,e.currentMonth=e.selectedMonth,e.currentYear=e.selectedYear);var s=t?"object"==typeof t?t:this._daylightSavingAdjust(new Date(a,i,t)):this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return this.formatDate(this._get(e,"dateFormat"),s,this._getFormatConfig(e))}}),e.fn.datepicker=function(t){if(!this.length)return this;e.datepicker.initialized||(e(document).mousedown(e.datepicker._checkExternalClick),e.datepicker.initialized=!0),0===e("#"+e.datepicker._mainDivId).length&&e("body").append(e.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return"string"!=typeof t||"isDisabled"!==t&&"getDate"!==t&&"widget"!==t?"option"===t&&2===arguments.length&&"string"==typeof arguments[1]?e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof t?e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this].concat(i)):e.datepicker._attachDatepicker(this,t)}):e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this[0]].concat(i))},e.datepicker=new i,e.datepicker.initialized=!1,e.datepicker.uuid=(new Date).getTime(),e.datepicker.version="1.10.3"})(jQuery);(function(e){var t={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},i={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0};e.widget("ui.dialog",{version:"1.10.3",options:{appendTo:"body",autoOpen:!0,buttons:[],closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:null,maxWidth:null,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",of:window,collision:"fit",using:function(t){var i=e(this).css(t).offset().top;0>i&&e(this).css("top",t.top-i)}},resizable:!0,show:null,title:null,width:300,beforeClose:null,close:null,drag:null,dragStart:null,dragStop:null,focus:null,open:null,resize:null,resizeStart:null,resizeStop:null},_create:function(){this.originalCss={display:this.element[0].style.display,width:this.element[0].style.width,minHeight:this.element[0].style.minHeight,maxHeight:this.element[0].style.maxHeight,height:this.element[0].style.height},this.originalPosition={parent:this.element.parent(),index:this.element.parent().children().index(this.element)},this.originalTitle=this.element.attr("title"),this.options.title=this.options.title||this.originalTitle,this._createWrapper(),this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog),this._createTitlebar(),this._createButtonPane(),this.options.draggable&&e.fn.draggable&&this._makeDraggable(),this.options.resizable&&e.fn.resizable&&this._makeResizable(),this._isOpen=!1},_init:function(){this.options.autoOpen&&this.open()},_appendTo:function(){var t=this.options.appendTo;return t&&(t.jquery||t.nodeType)?e(t):this.document.find(t||"body").eq(0)},_destroy:function(){var e,t=this.originalPosition;this._destroyOverlay(),this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach(),this.uiDialog.stop(!0,!0).remove(),this.originalTitle&&this.element.attr("title",this.originalTitle),e=t.parent.children().eq(t.index),e.length&&e[0]!==this.element[0]?e.before(this.element):t.parent.append(this.element)},widget:function(){return this.uiDialog},disable:e.noop,enable:e.noop,close:function(t){var i=this;this._isOpen&&this._trigger("beforeClose",t)!==!1&&(this._isOpen=!1,this._destroyOverlay(),this.opener.filter(":focusable").focus().length||e(this.document[0].activeElement).blur(),this._hide(this.uiDialog,this.options.hide,function(){i._trigger("close",t)}))},isOpen:function(){return this._isOpen},moveToTop:function(){this._moveToTop()},_moveToTop:function(e,t){var i=!!this.uiDialog.nextAll(":visible").insertBefore(this.uiDialog).length;return i&&!t&&this._trigger("focus",e),i},open:function(){var t=this;return this._isOpen?(this._moveToTop()&&this._focusTabbable(),undefined):(this._isOpen=!0,this.opener=e(this.document[0].activeElement),this._size(),this._position(),this._createOverlay(),this._moveToTop(null,!0),this._show(this.uiDialog,this.options.show,function(){t._focusTabbable(),t._trigger("focus")}),this._trigger("open"),undefined)},_focusTabbable:function(){var e=this.element.find("[autofocus]");e.length||(e=this.element.find(":tabbable")),e.length||(e=this.uiDialogButtonPane.find(":tabbable")),e.length||(e=this.uiDialogTitlebarClose.filter(":tabbable")),e.length||(e=this.uiDialog),e.eq(0).focus()},_keepFocus:function(t){function i(){var t=this.document[0].activeElement,i=this.uiDialog[0]===t||e.contains(this.uiDialog[0],t);i||this._focusTabbable()}t.preventDefault(),i.call(this),this._delay(i)},_createWrapper:function(){this.uiDialog=e("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front "+this.options.dialogClass).hide().attr({tabIndex:-1,role:"dialog"}).appendTo(this._appendTo()),this._on(this.uiDialog,{keydown:function(t){if(this.options.closeOnEscape&&!t.isDefaultPrevented()&&t.keyCode&&t.keyCode===e.ui.keyCode.ESCAPE)return t.preventDefault(),this.close(t),undefined;if(t.keyCode===e.ui.keyCode.TAB){var i=this.uiDialog.find(":tabbable"),a=i.filter(":first"),s=i.filter(":last");t.target!==s[0]&&t.target!==this.uiDialog[0]||t.shiftKey?t.target!==a[0]&&t.target!==this.uiDialog[0]||!t.shiftKey||(s.focus(1),t.preventDefault()):(a.focus(1),t.preventDefault())}},mousedown:function(e){this._moveToTop(e)&&this._focusTabbable()}}),this.element.find("[aria-describedby]").length||this.uiDialog.attr({"aria-describedby":this.element.uniqueId().attr("id")})},_createTitlebar:function(){var t;this.uiDialogTitlebar=e("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog),this._on(this.uiDialogTitlebar,{mousedown:function(t){e(t.target).closest(".ui-dialog-titlebar-close")||this.uiDialog.focus()}}),this.uiDialogTitlebarClose=e("<button></button>").button({label:this.options.closeText,icons:{primary:"ui-icon-closethick"},text:!1}).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar),this._on(this.uiDialogTitlebarClose,{click:function(e){e.preventDefault(),this.close(e)}}),t=e("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar),this._title(t),this.uiDialog.attr({"aria-labelledby":t.attr("id")})},_title:function(e){this.options.title||e.html("&#160;"),e.text(this.options.title)},_createButtonPane:function(){this.uiDialogButtonPane=e("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),this.uiButtonSet=e("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane),this._createButtons()},_createButtons:function(){var t=this,i=this.options.buttons;return this.uiDialogButtonPane.remove(),this.uiButtonSet.empty(),e.isEmptyObject(i)||e.isArray(i)&&!i.length?(this.uiDialog.removeClass("ui-dialog-buttons"),undefined):(e.each(i,function(i,a){var s,n;a=e.isFunction(a)?{click:a,text:i}:a,a=e.extend({type:"button"},a),s=a.click,a.click=function(){s.apply(t.element[0],arguments)},n={icons:a.icons,text:a.showText},delete a.icons,delete a.showText,e("<button></button>",a).button(n).appendTo(t.uiButtonSet)}),this.uiDialog.addClass("ui-dialog-buttons"),this.uiDialogButtonPane.appendTo(this.uiDialog),undefined)},_makeDraggable:function(){function t(e){return{position:e.position,offset:e.offset}}var i=this,a=this.options;this.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(a,s){e(this).addClass("ui-dialog-dragging"),i._blockFrames(),i._trigger("dragStart",a,t(s))},drag:function(e,a){i._trigger("drag",e,t(a))},stop:function(s,n){a.position=[n.position.left-i.document.scrollLeft(),n.position.top-i.document.scrollTop()],e(this).removeClass("ui-dialog-dragging"),i._unblockFrames(),i._trigger("dragStop",s,t(n))}})},_makeResizable:function(){function t(e){return{originalPosition:e.originalPosition,originalSize:e.originalSize,position:e.position,size:e.size}}var i=this,a=this.options,s=a.resizable,n=this.uiDialog.css("position"),r="string"==typeof s?s:"n,e,s,w,se,sw,ne,nw";this.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:this.element,maxWidth:a.maxWidth,maxHeight:a.maxHeight,minWidth:a.minWidth,minHeight:this._minHeight(),handles:r,start:function(a,s){e(this).addClass("ui-dialog-resizing"),i._blockFrames(),i._trigger("resizeStart",a,t(s))},resize:function(e,a){i._trigger("resize",e,t(a))},stop:function(s,n){a.height=e(this).height(),a.width=e(this).width(),e(this).removeClass("ui-dialog-resizing"),i._unblockFrames(),i._trigger("resizeStop",s,t(n))}}).css("position",n)},_minHeight:function(){var e=this.options;return"auto"===e.height?e.minHeight:Math.min(e.minHeight,e.height)},_position:function(){var e=this.uiDialog.is(":visible");e||this.uiDialog.show(),this.uiDialog.position(this.options.position),e||this.uiDialog.hide()},_setOptions:function(a){var s=this,n=!1,r={};e.each(a,function(e,a){s._setOption(e,a),e in t&&(n=!0),e in i&&(r[e]=a)}),n&&(this._size(),this._position()),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option",r)},_setOption:function(e,t){var i,a,s=this.uiDialog;"dialogClass"===e&&s.removeClass(this.options.dialogClass).addClass(t),"disabled"!==e&&(this._super(e,t),"appendTo"===e&&this.uiDialog.appendTo(this._appendTo()),"buttons"===e&&this._createButtons(),"closeText"===e&&this.uiDialogTitlebarClose.button({label:""+t}),"draggable"===e&&(i=s.is(":data(ui-draggable)"),i&&!t&&s.draggable("destroy"),!i&&t&&this._makeDraggable()),"position"===e&&this._position(),"resizable"===e&&(a=s.is(":data(ui-resizable)"),a&&!t&&s.resizable("destroy"),a&&"string"==typeof t&&s.resizable("option","handles",t),a||t===!1||this._makeResizable()),"title"===e&&this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))},_size:function(){var e,t,i,a=this.options;this.element.show().css({width:"auto",minHeight:0,maxHeight:"none",height:0}),a.minWidth>a.width&&(a.width=a.minWidth),e=this.uiDialog.css({height:"auto",width:a.width}).outerHeight(),t=Math.max(0,a.minHeight-e),i="number"==typeof a.maxHeight?Math.max(0,a.maxHeight-e):"none","auto"===a.height?this.element.css({minHeight:t,maxHeight:i,height:"auto"}):this.element.height(Math.max(0,a.height-e)),this.uiDialog.is(":data(ui-resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())},_blockFrames:function(){this.iframeBlocks=this.document.find("iframe").map(function(){var t=e(this);return e("<div>").css({position:"absolute",width:t.outerWidth(),height:t.outerHeight()}).appendTo(t.parent()).offset(t.offset())[0]})},_unblockFrames:function(){this.iframeBlocks&&(this.iframeBlocks.remove(),delete this.iframeBlocks)},_allowInteraction:function(t){return e(t.target).closest(".ui-dialog").length?!0:!!e(t.target).closest(".ui-datepicker").length},_createOverlay:function(){if(this.options.modal){var t=this,i=this.widgetFullName;e.ui.dialog.overlayInstances||this._delay(function(){e.ui.dialog.overlayInstances&&this.document.bind("focusin.dialog",function(a){t._allowInteraction(a)||(a.preventDefault(),e(".ui-dialog:visible:last .ui-dialog-content").data(i)._focusTabbable())})}),this.overlay=e("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo()),this._on(this.overlay,{mousedown:"_keepFocus"}),e.ui.dialog.overlayInstances++}},_destroyOverlay:function(){this.options.modal&&this.overlay&&(e.ui.dialog.overlayInstances--,e.ui.dialog.overlayInstances||this.document.unbind("focusin.dialog"),this.overlay.remove(),this.overlay=null)}}),e.ui.dialog.overlayInstances=0,e.uiBackCompat!==!1&&e.widget("ui.dialog",e.ui.dialog,{_position:function(){var t,i=this.options.position,a=[],s=[0,0];i?(("string"==typeof i||"object"==typeof i&&"0"in i)&&(a=i.split?i.split(" "):[i[0],i[1]],1===a.length&&(a[1]=a[0]),e.each(["left","top"],function(e,t){+a[e]===a[e]&&(s[e]=a[e],a[e]=t)}),i={my:a[0]+(0>s[0]?s[0]:"+"+s[0])+" "+a[1]+(0>s[1]?s[1]:"+"+s[1]),at:a.join(" ")}),i=e.extend({},e.ui.dialog.prototype.options.position,i)):i=e.ui.dialog.prototype.options.position,t=this.uiDialog.is(":visible"),t||this.uiDialog.show(),this.uiDialog.position(i),t||this.uiDialog.hide()}})})(jQuery);(function(e){e.widget("ui.menu",{version:"1.10.3",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,e.proxy(function(e){this.options.disabled&&e.preventDefault()},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(e){e.preventDefault()},"click .ui-state-disabled > a":function(e){e.preventDefault()},"click .ui-menu-item:has(a)":function(t){var i=e(t.target).closest(".ui-menu-item");!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.mouseHandled=!0,this.select(t),i.has(".ui-menu").length?this.expand(t):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(t){var i=e(t.currentTarget);i.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(t,i)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(e,t){var i=this.active||this.element.children(".ui-menu-item").eq(0);t||this.focus(e,i)},blur:function(t){this._delay(function(){e.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(t)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(t){e(t.target).closest(".ui-menu").length||this.collapseAll(t),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var t=e(this);t.data("ui-menu-submenu-carat")&&t.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(t){function i(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var s,a,n,r,o,h=!0;switch(t.keyCode){case e.ui.keyCode.PAGE_UP:this.previousPage(t);break;case e.ui.keyCode.PAGE_DOWN:this.nextPage(t);break;case e.ui.keyCode.HOME:this._move("first","first",t);break;case e.ui.keyCode.END:this._move("last","last",t);break;case e.ui.keyCode.UP:this.previous(t);break;case e.ui.keyCode.DOWN:this.next(t);break;case e.ui.keyCode.LEFT:this.collapse(t);break;case e.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(t);break;case e.ui.keyCode.ENTER:case e.ui.keyCode.SPACE:this._activate(t);break;case e.ui.keyCode.ESCAPE:this.collapse(t);break;default:h=!1,a=this.previousFilter||"",n=String.fromCharCode(t.keyCode),r=!1,clearTimeout(this.filterTimer),n===a?r=!0:n=a+n,o=RegExp("^"+i(n),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return o.test(e(this).children("a").text())}),s=r&&-1!==s.index(this.active.next())?this.active.nextAll(".ui-menu-item"):s,s.length||(n=String.fromCharCode(t.keyCode),o=RegExp("^"+i(n),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return o.test(e(this).children("a").text())})),s.length?(this.focus(t,s),s.length>1?(this.previousFilter=n,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}h&&t.preventDefault()},_activate:function(e){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(e):this.select(e))},refresh:function(){var t,i=this.options.icons.submenu,s=this.element.find(this.options.menus);s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var t=e(this),s=t.prev("a"),a=e("<span>").addClass("ui-menu-icon ui-icon "+i).data("ui-menu-submenu-carat",!0);s.attr("aria-haspopup","true").prepend(a),t.attr("aria-labelledby",s.attr("id"))}),t=s.add(this.element),t.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),t.children(":not(.ui-menu-item)").each(function(){var t=e(this);/[^\-\u2014\u2013\s]/.test(t.text())||t.addClass("ui-widget-content ui-menu-divider")}),t.children(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!e.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(e,t){"icons"===e&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(t.submenu),this._super(e,t)},focus:function(e,t){var i,s;this.blur(e,e&&"focus"===e.type),this._scrollIntoView(t),this.active=t.first(),s=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),e&&"keydown"===e.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=t.children(".ui-menu"),i.length&&/^mouse/.test(e.type)&&this._startOpening(i),this.activeMenu=t.parent(),this._trigger("focus",e,{item:t})},_scrollIntoView:function(t){var i,s,a,n,r,o;this._hasScroll()&&(i=parseFloat(e.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(e.css(this.activeMenu[0],"paddingTop"))||0,a=t.offset().top-this.activeMenu.offset().top-i-s,n=this.activeMenu.scrollTop(),r=this.activeMenu.height(),o=t.height(),0>a?this.activeMenu.scrollTop(n+a):a+o>r&&this.activeMenu.scrollTop(n+a-r+o))},blur:function(e,t){t||clearTimeout(this.timer),this.active&&(this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",e,{item:this.active}))},_startOpening:function(e){clearTimeout(this.timer),"true"===e.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(e)},this.delay))},_open:function(t){var i=e.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden","true"),t.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(t,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:e(t&&t.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(t),this.activeMenu=s},this.delay)},_close:function(e){e||(e=this.active?this.active.parent():this.element),e.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(e){var t=this.active&&this.active.parent().closest(".ui-menu-item",this.element);t&&t.length&&(this._close(),this.focus(e,t))},expand:function(e){var t=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();t&&t.length&&(this._open(t.parent()),this._delay(function(){this.focus(e,t)}))},next:function(e){this._move("next","first",e)},previous:function(e){this._move("prev","last",e)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(e,t,i){var s;this.active&&(s="first"===e||"last"===e?this.active["first"===e?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[e+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.children(".ui-menu-item")[t]()),this.focus(i,s)},nextPage:function(t){var i,s,a;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,a=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=e(this),0>i.offset().top-s-a}),this.focus(t,i)):this.focus(t,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]())),undefined):(this.next(t),undefined)},previousPage:function(t){var i,s,a;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,a=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=e(this),i.offset().top-s+a>0}),this.focus(t,i)):this.focus(t,this.activeMenu.children(".ui-menu-item").first())),undefined):(this.next(t),undefined)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(t){this.active=this.active||e(t.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(t,!0),this._trigger("select",t,i)}})})(jQuery);(function(e,t){function i(){return++a}function s(e){return e.hash.length>1&&decodeURIComponent(e.href.replace(n,""))===decodeURIComponent(location.href.replace(n,""))}var a=0,n=/#.*$/;e.widget("ui.tabs",{version:"1.10.3",delay:300,options:{active:null,collapsible:!1,event:"click",heightStyle:"content",hide:null,show:null,activate:null,beforeActivate:null,beforeLoad:null,load:null},_create:function(){var t=this,i=this.options;this.running=!1,this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible",i.collapsible).delegate(".ui-tabs-nav > li","mousedown"+this.eventNamespace,function(t){e(this).is(".ui-state-disabled")&&t.preventDefault()}).delegate(".ui-tabs-anchor","focus"+this.eventNamespace,function(){e(this).closest("li").is(".ui-state-disabled")&&this.blur()}),this._processTabs(),i.active=this._initialActive(),e.isArray(i.disabled)&&(i.disabled=e.unique(i.disabled.concat(e.map(this.tabs.filter(".ui-state-disabled"),function(e){return t.tabs.index(e)}))).sort()),this.active=this.options.active!==!1&&this.anchors.length?this._findActive(i.active):e(),this._refresh(),this.active.length&&this.load(i.active)},_initialActive:function(){var i=this.options.active,s=this.options.collapsible,a=location.hash.substring(1);return null===i&&(a&&this.tabs.each(function(s,n){return e(n).attr("aria-controls")===a?(i=s,!1):t}),null===i&&(i=this.tabs.index(this.tabs.filter(".ui-tabs-active"))),(null===i||-1===i)&&(i=this.tabs.length?0:!1)),i!==!1&&(i=this.tabs.index(this.tabs.eq(i)),-1===i&&(i=s?!1:0)),!s&&i===!1&&this.anchors.length&&(i=0),i},_getCreateEventData:function(){return{tab:this.active,panel:this.active.length?this._getPanelForTab(this.active):e()}},_tabKeydown:function(i){var s=e(this.document[0].activeElement).closest("li"),a=this.tabs.index(s),n=!0;if(!this._handlePageNav(i)){switch(i.keyCode){case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:a++;break;case e.ui.keyCode.UP:case e.ui.keyCode.LEFT:n=!1,a--;break;case e.ui.keyCode.END:a=this.anchors.length-1;break;case e.ui.keyCode.HOME:a=0;break;case e.ui.keyCode.SPACE:return i.preventDefault(),clearTimeout(this.activating),this._activate(a),t;case e.ui.keyCode.ENTER:return i.preventDefault(),clearTimeout(this.activating),this._activate(a===this.options.active?!1:a),t;default:return}i.preventDefault(),clearTimeout(this.activating),a=this._focusNextTab(a,n),i.ctrlKey||(s.attr("aria-selected","false"),this.tabs.eq(a).attr("aria-selected","true"),this.activating=this._delay(function(){this.option("active",a)},this.delay))}},_panelKeydown:function(t){this._handlePageNav(t)||t.ctrlKey&&t.keyCode===e.ui.keyCode.UP&&(t.preventDefault(),this.active.focus())},_handlePageNav:function(i){return i.altKey&&i.keyCode===e.ui.keyCode.PAGE_UP?(this._activate(this._focusNextTab(this.options.active-1,!1)),!0):i.altKey&&i.keyCode===e.ui.keyCode.PAGE_DOWN?(this._activate(this._focusNextTab(this.options.active+1,!0)),!0):t},_findNextTab:function(t,i){function s(){return t>a&&(t=0),0>t&&(t=a),t}for(var a=this.tabs.length-1;-1!==e.inArray(s(),this.options.disabled);)t=i?t+1:t-1;return t},_focusNextTab:function(e,t){return e=this._findNextTab(e,t),this.tabs.eq(e).focus(),e},_setOption:function(e,i){return"active"===e?(this._activate(i),t):"disabled"===e?(this._setupDisabled(i),t):(this._super(e,i),"collapsible"===e&&(this.element.toggleClass("ui-tabs-collapsible",i),i||this.options.active!==!1||this._activate(0)),"event"===e&&this._setupEvents(i),"heightStyle"===e&&this._setupHeightStyle(i),t)},_tabId:function(e){return e.attr("aria-controls")||"ui-tabs-"+i()},_sanitizeSelector:function(e){return e?e.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g,"\\$&"):""},refresh:function(){var t=this.options,i=this.tablist.children(":has(a[href])");t.disabled=e.map(i.filter(".ui-state-disabled"),function(e){return i.index(e)}),this._processTabs(),t.active!==!1&&this.anchors.length?this.active.length&&!e.contains(this.tablist[0],this.active[0])?this.tabs.length===t.disabled.length?(t.active=!1,this.active=e()):this._activate(this._findNextTab(Math.max(0,t.active-1),!1)):t.active=this.tabs.index(this.active):(t.active=!1,this.active=e()),this._refresh()},_refresh:function(){this._setupDisabled(this.options.disabled),this._setupEvents(this.options.event),this._setupHeightStyle(this.options.heightStyle),this.tabs.not(this.active).attr({"aria-selected":"false",tabIndex:-1}),this.panels.not(this._getPanelForTab(this.active)).hide().attr({"aria-expanded":"false","aria-hidden":"true"}),this.active.length?(this.active.addClass("ui-tabs-active ui-state-active").attr({"aria-selected":"true",tabIndex:0}),this._getPanelForTab(this.active).show().attr({"aria-expanded":"true","aria-hidden":"false"})):this.tabs.eq(0).attr("tabIndex",0)},_processTabs:function(){var t=this;this.tablist=this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role","tablist"),this.tabs=this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({role:"tab",tabIndex:-1}),this.anchors=this.tabs.map(function(){return e("a",this)[0]}).addClass("ui-tabs-anchor").attr({role:"presentation",tabIndex:-1}),this.panels=e(),this.anchors.each(function(i,a){var n,r,o,h=e(a).uniqueId().attr("id"),l=e(a).closest("li"),u=l.attr("aria-controls");s(a)?(n=a.hash,r=t.element.find(t._sanitizeSelector(n))):(o=t._tabId(l),n="#"+o,r=t.element.find(n),r.length||(r=t._createPanel(o),r.insertAfter(t.panels[i-1]||t.tablist)),r.attr("aria-live","polite")),r.length&&(t.panels=t.panels.add(r)),u&&l.data("ui-tabs-aria-controls",u),l.attr({"aria-controls":n.substring(1),"aria-labelledby":h}),r.attr("aria-labelledby",h)}),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role","tabpanel")},_getList:function(){return this.element.find("ol,ul").eq(0)},_createPanel:function(t){return e("<div>").attr("id",t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy",!0)},_setupDisabled:function(t){e.isArray(t)&&(t.length?t.length===this.anchors.length&&(t=!0):t=!1);for(var i,s=0;i=this.tabs[s];s++)t===!0||-1!==e.inArray(s,t)?e(i).addClass("ui-state-disabled").attr("aria-disabled","true"):e(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");this.options.disabled=t},_setupEvents:function(t){var i={click:function(e){e.preventDefault()}};t&&e.each(t.split(" "),function(e,t){i[t]="_eventHandler"}),this._off(this.anchors.add(this.tabs).add(this.panels)),this._on(this.anchors,i),this._on(this.tabs,{keydown:"_tabKeydown"}),this._on(this.panels,{keydown:"_panelKeydown"}),this._focusable(this.tabs),this._hoverable(this.tabs)},_setupHeightStyle:function(t){var i,s=this.element.parent();"fill"===t?(i=s.height(),i-=this.element.outerHeight()-this.element.height(),this.element.siblings(":visible").each(function(){var t=e(this),s=t.css("position");"absolute"!==s&&"fixed"!==s&&(i-=t.outerHeight(!0))}),this.element.children().not(this.panels).each(function(){i-=e(this).outerHeight(!0)}),this.panels.each(function(){e(this).height(Math.max(0,i-e(this).innerHeight()+e(this).height()))}).css("overflow","auto")):"auto"===t&&(i=0,this.panels.each(function(){i=Math.max(i,e(this).height("").height())}).height(i))},_eventHandler:function(t){var i=this.options,s=this.active,a=e(t.currentTarget),n=a.closest("li"),r=n[0]===s[0],o=r&&i.collapsible,h=o?e():this._getPanelForTab(n),l=s.length?this._getPanelForTab(s):e(),u={oldTab:s,oldPanel:l,newTab:o?e():n,newPanel:h};t.preventDefault(),n.hasClass("ui-state-disabled")||n.hasClass("ui-tabs-loading")||this.running||r&&!i.collapsible||this._trigger("beforeActivate",t,u)===!1||(i.active=o?!1:this.tabs.index(n),this.active=r?e():n,this.xhr&&this.xhr.abort(),l.length||h.length||e.error("jQuery UI Tabs: Mismatching fragment identifier."),h.length&&this.load(this.tabs.index(n),t),this._toggle(t,u))},_toggle:function(t,i){function s(){n.running=!1,n._trigger("activate",t,i)}function a(){i.newTab.closest("li").addClass("ui-tabs-active ui-state-active"),r.length&&n.options.show?n._show(r,n.options.show,s):(r.show(),s())}var n=this,r=i.newPanel,o=i.oldPanel;this.running=!0,o.length&&this.options.hide?this._hide(o,this.options.hide,function(){i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),a()}):(i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"),o.hide(),a()),o.attr({"aria-expanded":"false","aria-hidden":"true"}),i.oldTab.attr("aria-selected","false"),r.length&&o.length?i.oldTab.attr("tabIndex",-1):r.length&&this.tabs.filter(function(){return 0===e(this).attr("tabIndex")}).attr("tabIndex",-1),r.attr({"aria-expanded":"true","aria-hidden":"false"}),i.newTab.attr({"aria-selected":"true",tabIndex:0})},_activate:function(t){var i,s=this._findActive(t);s[0]!==this.active[0]&&(s.length||(s=this.active),i=s.find(".ui-tabs-anchor")[0],this._eventHandler({target:i,currentTarget:i,preventDefault:e.noop}))},_findActive:function(t){return t===!1?e():this.tabs.eq(t)},_getIndex:function(e){return"string"==typeof e&&(e=this.anchors.index(this.anchors.filter("[href$='"+e+"']"))),e},_destroy:function(){this.xhr&&this.xhr.abort(),this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible"),this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role"),this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId(),this.tabs.add(this.panels).each(function(){e.data(this,"ui-tabs-destroy")?e(this).remove():e(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")}),this.tabs.each(function(){var t=e(this),i=t.data("ui-tabs-aria-controls");i?t.attr("aria-controls",i).removeData("ui-tabs-aria-controls"):t.removeAttr("aria-controls")}),this.panels.show(),"content"!==this.options.heightStyle&&this.panels.css("height","")},enable:function(i){var s=this.options.disabled;s!==!1&&(i===t?s=!1:(i=this._getIndex(i),s=e.isArray(s)?e.map(s,function(e){return e!==i?e:null}):e.map(this.tabs,function(e,t){return t!==i?t:null})),this._setupDisabled(s))},disable:function(i){var s=this.options.disabled;if(s!==!0){if(i===t)s=!0;else{if(i=this._getIndex(i),-1!==e.inArray(i,s))return;s=e.isArray(s)?e.merge([i],s).sort():[i]}this._setupDisabled(s)}},load:function(t,i){t=this._getIndex(t);var a=this,n=this.tabs.eq(t),r=n.find(".ui-tabs-anchor"),o=this._getPanelForTab(n),h={tab:n,panel:o};s(r[0])||(this.xhr=e.ajax(this._ajaxSettings(r,i,h)),this.xhr&&"canceled"!==this.xhr.statusText&&(n.addClass("ui-tabs-loading"),o.attr("aria-busy","true"),this.xhr.success(function(e){setTimeout(function(){o.html(e),a._trigger("load",i,h)},1)}).complete(function(e,t){setTimeout(function(){"abort"===t&&a.panels.stop(!1,!0),n.removeClass("ui-tabs-loading"),o.removeAttr("aria-busy"),e===a.xhr&&delete a.xhr},1)})))},_ajaxSettings:function(t,i,s){var a=this;return{url:t.attr("href"),beforeSend:function(t,n){return a._trigger("beforeLoad",i,e.extend({jqXHR:t,ajaxSettings:n},s))}}},_getPanelForTab:function(t){var i=e(t).attr("aria-controls");return this.element.find(this._sanitizeSelector("#"+i))}})})(jQuery);


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/*
	 * jQuery plugin to wrap elements
	 *
	 * http://jsbin.com/idize
	 *
	 */
	(function(a) {
	    a.fn.wrapChildren = function(b) {
	        var b = a.extend({childElem: undefined, sets: 1, wrapper: "div"}, b || {});
	        if (b.childElem === undefined) {
	            return this
	        }
	        return this.each(function() {
	            var d = a(this).children(b.childElem);
	            var c = [];
	            d.each(function(e, f) {
	                c.push(f);
	                if (((e + 1) % b.sets === 0) || (e === d.length - 1)) {
	                    var g = a(c);
	                    c = [];
	                    g.wrapAll(a("<" + b.wrapper + ">"))
	                }
	            })
	        })
	    }
	})(jQuery);


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/**
	 * BxSlider v4.0 - Fully loaded, responsive content slider
	 * http://bxslider.com
	 *
	 * Copyright 2012, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
	 * Written while drinking Belgian ales and listening to jazz
	 *
	 * Released under the WTFPL license - http://sam.zoy.org/wtfpl/
	 */
	
	;(function($){
	
	    var plugin = {};
	    
	    var defaults = {
	        
	        // GENERAL
	        mode: 'horizontal',
	        slideSelector: '',
	        infiniteLoop: true,
	        hideControlOnEnd: false,
	        speed: 500,
	        easing: null,
	        slideMargin: 0,
	        startSlide: 0,
	        randomStart: false,
	        captions: false,
	        ticker: false,
	        tickerHover: false,
	        adaptiveHeight: false,
	        adaptiveHeightSpeed: 500,
	        touchEnabled: true,
	        swipeThreshold: 50,
	        video: false,
	        useCSS: true,
	        
	        // PAGER
	        pager: true,
	        pagerType: 'full',
	        pagerShortSeparator: ' / ',
	        pagerSelector: null,
	        buildPager: null,
	        pagerCustom: null,
	        
	        // CONTROLS
	        controls: true,
	        nextText: 'Next',
	        prevText: 'Prev',
	        nextSelector: null,
	        prevSelector: null,
	        autoControls: false,
	        startText: 'Start',
	        stopText: 'Stop',
	        autoControlsCombine: false,
	        autoControlsSelector: null,
	        
	        // AUTO
	        auto: false,
	        pause: 4000,
	        autoStart: true,
	        autoDirection: 'next',
	        autoHover: false,
	        autoDelay: 0,
	        
	        // CAROUSEL
	        minSlides: 1,
	        maxSlides: 1,
	        moveSlides: 0,
	        slideWidth: 0,
	        
	        // CALLBACKS
	        onSliderLoad: function() {},
	        onSlideBefore: function() {},
	        onSlideAfter: function() {},
	        onSlideNext: function() {},
	        onSlidePrev: function() {}
	    }
	
	    $.fn.bxSlider = function(options){
	        
	        if(this.length == 0) return;
	        
	        // support mutltiple elements
	        if(this.length > 1){
	            this.each(function(){$(this).bxSlider(options)});
	            return this;
	        }
	        
	        // create a namespace to be used throughout the plugin
	        var slider = {};
	        // set a reference to our slider element
	        var el = this;
	        plugin.el = this;
	        
	        /**
	         * ===================================================================================
	         * = PRIVATE FUNCTIONS
	         * ===================================================================================
	         */
	        
	        /**
	         * Initializes namespace settings to be used throughout plugin
	         */
	        var init = function(){
	            // merge user-supplied options with the defaults
	            slider.settings = $.extend({}, defaults, options);
	            // store the original children
	            slider.children = el.children(slider.settings.slideSelector);
	            // if random start, set the startSlide setting to random number
	            if(slider.settings.randomStart) slider.settings.startSlide = Math.floor(Math.random() * slider.children.length);
	            // store active slide information
	            slider.active = { index: slider.settings.startSlide }
	            // store if the slider is in carousel mode (displaying / moving multiple slides)
	            slider.carousel = slider.settings.minSlides > 1 || slider.settings.maxSlides > 1;
	            // calculate the min / max width thresholds based on min / max number of slides
	            // used to setup and update carousel slides dimensions
	            slider.minThreshold = (slider.settings.minSlides * slider.settings.slideWidth) + ((slider.settings.minSlides - 1) * slider.settings.slideMargin);
	            slider.maxThreshold = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
	            // store the current state of the slider (if currently animating, working is true)
	            slider.working = false;
	            // initialize the controls object
	            slider.controls = {};
	            // determine which property to use for transitions
	            slider.animProp = slider.settings.mode == 'vertical' ? 'top' : 'left';
	            // determine if hardware acceleration can be used
	            slider.usingCSS = slider.settings.useCSS && slider.settings.mode != 'fade' && (function(){
	                // create our test div element
	                var div = document.createElement('div');
	                // css transition properties
	                var props = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
	                // test for each property
	                for(var i in props){
	                    if(div.style[props[i]] !== undefined){
	                        slider.cssPrefix = props[i].replace('Perspective', '').toLowerCase();
	                        slider.animProp = '-' + slider.cssPrefix + '-transform';
	                        return true;
	                    }
	                }
	                return false;
	            }());
	            // if vertical mode always make maxSlides and minSlides equal
	            if(slider.settings.mode == 'vertical') slider.settings.maxSlides = slider.settings.minSlides;
	            // perform all DOM / CSS modifications
	            setup();
	        }
	
	        /**
	         * Performs all DOM and CSS modifications
	         */
	        var setup = function(){
	            // wrap el in a wrapper
	            el.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>');
	            // store a namspace reference to .bx-viewport
	            slider.viewport = el.parent();
	            // add a loading div to display while images are loading
	            slider.loader = $('<div class="bx-loading" />');
	            slider.viewport.prepend(slider.loader);
	            // set el to a massive width, to hold any needed slides
	            // also strip any margin and padding from el
	            el.css({
	                width: slider.settings.mode == 'horizontal' ? slider.children.length * 215 + '%' : 'auto',
	                position: 'relative',
	            });
	            // if using CSS, add the easing property
	            if(slider.usingCSS && slider.settings.easing){
	                el.css('-' + slider.cssPrefix + '-transition-timing-function', slider.settings.easing);
	            // if not using CSS and no easing value was supplied, use the default JS animation easing (swing)
	            }else if(!slider.settings.easing){
	                slider.settings.easing = 'swing';
	            }
	            // make modifications to the viewport (.bx-viewport)
	            slider.viewport.css({
	                width: '100%',
	                overflow: 'hidden',
	                position: 'relative'
	            });
	            // apply css to all slider children
	            slider.children.css({
	                float: slider.settings.mode == 'horizontal' ? 'left' : 'none',
	                listStyle: 'none',
	            });
	            // apply the calculated width after the float is applied to prevent scrollbar interference
	            slider.children.width(getSlideWidth());
	            // if slideMargin is supplied, add the css
	            if(slider.settings.mode == 'horizontal' && slider.settings.slideMargin > 0) slider.children.css('marginRight', slider.settings.slideMargin);
	            if(slider.settings.mode == 'vertical' && slider.settings.slideMargin > 0) slider.children.css('marginBottom', slider.settings.slideMargin);
	            // if "fade" mode, add positioning and z-index CSS
	            if(slider.settings.mode == 'fade'){
	                slider.children.css({
	                    position: 'absolute',
	                    zIndex: 0,
	                    display: 'none'
	                });
	                // prepare the z-index on the showing element
	                slider.children.eq(slider.settings.startSlide).css({zIndex: 50, display: 'block'});
	            }
	            // create an element to contain all slider controls (pager, start / stop, etc)
	            slider.controls.el = $('<div class="bx-controls" />');
	            // if captions are requested, add them
	            if(slider.settings.captions) appendCaptions();
	            // if infinite loop, prepare additional slides
	            if(slider.settings.infiniteLoop && slider.settings.mode != 'fade' && !slider.settings.ticker){
	                var slice = slider.settings.mode == 'vertical' ? slider.settings.minSlides : slider.settings.maxSlides;
	                var sliceAppend = slider.children.slice(0, slice).clone().addClass('bx-clone');
	                var slicePrepend = slider.children.slice(-slice).clone().addClass('bx-clone');
	                el.append(sliceAppend).prepend(slicePrepend);
	            }
	            // check if startSlide is last slide
	            slider.active.last = slider.settings.startSlide == getPagerQty() - 1;
	            // if video is true, set up the fitVids plugin
	            if(slider.settings.video) el.fitVids();
	            // only check for control addition if not in "ticker" mode
	            if(!slider.settings.ticker){
	                // if pager is requested, add it
	                if(slider.settings.pager) appendPager();
	                // if controls are requested, add them
	                if(slider.settings.controls) appendControls();
	                // if auto is true, and auto controls are requested, add them
	                if(slider.settings.auto && slider.settings.autoControls) appendControlsAuto();
	                // if any control option is requested, add the controls wrapper
	                if(slider.settings.controls || slider.settings.autoControls || slider.settings.pager) slider.viewport.after(slider.controls.el);
	            }
	            // preload all images, then perform final DOM / CSS modifications that depend on images being loaded
	            el.children().imagesLoaded(function(){
	                // remove the loading DOM element
	                slider.loader.remove();
	                // set the left / top position of "el"
	                setSlidePosition();
	                // if "vertical" mode, always use adaptiveHeight to prevent odd behavior
	                if (slider.settings.mode == 'vertical') slider.settings.adaptiveHeight = true;
	                // set the viewport height
	                slider.viewport.height(getViewportHeight());
	                // onSliderLoad callback
	                slider.settings.onSliderLoad(slider.active.index);
	                // if auto is true, start the show
	                if (slider.settings.auto && slider.settings.autoStart) initAuto();
	                // if ticker is true, start the ticker
	                if (slider.settings.ticker) initTicker();
	                // if pager is requested, make the appropriate pager link active
	                if (slider.settings.pager) updatePagerActive(slider.settings.startSlide);
	                // check for any updates to the controls (like hideControlOnEnd updates)
	                if (slider.settings.controls) updateDirectionControls();
	                // if touchEnabled is true, setup the touch events
	                if (slider.settings.touchEnabled && !slider.settings.ticker) initTouch();
	            });
	        }
	        
	        /**
	         * Returns the calculated height of the viewport, used to determine either adaptiveHeight or the maxHeight value
	         */
	        var getViewportHeight = function(){
	            var height = 0;
	            // first determine which children (slides) should be used in our height calculation
	            var children = $();
	            // if mode is not "vertical", adaptiveHeight is always false, so return all children
	            if(slider.settings.mode != 'vertical' && !slider.settings.adaptiveHeight){
	                children = slider.children;
	            }else{
	                // if not carousel, return the single active child
	                if(!slider.carousel){
	                    children = slider.children.eq(slider.active.index);
	                // if carousel, return a slice of children
	                }else{
	                    // get the individual slide index
	                    var currentIndex = slider.settings.moveSlides == 1 ? slider.active.index : slider.active.index * getMoveBy();
	                    // add the current slide to the children
	                    children = slider.children.eq(currentIndex);
	                    // cycle through the remaining "showing" slides
	                    for (i = 1; i <= slider.settings.maxSlides - 1; i++){
	                        // if looped back to the start
	                        if(currentIndex + i >= slider.children.length){
	                            children = children.add(slider.children.eq(i - 1));
	                        }else{
	                            children = children.add(slider.children.eq(currentIndex + i));
	                        }
	                    }
	                }
	            }
	            // if "vertical" mode, calculate the sum of the heights of the children
	            if(slider.settings.mode == 'vertical'){
	                children.each(function(index) {
	                  height += $(this).outerHeight();
	                });
	                // add user-supplied margins
	                if(slider.settings.slideMargin > 0){
	                    height += slider.settings.slideMargin * (slider.settings.minSlides - 1);
	                }
	            // if not "vertical" mode, calculate the max height of the children
	            }else{
	                height = Math.max.apply(Math, children.map(function(){
	                    return $(this).outerHeight(false);
	                }).get());
	            }
	            return height;
	        }
	        
	        /**
	         * Returns the calculated width to be applied to each slide
	         */
	        var getSlideWidth = function(){
	            // start with any user-supplied slide width
	            var newElWidth = slider.settings.slideWidth;
	            // get the current viewport width
	            var wrapWidth = slider.viewport.width();
	            // if slide width was not supplied, use the viewport width (means not carousel)
	            if(slider.settings.slideWidth == 0){
	                newElWidth = wrapWidth;
	            // if carousel, use the thresholds to determine the width
	            }else{
	                if(wrapWidth > slider.maxThreshold){
	                    newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.maxSlides - 1))) / slider.settings.maxSlides;
	                }else if(wrapWidth < slider.minThreshold){
	                    newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.minSlides - 1))) / slider.settings.minSlides;
	                }
	            }
	            return newElWidth;
	        }
	        
	        /**
	         * Returns the number of slides currently visible in the viewport (includes partially visible slides)
	         */
	        var getNumberSlidesShowing = function(){
	            var slidesShowing = 1;
	            if(slider.settings.mode == 'horizontal'){
	                // if viewport is smaller than minThreshold, return minSlides
	                if(slider.viewport.width() < slider.minThreshold){
	                    slidesShowing = slider.settings.minSlides;
	                // if viewport is larger than minThreshold, return maxSlides
	                }else if(slider.viewport.width() > slider.maxThreshold){
	                    slidesShowing = slider.settings.maxSlides;
	                // if viewport is between min / max thresholds, divide viewport width by first child width
	                }else{
	                    var childWidth = slider.children.first().width();
	                    slidesShowing = Math.floor(slider.viewport.width() / childWidth);
	                }
	            // if "vertical" mode, slides showing will always be minSlides
	            }else if(slider.settings.mode == 'vertical'){
	                slidesShowing = slider.settings.minSlides;
	            }
	            return slidesShowing;
	        }
	        
	        /**
	         * Returns the number of pages (one full viewport of slides is one "page")
	         */
	        var getPagerQty = function(){
	            var pagerQty = 0;
	            // if moveSlides is specified by the user
	            if(slider.settings.moveSlides > 0){
	                if(slider.settings.infiniteLoop){
	                    pagerQty = slider.children.length / getMoveBy();
	                }else{
	                    // use a while loop to determine pages
	                    var breakPoint = 0;
	                    var counter = 0
	                    // when breakpoint goes above children length, counter is the number of pages
	                    while (breakPoint < slider.children.length){
	                        ++pagerQty;
	                        breakPoint = counter + getNumberSlidesShowing();
	                        counter += slider.settings.moveSlides <= getNumberSlidesShowing() ? slider.settings.moveSlides : getNumberSlidesShowing();
	                    }
	                }
	            // if moveSlides is 0 (auto) divide children length by sides showing, then round up
	            }else{
	                pagerQty = Math.ceil(slider.children.length / getNumberSlidesShowing());
	            }
	            return pagerQty;
	        }
	        
	        /**
	         * Returns the number of indivual slides by which to shift the slider
	         */
	        var getMoveBy = function(){
	            // if moveSlides was set by the user and moveSlides is less than number of slides showing
	            if(slider.settings.moveSlides > 0 && slider.settings.moveSlides <= getNumberSlidesShowing()){
	                return slider.settings.moveSlides;
	            }
	            // if moveSlides is 0 (auto)
	            return getNumberSlidesShowing();
	        }
	        
	        /**
	         * Sets the slider's (el) left or top position
	         */
	        var setSlidePosition = function(){
	            // if last slide
	            if(slider.active.last){
	                if (slider.settings.mode == 'horizontal'){
	                    // get the last child's position
	                    var lastChild = slider.children.last();
	                    var position = lastChild.position();
	                    // set the left position
	                    setPositionProperty(-(position.left - (slider.viewport.width() - lastChild.width())), 'reset', 0);
	                }else if(slider.settings.mode == 'vertical'){
	                    // get the last showing index's position
	                    var lastShowingIndex = slider.children.length - slider.settings.minSlides;
	                    var position = slider.children.eq(lastShowingIndex).position();
	                    // set the top position
	                    setPositionProperty(-position.top, 'reset', 0);
	                }
	            // if not last slide
	            }else{
	                // get the position of the first showing slide
	                var position = slider.children.eq(slider.active.index * getMoveBy()).position();
	                // check for last slide
	                if (slider.active.index == getPagerQty() - 1) slider.active.last = true;
	                // set the repective position
	                if (position != undefined){
	                    if (slider.settings.mode == 'horizontal') setPositionProperty(-position.left, 'reset', 0);
	                    else if (slider.settings.mode == 'vertical') setPositionProperty(-position.top, 'reset', 0);
	                }
	            }
	        }
	        
	        /**
	         * Sets the el's animating property position (which in turn will sometimes animate el).
	         * If using CSS, sets the transform property. If not using CSS, sets the top / left property.
	         *
	         * @param value (int) 
	         *  - the animating property's value
	         *
	         * @param type (string) 'slider', 'reset', 'ticker'
	         *  - the type of instance for which the function is being
	         *
	         * @param duration (int) 
	         *  - the amount of time (in ms) the transition should occupy
	         *
	         * @param params (array) optional
	         *  - an optional parameter containing any variables that need to be passed in
	         */
	        var setPositionProperty = function(value, type, duration, params){
	            // use CSS transform
	            if(slider.usingCSS){
	                // determine the translate3d value
	                var propValue = slider.settings.mode == 'vertical' ? 'translate3d(0, ' + value + 'px, 0)' : 'translate3d(' + value + 'px, 0, 0)';
	                // add the CSS transition-duration
	                el.css('-' + slider.cssPrefix + '-transition-duration', duration / 1000 + 's');
	                if(type == 'slide'){
	                    // set the property value
	                    el.css(slider.animProp, propValue);
	                    // bind a callback method - executes when CSS transition completes
	                    el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
	                        // unbind the callback
	                        el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
	                        updateAfterSlideTransition();
	                    });
	                }else if(type == 'reset'){
	                    el.css(slider.animProp, propValue);
	                }else if(type == 'ticker'){
	                    // make the transition use 'linear'
	                    el.css('-' + slider.cssPrefix + '-transition-timing-function', 'linear');
	                    el.css(slider.animProp, propValue);
	                    // bind a callback method - executes when CSS transition completes
	                    el.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
	                        // unbind the callback
	                        el.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
	                        // reset the position
	                        setPositionProperty(params['resetValue'], 'reset', 0);
	                        // start the loop again
	                        tickerLoop();
	                    });
	                }
	            // use JS animate
	            }else{
	                var animateObj = {};
	                animateObj[slider.animProp] = value;
	                if(type == 'slide'){
	                    el.animate(animateObj, duration, slider.settings.easing, function(){
	                        updateAfterSlideTransition();
	                    });
	                }else if(type == 'reset'){
	                    el.css(slider.animProp, value)
	                }else if(type == 'ticker'){
	                    el.animate(animateObj, speed, 'linear', function(){
	                        setPositionProperty(params['resetValue'], 'reset', 0);
	                        // run the recursive loop after animation
	                        tickerLoop();
	                    });
	                }
	            }
	        }
	        
	        /**
	         * Populates the pager with proper amount of pages
	         */
	        var populatePager = function(){
	            var pagerHtml = '';
	            pagerQty = getPagerQty();
	            // loop through each pager item
	            for(var i=0; i < pagerQty; i++){
	                var linkContent = '';
	                // if a buildPager function is supplied, use it to get pager link value, else use index + 1
	                if(slider.settings.buildPager && $.isFunction(slider.settings.buildPager)){
	                    linkContent = slider.settings.buildPager(i);
	                    slider.pagerEl.addClass('bx-custom-pager');
	                }else{
	                    linkContent = i + 1;
	                    slider.pagerEl.addClass('bx-default-pager');
	                }
	                // var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(i) : i + 1;
	                // add the markup to the string
	                pagerHtml += '<div class="bx-pager-item"><a href="" data-slide-index="' + i + '" class="bx-pager-link">' + linkContent + '</a></div>';
	            };
	            // populate the pager element with pager links
	            slider.pagerEl.html(pagerHtml);
	        }
	        
	        /**
	         * Appends the pager to the controls element
	         */
	        var appendPager = function(){
	            if(!slider.settings.pagerCustom){
	                // create the pager DOM element
	                slider.pagerEl = $('<div class="bx-pager" />');
	                // if a pager selector was supplied, populate it with the pager
	                if(slider.settings.pagerSelector){
	                    $(slider.settings.pagerSelector).html(slider.pagerEl);
	                // if no pager selector was supplied, add it after the wrapper
	                }else{
	                    slider.controls.el.addClass('bx-has-pager').append(slider.pagerEl);
	                }
	                // populate the pager
	                populatePager();
	            }else{
	                slider.pagerEl = $(slider.settings.pagerCustom);
	            }
	            // assign the pager click binding
	            slider.pagerEl.delegate('a', 'click', clickPagerBind);
	        }
	        
	        /**
	         * Appends prev / next controls to the controls element
	         */
	        var appendControls = function(){
	            slider.controls.next = $('<a class="bx-next" href="">' + slider.settings.nextText + '</a>');
	            slider.controls.prev = $('<a class="bx-prev" href="">' + slider.settings.prevText + '</a>');
	            // bind click actions to the controls
	            slider.controls.next.bind('click', clickNextBind);
	            slider.controls.prev.bind('click', clickPrevBind);
	            // if nextSlector was supplied, populate it
	            if(slider.settings.nextSelector){
	                $(slider.settings.nextSelector).append(slider.controls.next);
	            }
	            // if prevSlector was supplied, populate it
	            if(slider.settings.prevSelector){
	                $(slider.settings.prevSelector).append(slider.controls.prev);
	            }
	            // if no custom selectors were supplied
	            if(!slider.settings.nextSelector && !slider.settings.prevSelector){
	                // add the controls to the DOM
	                slider.controls.directionEl = $('<div class="bx-controls-direction" />');
	                // add the control elements to the directionEl
	                slider.controls.directionEl.append(slider.controls.prev).append(slider.controls.next);
	                // slider.viewport.append(slider.controls.directionEl);
	                slider.controls.el.addClass('bx-has-controls-direction').append(slider.controls.directionEl);
	            }
	        }
	        
	        /**
	         * Appends start / stop auto controls to the controls element
	         */
	        var appendControlsAuto = function(){
	            slider.controls.start = $('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + slider.settings.startText + '</a></div>');
	            slider.controls.stop = $('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + slider.settings.stopText + '</a></div>');
	            // add the controls to the DOM
	            slider.controls.autoEl = $('<div class="bx-controls-auto" />');
	            // bind click actions to the controls
	            slider.controls.autoEl.delegate('.bx-start', 'click', clickStartBind);
	            slider.controls.autoEl.delegate('.bx-stop', 'click', clickStopBind);
	            // if autoControlsCombine, insert only the "start" control
	            if(slider.settings.autoControlsCombine){
	                slider.controls.autoEl.append(slider.controls.start);
	            // if autoControlsCombine is false, insert both controls
	            }else{
	                slider.controls.autoEl.append(slider.controls.start).append(slider.controls.stop);
	            }
	            // if auto controls selector was supplied, populate it with the controls
	            if(slider.settings.autoControlsSelector){
	                $(slider.settings.autoControlsSelector).html(slider.controls.autoEl);
	            // if auto controls selector was not supplied, add it after the wrapper
	            }else{
	                slider.controls.el.addClass('bx-has-controls-auto').append(slider.controls.autoEl);
	            }
	            // update the auto controls
	            updateAutoControls(slider.settings.autoStart ? 'stop' : 'start');
	        }
	        
	        /**
	         * Appends image captions to the DOM
	         */
	        var appendCaptions = function(){
	            // cycle through each child
	            slider.children.each(function(index){
	                // get the image title attribute
	                var title = $(this).find('img:first').attr('title');
	                // append the caption
	                if (title != undefined) $(this).append('<div class="bx-caption"><span>' + title + '</span></div>');
	            });
	        }
	        
	        /**
	         * Click next binding
	         *
	         * @param e (event) 
	         *  - DOM event object
	         */
	        var clickNextBind = function(e){
	            // if auto show is running, stop it
	            if (slider.settings.auto) el.stopAuto();
	            el.goToNextSlide();
	            e.preventDefault();
	        }
	        
	        /**
	         * Click prev binding
	         *
	         * @param e (event) 
	         *  - DOM event object
	         */
	        var clickPrevBind = function(e){
	            // if auto show is running, stop it
	            if (slider.settings.auto) el.stopAuto();
	            el.goToPrevSlide();
	            e.preventDefault();
	        }
	        
	        /**
	         * Click start binding
	         *
	         * @param e (event) 
	         *  - DOM event object
	         */
	        var clickStartBind = function(e){
	            el.startAuto();
	            e.preventDefault();
	        }
	        
	        /**
	         * Click stop binding
	         *
	         * @param e (event) 
	         *  - DOM event object
	         */
	        var clickStopBind = function(e){
	            el.stopAuto();
	            e.preventDefault();
	        }
	
	        /**
	         * Click pager binding
	         *
	         * @param e (event) 
	         *  - DOM event object
	         */
	        var clickPagerBind = function(e){
	            // if auto show is running, stop it
	            if (slider.settings.auto) el.stopAuto();
	            var pagerLink = $(e.currentTarget);
	            var pagerIndex = parseInt(pagerLink.attr('data-slide-index'));
	            // if clicked pager link is not active, continue with the goToSlide call
	            if(pagerIndex != slider.active.index) el.goToSlide(pagerIndex);
	            e.preventDefault();
	        }
	        
	        /**
	         * Updates the pager links with an active class
	         *
	         * @param slideIndex (int) 
	         *  - index of slide to make active
	         */
	        var updatePagerActive = function(slideIndex){
	            // if "short" pager type
	            if(slider.settings.pagerType == 'short'){
	                slider.pagerEl.html((slideIndex + 1) + slider.settings.pagerShortSeparator + slider.children.length);
	                return;
	            }
	            // remove all pager active classes
	            slider.pagerEl.find('a').removeClass('active');
	            // apply the active class
	            slider.pagerEl.find('a').eq(slideIndex).addClass('active');
	        }
	        
	        /**
	         * Performs needed actions after a slide transition
	         */
	        var updateAfterSlideTransition = function(){
	            // if infinte loop is true
	            if(slider.settings.infiniteLoop){
	                var position = '';
	                // first slide
	                if(slider.active.index == 0){
	                    // set the new position
	                    position = slider.children.eq(0).position();
	                // carousel, last slide
	                }else if(slider.active.index == getPagerQty() - 1 && slider.carousel){
	                    position = slider.children.eq((getPagerQty() - 1) * getMoveBy()).position();
	                // last slide
	                }else if(slider.active.index == slider.children.length - 1){
	                    position = slider.children.eq(slider.children.length - 1).position();
	                }
	                if (slider.settings.mode == 'horizontal') { setPositionProperty(-position.left, 'reset', 0);; }
	                else if (slider.settings.mode == 'vertical') { setPositionProperty(-position.top, 'reset', 0);; }
	            }
	            // declare that the transition is complete
	            slider.working = false;
	            // onSlideAfter callback
	            slider.settings.onSlideAfter(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
	        }
	        
	        /**
	         * Updates the auto controls state (either active, or combined switch)
	         *
	         * @param state (string) "start", "stop"
	         *  - the new state of the auto show
	         */
	        var updateAutoControls = function(state){
	            // if autoControlsCombine is true, replace the current control with the new state 
	            if(slider.settings.autoControlsCombine){
	                slider.controls.autoEl.html(slider.controls[state]);
	            // if autoControlsCombine is false, apply the "active" class to the appropriate control 
	            }else{
	                slider.controls.autoEl.find('a').removeClass('active');
	                slider.controls.autoEl.find('a:not(.bx-' + state + ')').addClass('active');
	            }
	        }
	        
	        /**
	         * Updates the direction controls (checks if either should be hidden)
	         */
	        var updateDirectionControls = function(){
	            // if infiniteLoop is false and hideControlOnEnd is true
	            if(!slider.settings.infiniteLoop && slider.settings.hideControlOnEnd){
	                // if first slide
	                if (slider.active.index == 0){
	                    slider.controls.prev.addClass('disabled');
	                    slider.controls.next.removeClass('disabled');
	                // if last slide
	                }else if(slider.active.index == getPagerQty() - 1){
	                    slider.controls.next.addClass('disabled');
	                    slider.controls.prev.removeClass('disabled');
	                // if any slide in the middle
	                }else{
	                    slider.controls.prev.removeClass('disabled');
	                    slider.controls.next.removeClass('disabled');
	                }
	            }
	        }
	        
	        /**
	         * Initialzes the auto process
	         */
	        var initAuto = function(){
	            // if autoDelay was supplied, launch the auto show using a setTimeout() call
	            if(slider.settings.autoDelay > 0){
	                var timeout = setTimeout(el.startAuto, slider.settings.autoDelay);
	            // if autoDelay was not supplied, start the auto show normally
	            }else{
	                el.startAuto();
	            }
	            // if autoHover is requested
	            if(slider.settings.autoHover){
	                // on el hover
	                el.hover(function(){
	                    // if the auto show is currently playing (has an active interval)
	                    if(slider.interval){
	                        // stop the auto show and pass true agument which will prevent control update
	                        el.stopAuto(true);
	                        // create a new autoPaused value which will be used by the relative "mouseout" event
	                        slider.autoPaused = true;
	                    }
	                }, function(){
	                    // if the autoPaused value was created be the prior "mouseover" event
	                    if(slider.autoPaused){
	                        // start the auto show and pass true agument which will prevent control update
	                        el.startAuto(true);
	                        // reset the autoPaused value
	                        slider.autoPaused = null;
	                    }
	                });
	            }
	        }
	        
	        /**
	         * Initialzes the ticker process
	         */
	        var initTicker = function(){
	            var startPosition = 0;
	            // if autoDirection is "next", append a clone of the entire slider
	            if(slider.settings.autoDirection == 'next'){
	                el.append(slider.children.clone().addClass('bx-clone'));
	            // if autoDirection is "prev", prepend a clone of the entire slider, and set the left position
	            }else{
	                el.prepend(slider.children.clone().addClass('bx-clone'));
	                var position = slider.children.first().position();
	                startPosition = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
	            }
	            setPositionProperty(startPosition, 'reset', 0);
	            // do not allow controls in ticker mode
	            slider.settings.pager = false;
	            slider.settings.controls = false;
	            slider.settings.autoControls = false;
	            // if autoHover is requested
	            if(slider.settings.tickerHover && !slider.usingCSS){
	                // on el hover
	                slider.viewport.hover(function(){
	                    el.stop();
	                }, function(){
	                    // calculate the total width of children (used to calculate the speed ratio)
	                    var totalDimens = 0;
	                    slider.children.each(function(index){
	                      totalDimens += slider.settings.mode == 'horizontal' ? $(this).outerWidth(true) : $(this).outerHeight(true);
	                    });
	                    // calculate the speed ratio (used to determine the new speed to finish the paused animation)
	                    var ratio = slider.settings.speed / totalDimens;
	                    // determine which property to use
	                    var property = slider.settings.mode == 'horizontal' ? 'left' : 'top';
	                    // calculate the new speed
	                    var newSpeed = ratio * (totalDimens - (Math.abs(parseInt(el.css(property)))));
	                    tickerLoop(newSpeed);
	                });
	            }
	            // start the ticker loop
	            tickerLoop();
	        }
	        
	        /**
	         * Runs a continuous loop, news ticker-style
	         */
	        var tickerLoop = function(resumeSpeed){
	            speed = resumeSpeed ? resumeSpeed : slider.settings.speed;
	            var position = {left: 0, top: 0};
	            var reset = {left: 0, top: 0};
	            // if "next" animate left position to last child, then reset left to 0
	            if(slider.settings.autoDirection == 'next'){
	                position = el.find('.bx-clone').first().position();
	            // if "prev" animate left position to 0, then reset left to first non-clone child
	            }else{
	                reset = slider.children.first().position();
	            }
	            var animateProperty = slider.settings.mode == 'horizontal' ? -position.left : -position.top;
	            var resetValue = slider.settings.mode == 'horizontal' ? -reset.left : -reset.top;
	            var params = {resetValue: resetValue};
	            setPositionProperty(animateProperty, 'ticker', speed, params);
	        }
	        
	        /**
	         * Initializes touch events
	         */
	        var initTouch = function(){
	            // initialize object to contain all touch values
	            slider.touch = {
	                start: {x: 0, y: 0},
	                end: {x: 0, y: 0}
	            }
	            slider.viewport.bind('touchstart', onTouchStart);
	        }
	        
	        /**
	         * Event handler for "touchstart"
	         *
	         * @param e (event) 
	         *  - DOM event object
	         */
	        var onTouchStart = function(e){
	            if(slider.working){
	                e.preventDefault();
	            }else{
	                // record the original position when touch starts
	                slider.touch.originalPos = el.position();
	                var orig = e.originalEvent;
	                // record the starting touch x, y coordinates
	                slider.touch.start.x = orig.changedTouches[0].pageX;
	                slider.touch.start.y = orig.changedTouches[0].pageY;
	                // bind a "touchmove" event to the viewport
	                slider.viewport.bind('touchmove', onTouchMove);
	                // bind a "touchend" event to the viewport
	                slider.viewport.bind('touchend', onTouchEnd);
	            }
	        }
	        
	        /**
	         * Event handler for "touchmove"
	         *
	         * @param e (event) 
	         *  - DOM event object
	         */
	        var onTouchMove = function(e){
	            e.preventDefault();
	            if(slider.settings.mode != 'fade'){
	                var orig = e.originalEvent;
	                var value = 0;
	                // if horizontal, drag along x axis
	                if(slider.settings.mode == 'horizontal'){
	                    var change = orig.changedTouches[0].pageX - slider.touch.start.x;
	                    value = slider.touch.originalPos.left + change;
	                // if vertical, drag along y axis
	                }else{
	                    var change = orig.changedTouches[0].pageY - slider.touch.start.y;
	                    value = slider.touch.originalPos.top + change;
	                }
	                setPositionProperty(value, 'reset', 0);
	            }
	        }
	        
	        /**
	         * Event handler for "touchend"
	         *
	         * @param e (event) 
	         *  - DOM event object
	         */
	        var onTouchEnd = function(e){
	            slider.viewport.unbind('touchmove', onTouchMove);
	            var orig = e.originalEvent;
	            var value = 0;
	            // record end x, y positions
	            slider.touch.end.x = orig.changedTouches[0].pageX;
	            slider.touch.end.y = orig.changedTouches[0].pageY;
	            // if fade mode, check if absolute x distance clears the threshold
	            if(slider.settings.mode == 'fade'){
	                var distance = Math.abs(slider.touch.start.x - slider.touch.end.x);
	                if(distance >= slider.settings.swipeThreshold){
	                    slider.touch.start.x > slider.touch.end.x ? el.goToNextSlide() : el.goToPrevSlide();
	                    el.stopAuto();
	                }
	            // not fade mode
	            }else{
	                var distance = 0;
	                // calculate distance and el's animate property
	                if(slider.settings.mode == 'horizontal'){
	                    distance = slider.touch.end.x - slider.touch.start.x;
	                    value = slider.touch.originalPos.left;
	                }else{
	                    distance = slider.touch.end.y - slider.touch.start.y;
	                    value = slider.touch.originalPos.top;
	                }
	                // if not infinite loop and first / last slide, do not attempt a slide transition
	                if(!slider.settings.infiniteLoop && ((slider.active.index == 0 && distance > 0) || (slider.active.last && distance < 0))){
	                    setPositionProperty(value, 'reset', 200);
	                }else{
	                    // check if distance clears threshold
	                    if(Math.abs(distance) >= slider.settings.swipeThreshold){
	                        distance < 0 ? el.goToNextSlide() : el.goToPrevSlide();
	                        el.stopAuto();
	                    }else{
	                        // el.animate(property, 200);
	                        setPositionProperty(value, 'reset', 200);
	                    }
	                }
	            }
	            slider.viewport.unbind('touchend', onTouchEnd);
	        }
	        
	        /**
	         * ===================================================================================
	         * = PUBLIC FUNCTIONS
	         * ===================================================================================
	         */
	        
	        /**
	         * Performs slide transition to the specified slide
	         *
	         * @param slideIndex (int) 
	         *  - the destination slide's index (zero-based)
	         *
	         * @param direction (string) 
	         *  - INTERNAL USE ONLY - the direction of travel ("prev" / "next")
	         */
	        el.goToSlide = function(slideIndex, direction){
	            // if plugin is currently in motion, ignore request
	            if(slider.working || slider.active.index == slideIndex) return;
	            // declare that plugin is in motion
	            slider.working = true;
	            // store the old index
	            slider.oldIndex = slider.active.index;
	            // if slideIndex is less than zero, set active index to last child (this happens during infinite loop)
	            if(slideIndex < 0){
	                slider.active.index = getPagerQty() - 1;
	            // if slideIndex is greater than children length, set active index to 0 (this happens during infinite loop)
	            }else if(slideIndex >= getPagerQty()){
	                slider.active.index = 0;
	            // set active index to requested slide
	            }else{
	                slider.active.index = slideIndex;
	            }
	            // onSlideBefore, onSlideNext, onSlidePrev callbacks
	            slider.settings.onSlideBefore(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
	            if(direction == 'next'){
	                slider.settings.onSlideNext(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
	            }else if(direction == 'prev'){
	                slider.settings.onSlidePrev(slider.children.eq(slider.active.index), slider.oldIndex, slider.active.index);
	            }
	            // check if last slide
	            slider.active.last = slider.active.index >= getPagerQty() - 1;
	            // update the pager with active class
	            if(slider.settings.pager) updatePagerActive(slider.active.index);
	            // // check for direction control update
	            if(slider.settings.controls) updateDirectionControls();
	            // if slider is set to mode: "fade"
	            if(slider.settings.mode == 'fade'){
	                // if adaptiveHeight is true and next height is different from current height, animate to the new height
	                if(slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()){
	                    slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
	                }
	                // fade out the visible child and reset its z-index value
	                slider.children.filter(':visible').fadeOut(slider.settings.speed).css({zIndex: 0});
	                // fade in the newly requested slide
	                slider.children.eq(slider.active.index).css('zIndex', 51).fadeIn(slider.settings.speed, function(){
	                    $(this).css('zIndex', 50);
	                    updateAfterSlideTransition();
	                });
	            // slider mode is not "fade"
	            }else{
	                // if adaptiveHeight is true and next height is different from current height, animate to the new height
	                if(slider.settings.adaptiveHeight && slider.viewport.height() != getViewportHeight()){
	                    slider.viewport.animate({height: getViewportHeight()}, slider.settings.adaptiveHeightSpeed);
	                }
	                var moveBy = 0;
	                var position = {left: 0, top: 0};
	                // if carousel and not infinite loop
	                if(!slider.settings.infiniteLoop && slider.carousel && slider.active.last){
	                    if(slider.settings.mode == 'horizontal'){
	                        // get the last child position
	                        var lastChild = slider.children.eq(slider.children.length - 1);
	                        position = lastChild.position();
	                        // calculate the position of the last slide
	                        moveBy = slider.viewport.width() - lastChild.width();
	                    }else{
	                        // get last showing index position
	                        var lastShowingIndex = slider.children.length - slider.settings.minSlides;
	                        position = slider.children.eq(lastShowingIndex).position();
	                    }
	                    // horizontal carousel, going previous while on first slide (infiniteLoop mode)
	                }else if(slider.carousel && slider.active.last && direction == 'prev'){
	                    // get the last child position
	                    var eq = slider.settings.moveSlides == 1 ? slider.settings.maxSlides - getMoveBy() : ((getPagerQty() - 1) * getMoveBy()) - (slider.children.length - slider.settings.maxSlides);
	                    var lastChild = el.children('.bx-clone').eq(eq);
	                    position = lastChild.position();
	                // if infinite loop and "Next" is clicked on the last slide
	                }else if(direction == 'next' && slider.active.index == 0){
	                    // get the last clone position
	                    position = el.find('.bx-clone').eq(slider.settings.maxSlides).position();
	                    slider.active.last = false;
	                // normal non-zero requests
	                }else if(slideIndex >= 0){
	                    var requestEl = slideIndex * getMoveBy();
	                    position = slider.children.eq(requestEl).position();
	                }
	                // plugin values to be animated
	                var value = slider.settings.mode == 'horizontal' ? -(position.left - moveBy) : -position.top;
	                setPositionProperty(value, 'slide', slider.settings.speed);
	            }
	        }
	        
	        /**
	         * Transitions to the next slide in the show
	         */
	        el.goToNextSlide = function(){
	            // if infiniteLoop is false and last page is showing, disregard call
	            if (!slider.settings.infiniteLoop && slider.active.last) return;
	            var pagerIndex = slider.active.index + 1;
	            el.goToSlide(pagerIndex, 'next');
	        }
	        
	        /**
	         * Transitions to the prev slide in the show
	         */
	        el.goToPrevSlide = function(){
	            // if infiniteLoop is false and last page is showing, disregard call
	            if (!slider.settings.infiniteLoop && slider.active.index == 0) return;
	            var pagerIndex = slider.active.index - 1;
	            el.goToSlide(pagerIndex, 'prev');
	        }
	        
	        /**
	         * Starts the auto show
	         *
	         * @param preventControlUpdate (boolean) 
	         *  - if true, auto controls state will not be updated
	         */
	        el.startAuto = function(preventControlUpdate){
	            // if an interval already exists, disregard call
	            if(slider.interval) return;
	            // create an interval
	            slider.interval = setInterval(function(){
	                slider.settings.autoDirection == 'next' ? el.goToNextSlide() : el.goToPrevSlide();
	            }, slider.settings.pause);
	            // if auto controls are displayed and preventControlUpdate is not true
	            if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('stop');
	        }
	        
	        /**
	         * Stops the auto show
	         *
	         * @param preventControlUpdate (boolean) 
	         *  - if true, auto controls state will not be updated
	         */
	        el.stopAuto = function(preventControlUpdate){
	            // if no interval exists, disregard call
	            if(!slider.interval) return;
	            // clear the interval
	            clearInterval(slider.interval);
	            slider.interval = null;
	            // if auto controls are displayed and preventControlUpdate is not true
	            if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('start');
	        }
	        
	        /**
	         * Returns current slide index (zero-based)
	         */
	        el.getCurrentSlide = function(){
	            return slider.active.index;
	        }
	        
	        /**
	         * Returns number of slides in show
	         */
	        el.getSlideCount = function(){
	            return slider.children.length;
	        }
	        
	        /**
	         * Makes slideshow responsive
	         */
	        // first get the original window dimens (thanks alot IE)
	        var windowWidth = $(window).width();
	        var windowHeight = $(window).height();
	        $(window).resize(function(){
	            // get the new window dimens (again, thank you IE)
	            var windowWidthNew = $(window).width();
	            var windowHeightNew = $(window).height();
	            // make sure that it is a true window resize
	            // *we must check this because our dinosaur friend IE fires a window resize event when certain DOM elements
	            // are resized. Can you just die already?*
	            if(windowWidth != windowWidthNew || windowHeight != windowHeightNew){
	                // set the new window dimens
	                windowWidth = windowWidthNew;
	                windowHeight = windowHeightNew;
	                // resize all children in ratio to new screen size
	                slider.children.add(el.find('.bx-clone')).width(getSlideWidth());
	                // adjust the height
	                slider.viewport.css('height', getViewportHeight());
	                // if active.last was true before the screen resize, we want
	                // to keep it last no matter what screen size we end on
	                if (slider.active.last) slider.active.index = getPagerQty() - 1;
	                // if the active index (page) no longer exists due to the resize, simply set the index as last
	                if (slider.active.index >= getPagerQty()) slider.active.last = true;
	                // if a pager is being displayed and a custom pager is not being used, update it
	                if(slider.settings.pager && !slider.settings.pagerCustom){
	                    populatePager();
	                    updatePagerActive(slider.active.index);
	                }
	                // update the slide position
	                if(!slider.settings.ticker) setSlidePosition();
	            }
	        });
	        
	        init();
	        
	        // returns the current jQuery object
	        return this;
	    }
	
	})(jQuery);
	
	/*!
	 * jQuery imagesLoaded plugin v2.1.0
	 * http://github.com/desandro/imagesloaded
	 *
	 * MIT License. by Paul Irish et al.
	 */
	
	/*jshint curly: true, eqeqeq: true, noempty: true, strict: true, undef: true, browser: true */
	/*global jQuery: false */
	
	(function(c,n){var l="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";c.fn.imagesLoaded=function(f){function m(){var b=c(i),a=c(h);d&&(h.length?d.reject(e,b,a):d.resolve(e));c.isFunction(f)&&f.call(g,e,b,a)}function j(b,a){b.src===l||-1!==c.inArray(b,k)||(k.push(b),a?h.push(b):i.push(b),c.data(b,"imagesLoaded",{isBroken:a,src:b.src}),o&&d.notifyWith(c(b),[a,e,c(i),c(h)]),e.length===k.length&&(setTimeout(m),e.unbind(".imagesLoaded")))}var g=this,d=c.isFunction(c.Deferred)?c.Deferred():
	0,o=c.isFunction(d.notify),e=g.find("img").add(g.filter("img")),k=[],i=[],h=[];c.isPlainObject(f)&&c.each(f,function(b,a){if("callback"===b)f=a;else if(d)d[b](a)});e.length?e.bind("load.imagesLoaded error.imagesLoaded",function(b){j(b.target,"error"===b.type)}).each(function(b,a){var d=a.src,e=c.data(a,"imagesLoaded");if(e&&e.src===d)j(a,e.isBroken);else if(a.complete&&a.naturalWidth!==n)j(a,0===a.naturalWidth||0===a.naturalHeight);else if(a.readyState||a.complete)a.src=l,a.src=d}):m();return d?d.promise(g):
	g}})(jQuery);

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = function ($) {
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
	                    anchor = imgGroup.children('a'),
	                    clickable = anchor.length > 0 ? anchor : imgGroup,
	
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
	
	                        log(mode);
	                        log(src);
	
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
	                                        event.target.playVideo();
	                                        setTimeout(function () {
	                                            iframe.focus();
	                                        }, 100);
	                                    }
	                                }
	                            });
	                        }
	
	                    };
	
	                clickable.bind('click', function (e) {
	                    e.preventDefault();
	
	                    clickable.unbind().click(function (e) {
	                        e.preventDefault();
	                    });
	
	
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
	            allowFullscreen: false,
	            controls: 2,
	            showInfo: 1
	        }, opt));
	        return this;
	    };
	};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/*
	 * Shadowbox.js, version 3.0.3
	 * http://shadowbox-js.com/
	 *
	 * Copyright 2007-2010, Michael J. I. Jackson
	 * Date: 2011-02-24 01:23:38 +0000
	 */
	(function(window,undefined){var S={version:"3.0.3"};var ua=navigator.userAgent.toLowerCase();if(ua.indexOf("windows")>-1||ua.indexOf("win32")>-1){S.isWindows=true}else{if(ua.indexOf("macintosh")>-1||ua.indexOf("mac os x")>-1){S.isMac=true}else{if(ua.indexOf("linux")>-1){S.isLinux=true}}}S.isIE=ua.indexOf("msie")>-1;S.isIE6=ua.indexOf("msie 6")>-1;S.isIE7=ua.indexOf("msie 7")>-1;S.isGecko=ua.indexOf("gecko")>-1&&ua.indexOf("safari")==-1;S.isWebKit=ua.indexOf("applewebkit/")>-1;var inlineId=/#(.+)$/,galleryName=/^(light|shadow)box\[(.*?)\]/i,inlineParam=/\s*([a-z_]*?)\s*=\s*(.+)\s*/,fileExtension=/[0-9a-z]+$/i,scriptPath=/(.+\/)shadowbox\.js/i;var open=false,initialized=false,lastOptions={},slideDelay=0,slideStart,slideTimer;S.current=-1;S.dimensions=null;S.ease=function(state){return 1+Math.pow(state-1,3)};S.errorInfo={fla:{name:"Flash",url:"http://www.adobe.com/products/flashplayer/"},qt:{name:"QuickTime",url:"http://www.apple.com/quicktime/download/"},wmp:{name:"Windows Media Player",url:"http://www.microsoft.com/windows/windowsmedia/"},f4m:{name:"Flip4Mac",url:"http://www.flip4mac.com/wmv_download.htm"}};S.gallery=[];S.onReady=noop;S.path=null;S.player=null;S.playerId="sb-player";S.options={animate:true,animateFade:true,autoplayMovies:true,continuous:false,enableKeys:true,flashParams:{bgcolor:"#000000",allowfullscreen:true},flashVars:{},flashVersion:"9.0.115",handleOversize:"resize",handleUnsupported:"link",onChange:noop,onClose:noop,onFinish:noop,onOpen:noop,showMovieControls:true,skipSetup:false,slideshowDelay:0,viewportPadding:20};S.getCurrent=function(){return S.current>-1?S.gallery[S.current]:null};S.hasNext=function(){return S.gallery.length>1&&(S.current!=S.gallery.length-1||S.options.continuous)};S.isOpen=function(){return open};S.isPaused=function(){return slideTimer=="pause"};S.applyOptions=function(options){lastOptions=apply({},S.options);apply(S.options,options)};S.revertOptions=function(){apply(S.options,lastOptions)};S.init=function(options,callback){if(initialized){return}initialized=true;if(S.skin.options){apply(S.options,S.skin.options)}if(options){apply(S.options,options)}if(!S.path){var path,scripts=document.getElementsByTagName("script");for(var i=0,len=scripts.length;i<len;++i){path=scriptPath.exec(scripts[i].src);if(path){S.path=path[1];break}}}if(callback){S.onReady=callback}bindLoad()};S.open=function(obj){if(open){return}var gc=S.makeGallery(obj);S.gallery=gc[0];S.current=gc[1];obj=S.getCurrent();if(obj==null){return}S.applyOptions(obj.options||{});filterGallery();if(S.gallery.length){obj=S.getCurrent();if(S.options.onOpen(obj)===false){return}open=true;S.skin.onOpen(obj,load)}};S.close=function(){if(!open){return}open=false;if(S.player){S.player.remove();S.player=null}if(typeof slideTimer=="number"){clearTimeout(slideTimer);slideTimer=null}slideDelay=0;listenKeys(false);S.options.onClose(S.getCurrent());S.skin.onClose();S.revertOptions()};S.play=function(){if(!S.hasNext()){return}if(!slideDelay){slideDelay=S.options.slideshowDelay*1000}if(slideDelay){slideStart=now();slideTimer=setTimeout(function(){slideDelay=slideStart=0;S.next()},slideDelay);if(S.skin.onPlay){S.skin.onPlay()}}};S.pause=function(){if(typeof slideTimer!="number"){return}slideDelay=Math.max(0,slideDelay-(now()-slideStart));if(slideDelay){clearTimeout(slideTimer);slideTimer="pause";if(S.skin.onPause){S.skin.onPause()}}};S.change=function(index){if(!(index in S.gallery)){if(S.options.continuous){index=(index<0?S.gallery.length+index:0);if(!(index in S.gallery)){return}}else{return}}S.current=index;if(typeof slideTimer=="number"){clearTimeout(slideTimer);slideTimer=null;slideDelay=slideStart=0}S.options.onChange(S.getCurrent());load(true)};S.next=function(){S.change(S.current+1)};S.previous=function(){S.change(S.current-1)};S.setDimensions=function(height,width,maxHeight,maxWidth,topBottom,leftRight,padding,preserveAspect){var originalHeight=height,originalWidth=width;var extraHeight=2*padding+topBottom;if(height+extraHeight>maxHeight){height=maxHeight-extraHeight}var extraWidth=2*padding+leftRight;if(width+extraWidth>maxWidth){width=maxWidth-extraWidth}var changeHeight=(originalHeight-height)/originalHeight,changeWidth=(originalWidth-width)/originalWidth,oversized=(changeHeight>0||changeWidth>0);if(preserveAspect&&oversized){if(changeHeight>changeWidth){width=Math.round((originalWidth/originalHeight)*height)}else{if(changeWidth>changeHeight){height=Math.round((originalHeight/originalWidth)*width)}}}S.dimensions={height:height+topBottom,width:width+leftRight,innerHeight:height,innerWidth:width,top:Math.floor((maxHeight-(height+extraHeight))/2+padding),left:Math.floor((maxWidth-(width+extraWidth))/2+padding),oversized:oversized};return S.dimensions};S.makeGallery=function(obj){var gallery=[],current=-1;if(typeof obj=="string"){obj=[obj]}if(typeof obj.length=="number"){each(obj,function(i,o){if(o.content){gallery[i]=o}else{gallery[i]={content:o}}});current=0}else{if(obj.tagName){var cacheObj=S.getCache(obj);obj=cacheObj?cacheObj:S.makeObject(obj)}if(obj.gallery){gallery=[];var o;for(var key in S.cache){o=S.cache[key];if(o.gallery&&o.gallery==obj.gallery){if(current==-1&&o.content==obj.content){current=gallery.length}gallery.push(o)}}if(current==-1){gallery.unshift(obj);current=0}}else{gallery=[obj];current=0}}each(gallery,function(i,o){gallery[i]=apply({},o)});return[gallery,current]};S.makeObject=function(link,options){var obj={content:link.href,title:link.getAttribute("title")||"",link:link};if(options){options=apply({},options);each(["player","title","height","width","gallery"],function(i,o){if(typeof options[o]!="undefined"){obj[o]=options[o];delete options[o]}});obj.options=options}else{obj.options={}}if(!obj.player){obj.player=S.getPlayer(obj.content)}var rel=link.getAttribute("rel");if(rel){var match=rel.match(galleryName);if(match){obj.gallery=escape(match[2])}each(rel.split(";"),function(i,p){match=p.match(inlineParam);if(match){obj[match[1]]=match[2]}})}return obj};S.getPlayer=function(content){if(content.indexOf("#")>-1&&content.indexOf(document.location.href)==0){return"inline"}var q=content.indexOf("?");if(q>-1){content=content.substring(0,q)}var ext,m=content.match(fileExtension);if(m){ext=m[0].toLowerCase()}if(ext){if(S.img&&S.img.ext.indexOf(ext)>-1){return"img"}if(S.swf&&S.swf.ext.indexOf(ext)>-1){return"swf"}if(S.flv&&S.flv.ext.indexOf(ext)>-1){return"flv"}if(S.qt&&S.qt.ext.indexOf(ext)>-1){if(S.wmp&&S.wmp.ext.indexOf(ext)>-1){return"qtwmp"}else{return"qt"}}if(S.wmp&&S.wmp.ext.indexOf(ext)>-1){return"wmp"}}return"iframe"};function filterGallery(){var err=S.errorInfo,plugins=S.plugins,obj,remove,needed,m,format,replace,inlineEl,flashVersion;for(var i=0;i<S.gallery.length;++i){obj=S.gallery[i];remove=false;needed=null;switch(obj.player){case"flv":case"swf":if(!plugins.fla){needed="fla"}break;case"qt":if(!plugins.qt){needed="qt"}break;case"wmp":if(S.isMac){if(plugins.qt&&plugins.f4m){obj.player="qt"}else{needed="qtf4m"}}else{if(!plugins.wmp){needed="wmp"}}break;case"qtwmp":if(plugins.qt){obj.player="qt"}else{if(plugins.wmp){obj.player="wmp"}else{needed="qtwmp"}}break}if(needed){if(S.options.handleUnsupported=="link"){switch(needed){case"qtf4m":format="shared";replace=[err.qt.url,err.qt.name,err.f4m.url,err.f4m.name];break;case"qtwmp":format="either";replace=[err.qt.url,err.qt.name,err.wmp.url,err.wmp.name];break;default:format="single";replace=[err[needed].url,err[needed].name]}obj.player="html";obj.content='<div class="sb-message">'+sprintf(S.lang.errors[format],replace)+"</div>"}else{remove=true}}else{if(obj.player=="inline"){m=inlineId.exec(obj.content);if(m){inlineEl=get(m[1]);if(inlineEl){obj.content=inlineEl.innerHTML}else{remove=true}}else{remove=true}}else{if(obj.player=="swf"||obj.player=="flv"){flashVersion=(obj.options&&obj.options.flashVersion)||S.options.flashVersion;if(S.flash&&!S.flash.hasFlashPlayerVersion(flashVersion)){obj.width=310;obj.height=177}}}}if(remove){S.gallery.splice(i,1);if(i<S.current){--S.current}else{if(i==S.current){S.current=i>0?i-1:i}}--i}}}function listenKeys(on){if(!S.options.enableKeys){return}(on?addEvent:removeEvent)(document,"keydown",handleKey)}function handleKey(e){if(e.metaKey||e.shiftKey||e.altKey||e.ctrlKey){return}var code=keyCode(e),handler;switch(code){case 81:case 88:case 27:handler=S.close;break;case 37:handler=S.previous;break;case 39:handler=S.next;break;case 32:handler=typeof slideTimer=="number"?S.pause:S.play;break}if(handler){preventDefault(e);handler()}}function load(changing){listenKeys(false);var obj=S.getCurrent();var player=(obj.player=="inline"?"html":obj.player);if(typeof S[player]!="function"){throw"unknown player "+player}if(changing){S.player.remove();S.revertOptions();S.applyOptions(obj.options||{})}S.player=new S[player](obj,S.playerId);if(S.gallery.length>1){var next=S.gallery[S.current+1]||S.gallery[0];if(next.player=="img"){var a=new Image();a.src=next.content}var prev=S.gallery[S.current-1]||S.gallery[S.gallery.length-1];if(prev.player=="img"){var b=new Image();b.src=prev.content}}S.skin.onLoad(changing,waitReady)}function waitReady(){if(!open){return}if(typeof S.player.ready!="undefined"){var timer=setInterval(function(){if(open){if(S.player.ready){clearInterval(timer);timer=null;S.skin.onReady(show)}}else{clearInterval(timer);timer=null}},10)}else{S.skin.onReady(show)}}function show(){if(!open){return}S.player.append(S.skin.body,S.dimensions);S.skin.onShow(finish)}function finish(){if(!open){return}if(S.player.onLoad){S.player.onLoad()}S.options.onFinish(S.getCurrent());if(!S.isPaused()){S.play()}listenKeys(true)}if(!Array.prototype.indexOf){Array.prototype.indexOf=function(obj,from){var len=this.length>>>0;from=from||0;if(from<0){from+=len}for(;from<len;++from){if(from in this&&this[from]===obj){return from}}return -1}}function now(){return(new Date).getTime()}function apply(original,extension){for(var property in extension){original[property]=extension[property]}return original}function each(obj,callback){var i=0,len=obj.length;for(var value=obj[0];i<len&&callback.call(value,i,value)!==false;value=obj[++i]){}}function sprintf(str,replace){return str.replace(/\{(\w+?)\}/g,function(match,i){return replace[i]})}function noop(){}function get(id){return document.getElementById(id)}function remove(el){el.parentNode.removeChild(el)}var supportsOpacity=true,supportsFixed=true;function checkSupport(){var body=document.body,div=document.createElement("div");supportsOpacity=typeof div.style.opacity==="string";div.style.position="fixed";div.style.margin=0;div.style.top="20px";body.appendChild(div,body.firstChild);supportsFixed=div.offsetTop==20;body.removeChild(div)}S.getStyle=(function(){var opacity=/opacity=([^)]*)/,getComputedStyle=document.defaultView&&document.defaultView.getComputedStyle;return function(el,style){var ret;if(!supportsOpacity&&style=="opacity"&&el.currentStyle){ret=opacity.test(el.currentStyle.filter||"")?(parseFloat(RegExp.$1)/100)+"":"";return ret===""?"1":ret}if(getComputedStyle){var computedStyle=getComputedStyle(el,null);if(computedStyle){ret=computedStyle[style]}if(style=="opacity"&&ret==""){ret="1"}}else{ret=el.currentStyle[style]}return ret}})();S.appendHTML=function(el,html){if(el.insertAdjacentHTML){el.insertAdjacentHTML("BeforeEnd",html)}else{if(el.lastChild){var range=el.ownerDocument.createRange();range.setStartAfter(el.lastChild);var frag=range.createContextualFragment(html);el.appendChild(frag)}else{el.innerHTML=html}}};S.getWindowSize=function(dimension){if(document.compatMode==="CSS1Compat"){return document.documentElement["client"+dimension]}return document.body["client"+dimension]};S.setOpacity=function(el,opacity){var style=el.style;if(supportsOpacity){style.opacity=(opacity==1?"":opacity)}else{style.zoom=1;if(opacity==1){if(typeof style.filter=="string"&&(/alpha/i).test(style.filter)){style.filter=style.filter.replace(/\s*[\w\.]*alpha\([^\)]*\);?/gi,"")}}else{style.filter=(style.filter||"").replace(/\s*[\w\.]*alpha\([^\)]*\)/gi,"")+" alpha(opacity="+(opacity*100)+")"}}};S.clearOpacity=function(el){S.setOpacity(el,1)};function getTarget(e){return e.target}function getPageXY(e){return[e.pageX,e.pageY]}function preventDefault(e){e.preventDefault()}function keyCode(e){return e.keyCode}function addEvent(el,type,handler){jQuery(el).bind(type,handler)}function removeEvent(el,type,handler){jQuery(el).unbind(type,handler)}jQuery.fn.shadowbox=function(options){return this.each(function(){var el=jQuery(this);var opts=jQuery.extend({},options||{},jQuery.metadata?el.metadata():jQuery.meta?el.data():{});var cls=this.className||"";opts.width=parseInt((cls.match(/w:(\d+)/)||[])[1])||opts.width;opts.height=parseInt((cls.match(/h:(\d+)/)||[])[1])||opts.height;Shadowbox.setup(el,opts)})};var loaded=false,DOMContentLoaded;if(document.addEventListener){DOMContentLoaded=function(){document.removeEventListener("DOMContentLoaded",DOMContentLoaded,false);S.load()}}else{if(document.attachEvent){DOMContentLoaded=function(){if(document.readyState==="complete"){document.detachEvent("onreadystatechange",DOMContentLoaded);S.load()}}}}function doScrollCheck(){if(loaded){return}try{document.documentElement.doScroll("left")}catch(e){setTimeout(doScrollCheck,1);return}S.load()}function bindLoad(){if(document.readyState==="complete"){return S.load()}if(document.addEventListener){document.addEventListener("DOMContentLoaded",DOMContentLoaded,false);window.addEventListener("load",S.load,false)}else{if(document.attachEvent){document.attachEvent("onreadystatechange",DOMContentLoaded);window.attachEvent("onload",S.load);var topLevel=false;try{topLevel=window.frameElement===null}catch(e){}if(document.documentElement.doScroll&&topLevel){doScrollCheck()}}}}S.load=function(){if(loaded){return}if(!document.body){return setTimeout(S.load,13)}loaded=true;checkSupport();S.onReady();if(!S.options.skipSetup){S.setup()}S.skin.init()};S.plugins={};if(navigator.plugins&&navigator.plugins.length){var names=[];each(navigator.plugins,function(i,p){names.push(p.name)});names=names.join(",");var f4m=names.indexOf("Flip4Mac")>-1;S.plugins={fla:names.indexOf("Shockwave Flash")>-1,qt:names.indexOf("QuickTime")>-1,wmp:!f4m&&names.indexOf("Windows Media")>-1,f4m:f4m}}else{var detectPlugin=function(name){var axo;try{axo=new ActiveXObject(name)}catch(e){}return !!axo};S.plugins={fla:detectPlugin("ShockwaveFlash.ShockwaveFlash"),qt:detectPlugin("QuickTime.QuickTime"),wmp:detectPlugin("wmplayer.ocx"),f4m:false}}var relAttr=/^(light|shadow)box/i,expando="shadowboxCacheKey",cacheKey=1;S.cache={};S.select=function(selector){var links=[];if(!selector){var rel;each(document.getElementsByTagName("a"),function(i,el){rel=el.getAttribute("rel");if(rel&&relAttr.test(rel)){links.push(el)}})}else{var length=selector.length;if(length){if(typeof selector=="string"){if(S.find){links=S.find(selector)}}else{if(length==2&&typeof selector[0]=="string"&&selector[1].nodeType){if(S.find){links=S.find(selector[0],selector[1])}}else{for(var i=0;i<length;++i){links[i]=selector[i]}}}}else{links.push(selector)}}return links};S.setup=function(selector,options){each(S.select(selector),function(i,link){S.addCache(link,options)})};S.teardown=function(selector){each(S.select(selector),function(i,link){S.removeCache(link)})};S.addCache=function(link,options){var key=link[expando];if(key==undefined){key=cacheKey++;link[expando]=key;addEvent(link,"click",handleClick)}S.cache[key]=S.makeObject(link,options)};S.removeCache=function(link){removeEvent(link,"click",handleClick);delete S.cache[link[expando]];link[expando]=null};S.getCache=function(link){var key=link[expando];return(key in S.cache&&S.cache[key])};S.clearCache=function(){for(var key in S.cache){S.removeCache(S.cache[key].link)}S.cache={}};function handleClick(e){S.open(this);if(S.gallery.length){preventDefault(e)}}
	/*
	 * Sizzle CSS Selector Engine - v1.0
	 *  Copyright 2009, The Dojo Foundation
	 *  Released under the MIT, BSD, and GPL Licenses.
	 *  More information: http://sizzlejs.com/
	 *
	 * Modified for inclusion in Shadowbox.js
	 */
	S.find=(function(){var chunker=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,done=0,toString=Object.prototype.toString,hasDuplicate=false,baseHasDuplicate=true;[0,0].sort(function(){baseHasDuplicate=false;return 0});var Sizzle=function(selector,context,results,seed){results=results||[];var origContext=context=context||document;if(context.nodeType!==1&&context.nodeType!==9){return[]}if(!selector||typeof selector!=="string"){return results}var parts=[],m,set,checkSet,extra,prune=true,contextXML=isXML(context),soFar=selector;while((chunker.exec(""),m=chunker.exec(soFar))!==null){soFar=m[3];parts.push(m[1]);if(m[2]){extra=m[3];break}}if(parts.length>1&&origPOS.exec(selector)){if(parts.length===2&&Expr.relative[parts[0]]){set=posProcess(parts[0]+parts[1],context)}else{set=Expr.relative[parts[0]]?[context]:Sizzle(parts.shift(),context);while(parts.length){selector=parts.shift();if(Expr.relative[selector]){selector+=parts.shift()}set=posProcess(selector,set)}}}else{if(!seed&&parts.length>1&&context.nodeType===9&&!contextXML&&Expr.match.ID.test(parts[0])&&!Expr.match.ID.test(parts[parts.length-1])){var ret=Sizzle.find(parts.shift(),context,contextXML);context=ret.expr?Sizzle.filter(ret.expr,ret.set)[0]:ret.set[0]}if(context){var ret=seed?{expr:parts.pop(),set:makeArray(seed)}:Sizzle.find(parts.pop(),parts.length===1&&(parts[0]==="~"||parts[0]==="+")&&context.parentNode?context.parentNode:context,contextXML);set=ret.expr?Sizzle.filter(ret.expr,ret.set):ret.set;if(parts.length>0){checkSet=makeArray(set)}else{prune=false}while(parts.length){var cur=parts.pop(),pop=cur;if(!Expr.relative[cur]){cur=""}else{pop=parts.pop()}if(pop==null){pop=context}Expr.relative[cur](checkSet,pop,contextXML)}}else{checkSet=parts=[]}}if(!checkSet){checkSet=set}if(!checkSet){throw"Syntax error, unrecognized expression: "+(cur||selector)}if(toString.call(checkSet)==="[object Array]"){if(!prune){results.push.apply(results,checkSet)}else{if(context&&context.nodeType===1){for(var i=0;checkSet[i]!=null;i++){if(checkSet[i]&&(checkSet[i]===true||checkSet[i].nodeType===1&&contains(context,checkSet[i]))){results.push(set[i])}}}else{for(var i=0;checkSet[i]!=null;i++){if(checkSet[i]&&checkSet[i].nodeType===1){results.push(set[i])}}}}}else{makeArray(checkSet,results)}if(extra){Sizzle(extra,origContext,results,seed);Sizzle.uniqueSort(results)}return results};Sizzle.uniqueSort=function(results){if(sortOrder){hasDuplicate=baseHasDuplicate;results.sort(sortOrder);if(hasDuplicate){for(var i=1;i<results.length;i++){if(results[i]===results[i-1]){results.splice(i--,1)}}}}return results};Sizzle.matches=function(expr,set){return Sizzle(expr,null,null,set)};Sizzle.find=function(expr,context,isXML){var set,match;if(!expr){return[]}for(var i=0,l=Expr.order.length;i<l;i++){var type=Expr.order[i],match;if((match=Expr.leftMatch[type].exec(expr))){var left=match[1];match.splice(1,1);if(left.substr(left.length-1)!=="\\"){match[1]=(match[1]||"").replace(/\\/g,"");set=Expr.find[type](match,context,isXML);if(set!=null){expr=expr.replace(Expr.match[type],"");break}}}}if(!set){set=context.getElementsByTagName("*")}return{set:set,expr:expr}};Sizzle.filter=function(expr,set,inplace,not){var old=expr,result=[],curLoop=set,match,anyFound,isXMLFilter=set&&set[0]&&isXML(set[0]);while(expr&&set.length){for(var type in Expr.filter){if((match=Expr.match[type].exec(expr))!=null){var filter=Expr.filter[type],found,item;anyFound=false;if(curLoop===result){result=[]}if(Expr.preFilter[type]){match=Expr.preFilter[type](match,curLoop,inplace,result,not,isXMLFilter);if(!match){anyFound=found=true}else{if(match===true){continue}}}if(match){for(var i=0;(item=curLoop[i])!=null;i++){if(item){found=filter(item,match,i,curLoop);var pass=not^!!found;if(inplace&&found!=null){if(pass){anyFound=true}else{curLoop[i]=false}}else{if(pass){result.push(item);anyFound=true}}}}}if(found!==undefined){if(!inplace){curLoop=result}expr=expr.replace(Expr.match[type],"");if(!anyFound){return[]}break}}}if(expr===old){if(anyFound==null){throw"Syntax error, unrecognized expression: "+expr}else{break}}old=expr}return curLoop};var Expr=Sizzle.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(elem){return elem.getAttribute("href")}},relative:{"+":function(checkSet,part){var isPartStr=typeof part==="string",isTag=isPartStr&&!/\W/.test(part),isPartStrNotTag=isPartStr&&!isTag;if(isTag){part=part.toLowerCase()}for(var i=0,l=checkSet.length,elem;i<l;i++){if((elem=checkSet[i])){while((elem=elem.previousSibling)&&elem.nodeType!==1){}checkSet[i]=isPartStrNotTag||elem&&elem.nodeName.toLowerCase()===part?elem||false:elem===part}}if(isPartStrNotTag){Sizzle.filter(part,checkSet,true)}},">":function(checkSet,part){var isPartStr=typeof part==="string";if(isPartStr&&!/\W/.test(part)){part=part.toLowerCase();for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){var parent=elem.parentNode;checkSet[i]=parent.nodeName.toLowerCase()===part?parent:false}}}else{for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){checkSet[i]=isPartStr?elem.parentNode:elem.parentNode===part}}if(isPartStr){Sizzle.filter(part,checkSet,true)}}},"":function(checkSet,part,isXML){var doneName=done++,checkFn=dirCheck;if(typeof part==="string"&&!/\W/.test(part)){var nodeCheck=part=part.toLowerCase();checkFn=dirNodeCheck}checkFn("parentNode",part,doneName,checkSet,nodeCheck,isXML)},"~":function(checkSet,part,isXML){var doneName=done++,checkFn=dirCheck;if(typeof part==="string"&&!/\W/.test(part)){var nodeCheck=part=part.toLowerCase();checkFn=dirNodeCheck}checkFn("previousSibling",part,doneName,checkSet,nodeCheck,isXML)}},find:{ID:function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);return m?[m]:[]}},NAME:function(match,context){if(typeof context.getElementsByName!=="undefined"){var ret=[],results=context.getElementsByName(match[1]);for(var i=0,l=results.length;i<l;i++){if(results[i].getAttribute("name")===match[1]){ret.push(results[i])}}return ret.length===0?null:ret}},TAG:function(match,context){return context.getElementsByTagName(match[1])}},preFilter:{CLASS:function(match,curLoop,inplace,result,not,isXML){match=" "+match[1].replace(/\\/g,"")+" ";if(isXML){return match}for(var i=0,elem;(elem=curLoop[i])!=null;i++){if(elem){if(not^(elem.className&&(" "+elem.className+" ").replace(/[\t\n]/g," ").indexOf(match)>=0)){if(!inplace){result.push(elem)}}else{if(inplace){curLoop[i]=false}}}}return false},ID:function(match){return match[1].replace(/\\/g,"")},TAG:function(match,curLoop){return match[1].toLowerCase()},CHILD:function(match){if(match[1]==="nth"){var test=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2]==="even"&&"2n"||match[2]==="odd"&&"2n+1"||!/\D/.test(match[2])&&"0n+"+match[2]||match[2]);match[2]=(test[1]+(test[2]||1))-0;match[3]=test[3]-0}match[0]=done++;return match},ATTR:function(match,curLoop,inplace,result,not,isXML){var name=match[1].replace(/\\/g,"");if(!isXML&&Expr.attrMap[name]){match[1]=Expr.attrMap[name]}if(match[2]==="~="){match[4]=" "+match[4]+" "}return match},PSEUDO:function(match,curLoop,inplace,result,not){if(match[1]==="not"){if((chunker.exec(match[3])||"").length>1||/^\w/.test(match[3])){match[3]=Sizzle(match[3],null,null,curLoop)}else{var ret=Sizzle.filter(match[3],curLoop,inplace,true^not);if(!inplace){result.push.apply(result,ret)}return false}}else{if(Expr.match.POS.test(match[0])||Expr.match.CHILD.test(match[0])){return true}}return match},POS:function(match){match.unshift(true);return match}},filters:{enabled:function(elem){return elem.disabled===false&&elem.type!=="hidden"},disabled:function(elem){return elem.disabled===true},checked:function(elem){return elem.checked===true},selected:function(elem){elem.parentNode.selectedIndex;return elem.selected===true},parent:function(elem){return !!elem.firstChild},empty:function(elem){return !elem.firstChild},has:function(elem,i,match){return !!Sizzle(match[3],elem).length},header:function(elem){return/h\d/i.test(elem.nodeName)},text:function(elem){return"text"===elem.type},radio:function(elem){return"radio"===elem.type},checkbox:function(elem){return"checkbox"===elem.type},file:function(elem){return"file"===elem.type},password:function(elem){return"password"===elem.type},submit:function(elem){return"submit"===elem.type},image:function(elem){return"image"===elem.type},reset:function(elem){return"reset"===elem.type},button:function(elem){return"button"===elem.type||elem.nodeName.toLowerCase()==="button"},input:function(elem){return/input|select|textarea|button/i.test(elem.nodeName)}},setFilters:{first:function(elem,i){return i===0},last:function(elem,i,match,array){return i===array.length-1},even:function(elem,i){return i%2===0},odd:function(elem,i){return i%2===1},lt:function(elem,i,match){return i<match[3]-0},gt:function(elem,i,match){return i>match[3]-0},nth:function(elem,i,match){return match[3]-0===i},eq:function(elem,i,match){return match[3]-0===i}},filter:{PSEUDO:function(elem,match,i,array){var name=match[1],filter=Expr.filters[name];if(filter){return filter(elem,i,match,array)}else{if(name==="contains"){return(elem.textContent||elem.innerText||getText([elem])||"").indexOf(match[3])>=0}else{if(name==="not"){var not=match[3];for(var i=0,l=not.length;i<l;i++){if(not[i]===elem){return false}}return true}else{throw"Syntax error, unrecognized expression: "+name}}}},CHILD:function(elem,match){var type=match[1],node=elem;switch(type){case"only":case"first":while((node=node.previousSibling)){if(node.nodeType===1){return false}}if(type==="first"){return true}node=elem;case"last":while((node=node.nextSibling)){if(node.nodeType===1){return false}}return true;case"nth":var first=match[2],last=match[3];if(first===1&&last===0){return true}var doneName=match[0],parent=elem.parentNode;if(parent&&(parent.sizcache!==doneName||!elem.nodeIndex)){var count=0;for(node=parent.firstChild;node;node=node.nextSibling){if(node.nodeType===1){node.nodeIndex=++count}}parent.sizcache=doneName}var diff=elem.nodeIndex-last;if(first===0){return diff===0}else{return(diff%first===0&&diff/first>=0)}}},ID:function(elem,match){return elem.nodeType===1&&elem.getAttribute("id")===match},TAG:function(elem,match){return(match==="*"&&elem.nodeType===1)||elem.nodeName.toLowerCase()===match},CLASS:function(elem,match){return(" "+(elem.className||elem.getAttribute("class"))+" ").indexOf(match)>-1},ATTR:function(elem,match){var name=match[1],result=Expr.attrHandle[name]?Expr.attrHandle[name](elem):elem[name]!=null?elem[name]:elem.getAttribute(name),value=result+"",type=match[2],check=match[4];return result==null?type==="!=":type==="="?value===check:type==="*="?value.indexOf(check)>=0:type==="~="?(" "+value+" ").indexOf(check)>=0:!check?value&&result!==false:type==="!="?value!==check:type==="^="?value.indexOf(check)===0:type==="$="?value.substr(value.length-check.length)===check:type==="|="?value===check||value.substr(0,check.length+1)===check+"-":false},POS:function(elem,match,i,array){var name=match[2],filter=Expr.setFilters[name];if(filter){return filter(elem,i,match,array)}}}};var origPOS=Expr.match.POS;for(var type in Expr.match){Expr.match[type]=new RegExp(Expr.match[type].source+/(?![^\[]*\])(?![^\(]*\))/.source);Expr.leftMatch[type]=new RegExp(/(^(?:.|\r|\n)*?)/.source+Expr.match[type].source)}var makeArray=function(array,results){array=Array.prototype.slice.call(array,0);if(results){results.push.apply(results,array);return results}return array};try{Array.prototype.slice.call(document.documentElement.childNodes,0)}catch(e){makeArray=function(array,results){var ret=results||[];if(toString.call(array)==="[object Array]"){Array.prototype.push.apply(ret,array)}else{if(typeof array.length==="number"){for(var i=0,l=array.length;i<l;i++){ret.push(array[i])}}else{for(var i=0;array[i];i++){ret.push(array[i])}}}return ret}}var sortOrder;if(document.documentElement.compareDocumentPosition){sortOrder=function(a,b){if(!a.compareDocumentPosition||!b.compareDocumentPosition){if(a==b){hasDuplicate=true}return a.compareDocumentPosition?-1:1}var ret=a.compareDocumentPosition(b)&4?-1:a===b?0:1;if(ret===0){hasDuplicate=true}return ret}}else{if("sourceIndex" in document.documentElement){sortOrder=function(a,b){if(!a.sourceIndex||!b.sourceIndex){if(a==b){hasDuplicate=true}return a.sourceIndex?-1:1}var ret=a.sourceIndex-b.sourceIndex;if(ret===0){hasDuplicate=true}return ret}}else{if(document.createRange){sortOrder=function(a,b){if(!a.ownerDocument||!b.ownerDocument){if(a==b){hasDuplicate=true}return a.ownerDocument?-1:1}var aRange=a.ownerDocument.createRange(),bRange=b.ownerDocument.createRange();aRange.setStart(a,0);aRange.setEnd(a,0);bRange.setStart(b,0);bRange.setEnd(b,0);var ret=aRange.compareBoundaryPoints(Range.START_TO_END,bRange);if(ret===0){hasDuplicate=true}return ret}}}}function getText(elems){var ret="",elem;for(var i=0;elems[i];i++){elem=elems[i];if(elem.nodeType===3||elem.nodeType===4){ret+=elem.nodeValue}else{if(elem.nodeType!==8){ret+=getText(elem.childNodes)}}}return ret}(function(){var form=document.createElement("div"),id="script"+(new Date).getTime();form.innerHTML="<a name='"+id+"'/>";var root=document.documentElement;root.insertBefore(form,root.firstChild);if(document.getElementById(id)){Expr.find.ID=function(match,context,isXML){if(typeof context.getElementById!=="undefined"&&!isXML){var m=context.getElementById(match[1]);return m?m.id===match[1]||typeof m.getAttributeNode!=="undefined"&&m.getAttributeNode("id").nodeValue===match[1]?[m]:undefined:[]}};Expr.filter.ID=function(elem,match){var node=typeof elem.getAttributeNode!=="undefined"&&elem.getAttributeNode("id");return elem.nodeType===1&&node&&node.nodeValue===match}}root.removeChild(form);root=form=null})();(function(){var div=document.createElement("div");div.appendChild(document.createComment(""));if(div.getElementsByTagName("*").length>0){Expr.find.TAG=function(match,context){var results=context.getElementsByTagName(match[1]);if(match[1]==="*"){var tmp=[];for(var i=0;results[i];i++){if(results[i].nodeType===1){tmp.push(results[i])}}results=tmp}return results}}div.innerHTML="<a href='#'></a>";if(div.firstChild&&typeof div.firstChild.getAttribute!=="undefined"&&div.firstChild.getAttribute("href")!=="#"){Expr.attrHandle.href=function(elem){return elem.getAttribute("href",2)}}div=null})();if(document.querySelectorAll){(function(){var oldSizzle=Sizzle,div=document.createElement("div");div.innerHTML="<p class='TEST'></p>";if(div.querySelectorAll&&div.querySelectorAll(".TEST").length===0){return}Sizzle=function(query,context,extra,seed){context=context||document;if(!seed&&context.nodeType===9&&!isXML(context)){try{return makeArray(context.querySelectorAll(query),extra)}catch(e){}}return oldSizzle(query,context,extra,seed)};for(var prop in oldSizzle){Sizzle[prop]=oldSizzle[prop]}div=null})()}(function(){var div=document.createElement("div");div.innerHTML="<div class='test e'></div><div class='test'></div>";if(!div.getElementsByClassName||div.getElementsByClassName("e").length===0){return}div.lastChild.className="e";if(div.getElementsByClassName("e").length===1){return}Expr.order.splice(1,0,"CLASS");Expr.find.CLASS=function(match,context,isXML){if(typeof context.getElementsByClassName!=="undefined"&&!isXML){return context.getElementsByClassName(match[1])}};div=null})();function dirNodeCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){elem=elem[dir];var match=false;while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];break}if(elem.nodeType===1&&!isXML){elem.sizcache=doneName;elem.sizset=i}if(elem.nodeName.toLowerCase()===cur){match=elem;break}elem=elem[dir]}checkSet[i]=match}}}function dirCheck(dir,cur,doneName,checkSet,nodeCheck,isXML){for(var i=0,l=checkSet.length;i<l;i++){var elem=checkSet[i];if(elem){elem=elem[dir];var match=false;while(elem){if(elem.sizcache===doneName){match=checkSet[elem.sizset];break}if(elem.nodeType===1){if(!isXML){elem.sizcache=doneName;elem.sizset=i}if(typeof cur!=="string"){if(elem===cur){match=true;break}}else{if(Sizzle.filter(cur,[elem]).length>0){match=elem;break}}}elem=elem[dir]}checkSet[i]=match}}}var contains=document.compareDocumentPosition?function(a,b){return a.compareDocumentPosition(b)&16}:function(a,b){return a!==b&&(a.contains?a.contains(b):true)};var isXML=function(elem){var documentElement=(elem?elem.ownerDocument||elem:0).documentElement;return documentElement?documentElement.nodeName!=="HTML":false};var posProcess=function(selector,context){var tmpSet=[],later="",match,root=context.nodeType?[context]:context;while((match=Expr.match.PSEUDO.exec(selector))){later+=match[0];selector=selector.replace(Expr.match.PSEUDO,"")}selector=Expr.relative[selector]?selector+"*":selector;for(var i=0,l=root.length;i<l;i++){Sizzle(selector,root[i],tmpSet)}return Sizzle.filter(later,tmpSet)};return Sizzle})();
	/*
	 * SWFObject v2.1 <http://code.google.com/p/swfobject/>
	 * Copyright (c) 2007-2008 Geoff Stearns, Michael Williams, and Bobby van der Sluis
	 * This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
	 *
	 * Modified for inclusion in Shadowbox.js
	 */
	S.flash=(function(){var swfobject=function(){var UNDEF="undefined",OBJECT="object",SHOCKWAVE_FLASH="Shockwave Flash",SHOCKWAVE_FLASH_AX="ShockwaveFlash.ShockwaveFlash",FLASH_MIME_TYPE="application/x-shockwave-flash",EXPRESS_INSTALL_ID="SWFObjectExprInst",win=window,doc=document,nav=navigator,domLoadFnArr=[],regObjArr=[],objIdArr=[],listenersArr=[],script,timer=null,storedAltContent=null,storedAltContentId=null,isDomLoaded=false,isExpressInstallActive=false;var ua=function(){var w3cdom=typeof doc.getElementById!=UNDEF&&typeof doc.getElementsByTagName!=UNDEF&&typeof doc.createElement!=UNDEF,playerVersion=[0,0,0],d=null;if(typeof nav.plugins!=UNDEF&&typeof nav.plugins[SHOCKWAVE_FLASH]==OBJECT){d=nav.plugins[SHOCKWAVE_FLASH].description;if(d&&!(typeof nav.mimeTypes!=UNDEF&&nav.mimeTypes[FLASH_MIME_TYPE]&&!nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)){d=d.replace(/^.*\s+(\S+\s+\S+$)/,"$1");playerVersion[0]=parseInt(d.replace(/^(.*)\..*$/,"$1"),10);playerVersion[1]=parseInt(d.replace(/^.*\.(.*)\s.*$/,"$1"),10);playerVersion[2]=/r/.test(d)?parseInt(d.replace(/^.*r(.*)$/,"$1"),10):0}}else{if(typeof win.ActiveXObject!=UNDEF){var a=null,fp6Crash=false;try{a=new ActiveXObject(SHOCKWAVE_FLASH_AX+".7")}catch(e){try{a=new ActiveXObject(SHOCKWAVE_FLASH_AX+".6");playerVersion=[6,0,21];a.AllowScriptAccess="always"}catch(e){if(playerVersion[0]==6){fp6Crash=true}}if(!fp6Crash){try{a=new ActiveXObject(SHOCKWAVE_FLASH_AX)}catch(e){}}}if(!fp6Crash&&a){try{d=a.GetVariable("$version");if(d){d=d.split(" ")[1].split(",");playerVersion=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10)]}}catch(e){}}}}var u=nav.userAgent.toLowerCase(),p=nav.platform.toLowerCase(),webkit=/webkit/.test(u)?parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,ie=false,windows=p?/win/.test(p):/win/.test(u),mac=p?/mac/.test(p):/mac/.test(u);
	/*@cc_on
				ie = true;
				@if (@_win32)
					windows = true;
				@elif (@_mac)
					mac = true;
				@end
			@*/
	return{w3cdom:w3cdom,pv:playerVersion,webkit:webkit,ie:ie,win:windows,mac:mac}}();var onDomLoad=function(){if(!ua.w3cdom){return}addDomLoadEvent(main);if(ua.ie&&ua.win){try{doc.write("<script id=__ie_ondomload defer=true src=//:><\/script>");script=getElementById("__ie_ondomload");if(script){addListener(script,"onreadystatechange",checkReadyState)}}catch(e){}}if(ua.webkit&&typeof doc.readyState!=UNDEF){timer=setInterval(function(){if(/loaded|complete/.test(doc.readyState)){callDomLoadFunctions()}},10)}if(typeof doc.addEventListener!=UNDEF){doc.addEventListener("DOMContentLoaded",callDomLoadFunctions,null)}addLoadEvent(callDomLoadFunctions)}();function checkReadyState(){if(script.readyState=="complete"){script.parentNode.removeChild(script);callDomLoadFunctions()}}function callDomLoadFunctions(){if(isDomLoaded){return}if(ua.ie&&ua.win){var s=createElement("span");try{var t=doc.getElementsByTagName("body")[0].appendChild(s);t.parentNode.removeChild(t)}catch(e){return}}isDomLoaded=true;if(timer){clearInterval(timer);timer=null}var dl=domLoadFnArr.length;for(var i=0;i<dl;i++){domLoadFnArr[i]()}}function addDomLoadEvent(fn){if(isDomLoaded){fn()}else{domLoadFnArr[domLoadFnArr.length]=fn}}function addLoadEvent(fn){if(typeof win.addEventListener!=UNDEF){win.addEventListener("load",fn,false)}else{if(typeof doc.addEventListener!=UNDEF){doc.addEventListener("load",fn,false)}else{if(typeof win.attachEvent!=UNDEF){addListener(win,"onload",fn)}else{if(typeof win.onload=="function"){var fnOld=win.onload;win.onload=function(){fnOld();fn()}}else{win.onload=fn}}}}}function main(){var rl=regObjArr.length;for(var i=0;i<rl;i++){var id=regObjArr[i].id;if(ua.pv[0]>0){var obj=getElementById(id);if(obj){regObjArr[i].width=obj.getAttribute("width")?obj.getAttribute("width"):"0";regObjArr[i].height=obj.getAttribute("height")?obj.getAttribute("height"):"0";if(hasPlayerVersion(regObjArr[i].swfVersion)){if(ua.webkit&&ua.webkit<312){fixParams(obj)}setVisibility(id,true)}else{if(regObjArr[i].expressInstall&&!isExpressInstallActive&&hasPlayerVersion("6.0.65")&&(ua.win||ua.mac)){showExpressInstall(regObjArr[i])}else{displayAltContent(obj)}}}}else{setVisibility(id,true)}}}function fixParams(obj){var nestedObj=obj.getElementsByTagName(OBJECT)[0];if(nestedObj){var e=createElement("embed"),a=nestedObj.attributes;if(a){var al=a.length;for(var i=0;i<al;i++){if(a[i].nodeName=="DATA"){e.setAttribute("src",a[i].nodeValue)}else{e.setAttribute(a[i].nodeName,a[i].nodeValue)}}}var c=nestedObj.childNodes;if(c){var cl=c.length;for(var j=0;j<cl;j++){if(c[j].nodeType==1&&c[j].nodeName=="PARAM"){e.setAttribute(c[j].getAttribute("name"),c[j].getAttribute("value"))}}}obj.parentNode.replaceChild(e,obj)}}function showExpressInstall(regObj){isExpressInstallActive=true;var obj=getElementById(regObj.id);if(obj){if(regObj.altContentId){var ac=getElementById(regObj.altContentId);if(ac){storedAltContent=ac;storedAltContentId=regObj.altContentId}}else{storedAltContent=abstractAltContent(obj)}if(!(/%$/.test(regObj.width))&&parseInt(regObj.width,10)<310){regObj.width="310"}if(!(/%$/.test(regObj.height))&&parseInt(regObj.height,10)<137){regObj.height="137"}doc.title=doc.title.slice(0,47)+" - Flash Player Installation";var pt=ua.ie&&ua.win?"ActiveX":"PlugIn",dt=doc.title,fv="MMredirectURL="+win.location+"&MMplayerType="+pt+"&MMdoctitle="+dt,replaceId=regObj.id;if(ua.ie&&ua.win&&obj.readyState!=4){var newObj=createElement("div");replaceId+="SWFObjectNew";newObj.setAttribute("id",replaceId);obj.parentNode.insertBefore(newObj,obj);obj.style.display="none";var fn=function(){obj.parentNode.removeChild(obj)};addListener(win,"onload",fn)}createSWF({data:regObj.expressInstall,id:EXPRESS_INSTALL_ID,width:regObj.width,height:regObj.height},{flashvars:fv},replaceId)}}function displayAltContent(obj){if(ua.ie&&ua.win&&obj.readyState!=4){var el=createElement("div");obj.parentNode.insertBefore(el,obj);el.parentNode.replaceChild(abstractAltContent(obj),el);obj.style.display="none";var fn=function(){obj.parentNode.removeChild(obj)};addListener(win,"onload",fn)}else{obj.parentNode.replaceChild(abstractAltContent(obj),obj)}}function abstractAltContent(obj){var ac=createElement("div");if(ua.win&&ua.ie){ac.innerHTML=obj.innerHTML}else{var nestedObj=obj.getElementsByTagName(OBJECT)[0];if(nestedObj){var c=nestedObj.childNodes;if(c){var cl=c.length;for(var i=0;i<cl;i++){if(!(c[i].nodeType==1&&c[i].nodeName=="PARAM")&&!(c[i].nodeType==8)){ac.appendChild(c[i].cloneNode(true))}}}}}return ac}function createSWF(attObj,parObj,id){var r,el=getElementById(id);if(el){if(typeof attObj.id==UNDEF){attObj.id=id}if(ua.ie&&ua.win){var att="";for(var i in attObj){if(attObj[i]!=Object.prototype[i]){if(i.toLowerCase()=="data"){parObj.movie=attObj[i]}else{if(i.toLowerCase()=="styleclass"){att+=' class="'+attObj[i]+'"'}else{if(i.toLowerCase()!="classid"){att+=" "+i+'="'+attObj[i]+'"'}}}}}var par="";for(var j in parObj){if(parObj[j]!=Object.prototype[j]){par+='<param name="'+j+'" value="'+parObj[j]+'" />'}}el.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+att+">"+par+"</object>";objIdArr[objIdArr.length]=attObj.id;r=getElementById(attObj.id)}else{if(ua.webkit&&ua.webkit<312){var e=createElement("embed");e.setAttribute("type",FLASH_MIME_TYPE);for(var k in attObj){if(attObj[k]!=Object.prototype[k]){if(k.toLowerCase()=="data"){e.setAttribute("src",attObj[k])}else{if(k.toLowerCase()=="styleclass"){e.setAttribute("class",attObj[k])}else{if(k.toLowerCase()!="classid"){e.setAttribute(k,attObj[k])}}}}}for(var l in parObj){if(parObj[l]!=Object.prototype[l]){if(l.toLowerCase()!="movie"){e.setAttribute(l,parObj[l])}}}el.parentNode.replaceChild(e,el);r=e}else{var o=createElement(OBJECT);o.setAttribute("type",FLASH_MIME_TYPE);for(var m in attObj){if(attObj[m]!=Object.prototype[m]){if(m.toLowerCase()=="styleclass"){o.setAttribute("class",attObj[m])}else{if(m.toLowerCase()!="classid"){o.setAttribute(m,attObj[m])}}}}for(var n in parObj){if(parObj[n]!=Object.prototype[n]&&n.toLowerCase()!="movie"){createObjParam(o,n,parObj[n])}}el.parentNode.replaceChild(o,el);r=o}}}return r}function createObjParam(el,pName,pValue){var p=createElement("param");p.setAttribute("name",pName);p.setAttribute("value",pValue);el.appendChild(p)}function removeSWF(id){var obj=getElementById(id);if(obj&&(obj.nodeName=="OBJECT"||obj.nodeName=="EMBED")){if(ua.ie&&ua.win){if(obj.readyState==4){removeObjectInIE(id)}else{win.attachEvent("onload",function(){removeObjectInIE(id)})}}else{obj.parentNode.removeChild(obj)}}}function removeObjectInIE(id){var obj=getElementById(id);if(obj){for(var i in obj){if(typeof obj[i]=="function"){obj[i]=null}}obj.parentNode.removeChild(obj)}}function getElementById(id){var el=null;try{el=doc.getElementById(id)}catch(e){}return el}function createElement(el){return doc.createElement(el)}function addListener(target,eventType,fn){target.attachEvent(eventType,fn);listenersArr[listenersArr.length]=[target,eventType,fn]}function hasPlayerVersion(rv){var pv=ua.pv,v=rv.split(".");v[0]=parseInt(v[0],10);v[1]=parseInt(v[1],10)||0;v[2]=parseInt(v[2],10)||0;return(pv[0]>v[0]||(pv[0]==v[0]&&pv[1]>v[1])||(pv[0]==v[0]&&pv[1]==v[1]&&pv[2]>=v[2]))?true:false}function createCSS(sel,decl){if(ua.ie&&ua.mac){return}var h=doc.getElementsByTagName("head")[0],s=createElement("style");s.setAttribute("type","text/css");s.setAttribute("media","screen");if(!(ua.ie&&ua.win)&&typeof doc.createTextNode!=UNDEF){s.appendChild(doc.createTextNode(sel+" {"+decl+"}"))}h.appendChild(s);if(ua.ie&&ua.win&&typeof doc.styleSheets!=UNDEF&&doc.styleSheets.length>0){var ls=doc.styleSheets[doc.styleSheets.length-1];if(typeof ls.addRule==OBJECT){ls.addRule(sel,decl)}}}function setVisibility(id,isVisible){var v=isVisible?"visible":"hidden";if(isDomLoaded&&getElementById(id)){getElementById(id).style.visibility=v}else{createCSS("#"+id,"visibility:"+v)}}function urlEncodeIfNecessary(s){var regex=/[\\\"<>\.;]/;var hasBadChars=regex.exec(s)!=null;return hasBadChars?encodeURIComponent(s):s}var cleanup=function(){if(ua.ie&&ua.win){window.attachEvent("onunload",function(){var ll=listenersArr.length;for(var i=0;i<ll;i++){listenersArr[i][0].detachEvent(listenersArr[i][1],listenersArr[i][2])}var il=objIdArr.length;for(var j=0;j<il;j++){removeSWF(objIdArr[j])}for(var k in ua){ua[k]=null}ua=null;for(var l in swfobject){swfobject[l]=null}swfobject=null})}}();return{registerObject:function(objectIdStr,swfVersionStr,xiSwfUrlStr){if(!ua.w3cdom||!objectIdStr||!swfVersionStr){return}var regObj={};regObj.id=objectIdStr;regObj.swfVersion=swfVersionStr;regObj.expressInstall=xiSwfUrlStr?xiSwfUrlStr:false;regObjArr[regObjArr.length]=regObj;setVisibility(objectIdStr,false)},getObjectById:function(objectIdStr){var r=null;if(ua.w3cdom){var o=getElementById(objectIdStr);if(o){var n=o.getElementsByTagName(OBJECT)[0];if(!n||(n&&typeof o.SetVariable!=UNDEF)){r=o}else{if(typeof n.SetVariable!=UNDEF){r=n}}}}return r},embedSWF:function(swfUrlStr,replaceElemIdStr,widthStr,heightStr,swfVersionStr,xiSwfUrlStr,flashvarsObj,parObj,attObj){if(!ua.w3cdom||!swfUrlStr||!replaceElemIdStr||!widthStr||!heightStr||!swfVersionStr){return}widthStr+="";heightStr+="";if(hasPlayerVersion(swfVersionStr)){setVisibility(replaceElemIdStr,false);var att={};if(attObj&&typeof attObj===OBJECT){for(var i in attObj){if(attObj[i]!=Object.prototype[i]){att[i]=attObj[i]}}}att.data=swfUrlStr;att.width=widthStr;att.height=heightStr;var par={};if(parObj&&typeof parObj===OBJECT){for(var j in parObj){if(parObj[j]!=Object.prototype[j]){par[j]=parObj[j]}}}if(flashvarsObj&&typeof flashvarsObj===OBJECT){for(var k in flashvarsObj){if(flashvarsObj[k]!=Object.prototype[k]){if(typeof par.flashvars!=UNDEF){par.flashvars+="&"+k+"="+flashvarsObj[k]}else{par.flashvars=k+"="+flashvarsObj[k]}}}}addDomLoadEvent(function(){createSWF(att,par,replaceElemIdStr);if(att.id==replaceElemIdStr){setVisibility(replaceElemIdStr,true)}})}else{if(xiSwfUrlStr&&!isExpressInstallActive&&hasPlayerVersion("6.0.65")&&(ua.win||ua.mac)){isExpressInstallActive=true;setVisibility(replaceElemIdStr,false);addDomLoadEvent(function(){var regObj={};regObj.id=regObj.altContentId=replaceElemIdStr;regObj.width=widthStr;regObj.height=heightStr;regObj.expressInstall=xiSwfUrlStr;showExpressInstall(regObj)})}}},getFlashPlayerVersion:function(){return{major:ua.pv[0],minor:ua.pv[1],release:ua.pv[2]}},hasFlashPlayerVersion:hasPlayerVersion,createSWF:function(attObj,parObj,replaceElemIdStr){if(ua.w3cdom){return createSWF(attObj,parObj,replaceElemIdStr)}else{return undefined}},removeSWF:function(objElemIdStr){if(ua.w3cdom){removeSWF(objElemIdStr)}},createCSS:function(sel,decl){if(ua.w3cdom){createCSS(sel,decl)}},addDomLoadEvent:addDomLoadEvent,addLoadEvent:addLoadEvent,getQueryParamValue:function(param){var q=doc.location.search||doc.location.hash;if(param==null){return urlEncodeIfNecessary(q)}if(q){var pairs=q.substring(1).split("&");for(var i=0;i<pairs.length;i++){if(pairs[i].substring(0,pairs[i].indexOf("="))==param){return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(isExpressInstallActive&&storedAltContent){var obj=getElementById(EXPRESS_INSTALL_ID);if(obj){obj.parentNode.replaceChild(storedAltContent,obj);if(storedAltContentId){setVisibility(storedAltContentId,true);if(ua.ie&&ua.win){storedAltContent.style.display="block"}}storedAltContent=null;storedAltContentId=null;isExpressInstallActive=false}}}}}();return swfobject})();S.lang={code:"en",of:"of",loading:"loading",cancel:"Cancel",next:"Next",previous:"Previous",play:"Play",pause:"Pause",close:"Close",errors:{single:'You must install the <a href="{0}">{1}</a> browser plugin to view this content.',shared:'You must install both the <a href="{0}">{1}</a> and <a href="{2}">{3}</a> browser plugins to view this content.',either:'You must install either the <a href="{0}">{1}</a> or the <a href="{2}">{3}</a> browser plugin to view this content.'}};var pre,proxyId="sb-drag-proxy",dragData,dragProxy,dragTarget;function resetDrag(){dragData={x:0,y:0,startX:null,startY:null}}function updateProxy(){var dims=S.dimensions;apply(dragProxy.style,{height:dims.innerHeight+"px",width:dims.innerWidth+"px"})}function enableDrag(){resetDrag();var style=["position:absolute","cursor:"+(S.isGecko?"-moz-grab":"move"),"background-color:"+(S.isIE?"#fff;filter:alpha(opacity=0)":"transparent")].join(";");S.appendHTML(S.skin.body,'<div id="'+proxyId+'" style="'+style+'"></div>');dragProxy=get(proxyId);updateProxy();addEvent(dragProxy,"mousedown",startDrag)}function disableDrag(){if(dragProxy){removeEvent(dragProxy,"mousedown",startDrag);remove(dragProxy);dragProxy=null}dragTarget=null}function startDrag(e){preventDefault(e);var xy=getPageXY(e);dragData.startX=xy[0];dragData.startY=xy[1];dragTarget=get(S.player.id);addEvent(document,"mousemove",positionDrag);addEvent(document,"mouseup",endDrag);if(S.isGecko){dragProxy.style.cursor="-moz-grabbing"}}function positionDrag(e){var player=S.player,dims=S.dimensions,xy=getPageXY(e);var moveX=xy[0]-dragData.startX;dragData.startX+=moveX;dragData.x=Math.max(Math.min(0,dragData.x+moveX),dims.innerWidth-player.width);var moveY=xy[1]-dragData.startY;dragData.startY+=moveY;dragData.y=Math.max(Math.min(0,dragData.y+moveY),dims.innerHeight-player.height);apply(dragTarget.style,{left:dragData.x+"px",top:dragData.y+"px"})}function endDrag(){removeEvent(document,"mousemove",positionDrag);removeEvent(document,"mouseup",endDrag);if(S.isGecko){dragProxy.style.cursor="-moz-grab"}}S.img=function(obj,id){this.obj=obj;this.id=id;this.ready=false;var self=this;pre=new Image();pre.onload=function(){self.height=obj.height?parseInt(obj.height,10):pre.height;self.width=obj.width?parseInt(obj.width,10):pre.width;self.ready=true;pre.onload=null;pre=null};pre.src=obj.content};S.img.ext=["bmp","gif","jpg","jpeg","png"];S.img.prototype={append:function(body,dims){var img=document.createElement("img");img.id=this.id;img.src=this.obj.content;img.style.position="absolute";var height,width;if(dims.oversized&&S.options.handleOversize=="resize"){height=dims.innerHeight;width=dims.innerWidth}else{height=this.height;width=this.width}img.setAttribute("height",height);img.setAttribute("width",width);body.appendChild(img)},remove:function(){var el=get(this.id);if(el){remove(el)}disableDrag();if(pre){pre.onload=null;pre=null}},onLoad:function(){var dims=S.dimensions;if(dims.oversized&&S.options.handleOversize=="drag"){enableDrag()}},onWindowResize:function(){var dims=S.dimensions;switch(S.options.handleOversize){case"resize":var el=get(this.id);el.height=dims.innerHeight;el.width=dims.innerWidth;break;case"drag":if(dragTarget){var top=parseInt(S.getStyle(dragTarget,"top")),left=parseInt(S.getStyle(dragTarget,"left"));if(top+this.height<dims.innerHeight){dragTarget.style.top=dims.innerHeight-this.height+"px"}if(left+this.width<dims.innerWidth){dragTarget.style.left=dims.innerWidth-this.width+"px"}updateProxy()}break}}};S.iframe=function(obj,id){this.obj=obj;this.id=id;var overlay=get("sb-overlay");this.height=obj.height?parseInt(obj.height,10):overlay.offsetHeight;this.width=obj.width?parseInt(obj.width,10):overlay.offsetWidth};S.iframe.prototype={append:function(body,dims){var html='<iframe id="'+this.id+'" name="'+this.id+'" height="100%" width="100%" frameborder="0" marginwidth="0" marginheight="0" style="visibility:hidden" onload="this.style.visibility=\'visible\'" scrolling="auto"';if(S.isIE){html+=' allowtransparency="true"';if(S.isIE6){html+=" src=\"javascript:false;document.write('');\""}}html+="></iframe>";body.innerHTML=html},remove:function(){var el=get(this.id);if(el){remove(el);if(S.isGecko){delete window.frames[this.id]}}},onLoad:function(){var win=S.isIE?get(this.id).contentWindow:window.frames[this.id];win.location.href=this.obj.content}};S.html=function(obj,id){this.obj=obj;this.id=id;this.height=obj.height?parseInt(obj.height,10):300;this.width=obj.width?parseInt(obj.width,10):500};S.html.prototype={append:function(body,dims){var div=document.createElement("div");div.id=this.id;div.className="html";div.innerHTML=this.obj.content;body.appendChild(div)},remove:function(){var el=get(this.id);if(el){remove(el)}}};S.swf=function(obj,id){this.obj=obj;this.id=id;this.height=obj.height?parseInt(obj.height,10):300;this.width=obj.width?parseInt(obj.width,10):300};S.swf.ext=["swf"];S.swf.prototype={append:function(body,dims){var tmp=document.createElement("div");tmp.id=this.id;body.appendChild(tmp);var height=dims.innerHeight,width=dims.innerWidth,swf=this.obj.content,version=S.options.flashVersion,express=S.path+"expressInstall.swf",flashvars=S.options.flashVars,params=S.options.flashParams;S.flash.embedSWF(swf,this.id,width,height,version,express,flashvars,params)},remove:function(){S.flash.expressInstallCallback();S.flash.removeSWF(this.id)},onWindowResize:function(){var dims=S.dimensions,el=get(this.id);el.height=dims.innerHeight;el.width=dims.innerWidth}};var overlayOn=false,visibilityCache=[],pngIds=["sb-nav-close","sb-nav-next","sb-nav-play","sb-nav-pause","sb-nav-previous"],container,overlay,wrapper,doWindowResize=true;function animate(el,property,to,duration,callback){var isOpacity=(property=="opacity"),anim=isOpacity?S.setOpacity:function(el,value){el.style[property]=""+value+"px"};if(duration==0||(!isOpacity&&!S.options.animate)||(isOpacity&&!S.options.animateFade)){anim(el,to);if(callback){callback()}return}var from=parseFloat(S.getStyle(el,property))||0;var delta=to-from;if(delta==0){if(callback){callback()}return}duration*=1000;var begin=now(),ease=S.ease,end=begin+duration,time;var interval=setInterval(function(){time=now();if(time>=end){clearInterval(interval);interval=null;anim(el,to);if(callback){callback()}}else{anim(el,from+ease((time-begin)/duration)*delta)}},10)}function setSize(){container.style.height=S.getWindowSize("Height")+"px";container.style.width=S.getWindowSize("Width")+"px"}function setPosition(){container.style.top=document.documentElement.scrollTop+"px";container.style.left=document.documentElement.scrollLeft+"px"}function toggleTroubleElements(on){if(on){each(visibilityCache,function(i,el){el[0].style.visibility=el[1]||""})}else{visibilityCache=[];each(S.options.troubleElements,function(i,tag){each(document.getElementsByTagName(tag),function(j,el){visibilityCache.push([el,el.style.visibility]);el.style.visibility="hidden"})})}}function toggleNav(id,on){var el=get("sb-nav-"+id);if(el){el.style.display=on?"":"none"}}function toggleLoading(on,callback){var loading=get("sb-loading"),playerName=S.getCurrent().player,anim=(playerName=="img"||playerName=="html");if(on){S.setOpacity(loading,0);loading.style.display="block";var wrapped=function(){S.clearOpacity(loading);if(callback){callback()}};if(anim){animate(loading,"opacity",1,S.options.fadeDuration,wrapped)}else{wrapped()}}else{var wrapped=function(){loading.style.display="none";S.clearOpacity(loading);if(callback){callback()}};if(anim){animate(loading,"opacity",0,S.options.fadeDuration,wrapped)}else{wrapped()}}}function buildBars(callback){var obj=S.getCurrent();get("sb-title-inner").innerHTML=obj.title||"";var close,next,play,pause,previous;if(S.options.displayNav){close=true;var len=S.gallery.length;if(len>1){if(S.options.continuous){next=previous=true}else{next=(len-1)>S.current;previous=S.current>0}}if(S.options.slideshowDelay>0&&S.hasNext()){pause=!S.isPaused();play=!pause}}else{close=next=play=pause=previous=false}toggleNav("close",close);toggleNav("next",next);toggleNav("play",play);toggleNav("pause",pause);toggleNav("previous",previous);var counter="";if(S.options.displayCounter&&S.gallery.length>1){var len=S.gallery.length;if(S.options.counterType=="skip"){var i=0,end=len,limit=parseInt(S.options.counterLimit)||0;if(limit<len&&limit>2){var h=Math.floor(limit/2);i=S.current-h;if(i<0){i+=len}end=S.current+(limit-h);if(end>len){end-=len}}while(i!=end){if(i==len){i=0}counter+='<a onclick="Shadowbox.change('+i+');"';if(i==S.current){counter+=' class="sb-counter-current"'}counter+=">"+(++i)+"</a>"}}else{counter=[S.current+1,S.lang.of,len].join(" ")}}get("sb-counter").innerHTML=counter;callback()}function showBars(callback){var titleInner=get("sb-title-inner"),infoInner=get("sb-info-inner"),duration=0.35;titleInner.style.visibility=infoInner.style.visibility="";if(titleInner.innerHTML!=""){animate(titleInner,"marginTop",0,duration)}animate(infoInner,"marginTop",0,duration,callback)}function hideBars(anim,callback){var title=get("sb-title"),info=get("sb-info"),titleHeight=title.offsetHeight,infoHeight=info.offsetHeight,titleInner=get("sb-title-inner"),infoInner=get("sb-info-inner"),duration=(anim?0.35:0);animate(titleInner,"marginTop",titleHeight,duration);animate(infoInner,"marginTop",infoHeight*-1,duration,function(){titleInner.style.visibility=infoInner.style.visibility="hidden";callback()})}function adjustHeight(height,top,anim,callback){var wrapperInner=get("sb-wrapper-inner"),duration=(anim?S.options.resizeDuration:0);animate(wrapper,"top",top,duration);animate(wrapperInner,"height",height,duration,callback)}function adjustWidth(width,left,anim,callback){var duration=(anim?S.options.resizeDuration:0);animate(wrapper,"left",left,duration);animate(wrapper,"width",width,duration,callback)}function setDimensions(height,width){var bodyInner=get("sb-body-inner"),height=parseInt(height),width=parseInt(width),topBottom=wrapper.offsetHeight-bodyInner.offsetHeight,leftRight=wrapper.offsetWidth-bodyInner.offsetWidth,maxHeight=overlay.offsetHeight,maxWidth=overlay.offsetWidth,padding=parseInt(S.options.viewportPadding)||20,preserveAspect=(S.player&&S.options.handleOversize!="drag");return S.setDimensions(height,width,maxHeight,maxWidth,topBottom,leftRight,padding,preserveAspect)}var K={};K.markup='<div id="sb-container"><div id="sb-overlay"></div><div id="sb-wrapper"><div id="sb-title"><div id="sb-title-inner"></div></div><div id="sb-wrapper-inner"><div id="sb-body"><div id="sb-body-inner"></div><div id="sb-loading"><div id="sb-loading-inner"><span>{loading}</span></div></div></div></div><div id="sb-info"><div id="sb-info-inner"><div id="sb-counter"></div><div id="sb-nav"><a id="sb-nav-close" title="{close}" onclick="Shadowbox.close()"></a><a id="sb-nav-next" title="{next}" onclick="Shadowbox.next()"></a><a id="sb-nav-play" title="{play}" onclick="Shadowbox.play()"></a><a id="sb-nav-pause" title="{pause}" onclick="Shadowbox.pause()"></a><a id="sb-nav-previous" title="{previous}" onclick="Shadowbox.previous()"></a></div></div></div></div></div>';K.options={animSequence:"sync",counterLimit:10,counterType:"default",displayCounter:true,displayNav:true,fadeDuration:0.35,initialHeight:160,initialWidth:320,modal:false,overlayColor:"#000",overlayOpacity:0.5,resizeDuration:0.35,showOverlay:true,troubleElements:["select","object","embed","canvas"]};K.init=function(){S.appendHTML(document.body,sprintf(K.markup,S.lang));K.body=get("sb-body-inner");container=get("sb-container");overlay=get("sb-overlay");wrapper=get("sb-wrapper");if(!supportsFixed){container.style.position="absolute"}if(!supportsOpacity){var el,m,re=/url\("(.*\.png)"\)/;each(pngIds,function(i,id){el=get(id);if(el){m=S.getStyle(el,"backgroundImage").match(re);if(m){el.style.backgroundImage="none";el.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,src="+m[1]+",sizingMethod=scale);"}}})}var timer;addEvent(window,"resize",function(){if(timer){clearTimeout(timer);timer=null}if(open){timer=setTimeout(K.onWindowResize,10)}})};K.onOpen=function(obj,callback){doWindowResize=false;container.style.display="block";setSize();var dims=setDimensions(S.options.initialHeight,S.options.initialWidth);adjustHeight(dims.innerHeight,dims.top);adjustWidth(dims.width,dims.left);if(S.options.showOverlay){overlay.style.backgroundColor=S.options.overlayColor;S.setOpacity(overlay,0);if(!S.options.modal){addEvent(overlay,"click",S.close)}overlayOn=true}if(!supportsFixed){setPosition();addEvent(window,"scroll",setPosition)}toggleTroubleElements();container.style.visibility="visible";if(overlayOn){animate(overlay,"opacity",S.options.overlayOpacity,S.options.fadeDuration,callback)}else{callback()}};K.onLoad=function(changing,callback){toggleLoading(true);while(K.body.firstChild){remove(K.body.firstChild)}hideBars(changing,function(){if(!open){return}if(!changing){wrapper.style.visibility="visible"}buildBars(callback)})};K.onReady=function(callback){if(!open){return}var player=S.player,dims=setDimensions(player.height,player.width);var wrapped=function(){showBars(callback)};switch(S.options.animSequence){case"hw":adjustHeight(dims.innerHeight,dims.top,true,function(){adjustWidth(dims.width,dims.left,true,wrapped)});break;case"wh":adjustWidth(dims.width,dims.left,true,function(){adjustHeight(dims.innerHeight,dims.top,true,wrapped)});break;default:adjustWidth(dims.width,dims.left,true);adjustHeight(dims.innerHeight,dims.top,true,wrapped)}};K.onShow=function(callback){toggleLoading(false,callback);doWindowResize=true};K.onClose=function(){if(!supportsFixed){removeEvent(window,"scroll",setPosition)}removeEvent(overlay,"click",S.close);wrapper.style.visibility="hidden";var callback=function(){container.style.visibility="hidden";container.style.display="none";toggleTroubleElements(true)};if(overlayOn){animate(overlay,"opacity",0,S.options.fadeDuration,callback)}else{callback()}};K.onPlay=function(){toggleNav("play",false);toggleNav("pause",true)};K.onPause=function(){toggleNav("pause",false);toggleNav("play",true)};K.onWindowResize=function(){if(!doWindowResize){return}setSize();var player=S.player,dims=setDimensions(player.height,player.width);adjustWidth(dims.width,dims.left);adjustHeight(dims.innerHeight,dims.top);if(player.onWindowResize){player.onWindowResize()}};S.skin=K;window.Shadowbox=S})(window);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * JavaScript Cookie v2.2.0
	 * https://github.com/js-cookie/js-cookie
	 *
	 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
	 * Released under the MIT license
	 */
	;(function (factory) {
		var registeredInModuleLoader = false;
		if (true) {
			!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
			registeredInModuleLoader = true;
		}
		if (true) {
			module.exports = factory();
			registeredInModuleLoader = true;
		}
		if (!registeredInModuleLoader) {
			var OldCookies = window.Cookies;
			var api = window.Cookies = factory();
			api.noConflict = function () {
				window.Cookies = OldCookies;
				return api;
			};
		}
	}(function () {
		function extend () {
			var i = 0;
			var result = {};
			for (; i < arguments.length; i++) {
				var attributes = arguments[ i ];
				for (var key in attributes) {
					result[key] = attributes[key];
				}
			}
			return result;
		}
	
		function init (converter) {
			function api (key, value, attributes) {
				var result;
				if (typeof document === 'undefined') {
					return;
				}
	
				// Write
	
				if (arguments.length > 1) {
					attributes = extend({
						path: '/'
					}, api.defaults, attributes);
	
					if (typeof attributes.expires === 'number') {
						var expires = new Date();
						expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
						attributes.expires = expires;
					}
	
					// We're using "expires" because "max-age" is not supported by IE
					attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';
	
					try {
						result = JSON.stringify(value);
						if (/^[\{\[]/.test(result)) {
							value = result;
						}
					} catch (e) {}
	
					if (!converter.write) {
						value = encodeURIComponent(String(value))
							.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
					} else {
						value = converter.write(value, key);
					}
	
					key = encodeURIComponent(String(key));
					key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
					key = key.replace(/[\(\)]/g, escape);
	
					var stringifiedAttributes = '';
	
					for (var attributeName in attributes) {
						if (!attributes[attributeName]) {
							continue;
						}
						stringifiedAttributes += '; ' + attributeName;
						if (attributes[attributeName] === true) {
							continue;
						}
						stringifiedAttributes += '=' + attributes[attributeName];
					}
					return (document.cookie = key + '=' + value + stringifiedAttributes);
				}
	
				// Read
	
				if (!key) {
					result = {};
				}
	
				// To prevent the for loop in the first place assign an empty array
				// in case there are no cookies at all. Also prevents odd result when
				// calling "get()"
				var cookies = document.cookie ? document.cookie.split('; ') : [];
				var rdecode = /(%[0-9A-Z]{2})+/g;
				var i = 0;
	
				for (; i < cookies.length; i++) {
					var parts = cookies[i].split('=');
					var cookie = parts.slice(1).join('=');
	
					if (!this.json && cookie.charAt(0) === '"') {
						cookie = cookie.slice(1, -1);
					}
	
					try {
						var name = parts[0].replace(rdecode, decodeURIComponent);
						cookie = converter.read ?
							converter.read(cookie, name) : converter(cookie, name) ||
							cookie.replace(rdecode, decodeURIComponent);
	
						if (this.json) {
							try {
								cookie = JSON.parse(cookie);
							} catch (e) {}
						}
	
						if (key === name) {
							result = cookie;
							break;
						}
	
						if (!key) {
							result[name] = cookie;
						}
					} catch (e) {}
				}
	
				return result;
			}
	
			api.set = api;
			api.get = function (key) {
				return api.call(api, key);
			};
			api.getJSON = function () {
				return api.apply({
					json: true
				}, [].slice.call(arguments));
			};
			api.defaults = {};
	
			api.remove = function (key, attributes) {
				api(key, '', extend(attributes, {
					expires: -1
				}));
			};
	
			api.withConverter = init;
	
			return api;
		}
	
		return init(function () {});
	}));


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = function () {
	    var Cookies = __webpack_require__(9);
	
	    return function ($) {
	        if (!Cookies.get('cookienoticeshown')) {
	            Cookies.set('cookienoticeshown', '1', {expires: 365});
	
	            $('.cookie-notice').show();
	
	            $('.cookie-notice__dismiss button').click(function (event) {
	                event.preventDefault();
	                $('.cookie-notice').fadeOut('fast');
	            });
	        }
	    };
	}();


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = function() {
	  var $globalNavWrapper = $(".global-nav-wrapper"),
	      $globalNavElements = $globalNavWrapper.find(".global-nav__item"),
	      $searchWrapper = $(".header-search-wrapper"),
	      $searchToggler = $(".header-search-toggler"),
	      $globalNavToggler = $(".global-nav-toggler"),
	      $window = $(window),
	      compactWidth = 844,
	      $body = $("body");
	
	  return function($) {
	    $searchToggler.on("click", function(e) {
	      e.preventDefault();
	      $searchWrapper.toggleClass("header-search-wrapper--active");
	      $globalNavWrapper.removeClass("global-nav-wrapper--active");
	    });
	
	    $globalNavToggler.on("click", function(e) {
	      e.preventDefault();
	      $globalNavWrapper.toggleClass("global-nav-wrapper--active");
	      $searchWrapper.removeClass("header-search-wrapper--active");
	    });
	
	    $globalNavElements.on("click", function(e) {
	      var clickedNavItem = $(this),
	          clickedNavItemIsActive = clickedNavItem.hasClass("global-nav__item--active");
	
	      if ($window.width() > compactWidth) {
	        e.stopPropagation();
	        $globalNavElements.removeClass("global-nav__item--active");
	        if (clickedNavItemIsActive) {
	          dataLayer.push({"event": "headerClick",
	                          "headerClickDetails": {
	                            "eventCategory": "Header Click",
	                            "eventAction": this.getElementsByTagName("a")[0].href.replace(/^https:/,"http:"),
	                            "eventLabel": this.getElementsByTagName("a")[0].innerText.trim() + " (follow)"}});
	        } else {
	          e.preventDefault();
	          clickedNavItem.addClass("global-nav__item--active");
	        }
	      }
	    });
	
	    $body.click(function() {
	      $globalNavElements.removeClass("global-nav__item--active");
	    });
	  };
	}();


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Toggle Visibility of Image Credit Component
	 */
	module.exports = function () {
	    'use strict';
	
	    var $ = __webpack_require__(1);
	
	    return function() {
	        var $credits = $(".image-credit"),
	            $creditItems = $(".credits-items"),
	            $scpCreditsTitle = $(".credits-title"),
	            creditButtonClass = ".image-credit__button",
	
	            toggleImageCredit = function(node) {
	                var state = node.attr("aria-pressed") === "true" ? "false" : "true";
	                node.attr("aria-pressed", state);
	                node.parent().attr("aria-expanded", state);
	            };
	
	        $credits.each(function () {
	            $(this).find(creditButtonClass).click(function(event) {
	                event.preventDefault();
	                toggleImageCredit($(this));
	            });
	        });
	
	        $scpCreditsTitle.on("click", function () {
	            $(this).toggleClass("credits-title--active").next(".credits-items").toggleClass("sr-only");
	        });
	    };
	
	}();


/***/ })
/******/ ]);