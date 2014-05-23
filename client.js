var io = require('socket.io-client');

var socket = io.connect('http://crtrdgmmorpg.herokuapp.com:80');

// connection test
socket.on('echo', function (data) {
  console.log(data);
});

socket.emit('echo', { the: 'test' });


var Game = require('crtrdg-gameloop');
var Arrows = require('crtrdg-arrows');
var Mouse = require('crtrdg-mouse');
var Entity = require('crtrdg-entity');
var aabb = require('aabb-2d');
var Vector2 = require('vector2-node'); // http://rahatarmanahmed.github.io/vector2-node/docs/index.html

var inherits = require('inherits');

var game = new Game({
  canvasId: 'game',
  width: 800,
  height: 400,
  backgroundColor: '#ff1f1f'
});

var arrows = new Arrows();
var mouse = new Mouse(game);

inherits(Player, Entity);

function Player(id, x, y) {
    this.id = id;
    this.position = new Vector2(x, y);

    this.size = {
      x: 10,
      y: 10
    };

    this.velocity = 4;

    this.box = aabb(
      [this.position.x, this.position.y],
      [this.size.x, this.size.y]
    );

}

// Direction: In Radiants from right counterclockwise
Player.prototype.controller = function (direction) {

  var dx = arrows.isDown('right') - arrows.isDown('left');
  var dy = arrows.isDown('down') - arrows.isDown('up');
  var movement = new Vector2(dx, dy);

  if (movement.length() > 0) {
    movement.normalize();
    this.position.add(movement.scale(this.velocity));
    socket.emit('position', this.position);
  }
}

var me = new Player(0, 10, 10);
me.addTo(game);

var players = [me];

socket.on('position', function (data) {

  var player = players.filter(function (player) {
    return player.id === data.id;
  })[0];

  if (player) {
    // Update player
    player.position.x = data.pos.x;
    player.position.y = data.pos.y;
  } else {
    // Create player
    var newPlayer = new Player(data.id, data.pos.x, data.pos.y);
    // i should also add them to the game maybe
    players.push(newPlayer);
  }

})


me.on('update', function (interval) {
  this.controller(); // When keys are pressed
});


game.on('update', function(interval){});

game.on('draw', function(context){
  context.fillStyle = '#fff';
  players.forEach(function (player) {
    context.fillRect(player.position.x, player.position.y, player.size.x, player.size.y);
  })
});

game.on('pause', function(){});

game.on('resume', function(){});
