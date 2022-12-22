class Alien extends EventTarget {
    #x;
    #y;
    #shape;
    #width = 30;
    #height = 30;
    #direction = 1;
    #tick = 0;
    #speed;
    #bombLatch;
    constructor(x,y, speed = 10) {
        super();
        this.#x = x;
        this.#y = y;
        this.#shape = new Image();
        this.#shape.src = `alien${y}.jpg`;
        this.#speed = speed;
    
        this.#resetBombLatch();
    };

    getLocation() {
        return { left: this.#getRealX(), top: this.#getRealY(), right: this.#getRealX() + this.#width, bottom: this.#getRealY() + this.#height };
    };

    #resetBombLatch() {
        this.#bombLatch = Math.floor(Math.random() * ((100 - this.#speed)/4));
    }

    #getRealX() {
        return 10+(40 * this.#x);
    };

    #getRealY() {
        return 10 +(this.#y * 40);
    }

    draw(context) {
        
        context.drawImage(
            this.#shape,
            this.#getRealX(),
            this.#getRealY(),
            this.#width, 
            this.#height
        );
    };

    move() {
        this.#tick ++;
        if (this.#tick % 3 == 0) {
            this.#y ++;
            this.#direction = this.#direction * -1;
            this.#speed = this.#speed + Math.floor(this.#speed/10);
        } else {
            this.#x += this.#direction;
        }

        this.#bombLatch--;
        if (this.#bombLatch < 0) {
            this.#resetBombLatch();
            this.dispatchEvent(new CustomEvent('bomb', {detail: {
                x: this.#getRealX() + this.#width/2,
                y: this.#getRealY() + this.#height
            }}));
        }
    }

}

module.exports = Alien;