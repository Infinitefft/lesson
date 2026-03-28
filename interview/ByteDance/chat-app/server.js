const Koa = require('koa');  // commonjs
const websocket = require('koa-websocket');
// 给server app 添加websocket能力
// server 就可以实时地和用户端进行通信
const app = websocket(new Koa());

const clients = new Set();  // 用户端连接集合

// 启动一个中间件
app.use(async (ctx) => {
  // ctx = req + res
  // 响应的内容是
  ctx.body = `
  <!DOCTYOPE html>
  <html>
  <head>
    <title>Chat App</title>
  </head>
  <body>
    <div id="messages" style="height: 300px; overflow-y: scroll;"></div>
    <input type="text" id="messageInput"/>
    <button onClick="sendMessage()">Send</button>

    <script>
      // html5 WebScoket对象
      // ws://  websocket 协议 不是http://
      const ws = new WebSocket('ws://localhost:3000/ws');
      ws.onmessage = function(event) {
        const messages = document.getElementById('messages');
        messages.innerHTML += '<div>' + event.data + '</div>';
      }
      function sendMessage() {
        const input = document.getElementById('messageInput');
        ws.send(input.value);
        input.value = '';
      }
    </script>
  </body>
  </html>
  `
})

// newsocket
// 处理websocket 连接
app.ws.use(async (ctx, next) => {
  // console.log('websocket connected');
  clients.add(ctx.websocket);
  // 服务端接收到消息时
  ctx.websocket.on('message', message => {
    for (const client of clients) {
      client.send(message.toString());
    }
  })

  ctx.websocket.on('close', () => {
    clients.delete(ctx.websocket);
  })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})