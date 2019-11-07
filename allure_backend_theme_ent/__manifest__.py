# -*- coding: utf-8 -*-
# Part of Odoo. See COPYRIGHT & LICENSE files for full copyright and licensing details.

{
    'name': 'allure Backend Theme Enterprise',
    'category': "Themes/Backend",
    'version': '1.1',
    'license': 'OPL-1',
    'summary': 'Customized Backend Theme',
    'description': 'Customized Backend Theme',
    'author': 'Synconics Technologies Pvt. Ltd.',
    'depends': ['web_enterprise'],
    'website': 'www.synconics.com',
    'data': [
        'data/theme_data.xml',
        'security/security.xml',
        'security/ir.model.access.csv',
        'views/ir_module_views.xml',
        'views/webclient_templates.xml',
        'views/res_users_views.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml',
    ],
    'images': [
        'static/description/main_screen.png',
        'static/description/allure_screenshot.jpg',
    ],
    'post_init_hook': 'post_init_check',
    'price': 449.0,
    'currency': 'EUR',
    'installable': True,
    'auto_install': False,
    'bootstrap': True,
    'application': True,
}