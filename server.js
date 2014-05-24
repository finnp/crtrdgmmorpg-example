var http = require('http');
var send = require('send');

var app = http.createServer(function(req, res){
  console.log(req.url);
  send(req, req.url, {root: __dirname}).pipe(res);
})

var io = require('socket.io').listen(app);

var port = process.env.PORT || 5000;
app.listen(port);

// This example server simply takes the player movements and positions and broadcasts them

io.sockets.on('connection', function (socket) {
  socket.on('change', function (data) {
    data.id = socket.id;
    socket.broadcast.emit('change', data);
  });
});
