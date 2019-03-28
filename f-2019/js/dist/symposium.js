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
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	var defer = __webpack_require__(13),
	    init = function() {
	        //select div of the day - open accordion section
	        var isAgenda = $('.symp-event-list__content');
	        if (isAgenda.length !== 0) {
	            // var testDay = new Date('May 22, 2017 23:15:30');
	            var today = new Date();
	            /// formats date into: dd-m-yy so it's compatible with squize
	            var todayFormatted =
	                '' +
	                today.getDate() +
	                '-' +
	                (today.getMonth() + 1) +
	                '-' +
	                today.getFullYear() +
	                '';
	            var dateToday = $(
	                '.symp-event-list__collection-of-day[data=' +
	                    todayFormatted +
	                    ']'
	            );
	
	            var days = [
	                'Sunday',
	                'Monday',
	                'Tuesday',
	                'Wednesday',
	                'Thursday',
	                'Friday',
	                'Saturday'
	            ];
	            var day = days[today.getDay()]; //change to /var now = new Date();/ this day when page goes live
	            var findDay = function(today) {
	                var divOfDay = $('' + today + '');
	
	                divOfDay.find('.symp-event-list__items').slideDown();
	                divOfDay.removeClass('closed');
	                var dayHeader = divOfDay.find('h2');
	                dayHeader
	                    .attr('aria-expanded', 'true')
	                    .find('.symp-venet-list_collection__chevron')
	                    .removeClass('icon-chevron-down')
	                    .addClass('icon-chevron-up');
	                $(document).ready(function() {
	                    $('html, body').animate(
	                        {
	                            scrollTop: dayHeader.offset().top
	                        },
	                        'slow'
	                    );
	                });
	            };
	            // opens today's accordian if avialable
	            if (dateToday.length > 0) {
	                findDay('#' + day + '[data=' + todayFormatted + ']');
	            } else {
	                //otherwise opens 1st accordian
	                findDay('.symp-event-list__collection-of-day:eq(0)');
	            }
	        }
	
	        //day-accordion
	        var closeItems = function(item, title) {
	                item.find('.symp-event-list__items').slideUp();
	                title
	                    .find('span')
	                    .removeClass('icon-chevron-up')
	                    .addClass('icon-chevron-down');
	                title.attr('aria-expanded', 'false');
	                item.addClass('closed');
	            },
	            openItems = function(item, title) {
	                item.find('.symp-event-list__items').slideDown();
	                title
	                    .find('span')
	                    .removeClass('icon-chevron-down')
	                    .addClass('icon-chevron-up');
	                title.attr('aria-expanded', 'true');
	                item.removeClass('closed');
	            };
	
	        var accordionHeader = $('.symp-event-list__collection-of-day h2');
	
	        var openClose = function() {
	            var title = $(this),
	                item = title.parent(),
	                isClosed = item.hasClass('closed');
	
	            if (isClosed) {
	                openItems(item, title);
	            } else {
	                closeItems(item, title);
	            }
	        };
	
	        accordionHeader.click(openClose).keypress(openClose);
	
	        //start map API
	        var mapDiv = $('#map');
	        if (mapDiv.length !== 0) {
	            var infowindow = new google.maps.InfoWindow();
	            var marker, i, lat, lng;
	
	            var locationFeed =
	                '//symposium.cass.city.ac.uk/2017/locations/locations-feed';
	            var prev_infowindow = false;
	            var evantMap = $('.map-single-marker');
	            var currentMarkerId = mapDiv.attr('data-locationId');
	
	            //get centre coordinates
	            function getCoordinates(selector) {
	                lat = $(selector).attr('lat');
	                lng = $(selector).attr('lng');
	                lat = parseFloat(lat);
	                lng = parseFloat(lng);
	                var coordinates = [lat, lng];
	                return coordinates;
	            }
	
	            var initialCoordinates = getCoordinates('#map');
	            var centrePoint = new google.maps.LatLng(
	                initialCoordinates[0],
	                initialCoordinates[1]
	            );
	
	            //create map
	            var map = new google.maps.Map(document.getElementById('map'), {
	                zoom: 14,
	                center: centrePoint,
	                mapTypeId: google.maps.MapTypeId.ROADMAP
	            });
	
	            //re-centre map on-click functionality
	            function newLocation(newLat, newLng) {
	                map.setCenter({
	                    lat: newLat,
	                    lng: newLng
	                });
	            }
	
	            var reCenterLink = $('#re-center a');
	            var reCentreAction = function(event) {
	                event.preventDefault();
	                var newCoordinates = getCoordinates($(this));
	                newLocation(newCoordinates[0], newCoordinates[1]);
	            };
	
	            reCenterLink.click(reCentreAction).keypress(reCentreAction);
	
	            //create map marker(s)
	            function dropMarker(myLatLng, markerMsg, markerId) {
	                setTimeout(function() {
	                    marker = new google.maps.Marker({
	                        position: myLatLng,
	                        map: map,
	                        animation: google.maps.Animation.DROP
	                    });
	                    attachMessage(marker, markerMsg, markerId);
	                }, i * 150);
	            }
	
	            function attachMessage(marker, markerMsg, markerId) {
	                var infowindow = new google.maps.InfoWindow({
	                    content: markerMsg
	                });
	
	                if (currentMarkerId == markerId) {
	                    prev_infowindow = infowindow;
	                    infowindow.open(map, marker);
	                }
	
	                marker.addListener('click', function() {
	                    if (prev_infowindow) {
	                        prev_infowindow.close();
	                    }
	                    prev_infowindow = infowindow;
	                    infowindow.open(map, marker);
	                });
	            }
	
	            var markerCreator = function(data) {
	                for (i = 0; i < data.length; i++) {
	                    var myLatLng = new google.maps.LatLng(
	                        data[i].lat,
	                        data[i].long
	                    );
	                    var markerMsg = data[i].placename;
	                    var markerId = data[i].id;
	                    if (evantMap.length !== 0) {
	                        if (currentMarkerId == markerId) {
	                            /*event-map with single map marker */
	                            dropMarker(myLatLng, markerMsg, markerId);
	                        }
	                    } else {
	                        /*locations-map with all map marker */
	                        dropMarker(myLatLng, markerMsg, markerId);
	                    }
	                }
	            };
	
	            $.ajax({
	                url: locationFeed,
	                headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                },
	                type: 'GET',
	                dataType: 'json',
	                data: {},
	                success: markerCreator,
	                error: function() {
	                    console.log('error');
	                }
	            });
	        }
	    };
	defer(init);


