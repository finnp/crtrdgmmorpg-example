var io = require('socket.io-client');

var socket = io.connect(location.origin);

var Game = require('crtrdg-gameloop');
var Arrows = require('crtrdg-arrows');
var Entity = require('crtrdg-entity');
var Vector2 = require('vector2-node'); // http://rahatarmanahmed.github.io/vector2-node/docs/index.html

var inherits = require('inherits');

var game = new Game({
  canvasId: 'game',
  width: 800,
  height: 400,
  backgroundColor: '#ff1f1f'
});

var arrows = new Arrows();

inherits(Player, Entity);

function Player(x, y) {
    this.position = new Vector2(x, y);

    this.size = {
      x: 10,
      y: 10
    };

    this.velocity = 0.25; // base speed not current
    this.movement = new Vector2(0, 0); // length of the vector is the speed
}

Player.prototype.controller = function () {

  var dx = arrows.isDown('right') - arrows.isDown('left');
  var dy = arrows.isDown('down') - arrows.isDown('up');
  var movement = new Vector2(dx, dy);
  if (movement.length() > 0) {
    movement.normalize();
  }
  movement.scale(this.velocity);
  if(!movement.equals(this.movement)) {
    this.movement = movement;
    socket.emit('change', {pos: this.position, mov: this.movement});
  }

}

var me = new Player(0, 10, 10);
me.addTo(game);

var players = {
  0: me
}; // hash with ids as keys, we set us to 0
socket.emit('join', {pos: me.position, mov: me.movement});


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
  var newPlayer = new Player(data.pos.x, data.pos.y);
  newPlayer.movement.x = data.mov.x;
  newPlayer.movement.y = data.mov.y;
  players[data.id] = newPlayer;
});

socket.on('players', function (data) {
  // initial players info
  for (id in data) {
    var info = data[id];
    var player  = new Player(info.pos.x, info.pos.y);
    player.movement.x = info.mov.x;
    player.movement.y = info.mov.y;
    players[info.id] = player;
  }
})

socket.on('leave', function (id) {
  delete players[id];
})

me.on('update', function (interval) {
    this.controller(); // When keys are pressed
});

game.on('update', function (interval) {
  for (id in players) {
    var player = players[id];
    player.position.add(player.movement.clone().scale(interval));
  }
});

game.on('draw', function(context){
  context.fillStyle = '#fff';
  for (id in players) {
    var player = players[id];
    context.fillRect(player.position.x, player.position.y, player.size.x, player.size.y);
  }
});
