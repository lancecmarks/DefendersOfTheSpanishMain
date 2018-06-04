var Defenders = Defenders || {};

Defenders.PreloadState = {
    preload: function() {
        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5);

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5);
        //function that uses sprite as a load bar
        this.load.setPreloadSprite(this.preloadBar);


        //game assets
        this.load.image('screen_main', 'assets/images/splash_defenders_rules.png')
        this.load.image('level_defenders01', 'assets/images/level_defenders01.png');
        this.load.spritesheet('pirate01', 'assets/images/pirate01.png', 32, 32, 4);
        this.load.spritesheet('pirate02', 'assets/images/pirate02.png', 32, 32, 4);
        this.load.spritesheet('pirate03', 'assets/images/pirate03.png', 32, 32, 4);
        this.load.image('buildsite01', 'assets/images/BuildSite01.png');
        this.load.image('castle', 'assets/images/defenders_castle02.png');
        this.load.spritesheet('tower01', 'assets/images/Tower01.png', 32, 32, 3);
        this.load.spritesheet('tower02', 'assets/images/Tower02.png', 32, 32, 3);
        this.load.spritesheet('tower03', 'assets/images/Tower03.png', 32, 32, 3);
        this.load.spritesheet('button_tower01', 'assets/images/button_tower01.png');
        this.load.spritesheet('button_tower02', 'assets/images/button_tower02.png');
        this.load.spritesheet('button_tower03', 'assets/images/button_tower03.png');
        this.load.image('bullet', 'assets/images/bullet.png');

        //level data
        this.load.text('level1', 'assets/data/level01.json');

    },
    create: function() {
        this.state.start('HomeState');
    }
};