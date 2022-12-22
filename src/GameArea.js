const Ship = require('./Ship');
const Alien = require('./Alien');
const Controls = require('./Controls');
const Missile = require('./Missile');
const Bomb = require('./Bomb');

class GameArea {
    #width = 480;
    #height = 480;

    #ship;
    #aliens = [];
    #bombs = [];
    #missiles = [];
    #controls;

    #speed;
    #alienMoveLatch;

    #context;
    #canvas;

    #level = 1;
    #score = 0;
    #sounds = {
        shoot: () => (new Audio('shoot.mp3')).play(),
        alien: () => (new Audio('alien.wav')).play(),
        kill: () => (new Audio('killed.mp3')).play(),
        dead: () => (new Audio('dead.mp3')).play()
    }

    constructor(canvas) {
        this.#canvas = canvas;
        this.#context = canvas.getContext("2d");

        const scaleFactor = Math.min(window.innerHeight / this.#height, window.innerWidth / this.#width) - 0.1;
    
        this.#canvas.width = this.#width * scaleFactor;
        this.#canvas.height = this.#height * scaleFactor;
        
        this.#context.scale(scaleFactor, scaleFactor);
    };

    init() {
        this.#controls = new Controls();
        this.#ship = new Ship(this.#controls);
        this.#primeAliens();

        this.#ship.addEventListener('fire', (event) => this.#fireMissile(event.detail));
    };

    #resetAlienMoveLatch() {
        this.#speed += Math.floor(this.#speed / 20);
        this.#alienMoveLatch = 100 - this.#speed;
    };

    #primeAliens() {
        this.#speed  = 10 + (this.#level * 3);
        for (let count = 0; count < 40; count++) {
            const row = Math.floor(count/10);
            const pos = ((count/10) - Math.floor(count/10)) *10;
            const alien = new Alien(pos, row, this.#speed);
            alien.addEventListener('bomb', (event) => this.#dropBomb(event.detail));
            this.#aliens.push(alien);  
        }
        this.#resetAlienMoveLatch();
    };


    #fireMissile({ x, y}) {
        this.#missiles.push(new Missile(x, y));
        this.#sounds.shoot();
    };

    #dropBomb({ x, y }) {
        this.#bombs.push(new Bomb( x, y, this.#speed /10));
    };

    #gameOverDisplay() {
        this.#drawBackground();
        this.#drawDisplay();
        this.#context.fillStyle = "white";
        this.#context.font = '100px Consolas';
        this.#context.fillText('Game', 100, 180);
        this.#context.fillText('Over!', 100, 300);
    };

    #drawBackground() {
        this.#context.clearRect(0, 0, this.#width, this.#height);
        this.#context.fillStyle = '#000000';
        this.#context.fillRect(0, 0, this.#width, this.#height);
    };
    
    #drawDisplay() {
        this.#context.fillStyle = "white";
        this.#context.font = '20px Consolas';
        this.#context.fillText(`Level ${this.#level}`, 100, 20);
        this.#context.fillText(`Score ${this.#score}`, 200, 20);
    };

    #inPlay(obj) {
        const { top, bottom, left, right } = obj.getLocation();
        return !(
            top > this.#height ||
            bottom < 0 ||
            left < 0 ||
            right > this.#width
        );
    }

    #collide(obj1, obj2) {
        const obj1Location = obj1.getLocation();
        const obj2Location = obj2.getLocation();

        return !(
            (obj1Location.top > obj2Location.bottom) ||
            (obj1Location.bottom < obj2Location.top) ||
            (obj1Location.left > obj2Location.right) ||
            (obj1Location.right < obj2Location.left)
        );
    };

    start() {
        this.#gameTick();
    };

    #gameTick() {
        let gameOver = false;

        this.#drawBackground();
        this.#alienMoveLatch--;

        this.#ship.move();
        this.#aliens = this.#aliens.filter(alien => {
            const hit = this.#missiles.findIndex(missile => this.#collide(missile, alien));
            if (hit >=0 ) {
                this.#missiles.splice(hit, 1);
                this.#score += this.#level;
                this.#sounds.kill();
                return false;
            }
            gameOver = gameOver || alien.getLocation().bottom > 460 || this.#collide(alien, this.#ship);

            if (this.#alienMoveLatch < 0) alien.move();
            
            return true;
        });
        if (this.#alienMoveLatch < 0) {
            this.#sounds.alien();
            this.#resetAlienMoveLatch();
        }

        this.#bombs = this.#bombs.filter(bomb => {
            gameOver = gameOver || this.#collide(bomb, this.#ship);
            bomb.move();
            return this.#inPlay(bomb);
        });
        this.#missiles = this.#missiles.filter( missile => {
            missile.move();
            return this.#inPlay(missile);
        });



        this.#ship.draw(this.#context);
        this.#aliens.forEach(alien => alien.draw(this.#context));
        this.#bombs.forEach(bomb => bomb.draw(this.#context));
        this.#missiles.forEach(missile => missile.draw(this.#context));

        this.#drawDisplay();

        if (gameOver) {
            this.#sounds.dead();
            window.requestAnimationFrame(() => this.#gameOverDisplay());
        } else {
            if (this.#aliens.length === 0) {
                this.#level++;
                this.#missiles = [];
                this.#bombs = [];
                this.#primeAliens();
            }
            window.requestAnimationFrame(() => this.#gameTick());
        }
        
    }

}

module.exports = GameArea;