odoo.define('allure_backend_theme_ent.FilterMenu', function (require) {
"use strict";
    var FilterMenu = require('web.FilterMenu');

    FilterMenu.include({
        start: function(){
            this._super();
            this.$el.addClass('ad_active');
        },
    })
});