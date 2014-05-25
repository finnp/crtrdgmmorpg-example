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

var players = {};

io.sockets.on('connection', function (socket) {
  socket.on('change', function (data) {
    var player = players[socket.id];
    if (player) {
      for (key in data) {
        player[key] = data[key];
      }
      data.id = socket.id;
      socket.broadcast.emit('change', data);
    }
  });
  socket.on('join', function (data) {
    socket.emit('players', players);
    data.id = socket.id;
    players[socket.id] = data;
    socket.broadcast.emit('join', data);
  })
  socket.on('disconnect', function () {
    delete players[socket.id];
    socket.broadcast.emit('leave', socket.id);
  })
});
