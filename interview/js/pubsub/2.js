// node 事件模块
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

myEmitter.on('hello', (name) => {
    console.log(`Hello, ${name}!`);
});
myEmitter.emit('hello', 'world');