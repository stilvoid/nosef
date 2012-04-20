var http = require("http");

exports.assert = function(value) {
    if(!value) {
        throw new Error("Failed Assert");
    }
};

exports.assert_contains = function(obj, prop) {
    if(!obj.hasOwnProperty(prop)) {
        throw new Error("Object does not contain property: " + prop);
    }
};

exports.assert_equal = function(a, b) {
    if(a != b) {
        throw new Error(a + " is not equal to " + b);
    }
};

exports.test_url = function(host, port, url, callback) {
    var options = {
        host: host,
        port: port,
        path: url
    };

    http.get(options, function(response) {
        response.setEncoding("utf8");

        response.on("data", function(data) {
            callback(data);
        });
    }).on('error', function(error) {
        throw error;
    });
};
