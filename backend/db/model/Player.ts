// define the Player model

export enum Move {
    ROCK = "rock",
    PAPER = "paper",
    SCISSORS = "scissors",
    INIT = "init"
}

export class Player {
    name!: string;
    lastMove: string;

    constructor(name: string) {
        this.name = name;
        this.lastMove = Move.INIT;
    }
}

export default { Move, Player };
