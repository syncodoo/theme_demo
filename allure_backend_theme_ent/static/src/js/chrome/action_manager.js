odoo.define('allure_backend_theme_ent.ActionManager', function (require) {
    "use strict";

    var ActionManager = require('web.ActionManager');
    var config = require('web.config');

    ActionManager.include({
        events: _.extend({}, ActionManager.prototype.events, {
            'click .o_action': '_onSidebarToggle',
        }),
        _onSidebarToggle: function(ev) {
            $('body').removeClass('ad_open_childmenu');
            if (config.device.isMobile) {
                $('body').addClass('ad_full_view');
            }
        }
    });

});