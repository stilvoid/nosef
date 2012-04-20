"use strict";

var http = require("http");

var server;

function urls(url_map) {
    var i;
    var param_pattern = /\{[^\}]+\}/;
    var path_pattern = /\{\{[^\}]+\}\}/;

    for(i=0; i<url_map.length; i++) {
        (function() {
            var pattern = url_map[i][0];
            var handler = url_map[i][1];

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

                    handler(request, response, params);

                    return true;
                }
            };
        }());
    }

    return url_map;
}

exports.start = function(config, start_callback, stop_callback) {
    var url_map = urls(config.urls);

    server = http.createServer(function(request, response) {
        var i;

        var matched = false;

        for(i=0; i<url_map.length; i++) {
            if(url_map[i](request, response)) {
                if(config.debug) {
                    console.log(request.url);
                }
                matched = true;
                break;
            }
        }

        if(!matched) {
            response.writeHead(404);
            response.end("'" + request.url + "' not found");
        }
    });

    server.on("close", function() {
        if(stop_callback) {
            stop_callback();
        }
    });

    server.listen(config.port || 80, config.address || "0.0.0.0", function(error) {
        if(start_callback) {
            start_callback(error);
        }
    });
};

exports.stop = function() {
    server.close();
};

/*
    // Map regular expressions to functions
    var url_map = urls([
        ["/api/campaigns", handlers.campaigns],
        ["/api/campaign/{campaign_id}", handlers.get_campaign],
        ["/", handlers.page]
    ]);
*/
