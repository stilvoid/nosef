"use strict";

var http = require("http");
var events = require("events");

var map_urls = require("./map_urls");

exports.start = function(config) {
    var url_map = map_urls(config.urls);

    var server = http.createServer(function(request, response) {
        var i;

        var matched = false;

        // Run middleware
        if(config.hasOwnProperty("middleware")) {
            if(Array.isArray(config.middleware)) {
                for(i=0; i<config.middleware.length; i++) {
                    if(typeof(config.middleware[i]) === "function") {
                        config.middleware[i](request, response);
                    }
                }
            } else if(typeof(config.middleware) === "function") {
                config.middleware(request, response);
            }
        }

        // Find a URL match
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

    server.listen(config.port || 80, config.address || "0.0.0.0", function(error) {
        server.emit("start");
    });

    return server;
};
