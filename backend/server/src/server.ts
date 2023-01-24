import Koa from 'koa';
import config  from './config';
import router from './routes/routes';
import BodyParser from 'koa-bodyparser';

const app = new Koa();

app.use(BodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port, () => {
    console.log(`Server running on: ${config.endpoint}`);
});

