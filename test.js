var server = require("./server");
var handler = require("./handler");

var config = {
    port: 8000,
    urls: [
        ["/", handler(function(request, response, params) {
            response.JSON(params);
        })],
        ["/log", handler(function(request, response, params) {
            console.log(request.url);
            response.end("logged");
        })],
        ["/{{path}}", handler(function(request, response, params) {
            console.log(params);
            response.not_found();
        })]
    ]
};

server.start(config);
