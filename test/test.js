var http = require("http");

var util = require("./util");

var nosef = require("../");

var config = {
    port: 9876,
    urls: [
        ["/path/{{path}}", nosef.handler(function(request, response, params) {
            response.JSON(params);
        })],
        ["/hello/{who}", nosef.handler(function(request, response, params) {
            response.end("Hello " + params.url.who);
        })],
        ["/file/{{path}}", nosef.file_handler("./", "path")]
    ]
};

var server = nosef.server.start(config);

server.on("start", function(error) {
    if(error) {
        throw error;
    }

    util.test_url("localhost", config.port, "/path/this/is/my/path", function(data) {
        data = JSON.parse(data);

        util.assert_contains(data.url, "path");
        util.assert_equal(data.url.path, "this/is/my/path");
    });

    util.test_url("localhost", config.port, "/hello/world", function(data) {
        util.assert_equal(data, "Hello world");
    });

    util.test_url("localhost", config.port, "/file/test.txt", function(data) {
        util.assert_equal(data, "Hello, world!\n");
    });

    setTimeout(function() {
        server.close();
    }, 1000);
});
