# -*- coding: utf-8 -*-
# Part of Odoo. See COPYRIGHT & LICENSE files for full copyright and licensing details.

import odoo
import numbers
from odoo import http
from odoo.addons.web.controllers.main import *
from odoo.http import request
from lxml import html


class MenuSearch(http.Controller):

    def get_view_ids(self, xml_ids):
        ids = []
        for xml_id in xml_ids:
            if "." in xml_id:
                record_id = request.env.ref(xml_id).id
            else:
                record_id = int(xml_id)
            ids.append(record_id)
        return ids

    @http.route(['/web/theme_customize_backend_get'], type='json', website=True, auth="public")
    def theme_customize_backend_get(self, xml_ids):
        enable = []
        disable = []
        ids = self.get_view_ids(xml_ids)
        for view in request.env['ir.ui.view'].with_context(
                active_test=True).browse(ids):
            if view.active:
                enable.append(view.xml_id)
            else:
                disable.append(view.xml_id)
        return [enable, disable]