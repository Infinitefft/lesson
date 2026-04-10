const startBtn = document.getElementById('startBtn');
const resultDisplay = document.getElementById('result');
const statusDisplay = document.getElementById('status');

// 1. 创建 Worker 实例，指向我们的 worker.js 文件
// 注意：必须在同源策略下运行（即文件都在本地服务器或同源目录下）
const myWorker = new Worker('worker.js');

startBtn.addEventListener('click', () => {
    resultDisplay.textContent = '计算中...（页面未卡死）';
    statusDisplay.textContent = '页面状态：流畅（你可以随意点击按钮或选中文字）';
    
    // 2. 向 Worker 发送数据（发送数字 40，这是一个较大的计算量）
    myWorker.postMessage(40);
    
    console.log('主线程：已发送计算请求');
});

// 3. 接收 Worker 返回的结果
myWorker.onmessage = function(e) {
    resultDisplay.textContent = e.data;
    statusDisplay.textContent = '页面状态：计算完成！';
    console.log('主线程：收到结果', e.data);
};

// 4. 处理 Worker 可能出现的错误
myWorker.onerror = function(error) {
    console.error('Worker 发生错误:', error.message);
    resultDisplay.textContent = '出错了！';
};