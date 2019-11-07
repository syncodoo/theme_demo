odoo.define('allure_backend_theme_ent.MainView', function (require) {
    "use strict";

    var config = require('web.config');

    $(document).ready(function (require) {

        var $body = $('body'),
            $full_view = $('#av_full_view');

        // Create a full view [start]
        $full_view.click(function () {
            $body.removeClass('nav-sm ad_open_childmenu').toggleClass('ad_full_view');
        });

        $(document).click(function (e) {
            if (!$(e.target).parents('.o_cp_left').hasClass('cp_open')) {
                $('.o_cp_left').removeClass('cp_open');
            }
            if (!$(e.target).find('.o_menu_systray').hasClass('show')) {
                $('.o_menu_systray').removeClass('show');
            }
        });

        //Mobile view detect
        if (config.device.isMobile) {
            $body.addClass('ad_mobile ad_full_view');
        }
        if ($(document).width() <= 991) {
            $body.addClass('ad_full_view');
        }
    });

});