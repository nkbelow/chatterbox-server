/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var http = require('http');

var storageArray = [{ 
  ObjectId: '00000000001',
  createdAt: 1,
  username: 'Fred',
  messages: 'Get me coffee',
  room: 'lobby'
}, { 
  ObjectId: '00000000002',
  createdAt: 2,
  username: 'FredsEvilTwin',
  messages: 'Get me donuts',
  room: 'lobby'
}];

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // See the note below about CORS headers.
  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };
  var headers = defaultCorsHeaders;

  var statusCode = 200;

  var JSONresults = {
    path: request.url,
    method: request.method,
    results: []
  };

  if (request.method === 'GET') {
    if (request.url === '/classes/messages') {
      statusCode = 200;

      JSONresults.results = storageArray;
      JSONresults.headers = headers;
      response.writeHead(statusCode, {'Content-Type': 'application/json'});
      console.log(JSON.stringify(JSONresults));
      response.end(JSON.stringify(JSONresults));  
      //fill out
    } else {
      statusCode = 404;
      response.writeHead(statusCode, {'Content-Type': 'html/text'});
      response.end();
    }
  } else if (request.method === 'POST') {
    if (request.url === '/classes/messages' || request.url === '/classes/room') {
      statusCode = 201;

      //add data to storage array
        //parse request for JSON data
        //add JSON data to out storage array
      body = [];
      request.on('error', function(err) {
        console.error(err);
      }).on('data', function(chunk) {
        body.push(chunk);
      }).on('end', function() {
        body = JSON.parse(Buffer.concat(body).toString());
        JSONresults.headers = headers;
        response.writeHead(statusCode, {'Content-Type': 'application/json'});
        console.log(body);
        storageArray.unshift(body);
        response.end();
      });
    } else {
      statusCode = 404;
      response.writeHead(statusCode, {'Content-Type': 'html/text'});
      response.end();
    }
  }
};
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;


