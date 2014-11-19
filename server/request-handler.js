var utils = require('./utils');
var fs = require('fs');

var objectId = 0;
var messages = [];
var chunkData = {results: messages}

var readable = fs.createReadStream('data.json');
readable.on('readable', function(){
  console.log("Ready to read");
});

readable.on('data', function(data) {
  var _chunk = JSON.parse(data.toString());
  for (var i = 0; i < _chunk.results.length; i++) {
    chunkData.results.push(_chunk.results[i]);
  }
});

readable.on('end', function() {
  console.log("Data read.");
});

var storeData = function(data) {
  var wstream = fs.createWriteStream('data.json');
  wstream.write(JSON.stringify(data));
  wstream.end();
}

var actions = {
  'GET': function(request, response){
    storeData(chunkData);
    utils.sendResponse(response, chunkData);
  },
  'POST': function(request, response){
    utils.collectData(request, function(message){
      message.objectId = ++objectId;
      storeData(chunkData);
      messages.push(message);
      utils.sendResponse(response, {objectId: objectId});
    });
  },
  'OPTIONS': function(request, response){
    utils.sendResponse(response);
  }
};

module.exports = function(request, response) {
  var action = actions[request.method];
  if( action ){
    action(request, response);
  } else {
    utils.sendResponse(response, "Not Found", 404);
  }
};







