// define state model

export enum GameStatus {
    WAITING = "WAITING",
    FULL = "FULL",
    INITPLAYERWIN = "INITPLAYERWIN",
    JOINEDPLAYERWIN = "JOINEDPLAYERWIN",
    DRAW = "DRAW",
}

export class State {
    gameState!: GameStatus;

    constructor(gameState: GameStatus) {
        this.gameState = gameState;
    }
}

export default { State, GameStatus};
