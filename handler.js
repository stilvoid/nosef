"use strict";

var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");

var template = require("./template");

function handler(callback) {
    return function(request, response, params) {
        // Attach convenience methods to the response object
        response.JSON = function(output) {
            response.writeHead(200, {
                "Content-Type": "application/json"
            });

            response.end(JSON.stringify(output));
        };

        response.not_found = function(message) {
            response.writeHead(404);
            response.end("Not found: " + request.url);
        };

        response.error = function(message) {
            console.log("ERROR:", message);
            response.writeHead(500);
            response.end(message);
        };

        response.template = function(template_path, content, escape_html) {
            response.writeHead(200, {
                "Content-Type": "text/html"
            });

            response.end(template.render(template_path, content, escape_html));
        };

        response.redirect = function(redirect_url, permanent) {
            response.writeHead(permanent ? 301 : 302, {
                "Location": redirect_url
            });
            response.end();
        };

        // Wrap up all the parameters
        var name;
        var get_data = url.parse(request.url, true).query;

        for(name in get_data) {
            if(!params.hasOwnProperty(name)) {
                params[name] = get_data[name];
            }
        }

        if(request.method.toLowerCase() == "post") {
            var form = new formidable.IncomingForm();

            params.files = {};

            form.on("field", function(field, value) {
                params[field] = value;
            });

            form.on("file", function(field, file) {
                var name = path.basename(file.name).toLowerCase();
                params.files[name] = file;
            });

            form.on("end", function() {
                callback(request, response, params);
            });

            form.parse(request);
        } else {
            request.on("end", function() {
                callback(request, response, params);
            });
        }
    };
}

module.exports = handler;
