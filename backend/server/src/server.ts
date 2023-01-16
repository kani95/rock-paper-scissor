import Koa from 'koa';
const app = new Koa({ proxy: true });
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});