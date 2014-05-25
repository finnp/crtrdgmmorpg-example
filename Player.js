var inherits = require('inherits');
var Vector2 = require('vector2-node');
var Entity = require('crtrdg-entity');
var Arrows = require('crtrdg-arrows');

var arrows = new Arrows();
var Color = require('color');

module.exports = Player;
inherits(Player, Entity);


function Player(x, y) {
    this.position = new Vector2(x || 0, y || 0);

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
    this.emit('change', this);
  }
}

Player.prototype.update = function (data) {
  for (key in data) {
    // We don't want to override Vector objects
    // Maybe we could do a recursive nested objects update? (Module?)
    if (['movement', 'position'].indexOf(key) > -1) {
      this[key].x = data[key].x;
      this[key].y = data[key].y;
    } else {
      this[key] = data[key];
    }
  }
}
