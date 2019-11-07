odoo.define('allure_backend_theme_ent.KanbanController', function (require) {
    "use strict";

    var KanbanController = require('web.KanbanController');

    KanbanController.include({
        _doUpdateSidebar: function () {
            var $body = $('body');
            if ($body.hasClass('ad_open_search')) {
                $body.find('.o_view_controller').addClass('o_open_sidebar');
            } else {
                $body.find('.o_view_controller').removeClass('o_open_sidebar');
            }
        },
        _update: function () {
            this._updateButtons();
            this._doUpdateSidebar();
            return this._super.apply(this, arguments);
        },
    });
});
