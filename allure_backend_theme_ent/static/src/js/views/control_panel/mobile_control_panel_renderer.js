odoo.define('allure_backend_theme_ent.MobileControlPanelRenderer', function (require) {
"use strict";

const config = require('web.config');

if (!config.device.isMobile) {
    return;
}

var ControlPanelRenderer = require('web.ControlPanelRenderer');

ControlPanelRenderer.include({

    _toggleMobileQuickSearchView: function () {
        this._super();
        this.searchBar._manageFacets();
    },

    _toggleMobileSearchView: function () {
        this.searchBar._manageFacets((this.$('.o_toggle_searchview_full').is(':visible') && !this.$('.o_mobile_search').is(':visible')));
        this._super();
    },

});

});
