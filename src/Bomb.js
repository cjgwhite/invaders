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
    
    draw(context) {
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

module.exports = Bomb;