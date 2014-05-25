// Socket connection
var io = require('socket.io-client');
var socket = io.connect(location.origin);

// Game and Player
var Game = require('crtrdg-gameloop');
var Player = require('./Player.js');


// Init

var game = new Game({
  canvasId: 'game',
  backgroundColor: '#eee'
});

var me = new Player(game.width / 2, game.height / 2);

me.addTo(game);

var playersCount = 1;

// hash with ids as keys, we simply set us as 0
var players = {
  0: me
};

// Networks etmits

socket.emit('join', {position: me.position, movement: me.movement, color: me.color});

me.on('change', function (data) {
  socket.emit('change', {position: data.position, movement: data.movement});
});

// Network events

socket.on('change', function (data) {
  var player = players[data.id];

  if (player) {
      player.update(data);
  }
})

socket.on('join', function (data) {
  var newPlayer = new Player();
  newPlayer.update(data);
  players[data.id] = newPlayer;
  playersCount++;
  player.addTo(game);
});

socket.on('players', function (data) {
  // initial players info
  console.dir(data);
  for (id in data) {
    var info = data[id];
    var player  = new Player();
    player.update(info);
    players[info.id] = player;
    playersCount++;
    player.addTo(game);
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
  context.fillText(playersCount + ' online', 10, 30);
});
