import Router from 'koa-router';

import callbacks from './callbacks';
import config from '../config';

const router = new Router({prefix: config.prefix});

router.post('/', callbacks.createGame);

export default router;