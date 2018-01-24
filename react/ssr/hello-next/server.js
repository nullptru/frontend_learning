import Koa from 'koa';
import next from 'next';
import Router from 'koa-router';

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = new Koa();
        const router = new Router();

        router.get('/p/:id', async ctx => {
            const actualPage = '/post';
            const queryParams = { id: ctx.params.id };
            await app.render(ctx.req, ctx.res, actualPage, queryParams);
        });

        router.get('*', async ctx => {
            await handle(ctx.req, ctx.res);
        });
        
        server.use(router.routes());

        server.listen(3000);
        console.log('server runs in 3000');
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    });
