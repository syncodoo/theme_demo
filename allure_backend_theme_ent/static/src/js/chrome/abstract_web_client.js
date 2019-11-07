odoo.define('allure_backend_theme_ent.AbstractWebClient', function (require) {
"use strict";

var AbstractWebClient = require('web.AbstractWebClient');
const core = require('web.core');
const _t = core._t;


AbstractWebClient.include({

    _onConnectionLost: function() {
        this.$connectionIndicator = $('<div class="oe_cu_indicator_warning">' + _t("Trying to reconnect... ") + '<i class="fa fa-refresh fa-spin"></i></div>').fadeIn("slow");
        this.$connectionIndicator.prependTo("body");
    },

    _onConnectionRestored: function() {
        var self = this;
        self.$connectionIndicator.animate({backgroundColor: '#00aa00', opacity: 1}, 1000);
        self.$connectionIndicator.removeClass('oe_cu_indicator_warning')
        .addClass('oe_cu_indicator_sucsess')
        .html(_t("You are back online"))
        .delay(2000).slideUp('slow', function () { self.$connectionIndicator.remove(); });
    },

});

});
