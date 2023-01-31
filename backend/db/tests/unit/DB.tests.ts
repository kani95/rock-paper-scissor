import DB from "../../DB";
import { GameStatus } from "../../model/State";
import { Move } from "../../model/Player";

describe("DB-class tests", () => {

    let db: DB;

    beforeEach(() => {
        db = DB.getInstance();
        db.clearData();
    });

    it("should create a DB instance", () => {
        expect(db).toBeInstanceOf(DB);
    });

    it("should create a game", () => {
        db.createGame("1", "player1");
        expect(db.getGameState("1")).toBe(GameStatus.WAITING);
    });

    it("should create a second game", () => {
        db.createGame("1", "player1");
        db.createGame("2", "player1");
        expect(db.getGameState("1")).toBe(GameStatus.WAITING);
        expect(db.getGameState("2")).toBe(GameStatus.WAITING);
    });

    it("should not create a game, throw GameAlreadyExistException", () => {
        db.createGame("1", "player1");
        expect(() => db.createGame("1", "player1")).toThrowError();
    });

    it("should join a game", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        expect(db.getGameState("1")).toBe(GameStatus.FULL);
    });

    it("should not join a game, throw GameNotFoundException", () => {
        expect(() => db.joinGame("1", "player2")).toThrowError();
    });

    it("should not join a game, throw FullGameException", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        expect(() => db.joinGame("1", "player3")).toThrowError();
    });

    it("should make a move", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        db.makeMove("1", Move.ROCK, "player1");
        expect(db.getGameState("1")).toBe(GameStatus.FULL);
    })

    it("should make a move and win", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        db.makeMove("1", Move.ROCK, "player1");
        db.makeMove("1", Move.SCISSORS, "player2");
        expect(db.getGameState("1")).toBe(GameStatus.INITPLAYERWIN);
    });

    it("should make a move and win", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        db.makeMove("1", Move.ROCK, "player1");
        db.makeMove("1", Move.PAPER, "player2");
        expect(db.getGameState("1")).toBe(GameStatus.JOINEDPLAYERWIN);
    });

    it("should make a move and win", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        db.makeMove("1", Move.PAPER, "player1");
        db.makeMove("1", Move.ROCK, "player2");
        expect(db.getGameState("1")).toBe(GameStatus.INITPLAYERWIN);
    });

    it("should make a move and win", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        db.makeMove("1", Move.PAPER, "player1");
        db.makeMove("1", Move.SCISSORS, "player2");
        expect(db.getGameState("1")).toBe(GameStatus.JOINEDPLAYERWIN);
    });

    it("should make a move and win", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        db.makeMove("1", Move.SCISSORS, "player1");
        db.makeMove("1", Move.ROCK, "player2");
        expect(db.getGameState("1")).toBe(GameStatus.JOINEDPLAYERWIN);
    });

    it("should make a move and win", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        db.makeMove("1", Move.SCISSORS, "player1");
        db.makeMove("1", Move.PAPER, "player2");
        expect(db.getGameState("1")).toBe(GameStatus.INITPLAYERWIN);
    });

    it("should make a move and draw", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        db.makeMove("1", Move.ROCK, "player1");
        db.makeMove("1", Move.ROCK, "player2");
        expect(db.getGameState("1")).toBe(GameStatus.DRAW);
    });

    it("should make a move and draw", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        db.makeMove("1", Move.PAPER, "player1");
        db.makeMove("1", Move.PAPER, "player2");
        expect(db.getGameState("1")).toBe(GameStatus.DRAW);
    });

    it("should make a move and draw", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        db.makeMove("1", Move.SCISSORS, "player1");
        db.makeMove("1", Move.SCISSORS, "player2");
        expect(db.getGameState("1")).toBe(GameStatus.DRAW);
    });

    it("should make a move and throw PlayerNotFoundException", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        expect(() => db.makeMove("1", Move.ROCK, "player3")).toThrowError();
    });

    it("should make a move and throw GameNotFoundException", () => {
        expect(() => db.makeMove("1", Move.ROCK, "player1")).toThrowError();
    });

    it("should not make a move and throw InvalidMoveException", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        expect(() => db.makeMove("1", "fire", "player2")).toThrowError();
    });

    it("should not make a move and throw GameNotFoundException", () => {
        expect(() => db.makeMove("1", Move.ROCK, "player1")).toThrowError();
    });

    it("make move twice for player1, should throw InvalidMoveException", () => {
        db.createGame("1", "player1");
        db.joinGame("1", "player2");
        db.makeMove("1", Move.ROCK, "player1");
        expect(() => db.makeMove("1", Move.ROCK, "player1")).toThrowError();
    });      
});