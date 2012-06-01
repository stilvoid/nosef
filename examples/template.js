var nosef = require("../");

function template_handler(request, response, params) {
    var content = {
        title: "Template test",
        error: {
            message: "Something went wrong"
        }
    };

    response.file_template("templates/template.html", content);
}

var config = {
    port: 8765,
    urls: [
        ["{{path}}", template_handler]
    ]
};

var server = nosef.server(config);

server.on("start", function() {
    console.log("Server started");
});
