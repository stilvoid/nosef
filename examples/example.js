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

nosef.server.start(config, function() {
    console.log("Server started");
}, function() {
    console.log("Server stopped");
});
