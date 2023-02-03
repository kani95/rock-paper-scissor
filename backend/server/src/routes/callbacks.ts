import { Context } from 'koa';
import crypto from 'crypto';

import GameAlreadyExistsException from '../../../exceptions/GameAlreadyExistsException';
import InvalidMoveException from '../../../exceptions/InvalidMoveException';
import GameNotFoundException from '../../../exceptions/GameNotFoundException';
import PlayerNotFoundException from '../../../exceptions/PlayerNotFoundException';
import FullGameException from '../../../exceptions/FullGameException';

import { playerSchema, moveSchema, idSchema } from './schema/zodSchema';

// POST /
const createGame = async (ctx: Context) => {
    let body;

    // validate the body
    try {
        body = playerSchema.parse(ctx.request.body);
    }
    catch (e) {
        ctx.body = JSON.parse(JSON.stringify({"Error": "Invalid body"}));
        ctx.status = 400;
        return;
    }

    const playerName = body.name.toLowerCase();
    const gameID = crypto.randomUUID();

    let resStatus = 200;
    let resBody;

    try {
        ctx.app.context.server.createGame(gameID, playerName);
        const msg = ctx.app.context.server.getGame(gameID).message();
        const state = {"id": gameID, "msg": msg};        
        resBody = state; 
    }
    catch (e)
    {
        /* istanbul ignore next */
        if (e instanceof GameAlreadyExistsException) {
            resStatus = 409;
            resBody = {"error": e.message};
        }
        else {
            resStatus = 500;
            resBody = {"error": "Internal server error"};
        }
    }
    finally {
        ctx.body = JSON.parse(JSON.stringify(resBody));
        ctx.status = resStatus;
    }
}

// POST /join/:id
const joinGame = async (ctx: Context) => {
    let body;
    let gameID;

    // validate the body and id params
    try {
        body = playerSchema.parse(ctx.request.body);
        gameID = idSchema.parse(ctx.params).id;
    }
    catch (e) {
        ctx.body = JSON.parse(JSON.stringify({"Error": "Invalid body or id"}));
        ctx.status = 400;
        return;
    }

    const playerName = body.name.toLowerCase();

    let resStatus = 200;
    let resBody;

    try {
        ctx.app.context.server.joinGame(gameID, playerName);
        const msg = ctx.app.context.server.getGame(gameID).message();
        const state = {"id": gameID, "msg": msg}; 
        resBody = state;
    }
    catch (e)
    {
        /* istanbul ignore next */
        if (e instanceof GameAlreadyExistsException ||
            e instanceof GameNotFoundException      ||
            e instanceof FullGameException) {
            resStatus = 409;
            resBody = {"error": e.message};
        }
        else {
            resStatus = 500;
            resBody = {"error": "Internal server error"};
        }
    }
    finally {
        ctx.body = JSON.parse(JSON.stringify(resBody));
        ctx.status = resStatus;
    }
}

// POST /move/:id
const makeMove = async (ctx: Context) => {
    let body;
    let gameID;

    // validate the body and id params
    try {
        body = moveSchema.parse(ctx.request.body);
        gameID = idSchema.parse(ctx.params).id;
    }
    catch (e) {
        ctx.body = JSON.parse(JSON.stringify({"Error": "Invalid body or id"}));
        ctx.status = 400;
        return;
    }

    const move = body.move.toLowerCase();
    const playerName = body.name.toLowerCase();

    let resStatus = 200;
    let resBody;

    try {
        ctx.app.context.server.makeMove(gameID, move, playerName);
        const state = {"id": gameID, "move": move, "name": playerName, "msg": "Move made successfully."}; 
        resBody = state;
    }
    catch (e)
    {
        /* istanbul ignore next */
        if (e instanceof GameAlreadyExistsException ||
            e instanceof GameNotFoundException      ||
            e instanceof PlayerNotFoundException    ||
            e instanceof InvalidMoveException) {
            resStatus = 409;
            resBody = {"error": e.message};
        }
        else {
            resBody = {"error": "Internal server error"};
            resStatus = 500;
        }
    }
    finally {
        ctx.body = JSON.parse(JSON.stringify(resBody));
        ctx.status = resStatus;
    }
}

// GET /state/:id
const getGameState = async (ctx: Context) => {
    let gameID;

    // validate the id params
    try {
        gameID = idSchema.parse(ctx.params).id;
    }
    catch (e) {
        ctx.body = JSON.parse(JSON.stringify({"Error": "Invalid id"}));
        ctx.status = 400;
        return;
    }

    let resStatus = 200;
    let resBody;

    try {  
        const state = ctx.app.context.server.getGame(gameID);
        state.id = gameID;
        state.msg = state.message();
        resBody = state;
    }
    catch (e)
    {
        /* istanbul ignore next */
        if (e instanceof GameAlreadyExistsException ||
            e instanceof GameNotFoundException) {
            resStatus = 409;
            resBody = {"error": e.message};
        }
        else {
            resStatus = 500;
            resBody = {"error": "Internal server error"};
        }
    }
    finally {
        ctx.body = JSON.parse(JSON.stringify(resBody));
        ctx.status = resStatus;
    }
}

const callbacks = {
    createGame,
    joinGame,
    makeMove,
    getGameState
}

export default callbacks;
