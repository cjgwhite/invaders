const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

const gameArea = {
    width: 480,
    height: 480,
    keys: [],
    ship: null,
    aliens: [],
    bombs: [],
    missiles: [],
    level: 1,
    score: 0
};

class Missile {
    #x;
    #y;
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    };
    #shape = [
        {x: 3, y: 3},
        {x: 3, y: 10},
        {x: -3, y: 10},
        {x: -3, y: 3}
    ];
    getLocation() {
        return { left: this.#x -3, top: this.#y, right: this.#x + 3, bottom: this.#y + 10};
    };
    draw() {
        context.fillStyle = 'white';
        context.beginPath();
        context.moveTo(this.#x,this.#y);
        this.#shape.forEach(point => context.lineTo(this.#x + point.x, this.#y + point.y));
        context.fill();
    };
    move() {
        this.#y -= 4;
    };
}

class Alien {
    #x;
    #y;
    #shape;
    #width = 30;
    #height = 30;
    #direction = 1;
    #tick = 0;
    #speed;
    #countDown;
    #bombLatch;
    constructor(x,y, speed = 30) {
        this.#x = x;
        this.#y = y;
        this.#shape = new Image();
        this.#shape.src = `alien${y}.jpg`;
        this.#speed = speed;
        this.#resetCountdown();
        this.#resetBombLatch();
    };

    getLocation() {
        return { left: this.#getRealX(), top: this.#getRealY(), right: this.#getRealX() + this.#width, bottom: this.#getRealY() + this.#height };
    };

    #resetCountdown() {
        this.#countDown = 100 - this.#speed;
    }

    #resetBombLatch() {
        this.#bombLatch = Math.floor(Math.random() * (100 - this.#speed) );
    }

    #getRealX() {
        return 10+(40 * this.#x);
    };

    #getRealY() {
        return 10 +(this.#y * 40);
    }

    draw() {
        
        context.drawImage(
            this.#shape,
            this.#getRealX(),
            this.#getRealY(),
            this.#width, 
            this.#height
        );
    };

    move() {
        this.#countDown--;
        
        if (this.#countDown < 0) {
            this.#tick ++;
            if (this.#tick % 3 == 0) {
                this.#y ++;
                this.#direction = this.#direction * -1;
                if (this.#y > 11) this.#y = 0;
            } else {
                this.#x += this.#direction;
            }
            this.#resetCountdown();

            this.#bombLatch--;
            if (this.#bombLatch < 0) {
                this.#resetBombLatch();
                gameArea.bombs.push(new Bomb(this.#getRealX() + this.#width/2, this.#getRealY() + this.#height, this.#speed / 10));
            }
        }
    }

}

class Bomb {
    #x;
    #y;
    #speed;
    #shape = [
        {x: 3, y: -6},
        {x: -3, y: -6},
        {x: 0, y: 0},
        {x: -3, y: -6},
        {x: 3, y: -8},
        {x: -3, y: -10},
        {x: 3, y: -12},
        {x: -3, y: -14},
        {x: 3, y: -16},
        {x: -3, y: -18},
        {x: 3, y: -20},
    ];
    constructor(x,y,speed) {
        this.#x = x;
        this.#y = y;
        this.#speed = speed;
    }

    getLocation() {
        return { left: this.#x -5, top: this.#y, right: this.#x +5, bottom: this.#y+15 };
    };
    
    draw() {
        context.strokeStyle = 'red';
        context.beginPath();
        context.moveTo(this.#x, this.#y);
        this.#shape.forEach(point => context.lineTo(this.#x + point.x, this.#y + point.y));
        context.stroke();
    };

    move() {
        this.#y += this.#speed;
    };

}

class Ship {
    #x = 240;
    #y = 450;
    #fireLatch = true;
    #shape = [
        {x: 5, y: 5},
        {x: 15, y: 5},
        {x: 15, y: 15},
        {x: -15, y: 15},
        {x: -15, y: 5},
        {x: -5, y: 5}
    ];

    getLocation() {
        return { left: this.#x -5, top: this.#y, right: this.#x +5, bottom: this.#y+15 };
    };

    draw() {
        context.fillStyle = 'lightblue';
        context.beginPath();
        context.moveTo(this.#x,this.#y);
        this.#shape.forEach(point => context.lineTo(this.#x + point.x, this.#y + point.y));
        context.fill();
    };
    move() {
        if (gameArea.keys[37]) this.#x = Math.max(this.#x - 2, 0);
        if (gameArea.keys[39]) this.#x = Math.min(this.#x + 2, gameArea.width);
        if (gameArea.keys[32] && this.#fireLatch) this.#fire();
    };
    #fire() {
        gameArea.missiles.push(new Missile(this.#x, this.#y));
        this.#fireLatch = false;
        setTimeout(() => this.#fireLatch = true, 500);
    };
}

function init(context) {    
    const scaleFactor = Math.min(window.innerHeight / gameArea.height, window.innerWidth / gameArea.width) - 0.1;
    
    canvas.width = gameArea.width * scaleFactor;
    canvas.height = gameArea.height * scaleFactor;
    
    context.scale(scaleFactor, scaleFactor);
    document.body.insertBefore(canvas, document.body.childNodes[0]);

    window.addEventListener('keydown', function (event) {
        gameArea.keys = (gameArea.keys || []);
        gameArea.keys[event.keyCode] = true;
    });
    window.addEventListener('keyup', function (event) {
        gameArea.keys[event.keyCode] = false;
    });

    gameArea.ship = new Ship(240,450);
    primeAliens(20);
}

function primeAliens(speed) {
    for (let count = 0; count < 40; count++) {
        const row = Math.floor(count/10);
        const pos = ((count/10) - Math.floor(count/10)) *10;
        gameArea.aliens.push(new Alien(pos, row, speed));    
    }
}

function drawBackground() {
    context.clearRect(0, 0, gameArea.width, gameArea.height);
    context.fillStyle = '#000000';
    context.fillRect(0, 0, gameArea.width, gameArea.height);
}

function drawDisplay() {
    context.fillStyle = "white";
    context.font = '20px Consolas';
    context.fillText(`Level ${gameArea.level}`, 100, 20);
    context.fillText(`Score ${gameArea.score}`, 200, 20);
}

function collide(obj1, obj2) {
    const obj1Location = obj1.getLocation();
    const obj2Location = obj2.getLocation();

    return !(
        (obj1Location.top > obj2Location.bottom) ||
        (obj1Location.bottom < obj2Location.top) ||
        (obj1Location.left > obj2Location.right) ||
        (obj1Location.right < obj2Location.left)
    );
}

function detectCollision() {
    
    let crash = false;
    const aliensToKeep = [];
    gameArea.aliens.every(alien => {
        let boom = false;
        const missilesToKeep = [];
        gameArea.missiles.forEach(missile => {
            if (collide(missile, alien)) {
                gameArea.score += gameArea.level;
                boom = true;
            } else {
                if (missile.getLocation().bottom > 0) missilesToKeep.push(missile);
            }     
        });
        if (!boom) aliensToKeep.push(alien);
        crash = collide(gameArea.ship, alien);
        gameArea.missiles = missilesToKeep;
        return !crash;
    });
    gameArea.aliens = aliensToKeep;

    if (!crash) {
        const bombsToKeep = [];
        gameArea.bombs.every(bomb => {
            if (bomb.getLocation().top < canvas.height) {
                bombsToKeep.push(bomb);
            }
            crash = collide(gameArea.ship, bomb);
            return !crash;
        });
        gameArea.bombs = bombsToKeep;
    }

    return crash;
}

function gameTick() {
    drawBackground();
    

    gameArea.ship.move();
    gameArea.aliens.forEach(alien => alien.move());
    gameArea.bombs.forEach(bomb => bomb.move());
    gameArea.missiles.forEach(missile => missile.move());


    gameArea.ship.draw();
    gameArea.aliens.forEach(alien => alien.draw());
    gameArea.bombs.forEach(bomb => bomb.draw());
    gameArea.missiles.forEach(missile => missile.draw());

    drawDisplay();
    const crash = detectCollision();

    if(crash) {
        window.requestAnimationFrame(gameOver);
    } else if(gameArea.aliens.length == 0) {
        gameArea.level ++;
        primeAliens(20 + (gameArea.level*5));
        window.requestAnimationFrame(gameTick);
        // window.requestAnimationFrame(youWin);
    } else {
        window.requestAnimationFrame(gameTick);
    }
}

function gameOver() {
    drawBackground();
    drawDisplay();
    context.fillStyle = "white";
    context.font = '100px Consolas';
    context.fillText('Game', 100, 180);
    context.fillText('Over!', 100, 300);
}

function youWin() {
    drawBackground();
    context.fillStyle = "white";
    context.font = '100px Consolas';
    context.fillText('You', 100, 180);
    context.fillText('Win!', 100, 300);
}

init(context);
gameTick();