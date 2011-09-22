var http = require('http').createServer(handler), 
    io = require('socket.io').listen(http), 
    fs = require('fs'),
    mongospy = require('./mongospy'),
    config = require('./config');


console.log('Spying on %s:%d/%s', config.mongo.host, config.mongo.port, config.mongo.database);
console.log('Listening on %s:%d', config.listen.host, config.listen.port);

http.listen(config.listen.port, config.listen.host);

function handler (req, res) {
  var url = req.url.split(/\?/)[0];
  switch(url) {
    case '/':
      sendClientScript(req, res);
      break;
  }
  res.statusCode = 404;
};

function sendClientScript(req, res) {
  fs.readFile(__dirname + '/client.js', 'utf8', function (err, data) {
    res.writeHead(200);
    data = data.replace(/#PATH#/g, 'http://' + config.listen.host + ':' + config.listen.port);
    data = data.replace(/#DATABASE#/g, config.mongo.database + '.');
    res.end(data);
  });  
}

var mongospy = new MongoSpy();
io.sockets.on('connection', function (socket) {
  mongospy.poll();
  mongospy.on('profiles', function(data) {
    socket.emit('profiles', data);
  });
  socket.on('disconnect', function() {
    mongospy.stopPolling();
  });
});

process.on('exit', cleanup);
process.on('uncaughtException', cleanupAndExit);
process.on('SIGINT', cleanupAndExit);

function cleanup() {
  mongospy.cleanup();
}
function cleanupAndExit(e) {
  cleanup();
  process.exit();
}