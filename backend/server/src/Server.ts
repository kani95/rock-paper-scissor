import Koa, { Context, Next } from 'koa';
import http from 'http';
import BodyParser from 'koa-bodyparser';

import config  from './config';
import router from './routes/routes';
import DB from '../../db/DB';
import { State } from '../../db/model/State';

// handles the koa-server instance and stores the database instance
class Server {
    public app: Koa;
    private db: DB;

    constructor() {
        this.app = new Koa();
        this.db = DB.getInstance();
    }

    /* istanbul ignore next */
    public start(): http.Server {
        this.app.use(BodyParser());
        this.setupCors();
        this.app.use(router.routes());
        this.app.use(router.allowedMethods());
        this.app.context.server = this;

        return this.app.listen(config.port, this.listenCallback);   
    }

    /* istanbul ignore next */
    private listenCallback(): void {
        console.log(`Server running on: ${config.endpoint} 🚀`);
    }

    /* istanbul ignore next */
    private setupCors(): void {
        this.app.use(this.corsSettings); 
    }

    /* istanbul ignore next */
    private async corsSettings(ctx: Context, next: Next): Promise<void> {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Methods', 'GET, POST');
        ctx.set('Access-Control-Allow-Headers', 'Content-Type');
        ctx.set('Content-Type', 'application/json');
        ctx.set('Allow', 'GET, POST');
        await next();
    }

    public createGame(gameId: string, playerName: string): void {
        this.db.createGame(gameId, playerName);
    }

    public joinGame(gameId: string, playerName: string): void {
        this.db.joinGame(gameId, playerName);
    }

    public makeMove(gameId: string, move: string, playerName: string): void {
        this.db.makeMove(gameId, move, playerName);
    }

    public getGame(gameId: string): State {
        return this.db.getGameState(gameId);
    }

    // for testing purposes
    public clearData(): void {
        this.db.clearData();
    }
}

export default Server;
