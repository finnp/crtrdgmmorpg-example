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

function Player(id, x, y) {
    this.id = id;
    this.position = new Vector2(x, y);

    this.size = {
      x: 10,
      y: 10
    };

    this.velocity = 4; // base speed not current
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

var players = [me];

socket.on('change', function (data) {
  console.log('change');

  var player = players.filter(function (player) {
    return player.id === data.id;
  })[0];

  if (player) {
    // Update player
    player.position.x = data.pos.x;
    player.position.y = data.pos.y;
    player.movement.x = data.mov.x;
    player.movement.y = data.mov.y;
  } else {
    // Create player
    var newPlayer = new Player(data.id, data.pos.x, data.pos.y);
    newPlayer.movement.x = data.mov.x;
    newPlayer.movement.y = data.mov.y;
    players.push(newPlayer);
  }

})

me.on('update', function (interval) {
    this.controller(); // When keys are pressed
});

game.on('update', function () {
  players.forEach(function (player) {
    player.position.add(player.movement);
  });
});

game.on('draw', function(context){
  context.fillStyle = '#fff';
  players.forEach(function (player) {
    context.fillRect(player.position.x, player.position.y, player.size.x, player.size.y);
  });
});
