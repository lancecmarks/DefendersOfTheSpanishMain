var Defenders = Defenders || {};

Defenders.BootState = {
    init: function() {
        //screen settings are here so that the loading screens are also responsive
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
    },
    preload: function() {
        this.load.image('preloadBar', 'assets/images/defenders_bar.png');
        this.load.image('logo', 'assets/images/defenders_logo.png');
    },
    create: function() {
        this.game.stage.backgroundColor = '#000';

        this.state.start('PreloadState');
    }
};