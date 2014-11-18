var _ = require('underscore');

var fs = require('fs');


var messages = [];
var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  var chunk = {results: messages};
  //need to get rid of messages eventually
  //replace with the data txt;
  var parsedURL = request.url.slice(1).split('/');
  if (request.method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    return response.end();
  }
  if(parsedURL[0] === 'classes') {
    if (request.method === 'GET') {
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(chunk));
      var wstream = fs.createWriteStream('data.txt');
      wstream.write(JSON.stringify(chunk));
      wstream.end();
    }
    else if (request.method === 'POST') {
      statusCode = 201;
      var body = '';
      request.on('data', function(chunk) {
        body += chunk;
      });
      request.on('end', function() {
        var wstream = fs.createWriteStream('data.txt');
        wstream.write(JSON.stringify(chunk));
        wstream.end();
        var post = JSON.parse(body);
        _.extend(post, {createdAt: new Date()});
        messages.push(post);
        // End this resspone after we've added the message
        response.writeHead(statusCode, headers);
        response.end();
      });
    }
  }
  else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;
