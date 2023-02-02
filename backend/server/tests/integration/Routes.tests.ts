import request from 'supertest';
import config from '../../src/config';
import Server from '../../src/Server';

describe('Server-class tests', () => {
  
    const app = new Server().start();
    
    afterAll(() => {
        app.close();
    });

    describe('POST /', () => {
        it('should be able to create a game', async () => {
            const response = 
                await request(app)
                    .post(config.prefix)
                    .send(JSON.parse(JSON.stringify({name: "player1"})));
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

        it('Fail to create game, empty name', async () => {
            const response =
                await request(app)
                    .post(config.prefix)
                    .send(JSON.parse(JSON.stringify({name: ""})));
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
        });

        it('Fail to create game, wrong body', async () => {
            const response =
                await request(app)
                    .post(config.prefix)
                    .send(JSON.parse(JSON.stringify({error: "player1"})));
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
        });
    });

    describe('POST /join/:id', () => {

        it('should be able to join a game', async () => {
            const responseCreateGame = 
                await request(app)
                    .post(config.prefix)
                    .send(JSON.parse(JSON.stringify({name: "player1"})));
            expect(responseCreateGame.status).toBe(200);
            expect(responseCreateGame.body).toBeDefined();
            
            const id = responseCreateGame.body.id;
            const response = 
            await request(app)
                    .post(config.prefix + "/join/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player2"})));
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

        it('Fail to join game, empty name', async () => {
            const response =
                await request(app)
                    .post(config.prefix + "/join/" + "1")
                    .send(JSON.parse(JSON.stringify({name: ""})));
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
        });

        it('Fail to join game, wrong body', async () => {
            const response =
                await request(app)
                    .post(config.prefix + "/join/" + "1")
                    .send(JSON.parse(JSON.stringify({error: "player2"})));
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
        });

        it('Fail to join game, no id', async () => {
            const response =
                await request(app)
                    .post(config.prefix + "/join/" + "")
                    .send(JSON.parse(JSON.stringify({name: "player2"})));
            expect(response.status).toBe(405);
            expect(response.body).toBeDefined();
        });

        it('fail to join game, no game found with id', async () => {
            const id = "1234";
            const response =
                await request(app)
                    .post(config.prefix + "/join/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player2"})));
            expect(response.status).toBe(409);
            expect(response.body).toBeDefined();
        });
    });

    describe('POST /move/:id', () => {
        it('should be able to make a move, player1 win', async () => {
            const responseCreateGame = 
                await request(app)
                    .post(config.prefix)
                    .send(JSON.parse(JSON.stringify({name: "player1"})));
            expect(responseCreateGame.status).toBe(200);
            expect(responseCreateGame.body).toBeDefined();
            
            const id = responseCreateGame.body.id;
            
            const responseJoinGame = 
                await request(app)
                    .post(config.prefix + "/join/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player2"})));
            expect(responseJoinGame.status).toBe(200);
            expect(responseJoinGame.body).toBeDefined();
            
            const response = 
                await request(app)
                    .post(config.prefix + "/move/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player1", move: "scissors"})));
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();

            const response2 =
                await request(app)
                    .post(config.prefix + "/move/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player2", move: "paper"})));
            expect(response2.status).toBe(200);
            expect(response2.body).toBeDefined();
        });

        it('should be able to make a move, draw', async () => {
            const responseCreateGame = 
                await request(app)
                    .post(config.prefix)
                    .send(JSON.parse(JSON.stringify({name: "player1"})));
            expect(responseCreateGame.status).toBe(200);
            expect(responseCreateGame.body).toBeDefined();
            
            const id = responseCreateGame.body.id;
            
            const responseJoinGame = 
                await request(app)
                    .post(config.prefix + "/join/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player2"})));
            expect(responseJoinGame.status).toBe(200);
            expect(responseJoinGame.body).toBeDefined();
            
            const response = 
                await request(app)
                    .post(config.prefix + "/move/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player1", move: "rock"})));
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();

            const response2 =
                await request(app)
                    .post(config.prefix + "/move/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player2", move: "rock"})));
            expect(response2.status).toBe(200);
            expect(response2.body).toBeDefined();
        });

        it('should be able to make a move, player2 win', async () => {
            const responseCreateGame = 
                await request(app)
                    .post(config.prefix)
                    .send(JSON.parse(JSON.stringify({name: "player1"})));
            expect(responseCreateGame.status).toBe(200);
            expect(responseCreateGame.body).toBeDefined();
            
            const id = responseCreateGame.body.id;
            
            const responseJoinGame = 
                await request(app)
                    .post(config.prefix + "/join/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player2"})));
            expect(responseJoinGame.status).toBe(200);
            expect(responseJoinGame.body).toBeDefined();
            
            const response = 
                await request(app)
                    .post(config.prefix + "/move/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player1", move: "rock"})));
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();

            const response2 =
                await request(app)
                    .post(config.prefix + "/move/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player2", move: "paper"})));
            expect(response2.status).toBe(200);
            expect(response2.body).toBeDefined();
        });

        it('Fail to make a move, wrong move', async () => {
            const response =
                await request(app)
                    .post(config.prefix + "/move/" + "1")
                    .send(JSON.parse(JSON.stringify({name: "player1", move: "fire"})));
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
        });

        it('fail to make move, no game found with id', async () => {
            const id = "1234";
            const response =
                await request(app)
                    .post(config.prefix + "/move/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player1", move: "rock"})));
            expect(response.status).toBe(409);
            expect(response.body).toBeDefined();
        });
    });

    describe('GET /', () => {
        it('should be able to get a game', async () => {
            const responseCreateGame =
                await request(app)
                    .post(config.prefix)
                    .send(JSON.parse(JSON.stringify({name: "player1"})));
            expect(responseCreateGame.status).toBe(200);
            expect(responseCreateGame.body).toBeDefined();

            const id = responseCreateGame.body.id;

            const responseJoinGame =
                await request(app)
                    .post(config.prefix + "/join/" + id)
                    .send(JSON.parse(JSON.stringify({name: "player2"})));
            expect(responseJoinGame.status).toBe(200);
            expect(responseJoinGame.body).toBeDefined();

            const responeGetGame =
                await request(app)
                    .get(config.prefix + "/" + id);
            expect(responeGetGame.status).toBe(200);
            expect(responeGetGame.body).toBeDefined();
        });

        it('Fail to get a game, over limit in length id', async () => {
            const response =
                await request(app)
                    .get(config.prefix + "/1231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313");
            expect(response.status).toBe(400);
            expect(response.body).toBeDefined();
        });

        it('fail to get game, no game found with id', async () => {
            const id = "1234";
            const response =
                await request(app)
                    .get(config.prefix + "/" + id);
            expect(response.status).toBe(409);
            expect(response.body).toBeDefined();
        });
    });

    describe('testing status codes', () => {
        it('405, wrong method, delete', async () => {
            const response =
                await request(app)
                    .delete(config.prefix);
            expect(response.status).toBe(405);
            expect(response.body).toBeDefined();
        });

        it('405, wrong method, put', async () => {
            const response =
                await request(app)
                    .put(config.prefix);
            expect(response.status).toBe(405);
            expect(response.body).toBeDefined();
        });

        it('404, wrong url, join', async () => {
            const response =
                await request(app)
                    .post(config.prefix + "/joins/" + "1");
            expect(response.status).toBe(404);
            expect(response.body).toBeDefined();
        });

        it('404, wrong url, move', async () => {
            const response =
                await request(app)
                    .post(config.prefix + "/moves/" + "1");
            expect(response.status).toBe(404);
            expect(response.body).toBeDefined();
        });

        it('404, wrong url, get', async () => {
            const response =
                await request(app)
                    .get(config.prefix + "/gets/" + "1");
            expect(response.status).toBe(404);
            expect(response.body).toBeDefined();
        });
    });
});