class Controls {
    #keys = [];

    constructor() {
        window.addEventListener('keydown', (event) => this.#keys[event.key] = true);
        window.addEventListener('keyup', (event) => this.#keys[event.key] = false);
    };

    get left() {
        return this.#keys['ArrowLeft'];
    };
    
    get right() {
        return this.#keys['ArrowRight'];
    };

    get fire() {
        return this.#keys[' '];
    }

}

module.exports = Controls;