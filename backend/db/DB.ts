import DBData from "./types/DBData";
import Game from "./model/Game";
import { Move, Player } from "./model/Player";
import { State, GameStatus } from "./model/State";
import InvalidMoveException from "../exceptions/InvalidMoveException";
import GameNotFoundException from "../exceptions/GameNotFoundException";
import GameAlreadyExistsException from "../exceptions/GameAlreadyExistsException";
import PlayerNotFoundException from "../exceptions/PlayerNotFoundException";

class DB {
    private static instance: DB;
    private static data = {} as DBData;
    
    public static getInstance(): DB {
        if (!DB.instance) {
            DB.instance = new DB();
        }
    
        return DB.instance;
    }

    public gameExists(gameId: string): void {
        if (!DB.data[gameId]) {
            throw new GameNotFoundException("ERROR: Game with id: " + gameId + " not found");
        }
    }

    public createGame(gameId: string, playerName: string): void {
        const state = new State(GameStatus.WAITING);
        const player = new Player(playerName);
        const game = new Game(player, state);

        if (DB.data[gameId]) {
            throw new GameAlreadyExistsException("ERROR: Game with id: " + gameId + " already exists");
        }

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
            throw new InvalidMoveException("ERROR: In game: " + gameId + " invalid move: " + move + " for player: " + playerName);
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
                throw new InvalidMoveException("ERROR: in game: " + gameId + " player: " + playerName + " already made a move");
            }
        }
        else {
            throw new PlayerNotFoundException("ERROR: in game: " + gameId + " player: " + playerName + " not found");
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