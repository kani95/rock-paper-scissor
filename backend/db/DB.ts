import DBData from "./types/DBData";
import Game from "./model/Game";
import { Move, Player } from "./model/Player";
import { State, GameStatus } from "./model/State";

class DB {
    private static instance: DB;
    private static data = {} as DBData;
    
    public static getInstance(): DB {
        if (!DB.instance) {
            DB.instance = new DB();
        }
    
        return DB.instance;
    }

    public gameExists(gameId: string): boolean {
        return DB.data[gameId] !== undefined;
    }

    public createGame(gameId: string, playerName: string): void {
        const state = new State(GameStatus.WAITING);
        const player = new Player(playerName);
        const game = new Game(player, state);

        DB.data[gameId] = game;        
    }
    
    public joinGame(gameId: string, playerName: string): void {
        const player = new Player(playerName); 
        
        DB.data[gameId].joinedPlayer = player;
        DB.data[gameId].state.gameState = GameStatus.FULL;
    }

    public makeMove(gameId: string, move: string, playerName: string): void {
        if (this.validMove(move)) {
            this.canMakeMove(gameId, playerName).lastMove = move;
            this.setGameState(gameId);
            console.log(DB.data[gameId]);
        }
        else {
            throw new Error("Invalid move");
        }
    }

    private validMove(move: string): boolean {
        return move === Move.ROCK || move === Move.PAPER || move === Move.SCISSORS;
    }

    private canMakeMove(gameId: string, playerName: string): Player {        
        const game = DB.data[gameId];
        let player: Player | undefined;

        if (game.joinedPlayer.name === playerName) {
            player = game.joinedPlayer;
        }
        else if (game.initPlayer.name === playerName) {
            player = game.initPlayer;
        }

        if (player !== undefined) {
            if (player.lastMove === Move.INIT) {
                return player;
            }
            else {
                throw new Error("Player already made a move");
            }
        }
        else {
            throw new Error("Player not found");
        }
    }

    private setGameState(gameId: string): void {
        const game = DB.data[gameId];
        const initPlayer = game.initPlayer;
        const joinedPlayer = game.joinedPlayer;

        if (initPlayer.lastMove !== Move.INIT && joinedPlayer.lastMove !== Move.INIT) {
            if (initPlayer.lastMove === joinedPlayer.lastMove) {
                game.state.gameState = GameStatus.DRAW;
            }
            else if (initPlayer.lastMove === Move.ROCK && joinedPlayer.lastMove === Move.SCISSORS) {
                game.state.gameState = GameStatus.INITPLAYERWIN;
            }
            else if (initPlayer.lastMove === Move.PAPER && joinedPlayer.lastMove === Move.ROCK) {
                game.state.gameState = GameStatus.INITPLAYERWIN;
            }
            else if (initPlayer.lastMove === Move.SCISSORS && joinedPlayer.lastMove === Move.PAPER) {
                game.state.gameState = GameStatus.INITPLAYERWIN;
            }
            else {
                game.state.gameState = GameStatus.JOINEDPLAYERWIN;
            }
        }
    }

    public getGameState(gameId: string): GameStatus {
        return DB.data[gameId].state.gameState;
    }
}

export default DB;