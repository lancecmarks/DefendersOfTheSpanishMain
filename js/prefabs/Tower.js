var Defenders = Defenders || {};

Defenders.Tower = function(game, x, y , key, bullets, enemies) {
    Phaser.Sprite.call(this, game, x, y, key);

    this.game = game;

    this.armorPiercing = 0;
    this.damageOut = 5;
    this.scale.setTo = 2;
    this.firingRange = 50;
    this.splashDamage = 0;

    this.isAttacking = false;

    this.animations.add('attacking', [1, 2, 1, 2, 1], 2, false);
    this.anchor.setTo(0.5);

    this.bullets = bullets;

    this.enemies = enemies;

    this.towerTimer = this.game.time.create(false);
    this.towerTimer.start();

    this.enemyInRange = false;

};

Defenders.Tower.prototype = Object.create(Phaser.Sprite.prototype);
Defenders.Tower.prototype.constructor = Defenders.Tower;

Defenders.Tower.prototype.update = function () {
    this.enemies.forEach(function(enemy) {
        //console.log("in update loop");
        this.enemy = enemy;
        if(Math.abs(this.x - this.enemy.x) < 90 && Math.abs(this.y - this.enemy.y) < 90) {
            //console.log("there is an enemy close to tower");
            //Set range variable to true and call the shooting timer helper function
            this.scheduleHelper(this.enemy);
        }
    }, this);
};

Defenders.Tower.prototype.reset = function(x, y, key) {
    Phaser.Sprite.prototype.reset.call(this, x, y);

    this.loadTexture(key);

    if(key == 'tower01') {
        this.armorPiercing = 0;
        this.damageOut = 5;
        this.scale.setTo = 2;
        this.firingRange = 50;
    }
    if(key == 'tower02') {
        this.armorPiercing = 1;
        this.damageOut = 10;
        this.scale.setTo = 2.5;
        this.firingRange = 70;
    }
    if(key == 'tower03') {
        this.armorPiercing = 0;
        this.damageOut = 15;
        this.scale.setTo = 2;
        this.firingRange = 80;
        this.splashDamage = 1;
    }
};

Defenders.Tower.prototype.shoot = function(enemyShoot) {
    //console.log(this);
    //console.log(this.enemy);
    var bullet = this.bullets.getFirstExists(false);
    var enemyAlive = enemyShoot.alive;
    if (enemyAlive) {
        if (!bullet) {
            bullet = new Defenders.Bullet(this.game, this.position.x, this.position.y);
            this.bullets.add(bullet);
        } else {
            bullet.reset(this.position.x + 16, this.position.y + 16);
        }
        var bulletMovement = this.game.add.tween(bullet);
        bulletMovement.to({x: enemyShoot.position.x, y: enemyShoot.position.y + 16}, this.BULLET_SPEED);
        bulletMovement.onComplete.add(function() {
            //MAKE CHANGES IN DAMAGE BASED ON TOWER AND ENEMY
            if (this.armorPiercing) {
                var damage = this.damageOut;
                enemyShoot.damage(this.damageOut);
                console.log('piercing damgage: ' + damage + " health:" + enemyShoot.health);
            } else {
                var damage = this.damageOut - enemyShoot.armorBuff;
                console.log('tower damage: ' + this.damageOut);
                if (damage > 0 ) {
                    enemyShoot.damage(this.damageOut - enemyShoot.armorBuff);
                }
                console.log('non piercing damgage: ' + damage + " health:" + enemyShoot.health);
            }
            if (this.splashDamage) {
                //go through each enemy and calculate distance to this enemy
                //damage each enemy with in range a value based on proximity
                this.enemies.forEach(function(otherEnemy) {
                    if (enemyShoot != otherEnemy) {
                        //console.log('SPLASH!')
                        // x1, y1, x2, y2
                        var distance = this.game.math.distance(enemyShoot.x, enemyShoot.y, otherEnemy.x, otherEnemy.y);
                        console.log("distance between: " + distance);
                        if (distance < 100) {
                            var damage = (this.damageOut * (1 - distance/100)) - otherEnemy.armorBuff;
                            console.log('tower damage: ' + this.damageOut);
                            console.log('splash damage: ' + damage + " health:" + otherEnemy.health);
                            if (damage > 0) {
                                otherEnemy.damage(damage);
                            }
                        }
                    }
                }, this)
            }
            //kill bullet sprite
            bullet.kill();
        }, this);
        bulletMovement.start();
    } 

};

Defenders.Tower.prototype.scheduleShooting = function(enemyLocal) {
    var enemyHere = enemyLocal;
    var enemyHereInRange = false;
    if(this.game.math.distance(this.x, this.y, enemyHere.x, enemyHere.y) < this.firingRange) { 
        this.isAttacking = true;
        enemyHereInRange = true;
    }

    if(enemyHere.alive && enemyHereInRange) {
        //console.log("scheduling a shot");
        //Play attacking animation
        this.play('attacking');
        this.shoot(enemyHere);
        this.towerTimer.add(Phaser.Timer.SECOND * 1, this.scheduleShooting, this, enemyHere);
    } else {
        this.frame = 0;
        this.isAttacking = false;
    }

};

Defenders.Tower.prototype.scheduleHelper = function(enemy) {
    var enemyLocal = enemy;
    var enemyLocalInRange = false;
    if(this.game.math.distance(this.x, this.y, enemyLocal.x, enemyLocal.y) < this.firingRange) { 
        enemyLocalInRange = true;
    }
    if(enemyLocalInRange && !this.isAttacking) {
        this.scheduleShooting(enemyLocal);
    } 
}