import koa from 'koa';
import BodyParser from 'koa-bodyparser';
import config from './config';
import router from './routes/routes';
import { Context, Next } from 'koa';

const app = new koa();

app.use(BodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (ctx: Context, next: Next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.set('Content-Type', 'application/json');
    await next();
});

export default app.listen(config.port);
