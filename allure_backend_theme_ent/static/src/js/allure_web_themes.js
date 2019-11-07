odoo.define('allure_backend_theme_ent.WebThemesDB', function (require) {
"use strict";

var core = require('web.core');
var utils = require('web.utils');
/* The WebThemesDB holds reference to data that is either
 * - static: does not change between pos reloads
 * - persistent : must stay between reloads ( orders )
 */

// alert("yyy");
var WebThemesDB = core.Class.extend({
    name: 'openerp_web_themes_db', //the prefix of the localstorage data
    limit: 100,  // the maximum number of results returned by a search
    init: function(options){
        options = options || {};
        this.name = options.name || this.name;
        this.limit = options.limit || this.limit;
        
        if (options.uuid) {
            this.name = this.name + '_' + options.uuid;
        }

        //cache the data in memory to avoid roundtrips to the localstorage
        this.cache = {};

        this.web_themes = [];
        this.theme_by_id = {};
        this.theme_by_uid = {};

        this.default_user_theme = false;
    },
    set_uuid: function(uuid){
        this.name = this.name + '_' + uuid;
    },

    /* loads a record store from the database. returns default if nothing is found */
    load: function(store,deft){
        if(this.cache[store] !== undefined){
            return this.cache[store];
        }
        var data = localStorage[this.name + '_' + store];
        if(data !== undefined && data !== ""){
            data = JSON.parse(data);
            this.cache[store] = data;
            return data;
        }else{
            return deft;
        }
    },
    /* saves a record store to the database */
    save: function(store,data){
        localStorage[this.name + '_' + store] = JSON.stringify(data);
        this.cache[store] = data;
    },

    add_themes: function(themes){
        this.web_themes = themes;
        this.default_user_theme = _.findWhere(themes, {default: true});
        for (var i = 0, len = themes.length; i < len; i++) {
            var theme = themes[i];
            this.theme_by_id[theme.id] = theme;
            this.theme_by_uid[theme.uid] = theme;
        };
    },

    get_themes: function() {
        return this.web_themes;
    },

    get_theme_by_id: function(id) {
        return this.theme_by_id[id];
    },

    get_theme_by_uid: function(uid) {
        return this.theme_by_uid[uid];
    },

    getUserTheme: function() {
        return this.default_user_theme;
    },
});

return WebThemesDB;

});


// odoo.define('allure_backend_theme_ent.AllureWebThemes', function (require) {
// "use strict";

// var rpc = require('web.rpc');
// var session = require('web.Session');

// var WebThemesDB = require('allure_backend_theme_ent.WebThemesDB');
// var __themesDB = new WebThemesDB();


// function getInitThemes() {
//     rpc.query({
//         model: 'ir.web.theme',
//         method: 'search_read',
//         domain: [['create_uid', '=', session.uid]],
//         fields: [],
//         context: session.user_context,
//     }).then(function (result) {
//         __themesDadd_themes(result);
//     });
// };

// return __themesDB;

// });