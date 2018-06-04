var Defenders = Defenders || {};

Defenders.Enemy = function(game, x, y, key, health) {
    Phaser.Sprite.call(this, game, x, y, key);

    this.game = game;

    this.anchor.setTo(0.5);
    this.scale.setTo(1,1);
    this.health = health;
    //console.log(this);

    this.enemyTimer = this.game.time.create(false);
    this.enemyTimer.start();

    this.generalDirection = 0;
    this.reward = 0;
    this.armor = 0;
    this.speedBuff = 1;
    this.lifeLoss = 1;
    
    //this.body.allowGravity = false;
    //this.enemy.body.velocity.x = -10;
    this.animations.add('walking', [1, 2, 3, 2, 1], 9, true);
    //this.enemy.play('walking');
    
};

Defenders.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Defenders.Enemy.prototype.constructor = Defenders.Enemy;

Defenders.Enemy.prototype.update = function() {
    //check enemy position and keep on path
    // Math.random() * (max - min) + min
    /*
    if (this.alive) {
        if (this.y < 265 && this.x < 250) {
            this.body.velocity.x = Math.random() * (-10);
            this.body.velocity.y = Math.random() * 10 + 10;
        }
        else if (this.y < 265 && this.x > 320) {
            this.body.velocity.x = Math.random() * (10);
            this.body.velocity.y = Math.random() * 10 + 10;
        }
        else if (this.y < 260) {
            this.body.velocity.x = Math.random() * 10 + 10;
            this.body.velocity.y = Math.random() * 10;
        }
        else if (this.y > 355) {
            this.body.velocity.x = Math.random() * 10 + 10;
            this.body.velocity.y = Math.random() * -10;
        }
    }
    */

    //moving the enemy for tower range function to stop firing
    if (!this.alive) {
        this.x = -10;
        this.y = -10;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
};

Defenders.Enemy.prototype.damage = function(amount) {
    //the prototype will kill sprite when health at zero
    Phaser.Sprite.prototype.damage.call(this, amount);
    //add damage animationA

    //move sprite off of the field 
    if (this.health <= 0) {
        this.x = -10;
        this.y = -10;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;

        //add money to player account
        //CHANGE THIS TO ENEMY.VALUE for different enemy amounts
        Defenders.GameState.increaseGold(this.reward);
        this.reward = 0;
    }
};

Defenders.Enemy.prototype.checkPosition = function() {
    if (this.alive) {
        if (this.y <= 250 && this.generalDirection != 270) {
            this.generalDirection = 270;
            this.body.velocity.y = Math.random() * 5 + 5 + this.speedBuff;
            this.body.velocity.x = Math.random() * 5;
        } 
        if (this.y > 265 && this.generalDirection != 180) {
            this.generalDirection = 180;
            this.body.velocity.y = Math.random() * -5;
            this.body.velocity.x = Math.random() * -5 - 5 - this.speedBuff;
        }

        if (this.generalDirection === 270) {
            if (this.x < 250) {
                this.body.velocity.x = Math.abs(this.body.velocity.x);
            }
            if (this.x > 300) {
                //set x to absolute
                this.body.velocity.x = Math.abs(this.body.velocity.x) * -1;
            }
        }

        if (this.generalDirection === 180) {
            if (this.y < 290) {
                this.body.velocity.y = Math.abs(this.body.velocity.y);
            }
            if (this.y > 320) {
                this.body.velocity.y = Math.abs(this.body.velocity.y) * -1;
            }
        }
        //Output the new velocities for troubleshooting
    }
    this.enemyTimer.add(Phaser.Timer.SECOND * 1, this.checkPosition, this);
    
};


Defenders.Enemy.prototype.reset = function(x, y, health, key, scale, speedX, speedY) {
    
    health = health + (5 * Defenders.GameState.currentWaveIndex);
    if (key == 'pirate03') {
        health = health * 1.2;
    }
    Phaser.Sprite.prototype.reset.call(this, x, y, health);

    this.loadTexture(key);
    this.scale.setTo(scale);
    this.body.velocity.x = speedX;
    this.body.velocity.y = speedY;
    this.generalDirection = 0;

    //set independent variables
    if(key == 'pirate01') {
        this.reward = 20;
        this.armorBuff = 0;
        this.speedBuff = 7;
        this.lifeLoss = 1;
    }
    if(key == 'pirate02') {
        this.reward = 30;
        this.armorBuff = 5;
        this.speedBuff = 3;
        this.lifeLoss = 2;
    }
    if(key == 'pirate03') {
        this.reward = 60;
        //smaller number less damage
        this.armorBuff = 10;
        this.speedBuff = 0;
        this.lifeLoss = 5;
    }

    this.checkPosition();
    this.play('walking');
};