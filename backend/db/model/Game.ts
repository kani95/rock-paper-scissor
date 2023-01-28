import Player from "./Player"
import { State } from "./State"

export default class Game {
    initPlayer!: Player;
    joinedPlayer!: Player;
    state!: State;

    constructor(initPlayer: Player, state: State) {
        this.initPlayer = initPlayer;
        this.state = state;
    }
}