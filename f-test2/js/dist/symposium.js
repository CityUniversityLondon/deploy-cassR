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
	init = function () {
	
	//select div of the day - open accordion section
	var isAgenda = $(".symp-event-list__content");
	if (isAgenda.length !== 0) {
	   // var testDay = new Date('May 22, 2017 23:15:30');
	    var today = new Date();
	
	    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	    var day = days[ today.getDay() ]; //change to /var now = new Date();/ this day when page goes live
	    var findDay = function( today ){
	        var divOfDay = $("#"+today);
	        divOfDay.find('.symp-event-list__items').slideDown();
	        divOfDay.removeClass('closed');
	        var dayHeader = divOfDay.find('h2');
	        dayHeader.attr('aria-expanded','true').find('.symp-venet-list_collection__chevron').removeClass('icon-chevron-down').addClass('icon-chevron-up');
	        $(document).ready(function () {
	            $('html, body').animate({
	                scrollTop: dayHeader.offset().top
	            }, 'slow');
	        });
	    };
	    if (day == "Friday" || day == "Saturday" || day == "Sunday") {
	        findDay("Monday");
	    } else {
	        findDay(day);
	    }
	}
	
	//day-accordion
	    var closeItems = function(item,title){
	            item.find('.symp-event-list__items').slideUp();           
	            title.find('span').removeClass('icon-chevron-up').addClass('icon-chevron-down');
	            title.attr('aria-expanded','false');
	            item.addClass('closed');
	        },
	        openItems = function(item,title){
	            item.find('.symp-event-list__items').slideDown();
	            title.find('span').removeClass('icon-chevron-down').addClass('icon-chevron-up');
	            title.attr('aria-expanded','true');
	            item.removeClass('closed');
	    };
	
	    var accordionHeader = $('.symp-event-list__collection-of-day h2');
	
	    var openClose = function () {
	      var title = $(this),
	          item = title.parent(),
	          isClosed = item.hasClass('closed');
	
	      if (isClosed) {
	          openItems(item,title);
	      } else {
	          closeItems(item,title);
	      }
	    };
	    
	    accordionHeader
	        .click(openClose)
	        .keypress(openClose);
	
	//start map API
	var mapDiv = $('#map');
	    if (mapDiv.length !== 0) {
	
	        var infowindow = new google.maps.InfoWindow();
	        var marker,
	            i,
	            lat,
	            lng;
	
	        var locationFeed = "//symposium.cass.city.ac.uk/2017/locations/locations-feed";
	        var prev_infowindow = false; 
	        var evantMap = $('.map-single-marker');
	        var currentMarkerId = mapDiv.attr('data-locationId');
	
	        //get centre coordinates
	        function getCoordinates(selector){
	            lat = $(selector).attr('lat');
	            lng = $(selector).attr('lng');
	            lat = parseFloat(lat);
	            lng = parseFloat(lng);
	            var coordinates = [lat,lng];
	            return coordinates;
	        }        
	
	        var initialCoordinates = getCoordinates('#map');
	        var centrePoint = new google.maps.LatLng(initialCoordinates[0],initialCoordinates[1]);
	
	        //create map
	        var map = new google.maps.Map(document.getElementById('map'), {
	            zoom: 14,
	            center: centrePoint,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        });
	
	        //re-centre map on-click functionality
	        function newLocation(newLat,newLng){
	            map.setCenter({
	                lat : newLat,
	                lng : newLng
	            });
	        }
	
	        var reCenterLink = $('#re-center a');
	        var reCentreAction = function( event ) {
	            event.preventDefault();
	            var newCoordinates = getCoordinates($(this));
	            newLocation(newCoordinates[0],newCoordinates[1]);
	        };
	
	        reCenterLink
	            .click(reCentreAction)
	            .keypress(reCentreAction);
	
	        //create map marker(s)    
	        function dropMarker(myLatLng, markerMsg, markerId) {
	            setTimeout(function () {
	                marker = new google.maps.Marker({
	                    position: myLatLng,
	                    map: map,
	                    animation: google.maps.Animation.DROP,
	                });
	                attachMessage(marker, markerMsg, markerId);
	            }, i * 150);
	        }
	
	        function attachMessage(marker, markerMsg, markerId) {
	            var infowindow = new google.maps.InfoWindow({
	                content: markerMsg
	            });
	
	            if( currentMarkerId == markerId ) {
	                prev_infowindow = infowindow;
	                infowindow.open(map, marker);
	            }
	
	            marker.addListener('click', function () {
	                if( prev_infowindow ) {
	                    prev_infowindow.close();
	                }
	                prev_infowindow = infowindow;
	                infowindow.open(map, marker);
	            });
	        }
	
	        var markerCreator = function (data) { 
	            for (i = 0; i < data.length; i++) {
	                var myLatLng = new google.maps.LatLng(data[i].lat, data[i].long);
	                var markerMsg = data[i].placename;
	                var markerId = data[i].id;
	                if (evantMap.length !== 0){
	                    if( currentMarkerId == markerId ) { /*event-map with single map marker */
	                        dropMarker(myLatLng, markerMsg, markerId);
	                    }
	                } else { /*locations-map with all map marker */
	                    dropMarker(myLatLng, markerMsg, markerId);
	                }
	            }
	        };
	
	        $.ajax({
	            url: locationFeed,
	            headers: {
	                'Content-Type': 'application/x-www-form-urlencoded'
	            },
	            type: "GET",
	            dataType: "json",
	            data: {},
	            success: markerCreator,
	            error: function () {
	                console.log("error");
	            }
	        });
	
	    };
	}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDg5MjIwNTk1MjJlMDkwZWE5ODI/Yzg4ZCoiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL21vZHMvc3ltcG9zaXVtLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2RzL3V0aWxzL2RlZmVyLmpzP2NjNmUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7O0FDdENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNDQUFxQyxtQ0FBbUM7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWlCO0FBQ2pCO0FBQ0EsY0FBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTtBQUNiOztBQUVBLDhDO0FBQ0Esd0JBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdEQUF1RDtBQUN2RDtBQUNBO0FBQ0Esa0JBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFhO0FBQ2I7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNsTEE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSx3Q0FBdUM7QUFDdkMsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDLEciLCJmaWxlIjoic3ltcG9zaXVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNDg5MjIwNTk1MjJlMDkwZWE5ODIiLCJ2YXIgZGVmZXIgPSByZXF1aXJlKCcuL3V0aWxzL2RlZmVyJyksXG5pbml0ID0gZnVuY3Rpb24gKCkge1xuXG4vL3NlbGVjdCBkaXYgb2YgdGhlIGRheSAtIG9wZW4gYWNjb3JkaW9uIHNlY3Rpb25cbnZhciBpc0FnZW5kYSA9ICQoXCIuc3ltcC1ldmVudC1saXN0X19jb250ZW50XCIpO1xuaWYgKGlzQWdlbmRhLmxlbmd0aCAhPT0gMCkge1xuICAgLy8gdmFyIHRlc3REYXkgPSBuZXcgRGF0ZSgnTWF5IDIyLCAyMDE3IDIzOjE1OjMwJyk7XG4gICAgdmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcblxuICAgIHZhciBkYXlzID0gWydTdW5kYXknLCdNb25kYXknLCdUdWVzZGF5JywnV2VkbmVzZGF5JywnVGh1cnNkYXknLCdGcmlkYXknLCdTYXR1cmRheSddO1xuICAgIHZhciBkYXkgPSBkYXlzWyB0b2RheS5nZXREYXkoKSBdOyAvL2NoYW5nZSB0byAvdmFyIG5vdyA9IG5ldyBEYXRlKCk7LyB0aGlzIGRheSB3aGVuIHBhZ2UgZ29lcyBsaXZlXG4gICAgdmFyIGZpbmREYXkgPSBmdW5jdGlvbiggdG9kYXkgKXtcbiAgICAgICAgdmFyIGRpdk9mRGF5ID0gJChcIiNcIit0b2RheSk7XG4gICAgICAgIGRpdk9mRGF5LmZpbmQoJy5zeW1wLWV2ZW50LWxpc3RfX2l0ZW1zJykuc2xpZGVEb3duKCk7XG4gICAgICAgIGRpdk9mRGF5LnJlbW92ZUNsYXNzKCdjbG9zZWQnKTtcbiAgICAgICAgdmFyIGRheUhlYWRlciA9IGRpdk9mRGF5LmZpbmQoJ2gyJyk7XG4gICAgICAgIGRheUhlYWRlci5hdHRyKCdhcmlhLWV4cGFuZGVkJywndHJ1ZScpLmZpbmQoJy5zeW1wLXZlbmV0LWxpc3RfY29sbGVjdGlvbl9fY2hldnJvbicpLnJlbW92ZUNsYXNzKCdpY29uLWNoZXZyb24tZG93bicpLmFkZENsYXNzKCdpY29uLWNoZXZyb24tdXAnKTtcbiAgICAgICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogZGF5SGVhZGVyLm9mZnNldCgpLnRvcFxuICAgICAgICAgICAgfSwgJ3Nsb3cnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBpZiAoZGF5ID09IFwiRnJpZGF5XCIgfHwgZGF5ID09IFwiU2F0dXJkYXlcIiB8fCBkYXkgPT0gXCJTdW5kYXlcIikge1xuICAgICAgICBmaW5kRGF5KFwiTW9uZGF5XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpbmREYXkoZGF5KTtcbiAgICB9XG59XG5cbi8vZGF5LWFjY29yZGlvblxuICAgIHZhciBjbG9zZUl0ZW1zID0gZnVuY3Rpb24oaXRlbSx0aXRsZSl7XG4gICAgICAgICAgICBpdGVtLmZpbmQoJy5zeW1wLWV2ZW50LWxpc3RfX2l0ZW1zJykuc2xpZGVVcCgpOyAgICAgICAgICAgXG4gICAgICAgICAgICB0aXRsZS5maW5kKCdzcGFuJykucmVtb3ZlQ2xhc3MoJ2ljb24tY2hldnJvbi11cCcpLmFkZENsYXNzKCdpY29uLWNoZXZyb24tZG93bicpO1xuICAgICAgICAgICAgdGl0bGUuYXR0cignYXJpYS1leHBhbmRlZCcsJ2ZhbHNlJyk7XG4gICAgICAgICAgICBpdGVtLmFkZENsYXNzKCdjbG9zZWQnKTtcbiAgICAgICAgfSxcbiAgICAgICAgb3Blbkl0ZW1zID0gZnVuY3Rpb24oaXRlbSx0aXRsZSl7XG4gICAgICAgICAgICBpdGVtLmZpbmQoJy5zeW1wLWV2ZW50LWxpc3RfX2l0ZW1zJykuc2xpZGVEb3duKCk7XG4gICAgICAgICAgICB0aXRsZS5maW5kKCdzcGFuJykucmVtb3ZlQ2xhc3MoJ2ljb24tY2hldnJvbi1kb3duJykuYWRkQ2xhc3MoJ2ljb24tY2hldnJvbi11cCcpO1xuICAgICAgICAgICAgdGl0bGUuYXR0cignYXJpYS1leHBhbmRlZCcsJ3RydWUnKTtcbiAgICAgICAgICAgIGl0ZW0ucmVtb3ZlQ2xhc3MoJ2Nsb3NlZCcpO1xuICAgIH07XG5cbiAgICB2YXIgYWNjb3JkaW9uSGVhZGVyID0gJCgnLnN5bXAtZXZlbnQtbGlzdF9fY29sbGVjdGlvbi1vZi1kYXkgaDInKTtcblxuICAgIHZhciBvcGVuQ2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGl0bGUgPSAkKHRoaXMpLFxuICAgICAgICAgIGl0ZW0gPSB0aXRsZS5wYXJlbnQoKSxcbiAgICAgICAgICBpc0Nsb3NlZCA9IGl0ZW0uaGFzQ2xhc3MoJ2Nsb3NlZCcpO1xuXG4gICAgICBpZiAoaXNDbG9zZWQpIHtcbiAgICAgICAgICBvcGVuSXRlbXMoaXRlbSx0aXRsZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNsb3NlSXRlbXMoaXRlbSx0aXRsZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBhY2NvcmRpb25IZWFkZXJcbiAgICAgICAgLmNsaWNrKG9wZW5DbG9zZSlcbiAgICAgICAgLmtleXByZXNzKG9wZW5DbG9zZSk7XG5cbi8vc3RhcnQgbWFwIEFQSVxudmFyIG1hcERpdiA9ICQoJyNtYXAnKTtcbiAgICBpZiAobWFwRGl2Lmxlbmd0aCAhPT0gMCkge1xuXG4gICAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcbiAgICAgICAgdmFyIG1hcmtlcixcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBsYXQsXG4gICAgICAgICAgICBsbmc7XG5cbiAgICAgICAgdmFyIGxvY2F0aW9uRmVlZCA9IFwiLy9zeW1wb3NpdW0uY2Fzcy5jaXR5LmFjLnVrLzIwMTcvbG9jYXRpb25zL2xvY2F0aW9ucy1mZWVkXCI7XG4gICAgICAgIHZhciBwcmV2X2luZm93aW5kb3cgPSBmYWxzZTsgXG4gICAgICAgIHZhciBldmFudE1hcCA9ICQoJy5tYXAtc2luZ2xlLW1hcmtlcicpO1xuICAgICAgICB2YXIgY3VycmVudE1hcmtlcklkID0gbWFwRGl2LmF0dHIoJ2RhdGEtbG9jYXRpb25JZCcpO1xuXG4gICAgICAgIC8vZ2V0IGNlbnRyZSBjb29yZGluYXRlc1xuICAgICAgICBmdW5jdGlvbiBnZXRDb29yZGluYXRlcyhzZWxlY3Rvcil7XG4gICAgICAgICAgICBsYXQgPSAkKHNlbGVjdG9yKS5hdHRyKCdsYXQnKTtcbiAgICAgICAgICAgIGxuZyA9ICQoc2VsZWN0b3IpLmF0dHIoJ2xuZycpO1xuICAgICAgICAgICAgbGF0ID0gcGFyc2VGbG9hdChsYXQpO1xuICAgICAgICAgICAgbG5nID0gcGFyc2VGbG9hdChsbmcpO1xuICAgICAgICAgICAgdmFyIGNvb3JkaW5hdGVzID0gW2xhdCxsbmddO1xuICAgICAgICAgICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICAgICAgICB9ICAgICAgICBcblxuICAgICAgICB2YXIgaW5pdGlhbENvb3JkaW5hdGVzID0gZ2V0Q29vcmRpbmF0ZXMoJyNtYXAnKTtcbiAgICAgICAgdmFyIGNlbnRyZVBvaW50ID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhpbml0aWFsQ29vcmRpbmF0ZXNbMF0saW5pdGlhbENvb3JkaW5hdGVzWzFdKTtcblxuICAgICAgICAvL2NyZWF0ZSBtYXBcbiAgICAgICAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgICAgICB6b29tOiAxNCxcbiAgICAgICAgICAgIGNlbnRlcjogY2VudHJlUG9pbnQsXG4gICAgICAgICAgICBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vcmUtY2VudHJlIG1hcCBvbi1jbGljayBmdW5jdGlvbmFsaXR5XG4gICAgICAgIGZ1bmN0aW9uIG5ld0xvY2F0aW9uKG5ld0xhdCxuZXdMbmcpe1xuICAgICAgICAgICAgbWFwLnNldENlbnRlcih7XG4gICAgICAgICAgICAgICAgbGF0IDogbmV3TGF0LFxuICAgICAgICAgICAgICAgIGxuZyA6IG5ld0xuZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVDZW50ZXJMaW5rID0gJCgnI3JlLWNlbnRlciBhJyk7XG4gICAgICAgIHZhciByZUNlbnRyZUFjdGlvbiA9IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgbmV3Q29vcmRpbmF0ZXMgPSBnZXRDb29yZGluYXRlcygkKHRoaXMpKTtcbiAgICAgICAgICAgIG5ld0xvY2F0aW9uKG5ld0Nvb3JkaW5hdGVzWzBdLG5ld0Nvb3JkaW5hdGVzWzFdKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZUNlbnRlckxpbmtcbiAgICAgICAgICAgIC5jbGljayhyZUNlbnRyZUFjdGlvbilcbiAgICAgICAgICAgIC5rZXlwcmVzcyhyZUNlbnRyZUFjdGlvbik7XG5cbiAgICAgICAgLy9jcmVhdGUgbWFwIG1hcmtlcihzKSAgICBcbiAgICAgICAgZnVuY3Rpb24gZHJvcE1hcmtlcihteUxhdExuZywgbWFya2VyTXNnLCBtYXJrZXJJZCkge1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBteUxhdExuZyxcbiAgICAgICAgICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYXR0YWNoTWVzc2FnZShtYXJrZXIsIG1hcmtlck1zZywgbWFya2VySWQpO1xuICAgICAgICAgICAgfSwgaSAqIDE1MCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBhdHRhY2hNZXNzYWdlKG1hcmtlciwgbWFya2VyTXNnLCBtYXJrZXJJZCkge1xuICAgICAgICAgICAgdmFyIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG4gICAgICAgICAgICAgICAgY29udGVudDogbWFya2VyTXNnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYoIGN1cnJlbnRNYXJrZXJJZCA9PSBtYXJrZXJJZCApIHtcbiAgICAgICAgICAgICAgICBwcmV2X2luZm93aW5kb3cgPSBpbmZvd2luZG93O1xuICAgICAgICAgICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsIG1hcmtlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hcmtlci5hZGRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYoIHByZXZfaW5mb3dpbmRvdyApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldl9pbmZvd2luZG93LmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZXZfaW5mb3dpbmRvdyA9IGluZm93aW5kb3c7XG4gICAgICAgICAgICAgICAgaW5mb3dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG1hcmtlckNyZWF0b3IgPSBmdW5jdGlvbiAoZGF0YSkgeyBcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIG15TGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhkYXRhW2ldLmxhdCwgZGF0YVtpXS5sb25nKTtcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyTXNnID0gZGF0YVtpXS5wbGFjZW5hbWU7XG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlcklkID0gZGF0YVtpXS5pZDtcbiAgICAgICAgICAgICAgICBpZiAoZXZhbnRNYXAubGVuZ3RoICE9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoIGN1cnJlbnRNYXJrZXJJZCA9PSBtYXJrZXJJZCApIHsgLypldmVudC1tYXAgd2l0aCBzaW5nbGUgbWFwIG1hcmtlciAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgZHJvcE1hcmtlcihteUxhdExuZywgbWFya2VyTXNnLCBtYXJrZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgeyAvKmxvY2F0aW9ucy1tYXAgd2l0aCBhbGwgbWFwIG1hcmtlciAqL1xuICAgICAgICAgICAgICAgICAgICBkcm9wTWFya2VyKG15TGF0TG5nLCBtYXJrZXJNc2csIG1hcmtlcklkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogbG9jYXRpb25GZWVkLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICBkYXRhOiB7fSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IG1hcmtlckNyZWF0b3IsXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3JcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcbn1cbmRlZmVyKGluaXQpO1xuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2RzL3N5bXBvc2l1bS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDIiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGRlZmVycmVkRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBDSVRZICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJChkZWZlcnJlZEZ1bmN0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghd2luZG93LkNJVFlfT1BUSU9OUykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5DSVRZX09QVElPTlMgPSB7ZGVmZXI6IFtdfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXdpbmRvdy5DSVRZX09QVElPTlMuZGVmZXIpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ0lUWV9PUFRJT05TLmRlZmVyID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBDSVRZX09QVElPTlMuZGVmZXIucHVzaChkZWZlcnJlZEZ1bmN0aW9uKTtcbiAgICAgICAgfVxuICAgIH07XG59KCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kcy91dGlscy9kZWZlci5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0Il0sInNvdXJjZVJvb3QiOiIifQ==