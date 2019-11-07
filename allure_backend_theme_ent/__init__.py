# -*- coding: utf-8 -*-
# Part of Odoo. See COPYRIGHT & LICENSE files for full copyright and licensing details.

from . import models
from . import controllers

from odoo import api, SUPERUSER_ID, _
from os.path import isfile
from odoo.modules import get_module_resource


def post_init_check(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    modules = env['ir.module.module'].search([])
    menu_ids = env['ir.ui.menu'].get_user_roots().mapped('id')
    board_id = env.ref('base.menu_board_root').id
    menu_ids.append(board_id)
    menus = env['ir.ui.menu'].browse(menu_ids)
    for module in modules:
        if module.name:
            icon_path = 'static/src/img/menu/' + module.name + '.png'
            module_path = get_module_resource('allure_backend_theme_ent', icon_path)
            if isfile(module_path):
                module.write({'theme_icon': '/allure_backend_theme_ent/' + icon_path})
            elif module.icon == '/base/static/description/icon.png':
                module.write({'theme_icon': '/allure_backend_theme_ent/static/src/img/menu/custom.png'});
            else:
                module.write({'theme_icon': module.icon})
    for menu in menus:
        if menu.web_icon:
            path_info = menu.web_icon.split(',')
            module_name = path_info[0]
            icon_path = 'static/src/img/menu/' + module_name + '.png'
            module_path = get_module_resource('allure_backend_theme_ent', icon_path)
            if isfile(module_path):
                menu.write({'theme_icon': 'allure_backend_theme_ent,' + icon_path,
                    'theme_icon_data': env['ir.ui.menu']._compute_web_icon_data('allure_backend_theme_ent,' + icon_path)})
            elif path_info[1] == '/base/static/description/icon.png':
                menu.write({'theme_icon': 'allure_backend_theme_ent,static/src/img/menu/custom.png',
                    'theme_icon_data':env['ir.ui.menu']._compute_web_icon_data('allure_backend_theme_ent,static/src/img/menu/custom.png')})
            else:
                menu.write({'theme_icon': menu.web_icon,
                    'theme_icon_data':env['ir.ui.menu']._compute_web_icon_data(menu.web_icon)})
            if path_info[0] == 'base':
                icon_name = path_info[1].split('/')
                if icon_name and icon_name[-1:][0]:
                    icon = icon_name[-1:][0]
                    icon_path = "allure_backend_theme_ent,static/src/img/menu/%s" %(icon)
                    menu.write({'theme_icon': icon_path,
                        'theme_icon_data':env['ir.ui.menu']._compute_web_icon_data(icon_path)})
