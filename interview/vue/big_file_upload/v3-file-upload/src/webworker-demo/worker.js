// worker.js
// 独立的js文件
// 与主线程通信 监听主线程有派活？
// self worker 线程 自己
self.onmessage = function(e) {
    const n = e.data; // 接收主线程传来的数字
    console.log(`Worker: 开始计算第 ${n} 项斐波那契数...`);
    
    // 这是一个非常耗时的递归计算，会占用大量 CPU
    const result = fibonacci(n);
    
    // 计算完成后，把结果发回主线程
    self.postMessage(result);
};

// 复杂的计算逻辑
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}