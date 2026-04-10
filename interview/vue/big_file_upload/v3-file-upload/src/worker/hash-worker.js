self.addEventListener('message', async (e) => {
    self.postMessage('你好啊，worker 线程');
})