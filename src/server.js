import Koa from 'koa';
import mount from 'koa-mount';
import send from 'koa-send';
import Router from 'koa-router';
import db from './server/db';
import fs from 'fs';
import genius from './server/genius';

const app = new Koa();
app.context.db = db;

const router = new Router();
const api = new Router();

router.get('/', async (ctx, next) => {
  await send(ctx, 'index.html', { root: __dirname + '/client' });
});

router.get('/dist/*', async (ctx, next) => {
  await send(ctx, ctx.path, { root: __dirname + '/client' });
});

api.get('/search/track/:term', async (ctx, next) => {
  ctx.body = await genius.searchTracks(ctx.params.term);
});

api.get('/track/:id', async (ctx, next) => {
  ctx.body = await genius.getLyrics('https://genius.com/Maxo-kream-grannies-lyrics');
});

router.use('/api', api.routes(), api.allowedMethods());

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
