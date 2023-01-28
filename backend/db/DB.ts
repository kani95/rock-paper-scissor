import DBData from "./types/DBData";
import Game from "./model/Game";
import Player from "./model/Player";
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

    public makeMove(gameId: string, move: string): void {
        DB.data[gameId].state.gameState = GameStatus.INITPLAYERWIN;
        DB.data[gameId].
    }

    public getGameState(gameId: string): GameStatus {
        return DB.data[gameId].state.gameState;
    }
}

export default DB;