/***/ }),

/***/ 13:
/***/ (function(module, exports) {

	module.exports = function () {
	    'use strict';
	
	    return function (deferredFunction) {
	        if (typeof CITY !== 'undefined') {
	            $(deferredFunction);
	        } else {
	            if (!window.CITY_OPTIONS) {
	                window.CITY_OPTIONS = {defer: []};
	            } else if (!window.CITY_OPTIONS.defer) {
	                window.CITY_OPTIONS.defer = [];
	            }
	            CITY_OPTIONS.defer.push(deferredFunction);
	        }
	    };
	}();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTQ0MTIyNDgwMzU2YjU0MGRkOGY/MDFhMioiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvc3ltcG9zaXVtLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2RzL3V0aWxzL2RlZmVyLmpzP2NjNmUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBMkMsbUNBQW1DO0FBQzlFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQSxrQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCOztBQUVqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7O0FBRUE7QUFDQSw0QkFBMkIsaUJBQWlCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFpQjtBQUNqQjtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN2TkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSx3Q0FBdUM7QUFDdkMsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDLEciLCJmaWxlIjoic3ltcG9zaXVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOTQ0MTIyNDgwMzU2YjU0MGRkOGYiLCJ2YXIgZGVmZXIgPSByZXF1aXJlKCcuL3V0aWxzL2RlZmVyJyksXG4gICAgaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAvL3NlbGVjdCBkaXYgb2YgdGhlIGRheSAtIG9wZW4gYWNjb3JkaW9uIHNlY3Rpb25cbiAgICAgICAgdmFyIGlzQWdlbmRhID0gJCgnLnN5bXAtZXZlbnQtbGlzdF9fY29udGVudCcpO1xuICAgICAgICBpZiAoaXNBZ2VuZGEubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAvLyB2YXIgdGVzdERheSA9IG5ldyBEYXRlKCdNYXkgMjIsIDIwMTcgMjM6MTU6MzAnKTtcbiAgICAgICAgICAgIHZhciB0b2RheSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAvLy8gZm9ybWF0cyBkYXRlIGludG86IGRkLW0teXkgc28gaXQncyBjb21wYXRpYmxlIHdpdGggc3F1aXplXG4gICAgICAgICAgICB2YXIgdG9kYXlGb3JtYXR0ZWQgPVxuICAgICAgICAgICAgICAgICcnICtcbiAgICAgICAgICAgICAgICB0b2RheS5nZXREYXRlKCkgK1xuICAgICAgICAgICAgICAgICctJyArXG4gICAgICAgICAgICAgICAgKHRvZGF5LmdldE1vbnRoKCkgKyAxKSArXG4gICAgICAgICAgICAgICAgJy0nICtcbiAgICAgICAgICAgICAgICB0b2RheS5nZXRGdWxsWWVhcigpICtcbiAgICAgICAgICAgICAgICAnJztcbiAgICAgICAgICAgIHZhciBkYXRlVG9kYXkgPSAkKFxuICAgICAgICAgICAgICAgICcuc3ltcC1ldmVudC1saXN0X19jb2xsZWN0aW9uLW9mLWRheVtkYXRhPScgK1xuICAgICAgICAgICAgICAgICAgICB0b2RheUZvcm1hdHRlZCArXG4gICAgICAgICAgICAgICAgICAgICddJ1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdmFyIGRheXMgPSBbXG4gICAgICAgICAgICAgICAgJ1N1bmRheScsXG4gICAgICAgICAgICAgICAgJ01vbmRheScsXG4gICAgICAgICAgICAgICAgJ1R1ZXNkYXknLFxuICAgICAgICAgICAgICAgICdXZWRuZXNkYXknLFxuICAgICAgICAgICAgICAgICdUaHVyc2RheScsXG4gICAgICAgICAgICAgICAgJ0ZyaWRheScsXG4gICAgICAgICAgICAgICAgJ1NhdHVyZGF5J1xuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHZhciBkYXkgPSBkYXlzW3RvZGF5LmdldERheSgpXTsgLy9jaGFuZ2UgdG8gL3ZhciBub3cgPSBuZXcgRGF0ZSgpOy8gdGhpcyBkYXkgd2hlbiBwYWdlIGdvZXMgbGl2ZVxuICAgICAgICAgICAgdmFyIGZpbmREYXkgPSBmdW5jdGlvbih0b2RheSkge1xuICAgICAgICAgICAgICAgIHZhciBkaXZPZkRheSA9ICQoJycgKyB0b2RheSArICcnKTtcblxuICAgICAgICAgICAgICAgIGRpdk9mRGF5LmZpbmQoJy5zeW1wLWV2ZW50LWxpc3RfX2l0ZW1zJykuc2xpZGVEb3duKCk7XG4gICAgICAgICAgICAgICAgZGl2T2ZEYXkucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpO1xuICAgICAgICAgICAgICAgIHZhciBkYXlIZWFkZXIgPSBkaXZPZkRheS5maW5kKCdoMicpO1xuICAgICAgICAgICAgICAgIGRheUhlYWRlclxuICAgICAgICAgICAgICAgICAgICAuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJylcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5zeW1wLXZlbmV0LWxpc3RfY29sbGVjdGlvbl9fY2hldnJvbicpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnaWNvbi1jaGV2cm9uLWRvd24nKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2ljb24tY2hldnJvbi11cCcpO1xuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IGRheUhlYWRlci5vZmZzZXQoKS50b3BcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2xvdydcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBvcGVucyB0b2RheSdzIGFjY29yZGlhbiBpZiBhdmlhbGFibGVcbiAgICAgICAgICAgIGlmIChkYXRlVG9kYXkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZpbmREYXkoJyMnICsgZGF5ICsgJ1tkYXRhPScgKyB0b2RheUZvcm1hdHRlZCArICddJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vb3RoZXJ3aXNlIG9wZW5zIDFzdCBhY2NvcmRpYW5cbiAgICAgICAgICAgICAgICBmaW5kRGF5KCcuc3ltcC1ldmVudC1saXN0X19jb2xsZWN0aW9uLW9mLWRheTplcSgwKScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9kYXktYWNjb3JkaW9uXG4gICAgICAgIHZhciBjbG9zZUl0ZW1zID0gZnVuY3Rpb24oaXRlbSwgdGl0bGUpIHtcbiAgICAgICAgICAgICAgICBpdGVtLmZpbmQoJy5zeW1wLWV2ZW50LWxpc3RfX2l0ZW1zJykuc2xpZGVVcCgpO1xuICAgICAgICAgICAgICAgIHRpdGxlXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdpY29uLWNoZXZyb24tdXAnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2ljb24tY2hldnJvbi1kb3duJyk7XG4gICAgICAgICAgICAgICAgdGl0bGUuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgICAgIGl0ZW0uYWRkQ2xhc3MoJ2Nsb3NlZCcpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wZW5JdGVtcyA9IGZ1bmN0aW9uKGl0ZW0sIHRpdGxlKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5maW5kKCcuc3ltcC1ldmVudC1saXN0X19pdGVtcycpLnNsaWRlRG93bigpO1xuICAgICAgICAgICAgICAgIHRpdGxlXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKCdzcGFuJylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdpY29uLWNoZXZyb24tZG93bicpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnaWNvbi1jaGV2cm9uLXVwJyk7XG4gICAgICAgICAgICAgICAgdGl0bGUuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgaXRlbS5yZW1vdmVDbGFzcygnY2xvc2VkJyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIHZhciBhY2NvcmRpb25IZWFkZXIgPSAkKCcuc3ltcC1ldmVudC1saXN0X19jb2xsZWN0aW9uLW9mLWRheSBoMicpO1xuXG4gICAgICAgIHZhciBvcGVuQ2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0aXRsZSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgaXRlbSA9IHRpdGxlLnBhcmVudCgpLFxuICAgICAgICAgICAgICAgIGlzQ2xvc2VkID0gaXRlbS5oYXNDbGFzcygnY2xvc2VkJyk7XG5cbiAgICAgICAgICAgIGlmIChpc0Nsb3NlZCkge1xuICAgICAgICAgICAgICAgIG9wZW5JdGVtcyhpdGVtLCB0aXRsZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNsb3NlSXRlbXMoaXRlbSwgdGl0bGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGFjY29yZGlvbkhlYWRlci5jbGljayhvcGVuQ2xvc2UpLmtleXByZXNzKG9wZW5DbG9zZSk7XG5cbiAgICAgICAgLy9zdGFydCBtYXAgQVBJXG4gICAgICAgIHZhciBtYXBEaXYgPSAkKCcjbWFwJyk7XG4gICAgICAgIGlmIChtYXBEaXYubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICB2YXIgaW5mb3dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG4gICAgICAgICAgICB2YXIgbWFya2VyLCBpLCBsYXQsIGxuZztcblxuICAgICAgICAgICAgdmFyIGxvY2F0aW9uRmVlZCA9XG4gICAgICAgICAgICAgICAgJy8vc3ltcG9zaXVtLmNhc3MuY2l0eS5hYy51ay8yMDE3L2xvY2F0aW9ucy9sb2NhdGlvbnMtZmVlZCc7XG4gICAgICAgICAgICB2YXIgcHJldl9pbmZvd2luZG93ID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgZXZhbnRNYXAgPSAkKCcubWFwLXNpbmdsZS1tYXJrZXInKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWFya2VySWQgPSBtYXBEaXYuYXR0cignZGF0YS1sb2NhdGlvbklkJyk7XG5cbiAgICAgICAgICAgIC8vZ2V0IGNlbnRyZSBjb29yZGluYXRlc1xuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0Q29vcmRpbmF0ZXMoc2VsZWN0b3IpIHtcbiAgICAgICAgICAgICAgICBsYXQgPSAkKHNlbGVjdG9yKS5hdHRyKCdsYXQnKTtcbiAgICAgICAgICAgICAgICBsbmcgPSAkKHNlbGVjdG9yKS5hdHRyKCdsbmcnKTtcbiAgICAgICAgICAgICAgICBsYXQgPSBwYXJzZUZsb2F0KGxhdCk7XG4gICAgICAgICAgICAgICAgbG5nID0gcGFyc2VGbG9hdChsbmcpO1xuICAgICAgICAgICAgICAgIHZhciBjb29yZGluYXRlcyA9IFtsYXQsIGxuZ107XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW5pdGlhbENvb3JkaW5hdGVzID0gZ2V0Q29vcmRpbmF0ZXMoJyNtYXAnKTtcbiAgICAgICAgICAgIHZhciBjZW50cmVQb2ludCA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoXG4gICAgICAgICAgICAgICAgaW5pdGlhbENvb3JkaW5hdGVzWzBdLFxuICAgICAgICAgICAgICAgIGluaXRpYWxDb29yZGluYXRlc1sxXVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy9jcmVhdGUgbWFwXG4gICAgICAgICAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyksIHtcbiAgICAgICAgICAgICAgICB6b29tOiAxNCxcbiAgICAgICAgICAgICAgICBjZW50ZXI6IGNlbnRyZVBvaW50LFxuICAgICAgICAgICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVBcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvL3JlLWNlbnRyZSBtYXAgb24tY2xpY2sgZnVuY3Rpb25hbGl0eVxuICAgICAgICAgICAgZnVuY3Rpb24gbmV3TG9jYXRpb24obmV3TGF0LCBuZXdMbmcpIHtcbiAgICAgICAgICAgICAgICBtYXAuc2V0Q2VudGVyKHtcbiAgICAgICAgICAgICAgICAgICAgbGF0OiBuZXdMYXQsXG4gICAgICAgICAgICAgICAgICAgIGxuZzogbmV3TG5nXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciByZUNlbnRlckxpbmsgPSAkKCcjcmUtY2VudGVyIGEnKTtcbiAgICAgICAgICAgIHZhciByZUNlbnRyZUFjdGlvbiA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV3Q29vcmRpbmF0ZXMgPSBnZXRDb29yZGluYXRlcygkKHRoaXMpKTtcbiAgICAgICAgICAgICAgICBuZXdMb2NhdGlvbihuZXdDb29yZGluYXRlc1swXSwgbmV3Q29vcmRpbmF0ZXNbMV0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVDZW50ZXJMaW5rLmNsaWNrKHJlQ2VudHJlQWN0aW9uKS5rZXlwcmVzcyhyZUNlbnRyZUFjdGlvbik7XG5cbiAgICAgICAgICAgIC8vY3JlYXRlIG1hcCBtYXJrZXIocylcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRyb3BNYXJrZXIobXlMYXRMbmcsIG1hcmtlck1zZywgbWFya2VySWQpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBteUxhdExuZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNoTWVzc2FnZShtYXJrZXIsIG1hcmtlck1zZywgbWFya2VySWQpO1xuICAgICAgICAgICAgICAgIH0sIGkgKiAxNTApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBhdHRhY2hNZXNzYWdlKG1hcmtlciwgbWFya2VyTXNnLCBtYXJrZXJJZCkge1xuICAgICAgICAgICAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBtYXJrZXJNc2dcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TWFya2VySWQgPT0gbWFya2VySWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldl9pbmZvd2luZG93ID0gaW5mb3dpbmRvdztcbiAgICAgICAgICAgICAgICAgICAgaW5mb3dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBtYXJrZXIuYWRkTGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2X2luZm93aW5kb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXZfaW5mb3dpbmRvdy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHByZXZfaW5mb3dpbmRvdyA9IGluZm93aW5kb3c7XG4gICAgICAgICAgICAgICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtYXJrZXJDcmVhdG9yID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBteUxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ldLmxhdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbaV0ubG9uZ1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWFya2VyTXNnID0gZGF0YVtpXS5wbGFjZW5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXJrZXJJZCA9IGRhdGFbaV0uaWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmFudE1hcC5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50TWFya2VySWQgPT0gbWFya2VySWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKmV2ZW50LW1hcCB3aXRoIHNpbmdsZSBtYXAgbWFya2VyICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHJvcE1hcmtlcihteUxhdExuZywgbWFya2VyTXNnLCBtYXJrZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKmxvY2F0aW9ucy1tYXAgd2l0aCBhbGwgbWFwIG1hcmtlciAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcE1hcmtlcihteUxhdExuZywgbWFya2VyTXNnLCBtYXJrZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogbG9jYXRpb25GZWVkLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIGRhdGE6IHt9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IG1hcmtlckNyZWF0b3IsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5kZWZlcihpbml0KTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2pzL21vZHMvc3ltcG9zaXVtLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZGVmZXJyZWRGdW5jdGlvbikge1xuICAgICAgICBpZiAodHlwZW9mIENJVFkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkKGRlZmVycmVkRnVuY3Rpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF3aW5kb3cuQ0lUWV9PUFRJT05TKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNJVFlfT1BUSU9OUyA9IHtkZWZlcjogW119O1xuICAgICAgICAgICAgfSBlbHNlIGlmICghd2luZG93LkNJVFlfT1BUSU9OUy5kZWZlcikge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5DSVRZX09QVElPTlMuZGVmZXIgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIENJVFlfT1BUSU9OUy5kZWZlci5wdXNoKGRlZmVycmVkRnVuY3Rpb24pO1xuICAgICAgICB9XG4gICAgfTtcbn0oKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2RzL3V0aWxzL2RlZmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQiXSwic291cmNlUm9vdCI6IiJ9