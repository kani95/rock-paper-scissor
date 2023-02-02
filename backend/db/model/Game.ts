import { State } from "./State";

// represent the game with the current game state
export default class Game {
    private state!: State;

    public getState(): State {
        return this.state;
    }

    public setState(state: State): void {
        this.state = state;
    }

    constructor(state: State) {
        this.state = state;
    }
}
