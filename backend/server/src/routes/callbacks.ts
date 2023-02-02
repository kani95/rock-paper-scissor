import { Context } from 'koa';
import crypto from 'crypto';

import { playerInterface, moveInterface } from './interfaces/interfaces';

import GameAlreadyExistsException from '../../../exceptions/GameAlreadyExistsException';
import InvalidMoveException from '../../../exceptions/InvalidMoveException';
import GameNotFoundException from '../../../exceptions/GameNotFoundException';
import PlayerNotFoundException from '../../../exceptions/PlayerNotFoundException';
import FullGameException from '../../../exceptions/FullGameException';

const createGame = async (ctx: Context) => {
    const body = ctx.request.body as playerInterface;
    const playerName = body.name.toLowerCase();
    const gameID = crypto.randomUUID();

    let resStatus = 200;
    let resBody = gameID;

    try {
        ctx.app.context.server.createGame(gameID, playerName);
    }
    catch (e)
    {
        /* istanbul ignore next */
        if (e instanceof GameAlreadyExistsException) {
            resStatus = 409;
            resBody = e.message;
        }
        else {
            resStatus = 400;
        }
    }
    finally {
        ctx.body = JSON.parse(JSON.stringify({"id": resBody}));
        ctx.status = resStatus;
    }
}

const joinGame = async (ctx: Context) => {
    const body = ctx.request.body as playerInterface;
    const playerName = body.name.toLowerCase();
    const gameID = ctx.params.id;

    let resStatus = 200;
    let resBody = gameID;

    try {
        ctx.app.context.server.joinGame(gameID, playerName);
    }
    catch (e)
    {
        /* istanbul ignore next */
        if (e instanceof GameAlreadyExistsException ||
            e instanceof GameNotFoundException      ||
            e instanceof FullGameException) {
            resStatus = 409;
            resBody = e.message;
        }
        else {
            resStatus = 400;
        }
    }
    finally {
        ctx.body = JSON.parse(JSON.stringify({"id": resBody}));
        ctx.status = resStatus;
    }
}

const makeMove = async (ctx: Context) => {
    const body = ctx.request.body as moveInterface;
    const move = body.move.toLowerCase();
    const playerName = body.name.toLowerCase();
    const gameID = ctx.params.id;

    let resStatus = 200;
    let resBody = gameID;

    try {
        ctx.app.context.server.makeMove(gameID, move, playerName);
    }
    catch (e)
    {
        /* istanbul ignore next */
        if (e instanceof GameAlreadyExistsException ||
            e instanceof GameNotFoundException      ||
            e instanceof PlayerNotFoundException    ||
            e instanceof InvalidMoveException) {
            resStatus = 409;
            resBody = e.message;
        }
        else {
            resStatus = 400;
        }
    }
    finally {
        ctx.body = JSON.parse(JSON.stringify({"id": resBody}));
        ctx.status = resStatus;
    }
}

const getGameState = async (ctx: Context) => {
    const gameID = ctx.params.id;

    let resStatus = 200;
    let resBody = gameID;

    try {  
        resBody = ctx.app.context.server.getGame(gameID);
    }
    catch (e)
    {
        /* istanbul ignore next */
        if (e instanceof GameAlreadyExistsException ||
            e instanceof GameNotFoundException) {
            resStatus = 409;
            resBody =  e.message;
        }
        else {
            resStatus = 400;
        }
    }
    finally {
        ctx.body = JSON.parse(JSON.stringify({"state": resBody}));
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
