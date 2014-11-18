var _ = require('underscore');
var fs = require('fs');
//Data Storage
var messages = [];
var chunk = {results: messages};
var readable = fs.createReadStream('data.json');
//Setup readStream
readable.on('readable', function(){
  console.log("Ready to read");
});
//Read data
readable.on('data', function(data) {
  var _chunk = JSON.parse(data.toString());
  for (var i = 0; i < _chunk.results.length; i++) {
    chunk.results.push(_chunk.results[i]);
  }
});
readable.on('end', function() {
  console.log("Data read.");
});
var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  console.log(chunk.results);
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  //need to get rid of messages eventually
  //replace with the data txt;
  var parsedURL = request.url.slice(1).split('/');
  if (request.method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    return response.end();
  }
  if(parsedURL[0] === 'classes') {
    if (request.method === 'GET') {

      var wstream = fs.createWriteStream('data.json');
      wstream.write(JSON.stringify(chunk));
      wstream.end();

      response.writeHead(statusCode, headers);
      response.end(JSON.stringify(chunk));
    }
    else if (request.method === 'POST') {
      statusCode = 201;
      var body = '';
      request.on('data', function(chunk) {
        body += chunk;
      });
      request.on('end', function() {
        var wstream = fs.createWriteStream('data.json');
        wstream.write(JSON.stringify(chunk));
        wstream.end();
        var post = JSON.parse(body);
        _.extend(post, {createdAt: new Date()});
        messages.push(post);
        // End this resspone after we've added the message
        response.writeHead(statusCode, headers);

        response.end(JSON.stringify(chunk));
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
