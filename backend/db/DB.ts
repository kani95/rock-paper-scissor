import DBData from "./types/DBData";
import Game from "./model/Game";
import Player from "./model/Player";
import Move from "./model/Move";
import { State, GameStatus, WaitingState, FullState, DrawState, InitPlayerWinState, JoinedPlayerWinState, HideState } from "./model/State";

import InvalidMoveException from "../exceptions/InvalidMoveException";
import GameNotFoundException from "../exceptions/GameNotFoundException";
import GameAlreadyExistsException from "../exceptions/GameAlreadyExistsException";
import PlayerNotFoundException from "../exceptions/PlayerNotFoundException";
import FullGameException from "../exceptions/FullGameException";

// represent the database for the backend
class DB {
    private static instance: DB;
    private static data = {} as DBData;
    
    public static getInstance(): DB {
        if (!DB.instance) {
            DB.instance = new DB();
        }
    
        return DB.instance;
    }

    // only for testing
    public clearData(): void {
        DB.data = {} as DBData;
    }

    // check if the game has been created
    private gameExists(gameId: string): void {
        if (!DB.data[gameId]) {
            throw new GameNotFoundException("ERROR: Game with id: " + gameId + " not found");
        }
    }

    // create the game and add it to the database
    public createGame(gameId: string, playerName: string): void {
        const state = new WaitingState();
        const player = new Player(playerName);
        state.setInitPlayer(player);
        const game = new Game(state);

        if (DB.data[gameId]) {
            throw new GameAlreadyExistsException("ERROR: Game with id: " + gameId + " already exists");
        }

        DB.data[gameId] = game;        
    }
    
    // one player joins the game, if the game is full (2 players), throw an exception
    public joinGame(gameId: string, playerName: string): void {
        this.gameExists(gameId);
        
        if (this.isRoom(gameId)) {
            const player = new Player(playerName); 
            const state = new FullState();
            state.setInitPlayer(DB.data[gameId].getState().getInitPlayer());
            state.setJoinedPlayer(player);
            DB.data[gameId].setState(state);
        }
        else {
            throw new FullGameException("ERROR: Game with id: " + gameId + " is full. Can't join.");
        }
    }

    // check if the game is waiting for a second player
    private isRoom(gameId: string): boolean {
        return DB.data[gameId].getState().getGameState() === GameStatus.WAITING;
    }
    
    // make a move, if the move is invalid i.e. not rock, paper or scissor, throw an exception
    public makeMove(gameId: string, move: string, playerName: string): void {
        this.gameExists(gameId);
        
        if (this.validMove(move)) {
            const selectedPlayer = this.canMakeMove(gameId, playerName);
            selectedPlayer.setLastMove(move);
            this.setGameState(gameId);
        }
        else {
            throw new InvalidMoveException("ERROR: In game: " + gameId + 
            " invalid move: " + move + " for player: " + playerName);
        }
    }

    // check if the move is valid
    private validMove(move: string): boolean {
        return move === Move.ROCK || move === Move.PAPER || move === Move.SCISSORS;
    }

    // check if the player can make a move then return said player
    // if the player already made a move, throw an exception
    private canMakeMove(gameId: string, playerName: string): Player {   
        const gameState = DB.data[gameId].getState();
        let player: Player | undefined;

        // find the player that made the move
        if (gameState.getJoinedPlayer().getName() === playerName) {
            player = gameState.getJoinedPlayer();
        }
        else if (gameState.getInitPlayer().getName() === playerName) {
            player = gameState.getInitPlayer();
        }

        // if the player is found, check if the player already made a move
        if (player !== undefined) {
            if (player.getLastMove() === Move.INIT) {
                return player;
            }
            else {
                throw new InvalidMoveException("ERROR: in game: " + gameId + 
                " player: " + playerName + " already made a move");
            }
        }
        else {
            throw new PlayerNotFoundException("ERROR: in game: " + gameId + 
            " player: " + playerName + " not found");
        }
    }

    // set the game state based on the moves made by the players
    private setGameState(gameId: string): void {
        const gameState = DB.data[gameId].getState();
        const initPlayer = gameState.getInitPlayer();
        const joinedPlayer = gameState.getJoinedPlayer();
        
        let state : State;

        // if both players made a move, set the game state
        if (initPlayer.getLastMove() !== Move.INIT && joinedPlayer.getLastMove() !== Move.INIT) {
            if (initPlayer.getLastMove() === joinedPlayer.getLastMove()) {
                state = new DrawState();
                state.setGameState(GameStatus.DRAW);
            }
            else if (initPlayer.getLastMove() === Move.ROCK && joinedPlayer.getLastMove() === Move.SCISSORS) {
                state = new InitPlayerWinState();
                state.setGameState(GameStatus.INITPLAYERWIN);
            }
            else if (initPlayer.getLastMove() === Move.PAPER && joinedPlayer.getLastMove() === Move.ROCK) {
                state = new InitPlayerWinState();
                state.setGameState(GameStatus.INITPLAYERWIN);
            }
            else if (initPlayer.getLastMove() === Move.SCISSORS && joinedPlayer.getLastMove() === Move.PAPER) {
                state = new InitPlayerWinState();
                state.setGameState(GameStatus.INITPLAYERWIN);
            }
            else {
                state = new JoinedPlayerWinState();
                state.setGameState(GameStatus.JOINEDPLAYERWIN);
            }

            state.setInitPlayer(initPlayer);
            state.setJoinedPlayer(joinedPlayer);

            DB.data[gameId].setState(state);
        }
    }

    // get the game state by the game id
    public getGameState(gameId: string): State {
        this.gameExists(gameId);
        
        const state = DB.data[gameId].getState();

        if (state.getGameState() !== GameStatus.WAITING && this.madeSingleMove(state)) {
            // hide the moves from the players
            return new HideState();
        } 
        return state;
    }

    // check if one player has made a move
    private madeSingleMove(state: State): boolean {
        return  (state.getInitPlayer().getLastMove() !== Move.INIT && state.getJoinedPlayer().getLastMove() === Move.INIT) ||
                (state.getInitPlayer().getLastMove() === Move.INIT && state.getJoinedPlayer().getLastMove() !== Move.INIT);
    }
}

export default DB;
