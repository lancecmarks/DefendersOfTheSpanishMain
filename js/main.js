//Create Defenders namespace
var Defenders = Defenders || {};

Defenders.game = new Phaser.Game(640, 480, Phaser.AUTO);

Defenders.game.state.add('GameState', Defenders.GameState);
Defenders.game.state.add('HomeState', Defenders.HomeState);
Defenders.game.state.add('PreloadState', Defenders.PreloadState);
Defenders.game.state.add('BootState', Defenders.BootState);
Defenders.game.state.start('BootState');