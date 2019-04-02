"use strict";

/*jshint devel:true */
/*global Backbone,_, appInitialData */

// see github.com/addyosmani/backbone.paginator for pagination sauce

/**
 * academics index page in backbone.js
 */
(function (B, M) {
  // could use require.js to pull all
  // the peices together later
  var $scrollBtn = $("<button />", {
    class: "scroll-btn visible",
    html: '<span class="icon-arrow-up"></span><span class="visuallyhidden">scroll to top of page</a>',
    click: function click(e) {
      e.preventDefault();
      $("html, body").animate({
        scrollTop: 0
      }, 500);
    }
  }),

  // our namespace
  APP = {
    collections: {
      academicsCollection: {}
    },
    views: {
      academicsListView: {},
      facetsView: {}
    },
    router: {}
  },

  // models
  AcademicModel = B.Model.extend({
    /*        initialize: function(){
    this.on("change", function(){
    //console.log('- Values for this model have changed.');
    });
    }*/
  }),

  // collections

  /*
   * The main collection, paginated with Backbone.Paginator.clientPager
   */
  AcademicsCollection = Backbone.Paginator.clientPager.extend({
    model: AcademicModel,

    initialize: function initialize() {
      /*            this.on("all", function (eventName) {
       console.log("academics collection event fired: " + eventName);
       });*/

      // SET DEFAULT VALUES (ALLOWS YOU TO POPULATE PAGINATOR MAUNALLY)
      this.setDefaults();
    },

    paginator_core: {
      dataType: "json",
      url: "/fb/search.json"
    },

    paginator_ui: {
      perPage: 20
    },

    server_api: {
      collection: "cass-experts",

      // doesn't matter if this is set on subsequent requests, fb deals with it
      landing: "true",
      sort: "metaR"
    },

    /**
     * when filtering (searching) using the paginator library,
     * all properties need to be at the top level. So we
     * flatten them while parsing
     */
    parse: function parse(response) {
      // our array of results to return
      var retval = [];

      if (!response.response || !response.response.resultPacket) {
        return retval;
      }

      // loop over each result and flatten (only 1 level at this point) then push into retval
      _.each(response.response.resultPacket.results, function (result) {
        // temp object we later push into retval
        var obj = {};

        // loop over each property and act accordingly
        _.each(result, function (val, key) {
          // flatten any nested objects
          if (_.isObject(val)) {
            _.each(val, function (v, k) {
              obj[k] = v;
            });
          } else if (_.isArray(val)) {
            if (!val.length) {
              return;
            }

            obj[key] = val;
          } else {
            obj[key] = val;
          }
        });

        retval.push(obj);
      });

      return retval;
    },

    /**
     * search funnelback and use the results to filter this collection
     */
    searchFunnelback: function searchFunnelback(query) {
      // really don't think we should be doing this processing here,
      // but if we don't do this data clobbers the server_api options
      // in Paginator.sync
      var server_api = this.server_api,
          data,
          self = this,
          school = $(".cass-experts").data("cul-fb-school");

      if (school) {
        server_api.meta_E_sand = school;
      }

      // don't want alpha sorting if we are querying fb
      delete server_api.sort;

      data = decodeURIComponent($.param(_.extend(server_api, {
        query: query
      })));

      this.fetch({
        success: function success() {
          // we're going against the way Paginator works a bit here,
          // so we need to manually do these steps

          // what do the next 2 lines do?
          self.sortedAndFilteredModels = self.models.slice();
          self.info();
        },
        data: data
      });
    }
  }),
      //end academics collection
  // Templates
  /* jshint -W015 */
  academicTemplate = ['<div itemscope itemtype="http://schema.org/Person">', '<div class="image">', '<a href="<%= attrs.liveUrl %>">', "<% if (attrs.O) { %>", '<img itemprop="image" class="thumbnail" src="<%= attrs.O %>" alt="Portrait of <%= attrs.title %>">', "<% } else { %>", '<span class="icon-user" />', "<% } %>", "</a>", "</div>", '<div class="who">', '<h2 itemprop="name"><a href="<%= attrs.liveUrl %>"><%= attrs.title %></a></h2>', "<% if (attrs.P) { %>", '<p itemprop="jobTitle" class="job-title"><% if ((attrs.P).length > 50) { print(attrs.P.substring(0, 50) + \'…\') } else { print(attrs.P); } %></p>', "<% }; %>", "</div>", '<div class="meta">', "<% if (attrs.F) {%>", '<p class="business-unit"><span class="icon-building"></span>', '<a class="filter department" href="#" data-filter-param="F" data-filter-value="<%= $.trim(attrs.F).replace("&","&amp;") %>" ', 'title="Find other staff in <%= $.trim(attrs.F) %>"><%= $.trim(attrs.F) %></a></p>', "<% } %>", "</div>", "</div>"].join("\n"),

  /* jshint +W015 */

  // views

  /**
   * The item view is responsible for rendering an individual academic card
   */
  AcademicItemView = M.ItemView.extend({
    tagName: "li",
    className: "academic",

    /**
     * called by ItemView.render
     */
    template: function template(modelData) {
      return _.template(academicTemplate, modelData, {
        variable: "attrs"
      });
    },

    events: {
      "click .filter": "filterClick"
    },

    /**
     * will route to the search form with filter applied
     */
    filterClick: function filterClick(e) {
      var data = $(e.target).data();

      // route
      APP.router.navigate("search/" + data.filterParam + "/" + encodeURIComponent(data.filterValue).replace(/%20/g, "+")
      //.replace(/&amp;/,"&")
      //.replace(/%26/,"&amp;")
      .replace(/[()]/g, "\\" + "$&"), {
        trigger: true
      });

      e.preventDefault();
    }
  }),

  /**
   * The collection view is responsible for rendering the list of academic cards
   */
  AcademicsListView = M.CollectionView.extend({
    // main target div
    el: "#academic-results",

    // the childView class
    itemView: AcademicItemView,

    // flag to help us know if we have done an initial render
    firstRender: true,

    initialize: function initialize() {
      this.$el.empty();
      this.$el.addClass("loading");
      // this needs to bind to the collection pre filtering/fetching
      this.$el.addClass("backbone-ready");

      this.on("render", this.removeSpinners);

      /*            this.on("all", function (eventName) {
       //console.log("academicsListView event fired: " + eventName);
       });*/
    },

    removeSpinners: function removeSpinners() {
      if (this.firstRender) {
        $(".initial-loading-indicator").remove();
        this.firstRender = false;
      }

      this.$el.removeClass("loading").children(".loading-fa-icon").remove();
    }
  }),

  /**
   * facets view
   * handles the switching on / off of the facets and the counters
   */
  FacetsView = B.View.extend({
    el: ".filters",

    facetsFound: null,

    initialize: function initialize() {
      var self = this;

      //self.listenTo(academicsCollection, "reset", self.updateCount);
      self.listenTo(self.collection, "reset", self.updateSelected);

      // need to wait for DOM ready for these
      $(function () {
        self.$filters = self.$el.find(".filter");
        self.facetsFound = self.findFacets();
      });
    },

    /**
     * assumptions: only one active facet at a time
     * fires when collection is reset
     */
    updateSelected: function updateSelected() {
      var filterParam, filterValue;

      this.$filters.removeClass("selected");

      if (this.collection.fieldFilterRules && this.collection.fieldFilterRules.length) {
        // field is the facet to query, e.g. "E" (School)
        filterParam = this.collection.fieldFilterRules[0].field;
        // value is the value of field e.g. "Cass Business School"
        filterValue = this.collection.fieldFilterRules[0].value.source; // chrome only??
        // find the DOM element with data param matching above values and add class
        this.$filters.filter("[data-filter-param='" + filterParam + "']").filter("[data-filter-value='" + filterValue + "']").addClass("selected");
      }
    },

    events: {
      "click .filter": "facetClick"
    },

    facetClick: function facetClick(e) {
      var $this = $(e.target),
          newUrl = "search/" + $this.data("filter-param") + "/" + encodeURIComponent($this.data("filter-value")).replace(/%20/g, "+");

      e.preventDefault();

      if ($this.hasClass("selected")) {
        // if we are clearing a filter
        $this.removeClass("selected");
        newUrl = "";
      } else {
        this.$el.find(".filter").removeClass("selected");
        $this.addClass("selected");
      }

      // empty the search box
      APP.views.searchboxView.empty();

      // trigger router
      APP.router.navigate(newUrl, {
        trigger: true
      });
    },

    /**
     * loops over all individual filters on page and grabs their filter-para data attr
     * @return {Array} an array of the params of all filters
     */
    findFacets: function findFacets() {
      var paramsOnPage = [];

      this.$filters.each(function () {
        paramsOnPage.push($(this).data("filter-param"));
      });

      return _.uniq(paramsOnPage);
    }
  }),

  /**
   * Search box view
   * Handles the search box input
   */
  SearchboxView = B.View.extend({
    el: "#fb-queryform",

    events: {
      "submit form": "doQuery",
      "click .clear-btn": "clearSearch"
    },

    initialize: function initialize() {
      this.$inputEl = this.$el.find("input");
      this.$clearBtn = this.$el.find(".clear-btn");

      //store the size of the input
      this.inputWidth = this.$inputEl.width();

      this.tfView = APP.views.tagFilterView;
      //this.tfView.on("render", this.adjustRoom, this);
    },

    clearSearch: function clearSearch() {
      // clear the ui
      this.empty();

      //reset the route
      APP.router.navigate("", {
        trigger: true
      });
    },

    doQuery: function doQuery(e) {
      // find out text input
      var searchTerm = $.trim(this.$inputEl.val());

      e.preventDefault();

      // validate searchTerm
      if (searchTerm.length === 0) {
        this.clearSearch();
        return;
      }

      // remove any tag filters
      APP.views.tagFilterView.removeFilter();

      // route
      APP.router.navigate("search/query/" + searchTerm, {
        trigger: true
      });
    },

    /*
     * Updates the input field value with the query
     * needed on page load if there is a query in the url
     */
    setText: function setText(text) {
      this.$inputEl.val(text);

      // if we have a query, show clear button
      if (text.length > 0) {
        this.$clearBtn.removeClass("hidden");
      }
    },

    empty: function empty() {
      this.$clearBtn.addClass("hidden");
      this.$inputEl.val("");
    },

    adjustRoom: function adjustRoom() {
      var tagFilterWidth = this.tfView.$el.outerWidth();

      this.$inputEl.css({
        "padding-left": tagFilterWidth + "px"
      });
    }
  }),

  /**
   * This handles the clickable tag filters
   */
  TagFilterView = M.ItemView.extend({
    el: ".tag-filters",

    events: {
      click: function click() {
        this.removeFilter(true);
      }
    },

    template: function template(data) {
      return $("<span />", {
        class: "tag-filter",
        title: "click to remove this filter",
        html: '<span class="icon-tag"></span> ' + data.value.replace("\\(", "(").replace("\\)", ")") + '<span class="icon-remove"></span>'
      });
    },

    // @param route should we reroute after clearing the filter?
    removeFilter: function removeFilter(route) {
      this.$el.empty();
      this.trigger("render");

      if (route) {
        APP.router.navigate("", {
          trigger: true
        });
      }
    }
  }),

  /**
   * Responsible for the "x-y of z results" text
   */
  SearchMetaView = M.ItemView.extend({
    el: ".results-summary",

    // catch any of these collection events and update our search meta
    collectionEvents: {
      sync: "render",
      reset: "render",
      sort: "render"
    },

    onRender: function onRender() {
      doLayout();
    },

    template: function template(modelData) {
      modelData.info = APP.collections.academicsCollection.information;

      // render with count
      return _.template("<span class='results-totals'><%= info.startRecord %> - <%= info.endRecord %> of <%= info.totalRecords %> results</span>", modelData);
    }
  }),

  /**
   * Responsible for the "show more" button
   */
  PaginationControlsView = M.ItemView.extend({
    el: ".load-more",

    // catch any of these collection events and update our search meta
    collectionEvents: {
      sync: "checkIfNeeded",
      reset: "checkIfNeeded",
      sort: "checkIfNeeded"
    },

    events: {
      "click .infinite": "showNextPage"
    },

    initialize: function initialize() {
      this.collection.origPerPage = this.collection.paginator_ui.perPage;
    },

    template: function template(CollectionData) {
      return _.template("<a class='infinite' href='#'>Show more</a>", CollectionData);
    },

    checkIfNeeded: function checkIfNeeded() {
      if (this.collection.information.perPage > this.collection.information.totalRecords) {
        this.$el.hide();
      } else {
        this.$el.show();
      }
    },

    /**
     * The basic idea is to increase the amount shown per page (see
     * Paginator.howManyPer) until we have more per page than total
     * results, at which point we hide the button
     *
     */
    showNextPage: function showNextPage(e) {
      e.preventDefault();

      // shortcut
      var c = this.collection,
          stats = c.information,
          newPerPage;

      // if amount of items per page is less than the total items
      if (stats.perPage < stats.totalRecords) {
        newPerPage = stats.perPage + c.origPerPage;

        // howManyPer is a convenience method of clientPager that sets the number of items to display per page
        // here we set it to the orginal number of items plus the current number of items displayed
        c.howManyPer(newPerPage);

        // if we are out of items, hide the show more button
        if (newPerPage >= stats.totalRecords) {
          this.$el.hide();
        }
      }
    }
  }),

  //Layout
  /**
   *   JQuery Styling of the different rendered cards even odd even odd pattern
   */
  doLayout = function doLayout() {
    var i = 0,
        $self;

    for (i; i < APP.collections.academicsCollection.length; i++) {
      $self = $("li.academic:eq(" + i + ")");

      if (i % 2 === 0) {
        $self.addClass("odd");
      }
    }
  },

  // router
  MainRouter = B.Router.extend({
    routes: {
      "": "defaultRoute",
      "search/query/:value": "fbSearchRoute",
      "search/:param/:value": "filterRoute"
    },

    initialize: function initialize() {
      $(function () {
        B.history.start({
          // N.B. we can't use pushstate because matrix will
          // try and resolve any url backbone generates on
          // next load (boo!)
          //
          // a solution could be some Apache rewriting, at
          // the expense of flexibility / ease of maintainence
          // (if we really want this)
          //
          // pushState: true,

          root: window.location.pathname
        });

        // bootstrap effectively calls pager, kicks everything off
        APP.collections.academicsCollection.bootstrap();
      });
    },

    defaultRoute: function defaultRoute() {
      // clear any filtering
      APP.collections.academicsCollection.setFieldFilter();

      // reset the width of search input el
      APP.views.tagFilterView.removeFilter();
    },

    /**
     * will filter the collection from the url:
     *
     * search/:param/:value
     *
     * where query is the funnelback metadata class
     */
    filterRoute: function filterRoute(param, value) {
      // replace +s in value
      value = $.trim(value).replace(/\+/g, " ", "gi");

      // search through collection
      APP.collections.academicsCollection.setFieldFilter([{
        field: param,
        type: "pattern",
        value: new RegExp(value)
      }]);

      // if our param does not appear on the page as a facet we
      // want to generate clickable tags in the search box
      if (!_.contains(APP.views.facetsView.facetsFound, param)) {
        APP.views.tagFilterView.model = new B.Model({
          value: value
        });
        APP.views.tagFilterView.render();
      }

      // and clear out leftover search text
      APP.views.searchboxView.empty();
    },

    /**
     * the /search/query/:value route
     *
     * uses funnelback searching power to fetch matching results and uses
     * those to filter the collection
     *
     * an issue is it requires 2 http requests to funnelback on a page load
     * which is not optimal. The traditional Backbone way of solving this
     * is to bootstrap the initial models. Which in our case would be
     * presenting all results on initial funnelback page load.
     *
     */
    fbSearchRoute: function fbSearchRoute(value) {
      // search through collection using fb response to query
      APP.collections.academicsCollection.searchFunnelback($.trim(value).replace(/\+/g, " "));

      // update query input text
      APP.views.searchboxView.setText(value);

      //remove tag filters
      APP.views.tagFilterView.removeFilter();

      // clear any active facets by passing an empty rules set
      APP.collections.academicsCollection.setFieldFilter();
    }
  });

  // collection, bootstrapped with inlined object
  APP.collections.academicsCollection = new AcademicsCollection(appInitialData);

  // collectionView - Marionette
  APP.views.academicsListView = new AcademicsListView({
    collection: APP.collections.academicsCollection
  });

  // view
  APP.views.facetsView = new FacetsView({
    collection: APP.collections.academicsCollection
  });

  // itemView - Marionette
  APP.views.tagFilterView = new TagFilterView();

  // view
  APP.views.searchboxView = new SearchboxView();

  // itemView - Marionette
  APP.views.searchMetaView = new SearchMetaView({
    collection: APP.collections.academicsCollection
  });

  // itemView - Marionette
  APP.views.paginationControlsView = new PaginationControlsView({
    collection: APP.collections.academicsCollection
  });

  // router
  APP.router = new MainRouter();

  // expose for debug
  window.SEARCHAPP = APP;

  // scroll to top, should probably find a better place for this
  $("#cass-experts-listing").append($scrollBtn);

  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $scrollBtn.addClass("visible");
    } else {
      $scrollBtn.removeClass("visible");
    }
  });
})(Backbone, Backbone.Marionette);