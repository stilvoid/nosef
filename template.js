var fs = require("fs");

var templates = {};

function make_safe(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;");
}

exports.render = function(template_path, content, escape_html) {
    var output, prop, c;

    if(!templates[template_path]) {
        templates[template_path] = fs.readFileSync(template_path, "utf8");
    }

    output = templates[template_path];

    for(prop in content) {
        c = "" + content[prop];

        if(escape_html) {
            c = make_safe(c);
        }
        output = output.replace(new RegExp("\\{\\{\\s*" + prop + "\\s*\\}\\}", "ig"), c);
    }

    return output;
};
