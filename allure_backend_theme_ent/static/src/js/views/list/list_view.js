odoo.define('allure_backend_theme_ent.ListView', function (require) {
    "use strict";
    var core = require('web.core');
    var ListModel = require('allure_backend_theme_ent.ListModel');
    var ListView = require('web.ListView');

    var _lt = core._lt;

    ListView.include({
        config: _.extend({}, ListView.prototype.config, {
            Model: ListModel,
        }),
        init: function (viewInfo, params) {
            this._super.apply(this, arguments);
            this.loadParams.attachmentsData = [];
            this.loadParams.resDomain = params.domain;
        },
    });
    return ListView;

});
