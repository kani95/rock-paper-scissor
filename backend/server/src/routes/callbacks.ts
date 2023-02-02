import { Context } from 'koa';
import crypto from 'crypto';
import { playerSchema, moveSchema, idSchema } from './schema/zodSchema';

import GameAlreadyExistsException from '../../../exceptions/GameAlreadyExistsException';
import InvalidMoveException from '../../../exceptions/InvalidMoveException';
import GameNotFoundException from '../../../exceptions/GameNotFoundException';
import PlayerNotFoundException from '../../../exceptions/PlayerNotFoundException';
import FullGameException from '../../../exceptions/FullGameException';

const createGame = async (ctx: Context) => {
    let body;

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
        resBody = {"message": "Created game successfully", "id": gameID};
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

const joinGame = async (ctx: Context) => {
    let body;
    let gameID;

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
        resBody = {"message": "Joined game successfully", "id": gameID};
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

const makeMove = async (ctx: Context) => {

    let body;
    let gameID;

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
        resBody = {"player": playerName, "move": move, "message": "Move made successfully"};
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

const getGameState = async (ctx: Context) => {

    let gameID;

    try {
        gameID = idSchema.parse(ctx.params).id;
    }
    catch (e) {
        ctx.body = JSON.parse(JSON.stringify({"Error": "Invalid body"}));
        ctx.status = 400;
        return;
    }

    let resStatus = 200;
    let resBody;

    try {  
        const state = ctx.app.context.server.getGame(gameID);
        resBody = {"state": state};
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
