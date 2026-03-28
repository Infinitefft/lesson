# 字节面试题

## Web Socket 和 SSE 的区别

- 面试官心理
  - SSE 是llm 流式输出，当下业务热点
  - 408 计算机网络 协议底层的理解
  - 类比
    共同点 实时推送数据
  - 前端比较熟悉的是http协议，跨协议开发的经验
  - websocket 是HTML5 的用于即时通讯
    聊天、游戏等场景 Socket协议（QQ、微信、端游）
    Client/Server 架构 实时通讯
    Browser/Server架构  浏览器，

### WebSocket
- Web + Socket
  Socket 基于tcp/ip 的实时通讯双工（双方都可以发送跟接收）协议
  Web + Socket 是html5提供的新特性 在web端也可以实时通讯了
  WebSocket 是一种在浏览器和服务器之间建立“长连接”的协议，可以实现双向实时通信。

### 项目需求分析
  chat-app 聊天应用
  - http 协议不适合
  基于请求（一次）、响应的（一次）获得最新的聊天内容，重新访问服务器（刷新页面）
  - sse 也不适合
  服务器端推送，单项持续推送，没办法做到用户端的持续推送
  只适合用户和llm聊天，prompt一次，llm 流式输出
  - socket 协议
  双工协议
  - 实时收消息
  - 实时发消息
  - 多人同步
  - 基于http协议，可以实时通讯吗？
    一定要遵守拿新内容，一定得走服务器
    fetch/ajax  dom 动态更新
    使用轮询 setInterval()  性能差，复杂
    http + loop ajax 类实时聊天的功能
  - websocket 一次链接，持续通信
  - 服务器端和用户端都可以主动推送

  - websocket 细节
    - koa + koa-websocket
    - new Koa()  listen 3000
    - app.use(middleware 就是一个函数)
    - ctx 请求响应上下文
    - 第一次和服务器的通信用http协议，拿到页面
    - 之后就是socket协议
      client  new WebSocket('ws://localhost:3000/ws')
    - 消息机制 实时通信（广播，服务器端维护了连接数组）
      on
      send
    - 101 switch protocol
      new WebSocket() 以后切换成socket协议

- 基于请求+响应的http 短连接，是要断开的
  keepAlive 不断开，其他的同domain 资源可以复用通道
  http 2.0 多路复用  tcp/ip 连接有开销的
- WebSocket 长连接（持久化双向通道）
- SSE 长连接（持久化单向通道）
- 通信方式 HTTP（客户端发起，服务器响应）、SSE（仅服务端向客户端发送） 都是单向的， WebSoket 双向（全双工，客户端和服务端都可以发送）
- 数据格式 HTTP无限制（文本、二进制、JSON等）
  ws 二进制数据或文本帧  SSE 仅文本（通常为 JSON 或纯文本）
- 协议类型  HTTP/1.1，HTTP/2.0，HTTP/3.0  WebSocket 协议（ws://或wss://）  SSE HTTP 协议（text/event-stream）
- 浏览器兼容性 HTTP 完美支持所有浏览器  WS 支持所有现代浏览器  SSE不支持IE，现代浏览器支持良好（fetch + readStream blob）

## 介绍心跳机制
客户端和服务端定期互相报平安，用来检测连接是否活着。
打个比方，异地恋两个人打电话
你在吗？心跳
为什么需要心跳？因为WebSocket/SSE 是长连接
- 网络断了
- 用户掉线
- 必须主动检测连接状态，ping/pong 心跳机制的测试

- 实现的方式
  - 客户端发送
  setInterval(() => {
    ws.send(JSON.stringify({type: 'ping'}));
  }, 30000)
  - 服务器端收到
  if (msg.type === 'ping') {
    ws.send(JSON.stringify({type: 'pong'}));
  }

  三步：
  - 定时发送ping
  - 接收响应pong
  - 超时判断 + 重连机制