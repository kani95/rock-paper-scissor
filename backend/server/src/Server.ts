import Koa from 'koa';
import BodyParser from 'koa-bodyparser';

import config  from './config';
import router from './routes/routes';
import DB from '../../db/DB';

class Server {
    private app: Koa;
    private db: DB;

    constructor() {
        this.app = new Koa();
        this.db = DB.getInstance();
    }

    public start(): void {
        this.app.use(BodyParser());
        this.setupCors();
        this.app.use(router.routes());
        this.app.use(router.allowedMethods());
        this.app.context.server = this;

        this.app.listen(config.port, () => {
            console.log(`Server running on: ${config.endpoint} 🚀`);
        });
    }

    private setupCors(): void {
        this.app.use(async (ctx, next) => {
            ctx.set('Access-Control-Allow-Origin', '*');
            ctx.set('Access-Control-Allow-Methods', 'GET, POST');
            await next();
        }); 
    }

    public createGame(gameId: string, playerName: string): void {
        if (this.db.gameExists(gameId)) {
            throw new Error("Game already exists");
        }

        this.db.createGame(gameId, playerName);
    }

    public joinGame(gameId: string, playerName: string): void {
        if (!this.db.gameExists(gameId)) {
            throw new Error("Game does not exist");
        }

        this.db.joinGame(gameId, playerName);
    }

    public makeMove(gameId: string, move: string, playerName: string): void {
        if (!this.db.gameExists(gameId)) {
            throw new Error("Game does not exist");
        }
        
        this.db.makeMove(gameId, move, playerName);
    }

    public getGame(gameId: string): string {
        if (!this.db.gameExists(gameId)) {
            throw new Error("Game does not exist");
        }
        
        return this.db.getGameState(gameId);
    }
}

export default Server;