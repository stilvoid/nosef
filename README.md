# nosef - A set of nice wrapper functionality for quickly building web services

## About

Nosef provides a couple of useful functions that wrap up some of the node http functionality and provide a simple mechanism for building web applications.

There are three main features:

### The server

A nosef server simply listens on the chosen address and port for HTTP requests and calls handler functions based on URL patterns

## Handlers

A handler is a function that takes a request, a response, and a parameters object as it's arguments. Nosef adds some convenience functions to the response object and parses GET, POST, and file upload data into the parameters object to save on the gruntwork.

## Templates

Nosef includes a simple system for reading and caching template files and then merging data into them before sending the result out to the client.

If you had a file called hello.txt that looked like this:

    Hello {{name}}

And a handler that looked like this:

    var hello_handler = handler(function(request, response, params) {
        response.template("hello.txt", params);
    })

And some URL rules that looked like this:

    var urls = [
        ["/hello/{name}", hello_handler
    ];

You could start a nosef server and visit http://server_address:port/hello/world to see "Hello world"

## Copying

See the COPYING file for more information

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

See the examples folder for more examples
