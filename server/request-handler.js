
// var data = {};
// data.results = [];
// var getData = function(request, response) {
//   return JSON.stringify(data);
// };
// var postRequest = function(request, response) {
//   request.on('data', function(buffer) {
//     data.results.push(JSON.parse(buffer.toString()));
//   });
//   return {
//     statusCode: 201
//   }
// }
var requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  var parsedURL = request.url.slice(1).split('/');

  if(parsedURL[0] === 'classes') {
    if (request.method == 'GET') {


    }
    else if (request.method == 'POST') {

    }
  }
  else {
    statusCode = 404;
  }

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify({results: []}));
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;
