"use strict";

CASS.library = function ($) {

    "use strict";

    /// Private

    var $formWrapper = $(".library-search"),
        $dropdown = $formWrapper.find(".dropdown-select"),
        $display = $dropdown.find(".display"),
        $displaySpan = $display.find("span"),
        $optionFields = $formWrapper.find(".search-refine-wrapper input"),
        $openingTimesElements = $("[data-library-id]").length,
        $calendarNavLinks = $(".opening-times-navigation .calendarNavLink"),
        $emptyHeadings = $(".opening-times-panel--left > h3"),
        daysArray = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        selectChange = function selectChange(e) {
        var index = $(e.target).prop('selectedIndex');
        $optionFields.prop("checked", false);
        $optionFields.eq(index).prop("checked", true);
    },
        toggleOption = function toggleOption(e) {

        var selectedData,
            text,
            thatPosition,
            that = $(e.target);

        e.preventDefault();

        $dropdown.toggleClass("active");

        if (that.hasClass("option")) {
            selectedData = that.attr("data-value");
            thatPosition = that.index();
            text = that.html();
            $optionFields.prop("checked", false);
            $optionFields.eq(thatPosition).prop("checked", true);
            $displaySpan.html(text);
            $dropdown.removeClass("active");
        }
    },
        setRelativeDate = function setRelativeDate(startDate, howFurther) {
        return new Date(startDate.getTime() + howFurther * 24 * 60 * 60 * 1000);
    },
        matrixFormatDate = function matrixFormatDate(date) {
        var dateD = date.getDate(),
            dateM = date.getMonth() + 1,
            dateY = date.getFullYear();

        // !!!!
        if (dateD < 10) {
            dateD = "0" + dateD;
        }
        if (dateM < 10) {
            dateM = "0" + dateM;
        }

        return dateY + "-" + dateM + "-" + dateD;
    },
        formatMonths = function formatMonths(date) {
        var months = {
            "0": "Jan",
            "1": "Feb",
            "2": "Mar",
            "3": "Apr",
            "4": "May",
            "5": "Jun",
            "6": "Jul",
            "7": "Aug",
            "8": "Sep",
            "9": "Oct",
            "10": "Nov",
            "11": "Dec"
        };
        return months[date.getMonth()];
    },


    /**
     * Capitalise First Letter
     * Given a string, return the same string with the first letter
     * capitalised.
     * @param {String} String to capitalise first letter of
     * @return {String} String with first letter capitalised
     */
    capitaliseFirstLetter = function capitaliseFirstLetter(string) {

        // TODO: remove and replace with CSS???
        return string.charAt(0).toUpperCase() + string.slice(1);
    },


    /**
     * Get Opening Times from the api
     * @param {String} the monday for the wanted week "2015-11-23"
     * return {Object} with JSON data and various strings extracted from data
     */
    getOpeningTimes = function getOpeningTimes(options) {

        // Instantiate some variables to perform the AJAX request and some
        // variables which relate to the Opening Times as a whole.

        var request = new XMLHttpRequest(),
            weekStart = options.week || "",
            requestURL = "//www.cass.city.ac.uk/api/library-opening-times/current-week/_nocache?SQ_CALENDAR_VIEW=week&SQ_CALENDAR_DATE=" + weekStart,
            data,
            returnObject = {};

        // Get the fresh data as JSON
        request.open("GET", requestURL, true);

        request.onreadystatechange = function () {

            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) {

                    //
                    // AJAX SUCCESS
                    //
                    data = JSON.parse(this.responseText);

                    mapOpeningTimes({
                        "data": data,
                        //"today": data.today,
                        "todayClean": data.todayClean,
                        "todayDay": data.todayDay,
                        "queryWeek": data.queryWeek,
                        //"weekStart": data.weekStart,
                        "updateElements": options.updateElements
                    });
                } else {

                    //
                    // AJAX ERROR
                    //
                    returnObject = {
                        "error": true
                    };
                }
            }
        };

        request.send();
        request = null;

        options.updateElements.addClass("opening-times-busy");
    },
        updateLibraryTime = function updateLibraryTime(response, libraries) {

        // libraries === response.targetLibraries

        libraries.each(function () {

            var that = $(this),
                libraryID = that.attr("data-library-id"),
                currentLibrary = response.data.libraries[libraryID],
                currentLibraryTimes = currentLibrary.times,
                elementA = that.find(".opening-times-list-card .opening-times-panel--left .opening-times-table tbody"),
                currentLibraryDayTimes,
                currentLibrarySpecial,
                currentLibraryDate,
                currentLibraryDateClean,
                currentLibraryStartTime,
                currentLibraryEndTime,
                currentLibraryIsToday,
                htmlA = "",
                htmlB = "",
                queryWeek,
                currentWeek,
                currentWeekEnd,
                currentWeekRange,
                nextWeek,
                nextWeekDisplay,
                previousWeek,
                previousWeekDisplay;

            for (var i = 0; i < daysArray.length; i++) {

                if (currentLibrary.times[daysArray[i]]) {

                    currentLibraryDayTimes = currentLibrary.times[daysArray[i]];

                    currentLibrarySpecial = currentLibraryDayTimes.special;
                    currentLibraryDate = currentLibraryDayTimes.date;
                    currentLibraryDateClean = currentLibraryDayTimes.dateClean.split(",", 1);
                    currentLibraryStartTime = currentLibraryDayTimes.startTime;
                    currentLibraryEndTime = currentLibraryDayTimes.endTime;
                    currentLibraryIsToday = currentLibraryDayTimes.isToday;

                    // if date of day matches today's date, then designate
                    // with a class `is-today`
                    if (currentLibraryIsToday) {
                        htmlA += "<tr data-date=\"" + currentLibraryDateClean + "\" class=\"is-today\">";
                    } else {
                        htmlA += "<tr data-date=\"" + currentLibraryDateClean + "\">";
                    }
                    // Print the day of the week from `daysArray` and
                    // capitalise the first letter
                    htmlA += "<td><span>" + capitaliseFirstLetter(daysArray[i]) + "</span></td>";
                    htmlA += "<td>";
                    // Check if Closed or Open 24 Hours and print appropriately
                    if (currentLibrarySpecial === "closed") {
                        htmlA += "<span><em>Closed</em></span>";
                    } else if (currentLibrarySpecial === "open24hours") {
                        htmlA += "<span><em>Open 24 hours</em></span>";
                    } else {
                        htmlA += "<time datetime=\"" + currentLibraryDate + "T" + currentLibraryStartTime.replace(".", ":") + "\">" + currentLibraryStartTime + "</time><span> &ndash; </span><time datetime=\"" + currentLibraryDate + "T" + currentLibraryEndTime.replace(".", ":") + "\">" + currentLibraryEndTime + "</time>";
                    }

                    htmlA += "</td>";
                    htmlA += "</tr>";
                } else {

                    htmlA += "<tr>";
                    htmlA += "<td><span>" + capitaliseFirstLetter(daysArray[i]) + "</span></td>";
                    htmlA += "<td><span>No time availalble</span></td>";
                    htmlA += "</tr>";
                }
            } // end for...loop


            if (response.queryWeek !== "") {

                // do some crazy time stuff here to get the next/previous/range correct for the interface
                queryWeek = response.queryWeek.split("-");
                currentWeek = new Date(queryWeek[0], queryWeek[1] - 1, queryWeek[2]);
                currentWeekEnd = setRelativeDate(currentWeek, 6);
                currentWeekRange = currentWeek.getDate() + " " + formatMonths(currentWeek) + " until " + currentWeekEnd.getDate() + " " + formatMonths(currentWeekEnd);
                nextWeek = setRelativeDate(currentWeek, 7);

                nextWeekDisplay = matrixFormatDate(nextWeek);
                previousWeek = setRelativeDate(currentWeek, -7);
                previousWeekDisplay = matrixFormatDate(previousWeek);
                that.find(".opening-times-navigation-previous a").attr("href", "?SQ_CALENDAR_VIEW=week&SQ_CALENDAR_DATE=" + previousWeekDisplay);
                that.find(".opening-times-navigation-next a").attr("href", "?SQ_CALENDAR_VIEW=week&SQ_CALENDAR_DATE=" + nextWeekDisplay);
                htmlB = currentWeekRange;
            } else {

                // current week
                htmlB = response.data.currentWeekRange;
            }

            that.find(".opening-times-navigation-date-range time").text(htmlB).attr("data-toggle", "on");
            elementA.html(htmlA);
            that.removeClass("opening-times-busy");
        });
    },
        mapOpeningTimes = function mapOpeningTimes(response) {

        var

        // TODO: use response.updateElements instead to find which page we're on?
        // instead of reselecting elements again
        $homeOpeningtimes = $("[data-times-type=daily]"),
            $mainOpeningtimes = $("[data-times-type=weekly]"),
            $widgetOpeningtimes = $("[data-times-type=call-to-action]"),
            libraryID,
            htmlA = "",
            htmlB = "",
            elementA,
            currentLibrarySpecial,
            currentLibraryDate,
            currentLibraryDateClean,
            currentLibraryStartTime,
            currentLibraryEndTime,
            currentLibraryIsToday,
            targetLibraries = response.updateElements;

        /**
         * Daily
         * Appears on the Library Homepage.
         */
        if ($homeOpeningtimes.length > 0) {

            targetLibraries.each(function () {
                var that = $(this),
                    libraryID = that.attr("data-library-id"),
                    currentLibrary = response.data.libraries[libraryID],
                    whatIsThis = currentLibrary.times[response.todayDay];

                currentLibrarySpecial = whatIsThis.special, currentLibraryDate = whatIsThis.date, currentLibraryStartTime = whatIsThis.startTime, currentLibraryEndTime = whatIsThis.endTime;

                // Inject today's date (clean) to replace the Opening Times
                // list title date
                $(".opening-times--home-controls h2 a time").html(response.todayClean);

                // Hook onto the Opening Times for each Library
                elementA = that.find(".opening-times--home-list-item-times");

                // Check if Closed or Open 24 Hours and print appropriately
                if (currentLibrarySpecial === "closed") {
                    htmlA = "<span><em>Closed</em></span>";
                } else if (currentLibrarySpecial === "open24hours") {
                    htmlA = "<span><em>Open 24 hours</em></span>";
                } else {
                    htmlA = "<time datetime=\"" + currentLibraryDate + "T" + currentLibraryStartTime.replace(".", ":") + "\">" + currentLibraryStartTime + "</time><span> &ndash; </span><time datetime=\"" + currentLibraryDate + "T" + currentLibraryEndTime.replace(".", ":") + "\">" + currentLibraryEndTime + "</time>";
                }

                // Inject the HTML into the node
                elementA.html(htmlA);

                that.removeClass("opening-times-busy");
            });
            return;
        }
        /**
         * Weekly
         * Appears on the dedicated Opening Times page
         */
        if ($mainOpeningtimes.length > 0) {

            updateLibraryTime(response, targetLibraries);
            return;
        }
        /**
         * Call to Action
         * Appears on Library Landing pages.
         */
        if ($widgetOpeningtimes.length > 0) {

            // do we really need a loop here? Only one widget
            targetLibraries.each(function () {

                var that = $(this),
                    elementB = that.find(".library-aside-call-to-action-subtitle"),
                    currentLibrary,
                    whatIsThis;

                libraryID = that.attr("data-library-id");
                currentLibrary = response.data.libraries[libraryID];
                whatIsThis = currentLibrary.times[response.todayDay];
                currentLibrarySpecial = whatIsThis.special;
                currentLibraryDate = whatIsThis.date;
                currentLibraryStartTime = whatIsThis.startTime;
                currentLibraryEndTime = whatIsThis.endTime;
                elementA = that.find(".library-aside-call-to-action-title");

                // Check if Closed and print appropriately
                if (currentLibrarySpecial === "closed") {
                    htmlA = "Closed";
                } else {
                    htmlA = "Open";
                    if (currentLibrarySpecial === "open24hours") {
                        htmlB = "24 hours";
                    } else {
                        htmlB = "until <time datetime=\"" + currentLibraryDate + "T" + currentLibraryEndTime.replace(".", ":") + "\">" + currentLibraryEndTime + "</time>";
                    }
                }
                htmlA += " Today";

                // Inject the HTML into each node
                elementA.html(htmlA);
                elementB.html(htmlB);

                that.removeClass("opening-times-busy");
            });
        }
    },
        init = function init() {

        $emptyHeadings.remove();
        $dropdown.on("click", toggleOption);
        $('.library-search__content-type').change(selectChange);

        if ($openingTimesElements !== 0) {

            getOpeningTimes({
                "week": "",
                "updateElements": $("[data-times-type]")
            });

            $calendarNavLinks.on("click", function (e) {

                var that = $(this),
                    week = that.attr("href").split("=")[2],
                    targetLibrary = that.parents("[data-times-type]");

                if (!targetLibrary.hasClass("opening-times-busy")) {
                    getOpeningTimes({
                        "week": week,
                        "updateElements": targetLibrary
                    });
                }

                e.preventDefault();
            });
        }
    };

    return {
        init: init
    };
}($);

//call init fn
CASS.library.init();