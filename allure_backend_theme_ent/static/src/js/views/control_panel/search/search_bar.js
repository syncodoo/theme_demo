odoo.define('allure_backend_theme_ent.SearchBar', function (require) {
"use strict";

var SearchFacet = require('web.SearchFacet');
var SearchBar = require('web.SearchBar');
var config = require('web.config');

SearchBar.include({

    init: function (parent, params) {
        this._super.apply(this, arguments);
        this.controlpanel = parent;
    },

    _manageFacets: function(detachToInput) {
        detachToInput = _.isUndefined(detachToInput) ? false : detachToInput;
        var self = this;

        var searchArea = 0;
        var deviceWidth = window.innerWidth;
        var mobileClass = config.device.isMobile ? '_mobile' : '';

        var $o_searchview = this.controlpanel.$('.o_searchview');
        var $o_search_recs = this.controlpanel.$('.o_search_recs' + mobileClass);
        var $o_search_rec_ul = this.controlpanel.$('.o_search_rec_ul' + mobileClass);

        _(self.searchFacets).each(function(facet) {
            searchArea += facet.$el[0].clientWidth;
            if (!detachToInput && searchArea !== 0) {
                if (config.device.isMobile && (searchArea > (deviceWidth - 200))) {
                    facet.$el.appendTo($o_search_rec_ul);
                } else if (!config.device.isMobile && searchArea > ((deviceWidth / 2) - 250)) {
                    facet.$el.appendTo($o_search_rec_ul);
                };
            } else {
                facet.$el.insertBefore(self.$('input'));
            }
        });

        setTimeout(function () {
            var hasDropDownFacet = Boolean($o_search_rec_ul.children().length);
            $o_searchview.toggleClass('show', hasDropDownFacet);
            $o_search_recs.toggleClass('hidden', !hasDropDownFacet);
            $o_search_rec_ul.toggleClass('hidden', !hasDropDownFacet).addClass('show');
        }, 10);
    },

    on_attach_callback: function() {
        this._manageFacets();
    },

});

return SearchBar;

});
