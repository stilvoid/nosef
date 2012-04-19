String.prototype.repeat = function(n) {
    var out = "";
    var i;

    for(i=0; i<n; i++) {
        out += this;
    }

    return out;
};

exports.format_json = function(json) {
    var level = 0;
    var output = "";
    var in_string = false;
    var i;

    if(typeof(json) === "undefined") {
        json = {};
    }

    for(i=0; i<json.length; i++) {
        var c = json.charAt(i);

        if(!in_string) {
            if (c === "{") {
                level++;
                output += c + "\n" + "\t".repeat(level);
            } else if(c === "}") {
                level--;
                output += "\n" + "\t".repeat(level) + c;
            } else if(c === "\"") {
                in_string = true;
                output += c;
            } else if(c === ",") {
                output += c + "\n" + "\t".repeat(level);
            } else if(c === ":") {
                output += c + " ";
            } else {
                output += c;
            }
        } else if(c === "\"") {
            in_string = false;
            output += c;
        } else {
            output += c;
        }
    }

    return output;
};
