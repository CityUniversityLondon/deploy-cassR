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

	var defer = __webpack_require__(13);
	
	var init = function () {
	    initSeriesLinks();
	    initAttachmentLinks();
	};
	
	var initSeriesLinks = function () {
	
	    var series = {
	        //Cass News
	        'announcements': 'Announcements',
	        'expert-comment': 'Expert Comment',
	        'graduate-success': 'Graduate Success',
	        'impact': 'Impact',
	        'research-spotlight': 'Research Spotlight',
	
	        //Cass Knowledge
	        'asset-management': 'Asset Management',
	        'charity': 'Charity and Non-Governmental Sector',
	        'corporate-finance': 'Corporate Finance',
	        'corporate-governance': 'Corporate Governance and CSR',
	        'health-and-care': 'Health and Care',
	        'human-resource-management': 'Human Resource Management',
	        'insurance-and-pensions': 'Insurance and Pensions',
	        'investment-and-risk': 'Investment and Risk Management',
	        'leadership-entrepreneurship': 'Leadership, Entrepreneurship and Innovation',
	        'marketing': 'Marketing',
	        'operations': 'Operations and Supply Chain Management',
	        'professional-services': 'Professional Services',
	        'real-estate': 'Real Estate',
	        'shipping-and-transport': 'Shipping and Transport'
	    };
	
	    var path = '//cass.city.ac.uk/' + $('.news-article').data('articles-path');
	
	    var seriesPrefix = path + '?meta_i_orsand=';
	
	    var tagsPrefix = path + '?all=1&meta_l_orsand="',
	        tagsSuffix = '"',
	        tagsName;
	
	    $('.news-article-series-family').each(function () {
	        $(this).attr('href', seriesPrefix + $(this).html());
	        $(this).html(series[$(this).html()]);
	    });
	
	    $('.news-article-tag').each(function () {
	        tagsName = encodeURIComponent($(this).text());
	        $(this).attr('href', tagsPrefix + tagsName + tagsSuffix);
	    });
	};
	
	var initAttachmentLinks = function () {
	    var attachments = $('.cass-knowledge-attachment__raw');
	
	    if (attachments.length) {
	        var template = "<li class='cass-knowledge-attachment__item'><a href='$0'>$1</a></li>";
	        var attachmentLinks = "<ul class='cass-knowledge-attachment__listing'>";
	
	        attachments = attachments.html().trim().split("; ");
	
	        $.each(attachments, function(index, value) {
	            var parts = value.slice(1, -1).split("}{");
	            var attachmentLink = template.replace("$0", parts[1]).replace("$1", parts[0]);
	            attachmentLinks = attachmentLinks.concat(attachmentLink);
	        });
	
	        attachmentLinks = attachmentLinks.concat("</ul>");
	        $('.cass-knowledge-attachment__raw').html(attachmentLinks);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTQ0MTIyNDgwMzU2YjU0MGRkOGY/MDFhMiIsIndlYnBhY2s6Ly8vLi9zcmMvanMvbW9kcy9uZXdzLmpzIiwid2VicGFjazovLy8uL3NyYy9qcy9tb2RzL3V0aWxzL2RlZmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQ3RDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEseURBQXdEOztBQUV4RDtBQUNBLHFEQUFvRDtBQUNwRDtBQUNBO0FBQ0EsVUFBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUN6RUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFTO0FBQ1Q7QUFDQSx3Q0FBdUM7QUFDdkMsY0FBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDLEciLCJmaWxlIjoibmV3cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDk0NDEyMjQ4MDM1NmI1NDBkZDhmIiwidmFyIGRlZmVyID0gcmVxdWlyZSgnLi91dGlscy9kZWZlcicpO1xuXG52YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpbml0U2VyaWVzTGlua3MoKTtcbiAgICBpbml0QXR0YWNobWVudExpbmtzKCk7XG59O1xuXG52YXIgaW5pdFNlcmllc0xpbmtzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHNlcmllcyA9IHtcbiAgICAgICAgLy9DYXNzIE5ld3NcbiAgICAgICAgJ2Fubm91bmNlbWVudHMnOiAnQW5ub3VuY2VtZW50cycsXG4gICAgICAgICdleHBlcnQtY29tbWVudCc6ICdFeHBlcnQgQ29tbWVudCcsXG4gICAgICAgICdncmFkdWF0ZS1zdWNjZXNzJzogJ0dyYWR1YXRlIFN1Y2Nlc3MnLFxuICAgICAgICAnaW1wYWN0JzogJ0ltcGFjdCcsXG4gICAgICAgICdyZXNlYXJjaC1zcG90bGlnaHQnOiAnUmVzZWFyY2ggU3BvdGxpZ2h0JyxcblxuICAgICAgICAvL0Nhc3MgS25vd2xlZGdlXG4gICAgICAgICdhc3NldC1tYW5hZ2VtZW50JzogJ0Fzc2V0IE1hbmFnZW1lbnQnLFxuICAgICAgICAnY2hhcml0eSc6ICdDaGFyaXR5IGFuZCBOb24tR292ZXJubWVudGFsIFNlY3RvcicsXG4gICAgICAgICdjb3Jwb3JhdGUtZmluYW5jZSc6ICdDb3Jwb3JhdGUgRmluYW5jZScsXG4gICAgICAgICdjb3Jwb3JhdGUtZ292ZXJuYW5jZSc6ICdDb3Jwb3JhdGUgR292ZXJuYW5jZSBhbmQgQ1NSJyxcbiAgICAgICAgJ2hlYWx0aC1hbmQtY2FyZSc6ICdIZWFsdGggYW5kIENhcmUnLFxuICAgICAgICAnaHVtYW4tcmVzb3VyY2UtbWFuYWdlbWVudCc6ICdIdW1hbiBSZXNvdXJjZSBNYW5hZ2VtZW50JyxcbiAgICAgICAgJ2luc3VyYW5jZS1hbmQtcGVuc2lvbnMnOiAnSW5zdXJhbmNlIGFuZCBQZW5zaW9ucycsXG4gICAgICAgICdpbnZlc3RtZW50LWFuZC1yaXNrJzogJ0ludmVzdG1lbnQgYW5kIFJpc2sgTWFuYWdlbWVudCcsXG4gICAgICAgICdsZWFkZXJzaGlwLWVudHJlcHJlbmV1cnNoaXAnOiAnTGVhZGVyc2hpcCwgRW50cmVwcmVuZXVyc2hpcCBhbmQgSW5ub3ZhdGlvbicsXG4gICAgICAgICdtYXJrZXRpbmcnOiAnTWFya2V0aW5nJyxcbiAgICAgICAgJ29wZXJhdGlvbnMnOiAnT3BlcmF0aW9ucyBhbmQgU3VwcGx5IENoYWluIE1hbmFnZW1lbnQnLFxuICAgICAgICAncHJvZmVzc2lvbmFsLXNlcnZpY2VzJzogJ1Byb2Zlc3Npb25hbCBTZXJ2aWNlcycsXG4gICAgICAgICdyZWFsLWVzdGF0ZSc6ICdSZWFsIEVzdGF0ZScsXG4gICAgICAgICdzaGlwcGluZy1hbmQtdHJhbnNwb3J0JzogJ1NoaXBwaW5nIGFuZCBUcmFuc3BvcnQnXG4gICAgfTtcblxuICAgIHZhciBwYXRoID0gJy8vY2Fzcy5jaXR5LmFjLnVrLycgKyAkKCcubmV3cy1hcnRpY2xlJykuZGF0YSgnYXJ0aWNsZXMtcGF0aCcpO1xuXG4gICAgdmFyIHNlcmllc1ByZWZpeCA9IHBhdGggKyAnP21ldGFfaV9vcnNhbmQ9JztcblxuICAgIHZhciB0YWdzUHJlZml4ID0gcGF0aCArICc/YWxsPTEmbWV0YV9sX29yc2FuZD1cIicsXG4gICAgICAgIHRhZ3NTdWZmaXggPSAnXCInLFxuICAgICAgICB0YWdzTmFtZTtcblxuICAgICQoJy5uZXdzLWFydGljbGUtc2VyaWVzLWZhbWlseScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmF0dHIoJ2hyZWYnLCBzZXJpZXNQcmVmaXggKyAkKHRoaXMpLmh0bWwoKSk7XG4gICAgICAgICQodGhpcykuaHRtbChzZXJpZXNbJCh0aGlzKS5odG1sKCldKTtcbiAgICB9KTtcblxuICAgICQoJy5uZXdzLWFydGljbGUtdGFnJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRhZ3NOYW1lID0gZW5jb2RlVVJJQ29tcG9uZW50KCQodGhpcykudGV4dCgpKTtcbiAgICAgICAgJCh0aGlzKS5hdHRyKCdocmVmJywgdGFnc1ByZWZpeCArIHRhZ3NOYW1lICsgdGFnc1N1ZmZpeCk7XG4gICAgfSk7XG59O1xuXG52YXIgaW5pdEF0dGFjaG1lbnRMaW5rcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXR0YWNobWVudHMgPSAkKCcuY2Fzcy1rbm93bGVkZ2UtYXR0YWNobWVudF9fcmF3Jyk7XG5cbiAgICBpZiAoYXR0YWNobWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IFwiPGxpIGNsYXNzPSdjYXNzLWtub3dsZWRnZS1hdHRhY2htZW50X19pdGVtJz48YSBocmVmPSckMCc+JDE8L2E+PC9saT5cIjtcbiAgICAgICAgdmFyIGF0dGFjaG1lbnRMaW5rcyA9IFwiPHVsIGNsYXNzPSdjYXNzLWtub3dsZWRnZS1hdHRhY2htZW50X19saXN0aW5nJz5cIjtcblxuICAgICAgICBhdHRhY2htZW50cyA9IGF0dGFjaG1lbnRzLmh0bWwoKS50cmltKCkuc3BsaXQoXCI7IFwiKTtcblxuICAgICAgICAkLmVhY2goYXR0YWNobWVudHMsIGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHBhcnRzID0gdmFsdWUuc2xpY2UoMSwgLTEpLnNwbGl0KFwifXtcIik7XG4gICAgICAgICAgICB2YXIgYXR0YWNobWVudExpbmsgPSB0ZW1wbGF0ZS5yZXBsYWNlKFwiJDBcIiwgcGFydHNbMV0pLnJlcGxhY2UoXCIkMVwiLCBwYXJ0c1swXSk7XG4gICAgICAgICAgICBhdHRhY2htZW50TGlua3MgPSBhdHRhY2htZW50TGlua3MuY29uY2F0KGF0dGFjaG1lbnRMaW5rKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXR0YWNobWVudExpbmtzID0gYXR0YWNobWVudExpbmtzLmNvbmNhdChcIjwvdWw+XCIpO1xuICAgICAgICAkKCcuY2Fzcy1rbm93bGVkZ2UtYXR0YWNobWVudF9fcmF3JykuaHRtbChhdHRhY2htZW50TGlua3MpO1xuICAgIH1cbn07XG5cbmRlZmVyKGluaXQpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvanMvbW9kcy9uZXdzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZGVmZXJyZWRGdW5jdGlvbikge1xuICAgICAgICBpZiAodHlwZW9mIENJVFkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkKGRlZmVycmVkRnVuY3Rpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF3aW5kb3cuQ0lUWV9PUFRJT05TKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkNJVFlfT1BUSU9OUyA9IHtkZWZlcjogW119O1xuICAgICAgICAgICAgfSBlbHNlIGlmICghd2luZG93LkNJVFlfT1BUSU9OUy5kZWZlcikge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5DSVRZX09QVElPTlMuZGVmZXIgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIENJVFlfT1BUSU9OUy5kZWZlci5wdXNoKGRlZmVycmVkRnVuY3Rpb24pO1xuICAgICAgICB9XG4gICAgfTtcbn0oKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9qcy9tb2RzL3V0aWxzL2RlZmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDEgMiAzIDQiXSwic291cmNlUm9vdCI6IiJ9