import Move from './Move';

// represents a player in the game
export class Player {
    private name!: string;
    private lastMove: string;

    public getName(): string {
        return this.name;
    }

    public getLastMove(): string {
        return this.lastMove;
    }

    public setLastMove(move: string): void {
        this.lastMove = move;
    }

    constructor(name: string) {
        this.name = name;
        this.lastMove = Move.INIT;
    }
}

export default Player;
