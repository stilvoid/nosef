var nosef = require("../index");

var echo_handler = nosef.handler(function(request, response, params) {
    response.JSON(params);
});

var hello_handler = nosef.handler(function(request, response, params) {
    response.template("hello.txt", params);
});

var config = {
    port: 8765,
    urls: [
        ["/echo/{{path}}", echo_handler],
        ["/hello/{name}", hello_handler]
    ]
};

nosef.server.start(config, function() {
    console.log("Server started");
}, function() {
    console.log("Server stopped");
});

console.log("HTTP server started on port " + config.port);
