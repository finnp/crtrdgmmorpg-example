var inherits = require('inherits');
var Vector2 = require('vector2-node');
var Entity = require('crtrdg-entity');
var Arrows = require('crtrdg-arrows');

var arrows = new Arrows();
var Color = require('color');

module.exports = Player;
inherits(Player, Entity);


function Player(x, y) {
    this.position = new Vector2(x, y);

    this.color = new Color({h: Math.random() * 360, s: 63, l: 35}).hexString();

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
    this.emit('change', {pos: this.position, mov: this.movement});
  }

}
