# nosef

A set of nice wrapper functionality for quickly building web services

nosef requires [formidable][] which can be found via [npm](http://npmjs.org).

## About

Nosef provides a couple of useful functions that wrap up some of the node http functionality and provide a simple mechanism for building web applications.

There are three main features:

### The server

A nosef server simply listens on the chosen address and port for HTTP requests and calls handler functions based on URL patterns

To start a server, you call `nosef.server.start`.

    var nosef = require("nosef");
    var server = nosef.server.start(config);

server is an instance of node's HTTP server with one additional event: "start" which is emitted when the server is started

`config` is a configuration object of the following format:

    var config = {
        port: 8000, // Default: 80
        address: "127.0.0.1", // Default: "0.0.0.0"
        urls: [ // An array of arrays mapping URL patterns to handler functions
            ["/echo/{{path}}", echo_handler],
            ["/hello/{name}", hello_handler]
        ]
    };

URL patterns are strings with optional variables that match against the path requested by a client. e.g. If you visit `http://127.0.0.1:8000/echo/and/the/bunnymen/` in a browser, the path would be `/echo/and/the/bunnymen`.

Variables in URL patterns can take two forms:

* {name}
    * Treats the url as a file path and matches just one part, i.e. cannot contain a slash (`/`)
    * This could be used in designing an API: `/products/get/{id}`
    
* {{name}}
    * Matches any string including slashes
    * This can be used if you just want to match a pattern and capture all or part of it: `/docs/{{path}}`

## Handlers

A handler is a function that takes a request, a response, and a parameters object as it's arguments. Nosef adds some convenience functions to the response object and parses GET, POST, and file upload data into the parameters object to save on the gruntwork.

To create a handler, pass a function into `nosef.handler`.

    var echo_handler = nosef.handler(function(request, response, params) {
        response.write(params.path);
    });

### Params

The params object looks like:

    {
        url: {}, // Variables from the URL patterm
        get: {}, // Query string parameters
        post: {}, // POST parameters
        request: {}, // get and post values combined
        files: {} // A map of uploaded file names to file objects
    }

The file objects are created by [formidable][].

### Response

The extensions to the response object are:

* response.JSON(object)
    * Takes a javscript object and sends a JSON representation of it back to the client

* response.not_found(message)
    * Returns a 404 error to the client

* response.error(message, code)
    * Returns an HTTP error code back to the client with a message.
    * `code` is optional and defaults to 500

* response.template(template_string, content, content_type, escape_html)
    * Replace variables in `template_string` with values in `content` as per the description of templates below.
    * `content_type` is the content type string to return to the client along with the filled-in template; it defaults to "text/html"
    * If `escape_html` is true, values in `content` will have special HTML character (e.g. < and >) escaped as HTML entities (e.g. &lt; and &gt;).

* response.file_template(template_path, content, content_type, escape_html)
    * The same as `response.template` except that the template is loaded from `template_path` and cached (so it won't be loaded next time it's needed)

* response.redirect(redirect_url, permanent)
    * Sends an HTTP 302 (301 if `permanent` is true) to redirect the client to `redirect_url`

## Templates

Nosef includes a simple system for reading and caching template files and then merging data into them before sending the result out to the client.

Templates are used by calling `response.template` from within a handler. Variables passed to `response.template` should be stored in an object and can be retrieved in the template using some very simple notation:

Property names of the object passed in should not contains spaces.

### Variables

If you have a content object that looks like this:

    var content = {
        foo: "This is foo",
        bar: {
            stool: "A bar stool",
            bar: "Black sheep",
            things: {
                i: "eye",
                four: 4
            }
        },
        array: ["first", "second", "third"]
    }

You could use the following template to access them all:

    Foo is "{{foo}}"
    Bar:
        Stool: {{bar.stool}}
        Bar: {{bar.bar}}
        Things: {{bar.things.i}} and {{bar.things.four}}
    Array:
        {{array.0}}, {{array.1}}, and {{array.2}}

### Conditionals

There is also two very basic conditional blocks.

    {% if bar.stool %}There is a bar stool!{% endif %}

This checks that there is a variable called bar.stool and if so, displays the content.

    {% if not bar.stool %}There is no bar stool!{% endif %}

This does the opposite of 'if'.

## Copying

See the COPYING file for more information

## Example usage

    var nosef = require("nosef");

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

See the examples folder for more examples

[formidable]: https://github.com/felixge/node-formidable
