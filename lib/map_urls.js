"use strict";

var handler = require("./handler");

/*
    // Map URL patterns to functions
    var url_map = urls([
        ["/api/campaigns", handlers.campaigns],
        ["/api/campaign/{campaign_id}", handlers.get_campaign],
        ["/", handlers.page]
    ]);
*/
function map_urls(url_map) {
    var i;
    var escape_pattern = /([\.\*\+\^\$\(\)\[\]\\\/])/g;
    var param_pattern = /\{[^\}]+\}/;
    var path_pattern = /\{\{[^\}]+\}\}/;

    for(i=0; i<url_map.length; i++) {
        (function() {
            var pattern = url_map[i][0];
            var callback = handler(url_map[i][1]);

            var j = 1;
            var param_names = {};

            var matches;

            pattern = "^" + pattern + "$";
            pattern = pattern.replace(/\//g, "\\/");

            while(path_pattern.test(pattern)) {
                matches = path_pattern.exec(pattern);

                if(matches) {
                    param_names[j] = matches[0].replace(/^\{\{/, "").replace(/\}\}$/, "");
                    pattern = pattern.replace(matches[0], "(.*?)");

                    j++;
                }
            }

            while(param_pattern.test(pattern)) {
                matches = param_pattern.exec(pattern);

                if(matches) {
                    param_names[j] = matches[0].replace(/^\{/, "").replace(/\}$/, "");
                    pattern = pattern.replace(matches[0], "([^\\/]+)");

                    j++;
                }
            }

            pattern = new RegExp(pattern);

            url_map[i] = function(request, response) {
                var param_index;

                var url = request.url.replace(/\?.*$/, "");

                var matches = pattern.exec(url);

                if(matches) {
                    var params = {};
                    for(param_index in param_names) {
                        params[param_names[param_index]] = matches[param_index];
                    }

                    callback(request, response, {url: params});

                    return true;
                }
            };
        }());
    }

    return url_map;
}

module.exports = map_urls;
