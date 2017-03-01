var http = require('http');
var urlParse = require('url');
var queryString = require('querystring');
var storageArray = [{ 
  objectId: '00000000001',
  // createdAt: 1,
  username: 'Fred',
  text: 'Get me coffee'
}, { 
  objectId: '00000000002',
  // createdAt: 2,
  username: 'FredsEvilTwin',
  text: 'Get me donuts'
}];
objectIdCounter = 54;
var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
  'Content-Type': 'application/json'
};

var sendResponse = function(response, data, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var collectData = function(request, callback) {
  var body = '';
  // request.on('error', function(err) {
  //   console.error(err);
  // });
  request.on('data', function(chunk) {
    body += chunk;
  });
  request.on('end', function() {
    console.log(queryString.parse(body));
    callback(queryString.parse(body));

  });
};

var actions = {
  'GET': function(request, response) {
    var part = urlParse.parse(request.url);
    console.log(part.pathname);
    if (part.pathname !== '/classes/messages') {
      sendResponse(response, 'Not found', 404);
    } else {
      sendResponse(response, {results: storageArray});
    }
  },
  'POST': function(request, response) {
    var part = urlParse.parse(request.url);
    if (part.pathname !== '/classes/messages') {
      sendResponse(response, 'Not found', 404);
    } else {
      collectData(request, function(chat) {
        chat.objectId = (++objectIdCounter).toString();
        storageArray.unshift(chat);
        console.log(storageArray);
        sendResponse(response, {objectId: chat.objectId}, 201);
      });
    }
  },
  'OPTIONS': function(request, response) {
    sendResponse(response, null);
  }
};

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);


  var statusCode = 200;

  var JSONresults = {
    path: request.url,
    method: request.method,
    results: [],
    headers: headers
  };


  var action = actions[request.method];
  if (action) {
    action(request, response);
  } else {
    sendResponse(response, 'Not found', 404);
  }
};
//   if (request.method === 'GET') {
//     if (request.url === '/classes/messages') {
//       JSONresults.results = storageArray;
//       sendResponse(response, {results: JSONresults.results}, statusCode);
//     } else {
//       response.writeHead(404, {'Content-Type': 'application/json'});
//       response.end();
//     }
//   } else if (request.method === 'POST') {
//     if (request.url === '/classes/messages' || request.url === '/classes/room') {      
//     } else {
//       statusCode = 404;
//       response.writeHead(statusCode, {'Content-Type': 'html/text'});
//       response.end();
//     }
//   } else if (request.method === 'OPTIONS') {
//     sendResponse(response, null);
//   }
// };
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.

module.exports.requestHandler = requestHandler;


