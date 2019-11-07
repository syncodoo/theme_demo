odoo.define('allure_backend_theme_ent.AbstractController', function (require) {
    "use strict";

    var AbstractController = require('web.AbstractController');

    AbstractController.include({
        _renderSwitchButtons: function (old_view) {
            if (this.viewType !== 'form' && this.viewType !== 'list') {
                $('body').find('.o_view_controller').removeClass('o_open_sidebar');
            }
            return this._super.apply(this, arguments)
        },
    });
});