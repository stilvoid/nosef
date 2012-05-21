var nosef = require("../");

var bar_handler = nosef.handler(function(request, response, params) {
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
    };

    response.file_template("templates/foo.txt", content, "text/plain");
});

var config = {
    port: 8765,
    urls: [
        ["{{path}}", bar_handler]
    ]
};

var server = nosef.server.start(config);

server.on("start", function() {
    console.log("Server started");
});
