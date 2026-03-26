# 定时任务 

明早9点，帮我把最新关于open claw 的新闻，整理成一片日报，发到我的邮箱。

- 日程安排的能力交给小龙虾
- 网络搜索tool
- 写文章
- 发邮件

## 生成器

普通函数，一调用就从头跑到尾
生成器函数 跑一些遇到yield停下来，promise 解决后可以从暂停的地方继续跑
async await 的前身

## RxJS
用数据流的方式来处理异步事件
- JS里常见的异步方式
  - callback 回调地狱
  - Promise
  - generator/yield
  - event listener
  - async/await

以上是适合一次性的异步任务
有很多异步任务是连续发生的事件
  - SSE
  - 输入框输入
  - 鼠标移动
  - AI 流式

事件1 -> 事件2 -> 事件3 -> 事件4
像一条河流