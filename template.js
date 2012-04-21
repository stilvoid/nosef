var fs = require("fs");

var templates = {};

function make_safe(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;");
}

function flatten_object(object) {
    var output = {},
        prop,
        subobject,
        subprop;

    for(prop in object) {
        if(typeof(object[prop]) === "string" || typeof(object[prop]) === "number") {
            output[prop] = object[prop];
        } else if(typeof(object[prop]) === "object") {
            subobject = flatten_object(object[prop]);

            for(subprop in subobject) {
                output[prop + "." + subprop] = subobject[subprop];
            }
        }
    }

    return output;
}

exports.render = function(template_path, content, escape_html) {
    var output, prop, c;

    if(!templates[template_path]) {
        templates[template_path] = fs.readFileSync(template_path, "utf8");
    }

    output = templates[template_path];

    content = flatten_object(content);

    for(prop in content) {
        c = "" + content[prop];

        if(escape_html) {
            c = make_safe(c);
        }
        output = output.replace(new RegExp("\\{\\{\\s*" + prop + "\\s*\\}\\}", "ig"), c);
    }

    return output;
};
