"use strict";

var path = require("path");

function file(base_dir, file_param) {
    if(typeof(file_param) === "undefined") {
        return function(request, response, params) {
            response.send_file(base_dir);
        };
    }

    return function(request, response, params) {
        try {
            var file_path = params.url[file_param];

            // Clean up the path
            file_path = "/" + file_path;
            file_path = path.normalize(file_path);
            file_path = path.join(base_dir, file_path);

            response.send_file(file_path);
        } catch(e) {
            response.error(e.message);
        }
    };
}

function redirect(redirect_url, permanent) {
    return function(request, response, params) {
        response.redirect(redirect_url, permanent);
    };
}

exports.file = file;
exports.redirect = redirect;
