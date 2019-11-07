odoo.define('allure_backend_theme_ent.GraphRenderer', function (require) {
    "use strict";

    var GraphRenderer = require('web.GraphRenderer');
    var COLORS = ["#1f77b4", "#ff7f0e", "#aec7e8", "#ffbb78", "#2ca02c", "#98df8a", "#d62728",
        "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2",
        "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];
    var COLOR_NB = COLORS.length;
    var session = require('web.session');

    return GraphRenderer.include({
        init: function (parent, state, params) {
            this.MODE = 'night_mode_off';
            this._super.apply(this, arguments);
        },
        willStart: function () {
            var self = this;
            return self._rpc({
                model: 'ir.config_parameter',
                method: 'get_param',
                args: ['allure_backend_theme_ent.selected_theme']
            }).then(function (theme_id) {
                self._rpc({
                    model: 'res.users',
                    method: 'search_read',
                    domain: [['id', '=', session.uid]],
                    fields: ['mode'],
                }).then(function (results) {
                    self.MODE = results[0].mode;
                });
                return self._rpc({
                    model: 'ir.web.theme',
                    method: 'search_read',
                    domain: [['id', '=', parseInt(theme_id)]],
                    fields: ['leftbar_color', 'buttons_color', 'tag_info',
                        'tag_danger', 'tag_success', 'tag_warning',
                        'tag_primary', 'tag_muted'],
                }).then(function (result) {
                    if (!_.isEmpty(result)) {
                        COLORS = [result[0].buttons_color, result[0].leftbar_color, result[0].tag_info, result[0].tag_danger,
                            result[0].tag_success, result[0].tag_warning, result[0].tag_primary, result[0].tag_muted],
                        COLOR_NB = COLORS.length;
                    }
                });
            });
        },
        _getColor: function (index) {
            return COLORS[index % COLOR_NB];
        },
        _getLegendOptions: function (datasetsCount) {
            var options = this._super.apply(this, arguments);
            if (_.isEmpty(options) || this.MODE !== "night_mode_on") {
                return options;
            }
            _.each(_.keys(options), function() {
                if (_.has(options || {}, "labels")) {
                    _.extend(options.labels, {}, {fontColor: 'white'});
                }
            });
            return options;
        },
        _getScaleOptions: function () {
            var options =  this._super.apply(this, arguments);
            if (_.isEmpty(options) || this.MODE !== "night_mode_on") {
                return options;
            }
            _.each(_.keys(options), function(key) {
                if (_.has(options[key][0] || {}, "ticks")) {
                    _.extend(options[key][0].ticks, {}, {fontColor: 'white'});
                }
                if (_.has(options[key][0] || {}, "scaleLabel")) {
                    _.extend(options[key][0].scaleLabel, {}, {fontColor: 'white'});
                }
                if (_.has(options || {}, 'xAxes')) {
                    _.extend(options[key][0] ,{}, {gridLines: {zeroLineColor:'white', color: '#636363'}});
                }
            });
            return options;
        },
    });
});
