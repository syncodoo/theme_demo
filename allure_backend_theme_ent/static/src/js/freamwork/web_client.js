odoo.define('allure_backend_theme_ent.WebClient', function (require) {
    "use strict";

    var ActionManager = require('web.ActionManager');
    var dom = require('web.dom');
    var session = require('web.session');
    var WebClient = require('web.WebClient');
    var HomeMenu = require('web_enterprise.HomeMenu');
    var Menu = require('web_enterprise.Menu');
    var config = require('web.config');


    WebClient.include({
        set_action_manager: function () {
            var self = this;
            this.action_manager = new ActionManager(this, session.user_context);
            var fragment = document.createDocumentFragment();
            return this.action_manager.appendTo(fragment).then(function () {
                dom.append(self.$('.o_view_controller'), fragment, {
                    in_DOM: true,
                    callbacks: [{widget: self.action_manager}],
                });
            });
        },
        do_action: function () {
            var self = this;
            return this._super.apply(this, arguments).then(function (action) {
                var $rightBar = $('body').find('.o_view_controller');
                if (action.type === 'ir.actions.report') {
                    $rightBar.removeClass(' o_open_sidebar')
                }
                if (self.menu.home_menu_displayed && action.target !== 'new' &&
                    action.type !== 'ir.actions.act_window_close') {
                    self.toggle_home_menu(false);
                }
                var $search_options = $('.o_search_options');
                if ($search_options.is(':visible') && $search_options.children().length > 0
                        && $search_options.children().hasClass('ad_has_options')) {
                    $rightBar.addClass('ad_open_search');
                } else {
                    $rightBar.removeClass('ad_open_search');
                }
            });
        },
    });

});