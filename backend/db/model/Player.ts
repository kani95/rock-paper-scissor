// define the Player model

enum Move {
    ROCK = "ROCK",
    PAPER = "PAPER",
    SCISSORS = "SCISSORS",
    INIT = "INIT"
}

export default class Player {
    name!: string;
    lastMove: string;

    constructor(name: string) {
        this.name = name;
        this.lastMove = Move.INIT;
    }
}
