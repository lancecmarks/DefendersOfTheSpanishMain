var Defenders = Defenders || {};

Defenders.HomeState = {
    init: function(message) {
        this.message = message;
    },
    create: function() {
        var background = this.add.sprite(0,0, 'screen_main');
        background.inputEnabled = true;

        background.events.onInputDown.add(function(){
            this.state.start('GameState');
        }, this);

        var style = {font: '20px Arial', fill: '#ff0'};

        if(this.message) {
            this.game.add.text(210, this.game.world.centerY + 60, this.message, style);
        }
    }
};