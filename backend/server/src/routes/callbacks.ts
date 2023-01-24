import { Context } from 'koa';


// async function that returns hello world
const helloWorld = async (ctx: Context) => {
    ctx.body = 'Hello World';
}

const createGame = async (ctx: Context) => {
    // retrieve the player name from the request body
    const name = ctx.request.body;

    ctx.status = 200;
    ctx.body = name;
}


// store all callbacks in an object
const callbacks = {
    helloWorld,
    createGame
}

export default callbacks;