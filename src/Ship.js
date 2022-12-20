class Ship extends EventTarget {
    #x = 240;
    #y = 450;
    #leftBounds = 480;
    #rightBounds = 0;
    #fireLatch = true;
    #shape = [
        {x: 5, y: 5},
        {x: 15, y: 5},
        {x: 15, y: 15},
        {x: -15, y: 15},
        {x: -15, y: 5},
        {x: -5, y: 5}
    ];
    #controls;

    constructor(controls) {
        super();
        this.#controls = controls;
    }

    getLocation() {
        return { left: this.#x -5, top: this.#y, right: this.#x +5, bottom: this.#y+15 };
    };

    draw(context) {
        context.fillStyle = 'lightblue';
        context.beginPath();
        context.moveTo(this.#x,this.#y);
        this.#shape.forEach(point => context.lineTo(this.#x + point.x, this.#y + point.y));
        context.fill();
    };
    move() {
        if (this.#controls.left) this.#x = Math.max(this.#x - 2, this.#rightBounds);
        if (this.#controls.right) this.#x = Math.min(this.#x + 2, this.#leftBounds);
        if (this.#controls.fire && this.#fireLatch) this.#fire();
    };
    #fire() {
        this.dispatchEvent(new CustomEvent('fire', {detail: {x: this.#x, y: this.#y}}));
        
        this.#fireLatch = false;
        setTimeout(() => this.#fireLatch = true, 500);
    };
}

module.exports = Ship;