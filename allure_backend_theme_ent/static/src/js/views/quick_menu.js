odoo.define('allure_backend_theme_ent.QuickMenu', function (require) {
    "use strict";

    var core = require('web.core');
    var Widget = require('web.Widget');
    var rpc = require('web.rpc');
    var QWeb = core.qweb;

    return Widget.extend({
        template: 'menu.QuickMenu',
        events: {
            'click li a': '_onOpenMenu',
        },
        init: function () {
            this._super.apply(this, arguments);
            this._doInitMenu();
        },
        willStart: function () {
            var self = this;
            return this._super.apply(this, arguments).then(function () {
                self._doInitMenu().then(function (menu_data) {
                    var debug = core.debug ? '?debug' : '';
                    self.$el.append($(QWeb.render('menu.QuickMenuItems', {
                        menu_data: menu_data,
                        debug: debug
                    })));
                });
            });
        },
        _doInitMenu: function () {
            var self = this;
            return rpc.query({
                model: 'ir.ui.menu',
                method: 'search_read',
                args: [[['parent_id', '=', false], ['name', 'in', ['Discuss', 'Conversations', 'Calendar']]]],
                kwargs: {fields: ['id', 'name', 'action']}
            }).then(function (menu_data) {
                return menu_data;
            });
        },
        _onOpenMenu: function (event) {
            var self = this;
            var $el = $(event.currentTarget);
            var menu_id = $el.data('menu');
            var action_id = $el.data('action-id');
            $('body').addClass('ad_nochild');
            if(action_id) {
                this.trigger_up('app_clicked', {
                    menu_id: menu_id,
                    action_id: action_id,
                });
            }
        },
    });
});