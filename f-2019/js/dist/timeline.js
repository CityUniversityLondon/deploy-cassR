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
	    init = function(){
	      var collection = $('.timeline__collection');
	      var header = $('.timeline__collection__header');
	      $('.timeline__collection__header a').click(function( event ) {
	        event.preventDefault();
	      });
	      
	      var openGroup = collection.filter('.open');
	      if (openGroup) {
	        openGroup.find('.timeline__content').removeClass('collapsed').addClass('expanded').end().find('.timeline__collection__header__icon').removeClass('icon-angle-down').addClass('icon-angle-up');
	        header.find('a').attr('aria-selected','true').attr('aria-expanded','true');
	      }
	  
	      var accordion = function () {
	
	        var closeItems = function (item,title) {
	              item.find('.timeline__content').fadeOut('slow').removeClass('expanded').addClass('collapsed').find('.timeline__content__block').slideUp('slow');
	              item.removeClass('open').addClass('closed').find('.timeline__content').slideUp("slow");
	              title.find('a').attr('aria-selected','false').attr('aria-expanded','false');
	              title.find('.timeline__collection__header__icon').removeClass('icon-angle-up').addClass('icon-angle-down');
	              item.find('.timeline__verical-line-stop').fadeIn('slow');  
	            },
	            openItems = function (item,title) {
	              item.find('.timeline__content').fadeIn('slow').removeClass('collapsed').addClass('expanded').find('.timeline__content__block').slideDown('slow');
	              item.removeClass('closed').addClass('open').find('.timeline__content').slideDown("slow");
	              title.find('a').attr('aria-selected','true').attr('aria-expanded','true');
	              title.find('.timeline__collection__header__icon').removeClass('icon-angle-down').addClass('icon-angle-up');
	              item.find('.timeline__verical-line-stop').fadeIn('slow');
	            };
	
	        $('.timeline__collection__header').click(function () {
	          var title = $(this),
	              item = title.parent(),
	              isOpen = item.hasClass('open');
	
	          if (isOpen) {
	              closeItems(item,title);
	          } else {
	              openItems(item,title);
	          }
	        });
	                
	    };
	
	    accordion();
	
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTQ0MTIyNDgwMzU2YjU0MGRkOGY/MDFhMioqIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2RzL3RpbWVsaW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2RzL3V0aWxzL2RlZmVyLmpzP2NjNmUqIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdFO0FBQ0EsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFXO0FBQ1g7QUFDQTtBQUNBLFVBQVM7O0FBRVQ7O0FBRUE7O0FBRUE7O0FBRUEsYTs7Ozs7OztBQ2pEQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVM7QUFDVDtBQUNBLHdDQUF1QztBQUN2QyxjQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUMsRyIsImZpbGUiOiJ0aW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDk0NDEyMjQ4MDM1NmI1NDBkZDhmIiwidmFyIGRlZmVyID0gcmVxdWlyZSgnLi91dGlscy9kZWZlcicpLFxuICAgIGluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgdmFyIGNvbGxlY3Rpb24gPSAkKCcudGltZWxpbmVfX2NvbGxlY3Rpb24nKTtcbiAgICAgIHZhciBoZWFkZXIgPSAkKCcudGltZWxpbmVfX2NvbGxlY3Rpb25fX2hlYWRlcicpO1xuICAgICAgJCgnLnRpbWVsaW5lX19jb2xsZWN0aW9uX19oZWFkZXIgYScpLmNsaWNrKGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICB2YXIgb3Blbkdyb3VwID0gY29sbGVjdGlvbi5maWx0ZXIoJy5vcGVuJyk7XG4gICAgICBpZiAob3Blbkdyb3VwKSB7XG4gICAgICAgIG9wZW5Hcm91cC5maW5kKCcudGltZWxpbmVfX2NvbnRlbnQnKS5yZW1vdmVDbGFzcygnY29sbGFwc2VkJykuYWRkQ2xhc3MoJ2V4cGFuZGVkJykuZW5kKCkuZmluZCgnLnRpbWVsaW5lX19jb2xsZWN0aW9uX19oZWFkZXJfX2ljb24nKS5yZW1vdmVDbGFzcygnaWNvbi1hbmdsZS1kb3duJykuYWRkQ2xhc3MoJ2ljb24tYW5nbGUtdXAnKTtcbiAgICAgICAgaGVhZGVyLmZpbmQoJ2EnKS5hdHRyKCdhcmlhLXNlbGVjdGVkJywndHJ1ZScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCd0cnVlJyk7XG4gICAgICB9XG4gIFxuICAgICAgdmFyIGFjY29yZGlvbiA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgY2xvc2VJdGVtcyA9IGZ1bmN0aW9uIChpdGVtLHRpdGxlKSB7XG4gICAgICAgICAgICAgIGl0ZW0uZmluZCgnLnRpbWVsaW5lX19jb250ZW50JykuZmFkZU91dCgnc2xvdycpLnJlbW92ZUNsYXNzKCdleHBhbmRlZCcpLmFkZENsYXNzKCdjb2xsYXBzZWQnKS5maW5kKCcudGltZWxpbmVfX2NvbnRlbnRfX2Jsb2NrJykuc2xpZGVVcCgnc2xvdycpO1xuICAgICAgICAgICAgICBpdGVtLnJlbW92ZUNsYXNzKCdvcGVuJykuYWRkQ2xhc3MoJ2Nsb3NlZCcpLmZpbmQoJy50aW1lbGluZV9fY29udGVudCcpLnNsaWRlVXAoXCJzbG93XCIpO1xuICAgICAgICAgICAgICB0aXRsZS5maW5kKCdhJykuYXR0cignYXJpYS1zZWxlY3RlZCcsJ2ZhbHNlJykuYXR0cignYXJpYS1leHBhbmRlZCcsJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgIHRpdGxlLmZpbmQoJy50aW1lbGluZV9fY29sbGVjdGlvbl9faGVhZGVyX19pY29uJykucmVtb3ZlQ2xhc3MoJ2ljb24tYW5nbGUtdXAnKS5hZGRDbGFzcygnaWNvbi1hbmdsZS1kb3duJyk7XG4gICAgICAgICAgICAgIGl0ZW0uZmluZCgnLnRpbWVsaW5lX192ZXJpY2FsLWxpbmUtc3RvcCcpLmZhZGVJbignc2xvdycpOyAgXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3Blbkl0ZW1zID0gZnVuY3Rpb24gKGl0ZW0sdGl0bGUpIHtcbiAgICAgICAgICAgICAgaXRlbS5maW5kKCcudGltZWxpbmVfX2NvbnRlbnQnKS5mYWRlSW4oJ3Nsb3cnKS5yZW1vdmVDbGFzcygnY29sbGFwc2VkJykuYWRkQ2xhc3MoJ2V4cGFuZGVkJykuZmluZCgnLnRpbWVsaW5lX19jb250ZW50X19ibG9jaycpLnNsaWRlRG93bignc2xvdycpO1xuICAgICAgICAgICAgICBpdGVtLnJlbW92ZUNsYXNzKCdjbG9zZWQnKS5hZGRDbGFzcygnb3BlbicpLmZpbmQoJy50aW1lbGluZV9fY29udGVudCcpLnNsaWRlRG93bihcInNsb3dcIik7XG4gICAgICAgICAgICAgIHRpdGxlLmZpbmQoJ2EnKS5hdHRyKCdhcmlhLXNlbGVjdGVkJywndHJ1ZScpLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCd0cnVlJyk7XG4gICAgICAgICAgICAgIHRpdGxlLmZpbmQoJy50aW1lbGluZV9fY29sbGVjdGlvbl9faGVhZGVyX19pY29uJykucmVtb3ZlQ2xhc3MoJ2ljb24tYW5nbGUtZG93bicpLmFkZENsYXNzKCdpY29uLWFuZ2xlLXVwJyk7XG4gICAgICAgICAgICAgIGl0ZW0uZmluZCgnLnRpbWVsaW5lX192ZXJpY2FsLWxpbmUtc3RvcCcpLmZhZGVJbignc2xvdycpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAkKCcudGltZWxpbmVfX2NvbGxlY3Rpb25fX2hlYWRlcicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgdGl0bGUgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICBpdGVtID0gdGl0bGUucGFyZW50KCksXG4gICAgICAgICAgICAgIGlzT3BlbiA9IGl0ZW0uaGFzQ2xhc3MoJ29wZW4nKTtcblxuICAgICAgICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgICAgICAgY2xvc2VJdGVtcyhpdGVtLHRpdGxlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvcGVuSXRlbXMoaXRlbSx0aXRsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICB9O1xuXG4gICAgYWNjb3JkaW9uKCk7XG5cbiAgfTtcblxuZGVmZXIoaW5pdCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kcy90aW1lbGluZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDMiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGRlZmVycmVkRnVuY3Rpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBDSVRZICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJChkZWZlcnJlZEZ1bmN0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghd2luZG93LkNJVFlfT1BUSU9OUykge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5DSVRZX09QVElPTlMgPSB7ZGVmZXI6IFtdfTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXdpbmRvdy5DSVRZX09QVElPTlMuZGVmZXIpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuQ0lUWV9PUFRJT05TLmRlZmVyID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBDSVRZX09QVElPTlMuZGVmZXIucHVzaChkZWZlcnJlZEZ1bmN0aW9uKTtcbiAgICAgICAgfVxuICAgIH07XG59KCk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kcy91dGlscy9kZWZlci5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0Il0sInNvdXJjZVJvb3QiOiIifQ==