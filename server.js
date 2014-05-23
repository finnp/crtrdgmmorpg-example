var http = require('http');
var send = require('send');
var app = http.createServer(function(req, res){
  console.log(req.url);
  send(req, req.url, {root: __dirname}).pipe(res);
})
var io = require('socket.io').listen(app);

var port = process.env.PORT || 5000; // Use the port that Heroku provides or default to 5000
app.listen(port);

// This example server simply takes the positions and broadcasts them to all clients

io.sockets.on('connection', function (socket) {

  socket.on('position', function (position) {
    socket.broadcast.emit('position', {pos: position, id: socket.id});
  });



  // Echo for testing
  socket.on('echo', function (data) {
    socket.emit('echo', data);
  });
});
