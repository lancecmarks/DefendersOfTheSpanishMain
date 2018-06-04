var Defenders = Defenders || {};

Defenders.Bullet = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'bullet');

    this.anchor.setTo(0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    
};

Defenders.Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Defenders.Bullet.prototype.constructor = Defenders.Enemy;
