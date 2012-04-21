"use strict";

var http = require("http");

var map_urls = require("./map_urls");

var server;

exports.start = function(config, start_callback, stop_callback) {
    var url_map = map_urls(config.urls);

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
