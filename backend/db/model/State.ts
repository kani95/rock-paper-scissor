import Player from "./Player";

/* all the possible states of the game
    * WAITING: the game is waiting for a second player to join
    * FULL: the game is full and no more players can join
    * INITPLAYERWIN: the player who created the game won
    * JOINEDPLAYERWIN: the player who joined the game won
    * DRAW: the game ended in a draw
*/
export enum GameStatus {
    WAITING = "WAITING",
    FULL = "FULL",
    INITPLAYERWIN = "INITPLAYERWIN",
    JOINEDPLAYERWIN = "JOINEDPLAYERWIN",
    DRAW = "DRAW",
    HIDE = "HIDE"
}

// interface for the state
export interface IState {
    message(): string;
}

// state class that implements the state interface
export abstract class State implements IState {
    private gameState!: GameStatus;
    private initPlayer!: Player;
    private joinedPlayer!: Player;

    constructor(gameState: GameStatus) {
        this.gameState = gameState;
    }

    public setInitPlayer(player: Player): void {
        this.initPlayer = player;
    }

    public getInitPlayer(): Player {
        return this.initPlayer;
    }

    public getJoinedPlayer(): Player {
        return this.joinedPlayer;
    }

    public setJoinedPlayer(player: Player): void {
        this.joinedPlayer = player;
    }

    public getGameState(): GameStatus {
        return this.gameState;
    }

    public setGameState(gameState: GameStatus): void {
        this.gameState = gameState;
    }

    public abstract message(): string;
}

// waiting state
export class WaitingState extends State {
    constructor() {
        super(GameStatus.WAITING);
    }

    public message(): string {
        return "Waiting for a second player to join...";
    }
}

// full state
export class FullState extends State {
    constructor() {
        super(GameStatus.FULL);
    }

    public message(): string {
        return "The game is now full.";
    }
}

// player that created game win state
export class InitPlayerWinState extends State {
    constructor() {
        super(GameStatus.INITPLAYERWIN);
    }

    public message(): string {
        return this.getInitPlayer.name + " won the game!";
    }
}

// player that joined game win state
export class JoinedPlayerWinState extends State {
    constructor() {
        super(GameStatus.JOINEDPLAYERWIN);
    }

    public message(): string {
        return this.getJoinedPlayer().getName() + " won the game!";
    }
}

// draw state
export class DrawState extends State {
    constructor() {
        super(GameStatus.DRAW);
    }

    public message(): string {
        return "The game ended in a draw!";
    }
}

// one player has not made a move yet
export class HideState extends State {
    constructor() {
        super(GameStatus.HIDE);
    }

    public message(): string {
        return "Waiting for other player to make a move...";
    }
}