"use strict";

var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var mime = require("mime");

var template = require("./template");

module.exports = function(callback) {
    return function(request, response, params) {
        // Attach convenience methods to the response object
        response.JSON = function(output, callback) {
            response.writeHead(200, {
                "Content-Type": "application/json"
            });

            output = JSON.stringify(output);

            if(typeof(callback) === "string") {
                output = callback + "(" + output + ");";
            }

            response.end(output);
        };

        response.not_found = function() {
            response.writeHead(404);
            response.end("Not found: " + request.url);
        };

        response.error = function(message, code) {
            console.log("ERROR:", message);
            response.writeHead(code || 500);
            response.end(message);
        };

        response.template = function(template_string, content, content_type, escape_html) {
            response.writeHead(200, {
                "Content-Type": content_type || "text/html"
            });

            response.end(template.render(template_string, content, escape_html));
        };

        response.send_file = function(file_path) {
            try {
                var stats = fs.statSync(file_path);

                // Send the file out
                response.writeHead(200, {
                    "Content-Type": mime.lookup(file_path),
                    "Content-Length": stats.size
                });

                response.end(fs.readFileSync(file_path));
            } catch(e) {
                response.not_found();
            }
        };

        response.file_template = function(template_path, content, content_type, escape_html) {
            response.writeHead(200, {
                "Content-Type": content_type || "text/html"
            });

            response.end(template.render_file(template_path, content, escape_html));
        };

        response.redirect = function(redirect_url, permanent) {
            response.writeHead(permanent ? 301 : 302, {
                "Location": redirect_url
            });
            response.end();
        };

        // Wrap up all the parameters
        var get_data = url.parse(request.url, true).query;
        var name;

        params.get = {};
        params.post = {};
        params.request = {};
        params.files = {};

        for(name in get_data) {
            params.get[name] = get_data[name];
            params.request[name] = get_data[name];
        }

        if(request.method.toLowerCase() == "post") {
            var form = new formidable.IncomingForm();

            form.on("field", function(field, value) {
                params.post[field] = value;
                params.request[field] = value;
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
};
