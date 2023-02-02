import Router from 'koa-router';
import callbacks from './callbacks';
import config from '../config';

const router = new Router({prefix: config.prefix});

router
    .post('/', callbacks.createGame)
    .post('/join/:id', callbacks.joinGame)
    .post('/move/:id', callbacks.makeMove)
    .get('/:id', callbacks.getGameState);

export default router;
