const Game = require('./GameArea');

const canvas = document.createElement("canvas");
document.body.insertBefore(canvas, document.body.childNodes[0]);

const game = new Game(canvas);

game.init();

game.start();