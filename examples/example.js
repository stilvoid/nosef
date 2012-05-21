var nosef = require("../");

var echo_handler = nosef.handler(function(request, response, params) {
    response.JSON(params);
});

var hello_handler = nosef.handler(function(request, response, params) {
    response.template("Hello {{who}}", params.url, "text/plain");
});

var config = {
    port: 8765,
    urls: [
        ["/echo/{{path}}", echo_handler],
        ["/hello/{who}", hello_handler]
    ]
};

var server = nosef.server.start(config);

server.on("start", function() {
    console.log("Server started");
});

server.on("close", function() {
    console.log("Server stopped");
});
