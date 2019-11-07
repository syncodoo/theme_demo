// odoo Menu inherit Open time has Children submenu add.
odoo.define('allure_backend_theme_ent.Menu', function (require) {
    "use strict";

    var AllureWebThemes = require('allure_backend_theme_ent.AllureWebThemes');
    var core = require('web.core');
    var Widget = require('web.Widget');
    var Menu = require('web_enterprise.Menu');
    var AppsMenu = require('web.AppsMenu');
    var UserMenu = require('web.UserMenu');
    var QuickMenu = require('allure_backend_theme_ent.QuickMenu');
    var FavoriteMenu = require('allure_backend_theme_ent.FavoriteMenu');
    var config = require('web.config');
    var session = require('web.session');
    var utils = require('web.utils');
    var SystrayMenu = require('web.SystrayMenu');
    var HomeMenu = require('web_enterprise.HomeMenu');
    var rpc = require('web.rpc');
    var dom = require('web.dom');
    var SwitchCompanyMenu = require('web.SwitchCompanyMenu');

    var QWeb = core.qweb;
    var _t = core._t;

    var LogoutMessage = Widget.extend({
        template: 'LogoutMessage',
        events: {
            'click  a.oe_cu_logout_yes': '_onClickLogout',
            'click  .mb-control-close': '_onClickClose',
        },
        init: function (parent) {
            this._super(parent);
        },
        _onClickLogout: function (e) {
            var self = this;
            self.getParent()._onMenuLogout();
        },
        _onClickClose: function (e) {
            this.$el.remove();
        }
    });

    if (config.device.isMobile) {
        SystrayMenu.Items.push(SwitchCompanyMenu);
    }

    HomeMenu.include({
        events: _.extend({}, HomeMenu.prototype.events, {
            'dragstop .o_home_menu_scrollable .o_apps .o_app': '_ondragStop',
            'dragstart .o_home_menu_scrollable .o_apps .o_app': '_ondragStart',
        }),
        init: function (parent, menuData) {
            this.company_id = session.company_id;
            this.menuData = menuData
            this.meniIcon = true;
            this._super.apply(this, arguments);
        },
        start: function () {
            var self = this;
            this._super.apply(this, arguments);
            this.$mainContent.parent('.o_home_menu').click(function () {
                if (config.device.isMobile || (config.device.size_class <= config.device.SIZES.MD)) {
                    $('body').addClass('ad_full_view');
                }
            });
        },
        _processMenuData: function (menuData) {
            var result = [];
            utils.traversePath(menuData, function (menuItem, parents) {
                if (!menuItem.id || !menuItem.action) {
                    return;
                }
                var item = {
                    parents: _.pluck(parents.slice(1), 'name').join(' / '),
                    label: menuItem.name,
                    id: menuItem.id,
                    xmlid: menuItem.xmlid,
                    action: menuItem.action ? menuItem.action.split(',')[1] : '',
                    is_app: !menuItem.parent_id,
                    web_icon: menuItem.web_icon,
                };
                if (!menuItem.parent_id) {
                    if (menuItem.theme_icon_data) {
                        item.web_icon_data = ('data:image/png;base64,' + menuItem.theme_icon_data).replace(/\s/g, "");
                    } else if (!menuItem.theme_icon_data) {
                        if (menuData.base_menu_icon == 'base_icon') {
                            item.web_icon_data = '/allure_backend_theme_ent/static/src/img/no_modul_ioc.png';
                        } else if (menuData.base_menu_icon == '3d_icon') {
                            item.web_icon_data = '/allure_backend_theme_ent/static/src/img/menu/custom.png';
                        } else if (menuData.base_menu_icon == '2d_icon') {
                            item.web_icon_data = '/allure_backend_theme_ent/static/src/img/menu_2d/custom.png';
                        }
                    } else if (item.web_icon) {
                        var iconData = item.web_icon.split(',');
                        item.web_icon = {
                            class: iconData[0],
                            color: iconData[1],
                            background: iconData[2],
                        };
                    } else {
                        item.web_icon_data = '/web_enterprise/static/src/img/default_icon_app.png';
                    }
                } else {
                    item.menu_id = parents[1].id;
                }
                result.push(item);
            });
            return result;
        },
        _enterpriseShowPanel: function (options) {
            var self = this;
            var hideCookie = utils.get_cookie('oe_instance_hide_panel');
            if ((options.diffDays <= 30 && !hideCookie) || options.diffDays <= 0) {

                var expirationPanel = $(QWeb.render('WebClient.database_expiration_panel', {
                    has_mail: _.includes(session.module_list, 'mail'),
                    diffDays: options.diffDays,
                    dbexpiration_reason: options.dbexpiration_reason,
                    warning: options.warning
                })).insertAfter(self.$mainContent);

                if (options.diffDays <= 0) {
                    expirationPanel.children().addClass('alert-danger');
                    expirationPanel.find('.oe_instance_buy')
                        .on('click.widget_events', self.proxy('_onEnterpriseBuy'));
                    expirationPanel.find('.oe_instance_renew')
                        .on('click.widget_events', self.proxy('_onEnterpriseRenew'));
                    expirationPanel.find('.oe_instance_upsell')
                        .on('click.widget_events', self.proxy('_onEnterpriseUpsell'));
                    expirationPanel.find('.check_enterprise_status')
                        .on('click.widget_events', self.proxy('_onEnterpriseCheckStatus'));
                    expirationPanel.find('.oe_instance_hide_panel').hide();
                    $.blockUI({
                        message: expirationPanel.find('.database_expiration_panel')[0],
                        css: {cursor: 'auto'},
                        overlayCSS: {cursor: 'auto'}
                    });
                }
            }
        },
        _render: function () {
            var self = this;
            this._super.apply(this, arguments);
            if (!config.device.touch) {
                self._onAddElement();
                self._onRemoveElement();
                self._onSortableElement();
                self._onDraggableElement();
            }
        },
        renderFavoriteMenuElement: function () {
            var self = this;
            rpc.query({
                model: 'ir.favorite.menu',
                method: 'search_read',
                args: [[['user_id', '=', session.uid]]],
                kwargs: {fields: ['favorite_menu_id', 'user_id', 'sequence', 'favorite_menu_xml_id', 'favorite_menu_action_id']}
            }).then(function (menu_data) {
                var debug = config.debug ? '?debug' : '';
                $('body').find('.oe_favorite_menu .oe_apps_menu').html(QWeb.render("menu.FavoriteMenuItem", {
                    menu_data: menu_data,
                    debug: debug
                }));
                self._onSortableElement();
                self._onDraggableElement();
            });
        },
        _onAddElement: function () {
            $('.oe_favorite_menu').droppable({
                tolerance: 'pointer',
                drop: _.bind(function (event, ui) {
                    var has_icon = true;
                    var data = $(ui.draggable).data('menu');
                    var data_xml = $(ui.draggable).data('menu-xmlid');
                    var data_action_id = $(ui.draggable).data('action-id');
                    var user = session.uid;
                    var object = $(event.target).find('.oe_apps_menu').children();
                    var sequence = $(ui.draggable).data('menu-sequence');
                    $(object).each(function () {
                        var menu_ids = $(this).data('menu-id');
                        if (menu_ids == data) {
                            has_icon = false;
                        }
                    });
                    if (has_icon) {
                        this._rpc({
                            model: 'ir.favorite.menu',
                            method: 'create',
                            args: [{
                                favorite_menu_id: data,
                                favorite_menu_xml_id: data_xml,
                                favorite_menu_action_id: data_action_id,
                                user_id: user
                            }],
                        }).then(function (ID) {
                            if (ID) {
                                self.renderFavoriteMenuElement();
                            }
                        });
                    }
                }, this),
            });
        },
        _onRemoveElement: function () {
            var self = this;
            self.$el.find('.o_home_menu_scrollable .o_apps').droppable({
                tolerance: 'pointer',
                drop: _.bind(function (event, ui) {
                    if ($(ui.draggable).hasClass('oe_favorite')) {
                        var data = $(ui.draggable).data('menu-id');
                        var user = session.uid;
                        self._rpc({
                            model: 'ir.favorite.menu',
                            method: 'unlink_menu_id',
                            args: [user, parseInt(data)],
                        }).then(function (data) {
                            self.renderFavoriteMenuElement();
                        });
                    }
                }, this),
            });
        },
        _onSortableElement: function () {
            self = this;
            $('body').find('#oe_shorting').sortable({
                start: function (event, ui) {
                    self.$el.find('.o_home_menu_scrollable .o_apps').addClass('oe_view_delete');
                },
                stop: function (event, ui) {
                    self.$el.find('.o_home_menu_scrollable .o_apps').removeClass('oe_view_delete');
                    ui.item.trigger('drop', ui.item.index());
                    var dragMenu = parseInt($(ui.item).data('menu-sequence'));
                    var nextMenu = $(ui.item).nextAll();
                    nextMenu.each(function () {
                        var vals = {}
                        dragMenu = dragMenu + 1;
                        var menu_id = $(this).data('favorite-menu');
                        vals['sequence'] = dragMenu;
                        vals['favorite_menu_id'] = $(this).data('menu-id');
                        self._rpc({
                            model: 'ir.favorite.menu',
                            method: 'write',
                            args: [[menu_id], vals],
                        });
                    });
                }
            });
        },
        _onDraggableElement: function () {
            this.$el.find('.o_home_menu_scrollable .o_apps .o_app').draggable({
                helper: "clone",
            });
        },
        _ondragStop: function () {
            if (!config.device.touch) {
                $('body').find('.oe_favorite_menu').removeClass('oe_dropable_view');
                $('body').removeClass('position-fixed');
            }
        },
        _ondragStart: function () {
            if (!config.device.touch) {
                $('body').find('.oe_favorite_menu').addClass('oe_dropable_view');
                $('body').addClass('position-fixed');
            }
        },
    });

    UserMenu.include({
        init: function () {
            this._super.apply(this, arguments);
            if (config.device.isMobile) {
                this.className = 'o_user_menu';
                this.tagName = 'li';
                this.template = 'UserMenu';
            }
        },
        start: function () {
            var self = this;
            return this._super.apply(this, arguments).then(function () {
                var $avatar = self.$('.oe_topbar_avatar');
                var avatar_src = session.url('/web/image', {
                    model: 'res.users',
                    field: 'image_256',
                    id: session.uid,
                });
                $avatar.attr('src', avatar_src);
                self.$el.on('click', 'li a.o_menu_logout', function (ev) {
                    ev.preventDefault();
                    return new LogoutMessage(self).appendTo(self.$el.closest('body'));
                });
            });
        },
    });

    Menu.include({
        menusTemplate: 'Menu.sections',
        events: _.extend({}, Menu.prototype.events, {
            'click #children_toggle': '_onSubmenuToggleClicked',
            'click #av_full_view': '_onFullViewClicked',
            'click .oe_back_btn': '_onMenuClose',
            'click a[data-menu]': '_onMenuClose',
            'click .oe_full_button': '_onFullScreen',
            'click .o_mobile_menu_toggle': '_onMobileMenu',
            'click .o_mail_preview': '_onMenuClose',
            'click #menu_toggle': '_menuClick',
        }),
        init: function (parent, menu_data) {
            this._super.apply(this, arguments);
            this.company_id = session.company_id;
            this.user_id = session.uid;
            this.menu_id = true;
            this.themeData = {};
        },
        willStart: function () {
            var self = this;
            return self._rpc({
                model: 'res.users',
                method: 'search_read',
                domain: [['id', '=', session.uid]],
                fields: ['base_menu'],
            }).then(function (results) {
                self.themeData = results[0];
            });
        },
        start: function () {
            var self = this;
            if (this.themeData && this.themeData.base_menu === 'base_menu') {
                $('body').addClass('oe_base_menu');
                this.$('.o_main_navbar').replaceWith($(QWeb.render('MenuTitle')));
            }
            this.$av_full_view = this.$('#av_full_view');
            this.$menu_toggle = this.$('#menu_toggle');
            this.$menu_brand_placeholder = this.$('.o_menu_brand');
            this.$section_placeholder = this.$('.o_menu_sections');
            this.$children_toggle = this.$('#children_toggle');
            this.$menu_apps = this.$('.o_menu_apps');

            // if (this.themeData && this.themeData.base_menu === 'base_menu' && !config.device.touch) {
            //     dom.initAutoMoreMenu(this.$section_placeholder, {
            //         maxWidth: function () {
            //             return self.$el.width() - (self.$av_full_view.outerWidth(true) + self.$menu_toggle.outerWidth(true) + self.$menu_brand_placeholder.outerWidth(true) + self.systray_menu.$el.outerWidth(true));
            //         },
            //         sizeClass: 'SM',
            //     });
            // }
            // Navbar's menus event handlers
            var on_secondary_menu_click = function (ev) {
                ev.preventDefault();
                var menu_id = $(ev.currentTarget).data('menu');
                var action_id = $(ev.currentTarget).data('action-id');
                self._on_secondary_menu_click(menu_id, action_id);
            };
            var menu_ids = _.keys(this.$menu_sections);
            var primary_menu_id, $section;
            for (var i = 0; i < menu_ids.length; i++) {
                primary_menu_id = menu_ids[i];
                $section = this.$menu_sections[primary_menu_id];
                $section.on('click', 'a[data-menu]', self, on_secondary_menu_click.bind(this));
            }

            // Apps Menu
            this._appsMenu = new AppsMenu(self, this.menu_data, this.themeData);
            this._appsMenu.appendTo(this.$menu_apps);

            // Systray Menu
            this.systray_menu = new SystrayMenu(this);
            this.systray_menu.attachTo(this.$('.o_menu_systray'));
            if (this.themeData && this.themeData.base_menu === 'base_menu' && !config.device.touch) {
                dom.initAutoMoreMenu(this.$section_placeholder, {
                    maxWidth: function () {
                        return self.$el.width() - (self.$av_full_view.outerWidth(true) + self.$menu_toggle.outerWidth(true) + self.$menu_brand_placeholder.outerWidth(true) + self.systray_menu.$el.outerWidth(true));
                    },
                    sizeClass: 'SM',
                });
            }
            this._loadQuickMenu();
            if (!config.device.touch) {
                self._onSortableElement();
            }
        },
        _onSortableElement: function () {
            self = this;
            $('body').find('#oe_shorting').sortable({
                start: function (event, ui) {
                    self.$el.find('.o_home_menu_scrollable .o_apps').addClass('oe_view_delete');
                },
                stop: function (event, ui) {
                    self.$el.find('.o_home_menu_scrollable .o_apps').removeClass('oe_view_delete');
                    ui.item.trigger('drop', ui.item.index());
                    var dragMenu = parseInt($(ui.item).data('menu-sequence'));
                    var nextMenu = $(ui.item).nextAll();
                    nextMenu.each(function () {
                        var vals = {}
                        dragMenu = dragMenu + 1;
                        var menu_id = $(this).data('favorite-menu');
                        vals['sequence'] = dragMenu;
                        vals['favorite_menu_id'] = $(this).data('menu-id');
                        self._rpc({
                            model: 'ir.favorite.menu',
                            method: 'write',
                            args: [[menu_id], vals],
                        });
                    });
                }
            });
        },
        _updateMenuBrand: function (brandName) {
            if (brandName) {
                this.$menu_brand_placeholder.text(brandName).show();
                this.$section_placeholder.show();
                this.$children_toggle.show()
            } else {
                this.$menu_brand_placeholder.hide()
                this.$section_placeholder.hide();
                this.$children_toggle.hide()
            }
        },
        _onSubmenuToggleClicked: function (e) {
            $('body').removeClass('nav-sm').toggleClass('ad_open_childmenu');
            $(this).toggleClass('active');
        },
        change_menu_section: function (primary_menu_id) {
            if (!this.$menu_sections[primary_menu_id]) {
                this._updateMenuBrand();
                return; // unknown menu_id
            }

            if (this.current_primary_menu === primary_menu_id) {
                return; // already in that menu
            }

            if (this.current_primary_menu) {
                this.$menu_sections[this.current_primary_menu].detach();
            }

            // Get back the application name
            for (var i = 0; i < this.menu_data.children.length; i++) {
                if (this.menu_data.children[i].id === primary_menu_id) {
                    this._updateMenuBrand(this.menu_data.children[i].name);
                    break;
                }
            }
            if (this.themeData && this.themeData.base_menu === 'base_menu') {
                this.$menu_sections[primary_menu_id].appendTo(this.$section_placeholder);
                this.current_primary_menu = primary_menu_id;
            } else {
                // Selcted Menu
                var submenu_data = _.findWhere(this.menu_data.children, {id: primary_menu_id});
                this.menu_id = submenu_data;
                var $submenu_title = $(QWeb.render('SubmenuTitle', {
                    selected_menu: submenu_data,
                }));
                this.$section_placeholder.html($submenu_title);
                $('<div>', {
                    class: 'o_submenu_list',
                }).append(this.$menu_sections[primary_menu_id]).appendTo(this.$section_placeholder);
                this.current_primary_menu = primary_menu_id;
                $('body').toggleClass('ad_nochild', !submenu_data.children.length);

                if ($('body').hasClass('ad_open_childmenu') && !submenu_data.children.length) {
                    $('body').removeClass('ad_open_childmenu')
                }
            }

            core.bus.trigger('resize');
        },
        _onMobileMenu: function (e) {
            $('body').toggleClass('open_mobile_menu');
        },
        _onMenuClose: function (e) {
            $('body').removeClass('open_mobile_menu');
            $('.o_menu_systray').removeClass('show');
            if (config.device.touch || config.device.size_class <= config.device.SIZES.MD) {
                $('body').removeClass('ad_open_childmenu').removeClass('nav-sm');
            }
        },
        _onFullScreen: function (e) {
            document.fullScreenElement && null !== document.fullScreenElement || !document.mozFullScreen &&
            !document.webkitIsFullScreen ? document.documentElement.requestFullScreen ? document.documentElement.requestFullScreen() :
                document.documentElement.mozRequestFullScreen ? document.documentElement.mozRequestFullScreen() :
                    document.documentElement.webkitRequestFullScreen && document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) :
                document.cancelFullScreen ? document.cancelFullScreen() :
                    document.mozCancelFullScreen ? document.mozCancelFullScreen() :
                        document.webkitCancelFullScreen && document.webkitCancelFullScreen()
        },
        _onFullViewClicked: function (e) {
            $('body').removeClass('nav-sm').toggleClass('ad_full_view');
        },
        _on_secondary_menu_click: function (menu_id, action_id) {
            var self = this;

            // It is still possible that we don't have an action_id (for example, menu toggler)
            if (action_id) {
                self._trigger_menu_clicked(menu_id, action_id);
                this.current_secondary_menu = menu_id;
            }
        },
        _loadQuickMenu: function () {
            var self = this;
            new FavoriteMenu(self).appendTo(this.$el.find('.oe_menu_layout.oe_theme_menu_layout'));
            this.$el.parents('.o_web_client').find('.o_menu_systray li.o_global_search').remove();
        },
        switchMode: function (mode) {
            var self = this;
            this._super.apply(this, arguments);
            if (!mode) {
                this.$detached_systray.appendTo('.o_main_navbar');
                if (this.studio_menu) {
                    this.studio_menu.destroy();
                    this.studio_menu = undefined;
                }
            }
        },
        _menuClick: function() {
            if (config.device.isMobile && config.device.size_class <= config.device.SIZES.XS) {
                $('body').removeClass('ad_open_childmenu');
            }
        },
    });
});