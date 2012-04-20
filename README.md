# nosef - A set of nice wrapper functionality for quickly building web services

## Example usage

    var nosef = require("nosef");

    var echo_handler = nosef.handler(function(request, response, params) {
        response.JSON(params);
    });

    var hello_handler = nosef.handler(function(request, response, params) {
        response.end("Hello " + (params.who || "world"));
    });

    var config = {
        port: 8765,
        urls: [
            ["/echo/{{path}}", echo_handler],
            ["/hello/{who}", hello_handler]
        ]
    };

    nosef.server.start(config, function() {
        console.log("Server stopped");
    });

    console.log("HTTP server started on port " + config.port);
