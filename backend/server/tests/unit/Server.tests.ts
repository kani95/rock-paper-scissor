import RequestHandler from "../../src/Server";
import { Move } from "../../../db/model/Player";

describe("Server-class tests", () => {
    
    jest.mock("../../src/Server");
    let server: RequestHandler;

    beforeEach(() => {
        server = new RequestHandler();
        server.clearData();
    });

    it("should create a Server instance", () => {
        expect(server).toBeInstanceOf(RequestHandler);
    });

    it("should be able to start the server", async () => {
        jest.mock("../../src/Server");
        server.start = jest.fn();

        expect(() => server.start()).not.toThrowError();
    });

    it("should be able to create a game", async () => {
        expect(() => server.createGame("1", "player1")).not.toThrowError();
    });

    it("should be able to join a game", async () => {
        server.createGame("1", "player1");
        expect(() => server.joinGame("1", "player2")).not.toThrowError();
    });

    it("should be able to make a move", async () => {
        server.createGame("1", "player1");
        server.joinGame("1", "player2");
        expect(() => server.makeMove("1", Move.ROCK, "player1")).not.toThrowError();
    });

    it("should be able to get a game", async () => {
        server.createGame("1", "player1");
        server.joinGame("1", "player2");
        server.makeMove("1", Move.ROCK, "player1");
        server.makeMove("1", Move.SCISSORS, "player2");
        expect(() => server.getGame("1")).not.toThrowError();
    });
});