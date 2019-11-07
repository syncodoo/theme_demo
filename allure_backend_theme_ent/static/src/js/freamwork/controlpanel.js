// odoo Controlpanel view inherit to manage view button.
// search option button click and default filter view active.
// control panel all view button wrap time active button status
// Using for print - action - attechment btn
odoo.define('allure_backend_theme_ent.ControlPanel', function (require) {
    "use strict";

    var Sidebar = require('web.Sidebar');
    var ControlPanel = require('web.ControlPanel');
    var config = require('web.config');

    ControlPanel.include({
        events: _.extend({}, ControlPanel.prototype.events, {
            'click .o_main_cp_buttons': function (e) {
                $(e.target).parent('.o_cp_left').toggleClass('cp_open');
            },
            // Using Toggle - action
            'click .o_cp_sidebar span.o_sidebar_drw': '_onSidebarToggle',
        }),
        // Using Toggle - action
        _onSidebarToggle: function (e) {
            var $cp_sidebar = $(e.target).parents('.btn-group');
            // $cp_sidebar.find('.o_dropdown').first().addClass('ad_active show');
            $(e.target).toggleClass('fa-chevron-left fa-chevron-right');
            $cp_sidebar.toggleClass('o_drw_in');
            $(e.target).parents('.o_view_controller').toggleClass('o_open_sidebar');
        },
        // control panel all view button wrap time active button status
        _update_switch_buttons: function (active_view_selector) {
            this._super.apply(this, arguments);
            // Using for print - action - attechment btn
            var $active_class = active_view_selector.split('.').join("");
            if ($active_class) {
                $('#all_views_button').attr('class', $active_class);
            }
        },

        update: function(status, options) {
            this._super.apply(this, arguments);

            var $search_options = $('.o_search_options');
            if(!$search_options.children().hasClass('ad_has_options')){
                $('.o_control_panel').addClass('no_ad_has_search');
            }
            if($search_options.children().hasClass('ad_has_options')){
                $('.o_control_panel').removeClass('no_ad_has_search');
            }
        },

        // control panel all view button wrap time active button status
        // Form view load time search option hidden- [start]
        _update_search_view: function (searchview, is_hidden) {
            this._super.apply(this, arguments);
            var self = this;
            var $search_options = $('.o_search_options');
            // For View hide if no view available
            if ($('.oe_cp_view_btn button').length > 1) {
                $('.oe_cp_view_btn').removeClass('hidden');
            } else {
                $('.oe_cp_view_btn').addClass('hidden');
            }
            if ($search_options.is(':visible') && $search_options.children().length > 0 && $search_options.children().hasClass('ad_has_options')) {
                $('body').find('.o_view_controller').addClass('ad_open_search');
            } else {
                $('body').find('.o_view_controller').removeClass('ad_open_search');
            }
            if (config.device.isMobile ||
                    (config.device.size_class < config.device.SIZES.SM)) {
                this.$el.addClass('ad_search_full');
            }
            if (_.isUndefined(this.$enable_searchview)) {
                this.$enable_searchview = $('<button/>', {type: 'button'})
                        .addClass('ad_mobile_searchview btn btn-sm btn-default fa fa-search')
                        .on('click', function () {
                            self.searchview_displayed = !self.searchview_displayed;
                            self.$el.toggleClass('ad_search_full', !self.searchview_displayed);
                        });
            }
            if ((!is_hidden && config.device.size_class <= config.device.SIZES.XS) ||
                    (!is_hidden && (config.device.isMobile))) {
                self.$enable_searchview.insertAfter(self.nodes.$searchview);
                self.searchview_displayed = false;
                self.nodes.$searchview_buttons.hide();
            } else {
                self.$enable_searchview.detach();
            }
            if(!$('.o_cp_buttons').children().length > 0){
                $('.o_cp_buttons').addClass('oe_no_button');
            }else{
                $('.o_cp_buttons').removeClass('oe_no_button');
            }
        },
    });
});