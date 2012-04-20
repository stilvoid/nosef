var http = require("http");

var util = require("./util");

var server = require("../server");
var handler = require("../handler");

var config = {
    port: 9876,
    urls: [
        ["/path/{{path}}", handler(function(request, response, params) {
            response.JSON(params);
        })],
        ["/hello/{who}", handler(function(request, response, params) {
            response.end("Hello " + params.who);
        })]
    ]
};

server.start(config, function(error) {
    if(error) {
        throw error;
    }

    util.test_url("localhost", config.port, "/path/this/is/my/path", function(data) {
        data = JSON.parse(data);

        util.assert_contains(data, "path");
        util.assert_equal(data.path, "this/is/my/path");
    });

    util.test_url("localhost", config.port, "/hello/world", function(data) {
        util.assert_equal(data, "Hello world");
    });

    setTimeout(function() {
        server.stop();
    }, 1000);
});
