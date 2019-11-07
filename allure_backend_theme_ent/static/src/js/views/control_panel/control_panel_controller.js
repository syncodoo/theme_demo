odoo.define('allure_backend_theme_ent.ControlPanelController', function (require) {
"use strict";

var ControlPanelController = require('web.ControlPanelController');

ControlPanelController.include({
    _reportNewQueryAndRender: function () {
        var self = this;
        var _Super = this._super();
        _Super.then(function() {
            if (self.renderer.searchBar) {
                self.renderer.searchBar._manageFacets();
            }
        });
        return _Super;
    },
});

});
