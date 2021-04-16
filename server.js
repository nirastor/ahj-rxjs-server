const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
var faker = require('faker');

const app = new Koa();

app.use(cors());
app.use(koaBody({json: true}));

let id = 1;
const messages = [];

setInterval(() => {
    if (messages.length > 100) {
        messages = messages.slice(50)
    }
    messages.push({
        id,
        from: faker.internet.email(),
        subject: faker.lorem.sentence(),
        body: faker.lorem.paragraph(),
        received: Date.now(),
    })
    id += 1;
}, 60 * 1000)


const router = new Router();

router.get('/messages/unread', async (ctx, next) => {
    ctx.response.body = {
        status: "ok",
        timestamp: Date.now(),
        messages,
    };
});

app.use(router.routes()).use(router.allowedMethods());

const port = 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));