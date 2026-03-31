const fs = require('fs')

console.log('start')

// timers 阶段
setTimeout(() => {
  console.log('timeout')
}, 0)

// check 阶段
setImmediate(() => {
  console.log('immediate')
})

// poll 阶段
fs.readFile(__filename, () => {
  console.log('readFile')

  setTimeout(() => {
    console.log('timeout in I/O')
  }, 0)

  setImmediate(() => {
    console.log('immediate in I/O')
  })
})

// microtasks 优先级高于promise
// then 进入微任务队列是在同步代码执行完后 情绪价值

Promise.resolve().then(() => {
  console.log('promise')
})

// nextTick 微任务
process.nextTick(() => {
  console.log('nextTick')
})

console.log('end')