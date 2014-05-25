// Socket connection
var io = require('socket.io-client');
var socket = io.connect(location.origin);

// Game and Player
var Game = require('crtrdg-gameloop');
var Player = require('./Player.js');


// Init

var game = new Game({
  canvasId: 'game',
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#eee'
});

var me = new Player(0, 10, 10);

me.addTo(game);

var playersCount = 1;
var chatBoxText = '';
// hash with ids as keys, we simply set us as 0
var players = {
  0: me
};

// Networks etmits

socket.emit('join', {pos: me.position, mov: me.movement, color: me.color});

me.on('change', function () {
  socket.emit('change', {pos: this.position, mov: this.movement});
});

// Network events

socket.on('change', function (data) {
  var player = players[data.id];

  if (player) {
      // Update player
    player.position.x = data.pos.x;
    player.position.y = data.pos.y;
    player.movement.x = data.mov.x;
    player.movement.y = data.mov.y;
  }


})

socket.on('join', function (data) {
  console.dir(data);
  var newPlayer = new Player(data.pos.x, data.pos.y);
  newPlayer.movement.x = data.mov.x;
  newPlayer.movement.y = data.mov.y;
  newPlayer.color = data.color;
  players[data.id] = newPlayer;
  playersCount++;
});

socket.on('players', function (data) {
  // initial players info
  console.dir(data);
  for (id in data) {
    var info = data[id];
    var player  = new Player(info.pos.x, info.pos.y);
    player.movement.x = info.mov.x;
    player.movement.y = info.mov.y;
    player.color = info.color;
    players[info.id] = player;
    playersCount++;
  }
})

socket.on('leave', function (id) {
  playersCount--;
  delete players[id];
})


// Game Updates

game.on('update', function (interval) {
  for (id in players) {
    var player = players[id];
    player.position.add(player.movement.clone().scale(interval));
  }
});


me.on('update', function (interval) {
    this.controller(); // When keys are pressed
});

// Game Draw

game.on('draw', function(context){
  // draw players
  for (id in players) {
    var player = players[id];
    context.fillStyle = player.color;
    context.fillRect(player.position.x, player.position.y, player.size.x, player.size.y);
  }
  // draw player count
  context.fillStyle = '#444';
  context.font = '20px Arial';
  context.fillText(playersCount + ' online',10,30);
});
