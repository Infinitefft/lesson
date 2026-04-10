# 大文件上传

## 上传
post input[type=file] blob
写入服务器相应文件夹 upload/

## 大文件
- http 2.0/3.0  多路复用
    太慢了，blob 切片 并发请求
- 用户体验
    移动端  网络不稳定
    大文件上传容易失败 用户沮丧
- 断点续传
    file id-chunk-i
- 秒传
    之前上传过

需解决网络不稳定与内存溢出痛点。核心采用切片上传降低单次负载，配合断电续传确保失败可恢复，利用并发控制提升速度，并通过秒传机制避免冗余传输。

### WebWorker
hmtl5 新特性，js的多线程
worker 线程 js 有些不擅长的工作，
js 擅长的描述、dom操作，不擅长 计算（Number）
hash 计算 耗费大量时间 js 单线程
耗时性任务放在worker 线程中去做
js 通过消息机制
- self worker 线程自己
- postMessage  onmessage 消息机制