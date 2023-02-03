import DB from "../../DB";
import { GameStatus } from "../../model/State";
import Move from "../../model/Move";

describe("DB-class tests", () => {
    let db: DB;

    beforeEach(() => {
        db = DB.getInstance();
        db.clearData();
    });

    describe("createGame", () => {
        it("should create a DB instance", () => {
            expect(db).toBeInstanceOf(DB);
        });

        it("should create a game", () => {
            db.createGame("1", "player1");
            expect(db.getGameState("1").getGameState()).toBe(GameStatus.WAITING);
        });

        it("should create two games", () => {
            db.createGame("1", "player1");
            db.createGame("2", "player1");
            expect(db.getGameState("1").getGameState()).toBe(GameStatus.WAITING);
            expect(db.getGameState("2").getGameState()).toBe(GameStatus.WAITING);
        });

        it("should not create a game, throw GameAlreadyExistException", () => {
            db.createGame("1", "player1");
            expect(() => db.createGame("1", "player1")).toThrowError();
        });
    });

    describe("joinGame", () => {
        it("should join a game", () => {
            db.createGame("1", "player1");
            db.joinGame("1", "player2");
            expect(db.getGameState("1").getGameState()).toBe(GameStatus.FULL);
        });

        it("should not join a game, throw GameNotFoundException", () => {
            expect(() => db.joinGame("1", "player2")).toThrowError();
        });

        it("should not join a game, throw FullGameException", () => {
            db.createGame("1", "player1");
            db.joinGame("1", "player2");
            expect(() => db.joinGame("1", "player3")).toThrowError();
        });
    });

    describe("makeMove", () => {
        it("should make a move, player1, hide state", () => {
            db.createGame("1", "player1");
            db.joinGame("1", "player2");
            db.makeMove("1", Move.ROCK, "player1");
            expect(db.getGameState("1").getGameState()).toBe(GameStatus.HIDE);
        })

        it("should make a move, player2, hide state", () => {
            db.createGame("1", "player1");
            db.joinGame("1", "player2");
            db.makeMove("1", Move.ROCK, "player2");
            expect(db.getGameState("1").getGameState()).toBe(GameStatus.HIDE);
        })

        describe("makeMove, test all moves, decide winner", () => {
            it("rock & scissors, init player win", () => {
                db.createGame("1", "player1");
                db.joinGame("1", "player2");
                db.makeMove("1", Move.ROCK, "player1");
                db.makeMove("1", Move.SCISSORS, "player2");
                expect(db.getGameState("1").getGameState()).toBe(GameStatus.INITPLAYERWIN);
            });

            it("rock & paper, joined player win", () => {
                db.createGame("1", "player1");
                db.joinGame("1", "player2");
                db.makeMove("1", Move.ROCK, "player1");
                db.makeMove("1", Move.PAPER, "player2");
                expect(db.getGameState("1").getGameState()).toBe(GameStatus.JOINEDPLAYERWIN);
            });

            it("paper & rock, init player win", () => {
                db.createGame("1", "player1");
                db.joinGame("1", "player2");
                db.makeMove("1", Move.PAPER, "player1");
                db.makeMove("1", Move.ROCK, "player2");
                expect(db.getGameState("1").getGameState()).toBe(GameStatus.INITPLAYERWIN);
            });

            it("paper & scissors, joined player win", () => {
                db.createGame("1", "player1");
                db.joinGame("1", "player2");
                db.makeMove("1", Move.PAPER, "player1");
                db.makeMove("1", Move.SCISSORS, "player2");
                expect(db.getGameState("1").getGameState()).toBe(GameStatus.JOINEDPLAYERWIN);
            });

            it("scissors & rock, joined player win", () => {
                db.createGame("1", "player1");
                db.joinGame("1", "player2");
                db.makeMove("1", Move.SCISSORS, "player1");
                db.makeMove("1", Move.ROCK, "player2");
                expect(db.getGameState("1").getGameState()).toBe(GameStatus.JOINEDPLAYERWIN);
            });

            it("scissors & paper, init player win", () => {
                db.createGame("1", "player1");
                db.joinGame("1", "player2");
                db.makeMove("1", Move.SCISSORS, "player1");
                db.makeMove("1", Move.PAPER, "player2");
                expect(db.getGameState("1").getGameState()).toBe(GameStatus.INITPLAYERWIN);
            });

            it("rock & rock, draw", () => {
                db.createGame("1", "player1");
                db.joinGame("1", "player2");
                db.makeMove("1", Move.ROCK, "player1");
                db.makeMove("1", Move.ROCK, "player2");
                expect(db.getGameState("1").getGameState()).toBe(GameStatus.DRAW);
            });

            it("paper & paper, draw", () => {
                db.createGame("1", "player1");
                db.joinGame("1", "player2");
                db.makeMove("1", Move.PAPER, "player1");
                db.makeMove("1", Move.PAPER, "player2");
                expect(db.getGameState("1").getGameState()).toBe(GameStatus.DRAW);
            });

            it("scissors & scissors, draw", () => {
                db.createGame("1", "player1");
                db.joinGame("1", "player2");
                db.makeMove("1", Move.SCISSORS, "player1");
                db.makeMove("1", Move.SCISSORS, "player2");
                expect(db.getGameState("1").getGameState()).toBe(GameStatus.DRAW);
            });
        });

        it("should not make a move and throw PlayerNotFoundException", () => {
            db.createGame("1", "player1");
            db.joinGame("1", "player2");
            expect(() => db.makeMove("1", Move.ROCK, "player3")).toThrowError();
        });

        it("should not make a move and throw GameNotFoundException", () => {
            expect(() => db.makeMove("1", Move.ROCK, "player1")).toThrowError();
        });

        it("should not make a move and throw InvalidMoveException", () => {
            db.createGame("1", "player1");
            db.joinGame("1", "player2");
            expect(() => db.makeMove("1", "fire", "player2")).toThrowError();
        });

        it("make move twice for player1, should throw InvalidMoveException", () => {
            db.createGame("1", "player1");
            db.joinGame("1", "player2");
            db.makeMove("1", Move.ROCK, "player1");
            expect(() => db.makeMove("1", Move.ROCK, "player1")).toThrowError();
        });   

        it("make move twice for player2, should throw InvalidMoveException", () => {
            db.createGame("1", "player1");
            db.joinGame("1", "player2");
            db.makeMove("1", Move.ROCK, "player1");
            db.makeMove("1", Move.ROCK, "player2");
            expect(() => db.makeMove("1", Move.ROCK, "player2")).toThrowError();
        });
    });
});
