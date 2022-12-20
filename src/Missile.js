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
    draw(context) {
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

module.exports = Missile;