var nosef = require("../");

var template_handler = nosef.handler(function(request, response, params) {
    var content = {
        title: "Template test",
        error: {
            message: "Something went wrong"
        }
    };

    response.file_template("templates/template.html", content);
});

var config = {
    port: 8765,
    urls: [
        ["{{path}}", template_handler]
    ]
};

var server = nosef.server.start(config, function() {
    console.log("Server started");
});
