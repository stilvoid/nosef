"use strict";

var url = require("url");
var fs = require("fs");
var path = require("path");
var formidable = require("formidable");
var mime = require("mime");

var template = require("./template");

// Individual response methods

function json_response(output, callback) {
    try {
        output = JSON.stringify(output);
    } catch(err) {
        return this.error(err.message);
    }

    this.writeHead(200, {
        "Content-Type": "application/json"
    });

    if(typeof(callback) === "string") {
        output = callback + "(" + output + ");";
    }

    return this.end(output);
}

function not_found_response() {
    this.writeHead(404);
    this.end("Not found: " + this.url);
}

function error_response(message, code) {
    console.log("ERROR:", message);

    this.writeHead(code || 500);
    this.end(message);
}

function file_response(file_path) {
    var response = this;

    fs.stat(file_path, function(err, stats) {
        if(err) {
            if(err.code === "ENOENT") {
                return response.not_found();
            } else {
                return response.error(err.message);
            }
        }

        // Send the file out
        response.writeHead(200, {
            "Content-Type": mime.lookup(file_path),
            "Content-Length": stats.size
        });

        return fs.readFile(file_path, function(err, data) {
            if(err) {
                return response.error(err.message);
            }

            return response.end(data);
        });
    });
}

function template_response(template_string, content, content_type, escape_html) {
    this.writeHead(200, {
        "Content-Type": content_type || "text/html"
    });

    this.end(template.render(template_string, content, escape_html));
}

function template_file_response(template_path, content, content_type, escape_html) {
    try {
        var data = template.render_file(template_path, content, escape_html);

        this.writeHead(200, {
            "Content-Type": content_type || "text/html"
        });

        this.end(data);
    } catch(err) {
        response.error(err.message);
    }
}

function redirect_response(redirect_url, permanent) {
    this.writeHead(permanent ? 301 : 302, {
        "Location": redirect_url
    });

    this.end();
}

module.exports = function(callback) {
    return function(request, response, params) {
        // Attach request url to the response for convenience
        response.url = request.url;

        // Attach convenience methods to the response object
        response.JSON = json_response;

        response.not_found = not_found_response;

        response.error = error_response;

        response.template = template_response;

        response.send_file = file_response;

        response.file_template = template_file_response;

        response.redirect = redirect_response;

        // Wrap up all the parameters
        var get_data;
        try {
            get_data = url.parse(request.url, true).query;
        } catch(e) {
            get_data = {};
        }
        var name;

        params.get = {};
        params.request = {};

        for(name in get_data) {
            params.get[name] = get_data[name];
            params.request[name] = get_data[name];
        }

        var request_method = request.method.toLowerCase();

        if(request_method === "post" || request_method === "put") {
            var form = new formidable.IncomingForm();

            // Capture post body
            params.post = [];
            params.files = {};
            params.body = [];

            request.on("data", function(data) {
                params.body.push(data);
            });

            try {
                form.parse(request, function(err, fields, files) {
                    // Join body together
                    params.body = Buffer.concat(params.body);

                    if(err) {
                        console.log("Error parsing incoming form:", err);
                    } else {
                        params.files = files;
                        Object.keys(fields).forEach(function(field) {
                            params.post[field] = fields[field];
                            params.request[field] = fields[field];
                        });
                    }

                    callback(request, response, params);
                });
            } catch(err) {
                console.log("Error parsing incoming form:", err);

                callback(request, response, params);
            }
        } else {
            request.on("end", function() {
                callback(request, response, params);
            });
        }
    };
};
