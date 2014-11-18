var _ = require('underscore');
var messages = [];
var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  var data = {results: messages};

  var parsedURL = request.url.slice(1).split('/');

  if(parsedURL[0] === 'classes') {
    if (request.method === 'GET') {


    }
    else if (request.method === 'POST') {
      statusCode = 201;
      var content = '';
      request.on('data', function(data) {
        content += data;
      });
      request.on('end', function() {
        var post = JSON.parse(content);
        _.extend(post, {createdAt: new Date()});
        messages.push(post);
      });
    }
  }
  else {
    statusCode = 404;
  }

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;
