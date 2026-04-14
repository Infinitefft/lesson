# Promise.race

谁先有结果（settled），就返回谁的结果（不管成功还是失败）

其他的promise还会执行，只不过已经没有意义的

- 首先，返回一个promise
- 传入一个iterable 的promise 数组或类数组
- 对每一项做Promise.resolve 包装
    [pro1, pro2, pro3, pro4] 3
- 只要有一个执行，就直接resolve/reject

