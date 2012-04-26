var fs = require("fs");

var templates = {};

function make_safe(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;");
}

function flatten_object(object) {
    var output,
        prop,
        subobject,
        subprop,
        i;

    if(typeof(object) === "string" || typeof(object) === "number") {
        return object;
    } else if(Array.isArray(object)) {
        output = {};

        for(i=0; i<object.length; i++) {
            output[i] = object[i];
        }

        return flatten_object(output);
    } else if(object && typeof(object) === "object") {
        output = {};

        for(prop in object) {
            subobject = flatten_object(object[prop]);

            if(typeof(subobject) === "object") {
                for(subprop in subobject) {
                    output[prop + "." + subprop] = subobject[subprop];
                }
            } else {
                output[prop] = object[prop];
            }
        }

        return output;
    }

    return "" + object;
}

var ifPattern = /\{%\s*if\s+(\S+?)\s*%\}((?:[\s\S](?!\{%))*[\s\S])\{%\s*endif\s*%}/i;
var ifNotPattern = /\{%\s*if\s+not\s+(.+?)\s*%\}((?:[\s\S](?!\{%))*[\s\S])\{%\s*endif\s*%}/i;

function contains(content, prop) {
    if(content.hasOwnProperty(prop)) {
        return true;
    } else {
        for(var p in content) {
            if(new RegExp("^" + prop + "[\.$]", "i").test(p)) {
                return true;
            }
        }
    }

    return false;
}

exports.render = function(template, content, escape_html) {
    var prop, c, matches;

    content = flatten_object(content);

    for(prop in content) {
        c = "" + content[prop];

        if(escape_html) {
            c = make_safe(c);
        }
        template = template.replace(new RegExp("\\{\\{\\s*" + prop + "\\s*\\}\\}", "ig"), c);
    }

    while(ifPattern.test(template)) {
        matches = ifPattern.exec(template);

        if(contains(content, matches[1])) {
            template = template.replace(matches[0], matches[2]);
        } else {
            template = template.replace(matches[0], "");
        }
    }

    while(ifNotPattern.test(template)) {
        matches = ifNotPattern.exec(template);

        if(!contains(content, matches[1])) {
            template = template.replace(matches[0], matches[2]);
        } else {
            template = template.replace(matches[0], "");
        }
    }

    return template;
};

exports.render_file = function(template_path, content, escape_html) {
    var template;

    if(!templates[template_path]) {
        templates[template_path] = fs.readFileSync(template_path, "utf8");
    }

    template = templates[template_path];

    return exports.render(template, content, escape_html);
};
