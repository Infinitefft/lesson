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

## 流式输出
- nest.js + rxjs 实现服务器端 sse 接口
  - nest.js 以 @Sse 装饰器模式  /ai/chat/stream
  - 本质是 设置了 Content-Type: text/event-stream
  Cache-Control Connection Transfer-Encoding 等
  - service 模块根据 langchain stream：true  llm流式响应
  - 使用rxjs from api 将llm 的流式响应转成一个 Observable 对象
    pipe一下，map 转成前端需要的data:chunk 格式
  - service 使用langchain tool 定义了 queryUserTool 等tool
  - llm 流式大模型响应 for await chunk of stream
  - chunk 不断concat 合并
  - 判断fullMessageChunk.tool_call_chunks
    - 如果是，不干
    - 如果不是，yield 输出
  - agentLoop
    - 如果要调用工具，执行tool(args)
  - 结束

## Event Source
- hmtl5 特性的时候
  - 语义化标签
  - video/audio 标签，哔哩哔哩
  - canvas 游戏和3D
  - 定位 Geolocation 经纬度  美团的点外卖
  - 表单的增强能力 placeholder required type="range" input 的类型
  - llm 流式输出 EventSource 自动接收服务器推送的文本数据流
  - localStorage/sessionStorage 本地存储
  - Web Worder  JS 多线程
  - WebSocket 全双工通信
  - 拖放 API
  - getUserMedia 摄像头 web直播/视频
  - history API 前端路由

- ts 的 Partial 和 Omit
  Partial可选  Omit排除
  partial: Partial<Omit<User, 'id'>>
  

- 深化tool
  - query_user
  把 tool 作为provide 在module 里声明，和原有的service 解耦
  依赖注入的方式 model.bindTools()

## 邮件tool
- 邮件服务
  服务器 提供http 服务（Web Server 3000 | nginx 80），邮件服务，数据库服务（3306）
  端口
  pnpm i nodemailer(邮件npm)  @nestjs-modules/mailer(nest 接入nodemailer,生态很好)
  - 发送的内容是邮件，不是text/html
  - 传输 不能用HTTP  QQ邮箱提供的SMTP服务  408