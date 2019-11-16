

class Game {
    constructor(model) {
        this.level = 1;
        this.model = model;

        this.rocks = [
            [30, 30, 60, 60],
            [180, 180, 210, 210]
        ];
    }

    update() {
        this.checkForRockCollisions();
    }

    checkForRockCollisions() {
        this.rocks.forEach((rock) => {
            
        });
    }
}

export default Game;