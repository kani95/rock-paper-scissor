import request from 'supertest';
import config from '../../src/config';
import Server from '../../src/Server';

describe('Server tests', () => {
  
    const app = new Server().start();
    
    afterAll(() => {
        app.close();
    });

    it('should be able to create a game', async () => {
        const response = 
            await request(app)
                .post(config.prefix)
                .send(JSON.parse(JSON.stringify({name: "player1"})));
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('Fail to create game', async () => {
        const response =
            await request(app)
                .post(config.prefix)
                .send(JSON.parse(JSON.stringify({name: ""})));
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    it('Fail to create game', async () => {
        const response =
            await request(app)
                .post(config.prefix)
                .send(JSON.parse(JSON.stringify({error: "player1"})));
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

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

    it('Fail to join game', async () => {
        const response =
            await request(app)
                .post(config.prefix + "/join/" + "1")
                .send(JSON.parse(JSON.stringify({name: ""})));
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    it('Fail to join game', async () => {
        const response =
            await request(app)
                .post(config.prefix + "/join/" + "1")
                .send(JSON.parse(JSON.stringify({error: "player2"})));
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    it('Fail to join game', async () => {
        const response =
            await request(app)
                .post(config.prefix + "/join/" + "")
                .send(JSON.parse(JSON.stringify({name: "player2"})));
        expect(response.status).toBe(405);
        expect(response.body).toBeDefined();
    });

    it('should be able to make a move', async () => {
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
    });

    it('Fail to make a move', async () => {
        const response =
            await request(app)
                .post(config.prefix + "/move/" + "1")
                .send(JSON.parse(JSON.stringify({name: "player1", move: "fire"})));
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    it('Fail to make a move', async () => {
        const response =
            await request(app)
                .post(config.prefix + "/move/" + "1")
                .send(JSON.parse(JSON.stringify({name: "player1", move: "error"})));
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

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

    it('Fail to get a game', async () => {
        const response =
            await request(app)
                .get(config.prefix + "/1231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313123131231312313");
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    });

    it('fail to join game', async () => {
        const id = "1234";
        const response =
            await request(app)
                .post(config.prefix + "/join/" + id)
                .send(JSON.parse(JSON.stringify({name: "player2"})));
        expect(response.status).toBe(409);
        expect(response.body).toBeDefined();
    });

    it('fail to make move', async () => {
        const id = "1234";
        const response =
            await request(app)
                .post(config.prefix + "/move/" + id)
                .send(JSON.parse(JSON.stringify({name: "player1", move: "rock"})));
        expect(response.status).toBe(409);
        expect(response.body).toBeDefined();
    });

    it('fail to get game', async () => {
        const id = "1234";
        const response =
            await request(app)
                .get(config.prefix + "/" + id);
        expect(response.status).toBe(409);
        expect(response.body).toBeDefined();
    });

    it('405', async () => {
        const response =
            await request(app)
                .delete(config.prefix);
        expect(response.status).toBe(405);
        expect(response.body).toBeDefined();
    });

    it('405', async () => {
        const response =
            await request(app)
                .put(config.prefix);
        expect(response.status).toBe(405);
        expect(response.body).toBeDefined();
    });

    it('404', async () => {
        const response =
            await request(app)
                .post(config.prefix + "/joins/" + "1");
        expect(response.status).toBe(404);
        expect(response.body).toBeDefined();
    });
});