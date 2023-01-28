import Router from 'koa-router';
import { Context, Next } from 'koa';
import callbacks from './callbacks';
import config from '../config';

const router = new Router({prefix: config.prefix});

router
    .post('/', callbacks.createGame)
    .post('/:id/join', callbacks.joinGame)
    .post('/:id/move', callbacks.makeMove)
    .get('/:id', callbacks.getGameState);


export default router;