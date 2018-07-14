// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

//Instantiating servers

var Server = http.createServer(function(req,res) {
    var parsedUrl = url.parse(req.url,true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, "");

    var queryStringObject = parsedUrl.query;

    var method = req.method.toLowerCase();

    var headers = req.headers;

    var decoder = new StringDecoder('utf-8');
    var buffer ='';
    req.on('data',function (data) {
            buffer +=decoder.write(data);
    });

    req.on('end',function () {

        buffer += decoder.end();
        var choosenHandler = typeof(routers[trimmedPath]) !== 'undefined' ? routers[trimmedPath] : handlers.notFound;

        var data = {
            'trimmedPath' : trimmedPath,
            'method' : method,
            'queryStringObject' : queryStringObject,
            'headers' : headers,
            'payload' : buffer
        }

        choosenHandler(data,function(statusCode,payload) {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            var payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type' , ' application/json');

            res.writeHead(statusCode);

            res.end(payloadString);

            console.log(trimmedPath,statusCode);
        });

    });
});

//listening through 3030 in httpPort

Server.listen(3030,function() {
    console.log("Srever is up and running in port 550");
})


var handlers = {};

handlers.hello = function (data,callback) {
    callback(403,{'hello there!' : 'you\'re welcomed'});
};

handlers.notFound = function(data,callback) {
    callback(404,{'1':'page not found'});
}

var routers = {
    'hello' : handlers.hello
}
