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
