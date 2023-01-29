import { Context } from 'koa';
import crypto from 'crypto';

import { playerInterface, moveInterface } from './interfaces/interfaces';

const createGame = async (ctx: Context) => {
    const body = ctx.request.body as playerInterface;
    const playerName = body.name.toLowerCase();
    const gameID = crypto.randomUUID();

    ctx.app.context.server.createGame(gameID, playerName);
    ctx.body = gameID;
    ctx.status = 200;
}

const joinGame = async (ctx: Context) => {
    const body = ctx.request.body as playerInterface;
    const playerName = body.name.toLowerCase();
    const gameID = ctx.params.id;

    ctx.app.context.server.joinGame(gameID, playerName);
    ctx.body = gameID;
    ctx.status = 200;
}

const makeMove = async (ctx: Context) => {
    const body = ctx.request.body as moveInterface;
    const move = body.move.toLowerCase();
    const playerName = body.player.name.toLowerCase();
    const gameID = ctx.params.id;

    ctx.app.context.server.makeMove(gameID, move, playerName);
    ctx.body = gameID;

    ctx.status = 200;
}

const getGameState = async (ctx: Context) => {
    const gameID = ctx.params.id;
    const game = ctx.app.context.server.getGame(gameID);

    ctx.body = game;
    ctx.status = 200;
}

// store all callbacks in an object
const callbacks = {
    createGame,
    joinGame,
    makeMove,
    getGameState
}

export default callbacks;