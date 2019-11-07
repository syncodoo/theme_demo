// inherit for set slide menu
odoo.define('allure_backend_theme_ent.ControlPanelRenderer', function (require) {
    "use strict";

    var ControlPanelRenderer = require('web.ControlPanelRenderer');
    var AllurSearchBar = require('allure_backend_theme_ent.SearchBar');
    var config = require('web.config');

    ControlPanelRenderer.include({
        events: _.extend({}, ControlPanelRenderer.prototype.events, {
            'click .o_sidebar_drw': '_onActionMore',
            'mousedown .btn-group.o_dropdown' : '_dropdownBtnClick',
            'click .o_main_cp_buttons': function (e) {
                $(e.target).parent('.o_cp_left').toggleClass('cp_open');
            },
        }),
        start: function () {
            this._super();
            this.isMobile = config.device.isMobile;
            if(!this.isMobile) {
                this.displaySearchMenu = false;
            }
        },
        _onActionMore: function(e) {
            var $cp_sidebar = $(e.target).parents('.btn-group');
            $cp_sidebar.toggleClass('o_drw_in');
            $(e.target).toggleClass('fa-chevron-left fa-chevron-right');
            $(e.target).parents('.o_action').toggleClass('o_open_sidebar');
        },
        _getSubMenusPlace: function () {
            if(!this.isMobile) {
                return $('<div class="ad_has_options">').appendTo(this.$('.o_search_options'));
            }
            else {
                return this.$('.o_mobile_search_filter');
            }
        },
        _setSearchMenusVisibility: function () {
            this._super.apply(this, arguments);
            if(!this.isMobile) {
                this.$el.parents('.o_action').toggleClass('ad_open_search', this.displaySearchMenu);
            }
        },
        _dropdownBtnClick: function(e) {
            this.$('.ad_has_options .btn-group').removeClass('ad_active');
            $(e.target).parents('.btn-group').addClass('ad_active');
        },
        on_attach_callback: function() {
            this._super.apply(this, arguments);
            if (this.withSearchBar) { this.searchBar.on_attach_callback(); };
        },
    });
});