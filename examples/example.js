var nosef = require("../");

function echo_handler(request, response, params) {
    response.JSON(params);
}

function hello_handler(request, response, params) {
    response.template("Hello {{who}}", params.url, "text/plain");
}

var config = {
    port: 8765,
    middleware: function(request, response) {
        console.log("URL: ", request.url);
    },
    urls: [
        ["/echo/{{path}}", echo_handler],
        ["/hello/{who}", hello_handler],
        ["/file/{{path}}", nosef.handlers.file("./", "path")]
    ]
};

var server = nosef.server(config);

server.on("start", function() {
    console.log("Server started");
});

server.on("close", function() {
    console.log("Server stopped");
});
