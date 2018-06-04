var Defenders = Defenders || {};

Defenders.GameState = {
    init: function(currentLevel) {
        //screen settings are here so that the loading screens are also responsive
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.PLAYER_SPEED = 10;
        this.FIRING_RATE = 1.5;
        this.BULLET_SPEED = 30;
        this.CANNON_SPEED = 40;
        this.MORTAR_SPEED = 40;
        this.RIFLE_COST = 100;
        this.CANNON_COST = 200;
        this.MORTAR_COST = 300;
        this.LIFE = 20;
        this.GOLD = 400;
        this.WARNING = '';

        //LEVEL DATA
        this.numLevels = 1;
        this.currentLevel = currentLevel ? currentLevel : 1;
        console.log('current level:' + this.currentLevel);
    
    },
    preload: function() {

    },
    create: function() {
        this.background = this.game.add.sprite(0, 0, 'level_defenders01');
        this.background.inputEnabled = true;
        this.background.events.onInputDown.add(this.buildTower, this);


        //CREATE THE CASTLE
        this.castle = this.game.add.sprite(32, 256, 'castle');
        this.game.physics.arcade.enable(this.castle);
        this.castle.body.allowGravity = false;
        this.castle.body.immovable = true;
        this.castle.anchor.setTo(0.5);
        this.castle.scale.setTo(1);

        //INITIATE SPRITE POOLS
        this.initBullets();
        this.initTowers();
        this.initEnemies();

        //BUTTON STUFF
        this.createOnscreenControls();

        //CREATE THE ONSCREEN INFORMATION
        var styleScore = { font: '25px Arial', fill: '#FF0'};
        this.game.add.text(20, 30, 'Lives: ', styleScore);
        this.textLives = this.game.add.text(100, 30, this.LIFE, styleScore);
        this.game.add.text(20, 60, 'Gold: ', styleScore);
        this.textGold = this.game.add.text(100, 60, this.GOLD, styleScore);

        var styleCost = { font: '15px Arial', fill: '#FF0'};
        this.game.add.text(285, 435, this.RIFLE_COST, styleCost);
        this.game.add.text(325, 435, this.CANNON_COST, styleCost);
        this.game.add.text(365, 435, this.MORTAR_COST, styleCost);

        var styleWarning = { font: '35px Arial', fill: '#FF0'};
        this.textWarning = this.game.add.text(60, this.game.world.centerY, this.WARNING, styleWarning);

        //LOAD LEVEL
        this.loadLevel();

        //TIMER FOR GAME
        this.GameIsOver = 0;
        this.gameTimer = this.game.time.create(false);
        console.log("Level time: " + this.levelData.level_time);
        this.timeOfLevel = this.gameTimer.add(Phaser.Timer.SECOND * this.levelData.level_time, this.endTimer, this);
        this.gameTimer.start();
        console.log("Timer until end of game remainging: " + this.gameTimer.duration.toFixed(0));

        //CALL GAME OVER CHECK FUNCTION
        this.gameOver();

    },
    //executed multiple times per second
    update: function () {

        //check if enemy has made it to the castle
        this.enemies.forEach(function(enemy) {
            //console.log("in update loop");
            if(enemy.x <= 5 && enemy.alive) {
                this.deductLife(this.castle, enemy);
            }
        }, this);

    },
    onUp: function(sprite, event) {
        sprite.alpha = 1;
    },
    createOnscreenControls: function() {
        this.buttonTower01 = this.add.button(280, 400, 'button_tower01');
        this.buttonTower01.events.onInputDown.add(function(){
            this.buttonTower01.alpha = 0.3;
            this.selectedTower = 'tower01';
            this.uiBlocked = true;
        }, this);
        this.buttonTower01.events.onInputUp.add(this.onUp, this);

        this.buttonTower02 = this.add.button(320, 400, 'button_tower02');
        this.buttonTower02.events.onInputDown.add(function(){
            this.buttonTower02.alpha = 0.3;
            this.selectedTower = 'tower02';
            this.uiBlocked = true;
        }, this);
        this.buttonTower02.events.onInputUp.add(this.onUp, this);

        this.buttonTower03 = this.add.button(360, 400, 'button_tower03');
        this.buttonTower03.events.onInputDown.add(function(){
            this.buttonTower03.alpha = 0.3;
            this.selectedTower = 'tower03';
            this.uiBlocked = true;
        }, this);
        this.buttonTower03.events.onInputUp.add(this.onUp, this);
    },
    initTowers: function(){
        this.towers = this.add.group();
    },
    initEnemies: function() {
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
    },
    initBullets: function() {
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
    },
    buildTower: function(sprite, event) {
        var x = event.position.x;
        var y = event.position.y;
        
        if (this.deductGold(this.selectedTower)) {
            var tower = this.towers.getFirstExists(false);

            if(!tower) {
                tower = new Defenders.Tower(this.game, x, y, this.selectedTower, this.bullets, this.enemies);
                this.towers.add(tower);
            }
            else {
                tower.loadTexture(this.selectedTower);
                tower.reset(x, y);
                this.selectedTower = null;
            }
            tower.reset(x, y, this.selectedTower);
            this.selectedTower = null;
        }
        
        this.uiBlocked = false;
    },
    createEnemy: function(x, y, health, key, scale, speedX, speedY) {
        var enemy = this.enemies.getFirstExists(false);

        if(!enemy) {
            enemy = new Defenders.Enemy(this.game, x, y, key, health);
            this.enemies.add(enemy);
        }
        enemy.reset(x, y, health, key, scale, speedX, speedY);

    },
    deductLife: function(castle, enemy) {
        this.LIFE = this.LIFE - enemy.lifeLoss;
        this.textLives.text = this.LIFE;
        enemy.kill();
    },
    increaseGold: function(amount) {
        this.GOLD = this.GOLD + amount;
        this.textGold.text = this.GOLD;
    },
    deductGold: function(key) {
        var value = 0;
        var amount = 0;
        if (key == 'tower01' && this.GOLD >= 100) {
            value = 1;
            amount = this.RIFLE_COST;
        }
        if (key == 'tower02' && this.GOLD >= 200) {
            value = 1;
            amount = this.CANNON_COST;
        } 
        if (key == 'tower03' && this.GOLD >= 300) {
            value = 1;
            amount = this.MORTAR_COST; 
        }

        if (value) {
            this.GOLD = this.GOLD - amount;
            this.textGold.text = this.GOLD;
            return value;
        } else {
            return value;
        }
    },
    loadLevel: function() {
        //console.log('Inside the loadLevel()');
        this.levelData = JSON.parse(this.game.cache.getText('level' + this.currentLevel));

        this.currentWaveIndex = 0;
        this.currentEnemyIndex = 0;
        this.previousEnemyTime = 0;
        this.numberOfWaves = this.levelData.waves.length;

        //console.log('Wave ' + (this.currentWaveIndex + 1) + '  of ' + this.numberOfWaves + ' Incoming!');

        this.scheduleNextEnemy();
    },
    showWaveIncoming: function() {
        this.textWarning.text = 'Warning! Wave ' + (this.currentWaveIndex + 1) + ' of ' + this.numberOfWaves + ' Incoming!';

        this.clearWarningTimer = this.game.time.events.add(2000, function() {this.textWarning.text = '';}, this);
    },
    scheduleNextEnemy: function() {
        //console.log('Inside scheduleNextEnemy()');
        var duration = this.levelData.waves[this.currentWaveIndex].duration;
        //console.log("next enemy duration: " + duration);
        var nextEnemy = this.levelData.waves[this.currentWaveIndex].enemies[this.currentEnemyIndex];


        if(nextEnemy && !this.GameIsOver) {
            //console.log('There is a Next Enemy!');
            //NEED TO UPDATE THIS FUNCTION SO THAT ON A NEW WAVE IT DOES NOT ACCESS TIME OF ENEMY(-1) AND CRASH
            var nextTime = 1000 * ((duration + nextEnemy.time) - this.previousEnemyTime);
            
            this.nextEnemyTimer = this.game.time.events.add(nextTime, function() {
                //posx, posy, health, key, scale, speedx, speedy
                if (this.currentEnemyIndex == 0) {
                    this.showWaveIncoming();
                }
                this.createEnemy(nextEnemy.x, nextEnemy.y, nextEnemy.health, nextEnemy.key, nextEnemy.scale, nextEnemy.speedX, nextEnemy.speedY);

                this.currentEnemyIndex++;
                this.previousEnemyTime = duration + nextEnemy.time;
                this.scheduleNextEnemy();
            }, this);
        } else {
            //check for next wave
            //console.log('There is NOT a Next Enemy!')
            if(this.levelData.waves.length - this.currentWaveIndex - 1 && !this.GameIsOver) {
                //console.log('There is another Wave Incoming!')
                this.currentWaveIndex++;
                this.currentEnemyIndex = 0;
                this.scheduleNextEnemy();
            }
        }

    },
    endTimer: function() {
        var hamburger = 5;
    },
    changeState: function(state, message, score) {

        message = message + " \n" + score;
        console.log('Better be late in the game');

        this.gameStateChanger.add(Phaser.Timer.SECOND * 5, this.state.start(state, true, false), this);
    },
    gameOver: function() {
        if ((this.gameTimer.duration.toFixed(0) < 1) || this.LIFE <= 0) {
            this.GameIsOver = 1;
            var aliveCount = 0

            this.enemies.forEach(function(enemy) {
                //console.log("in update loop");
                if (enemy.alive)
                    aliveCount = aliveCount + 1;
                    enemy.destroy();

            }, this);
            console.log(aliveCount);
            if (this.LIFE > 0) {
                this.textWarning.text = '               YOU WON!!             ';
                message = "YOU WON";
            } else {
                this.textWarning.text = '               GAME OVER!             ';
                message = "YOU LOST";
            }
            var score =  ((((this.currentWaveIndex + 1)*10) - aliveCount) * 20 + this.GOLD) + ' points!';

            this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
                this.textWarning.text = 'You scored ' + score + ' points!';
            }, this);

            this.clearWarningTimer = this.game.time.events.add(Phaser.Timer.SECOND * 9, function() {this.textWarning.text = '';}, this);
            this.gameStateChanger = this.game.time.create(false);
            this.gameStateChanger.start();
            this.gameStateChanger.add(Phaser.Timer.SECOND * 8, this.changeState, this, 'HomeState', message, score);
            //this.state.start('HomeState', true, false, 'GAME OVER!');
        } else {
            this.game.time.events.add(Phaser.Timer.SECOND * 2, this.gameOver, this);
        }
    }

};