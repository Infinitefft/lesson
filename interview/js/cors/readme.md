# 跨域

浏览器同源策略是跨域的根源。协议、域名、端口任一不同即跨域。它为保护用户数据安全，防止恶意网站窃取本地信息、改页面发起非法请求，限制非同源网页读写资源与接口通信。

日常开发中都是前后端分离的，还有会使用各个部门，合作商的跨域接口

## jsonp（json with padding）
主要用于跨域请求，JSONP 最大的优点是在于它极其搞得浏览器兼容性和简单性
  - es6 startsWith 判断 req.url 以 /say 开始
  - jsonp函数的封装，return promise，拿到json后的前端业务处理 thenable/await
  - 拼接请求参数 params json，for key in   key=value放到数组里面，用 &join 一下
  - 实现细节
  1. 动态创建一个script标签，src 加载脚本不受同源策略的限制，src queryString 除了自身参数外，再带上一个callback参数，值为callback+随机数（避免缓存）。
  2. 后端先解析callback 参数的值，设置响应头为 text/javascript 返回json的数据。数据用callback的值作为函数包裹返回，即json with padding

- 缺点：
  - 容易遭受XSS 攻击，因为他是通过 script 标签加载数据，无法有效验证来源。
  - 仅支持GET请求
  - 额外加载的script标签会阻塞页面渲染，影响性能。

现代应用推荐使用cors 代替 jsonp。

## cors
全称是Cross-Origin Resource Sharing 跨源资源共享。
> 它是一种基于 HTTP 头的机制，允许服务器声明哪些外部源（域、协议或端口）可以访问其资源。通过 CORS，浏览器能够安全地进行跨源数据传输，从而在保障安全的前提下，突破了浏览器同源策略的限制。后端开发框架都有响应的cors中间件。启用一下就好，也可以进行细节设定。

Access-Control-Allow-Origin  *所有，白名单
Access-Control-Allow-Methods: GET, POST, PUT  只读，允许新增，不可修改
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true 是否允许发送凭据（cookies，HTTP认证信息）

如果是复杂跨域，发送两次请求。多一次预检请求（Preflight Request）

- 使用了非简单方法（如PUT、DELETE，而不是GET/POST）
- 使用了自定义的请求头 X-Custom-Header
- 请求内容类型不是 application/x-www-form-urlencoded multipart/form-data 或 text/plain

### cors 预检(preflight)请求
先发送 OPTIONS 请求，服务器要配合，返回 CORS 响应头设置，状态码为204(No Content) 没有响应体
浏览器根据响应头进行预检
之后再进行复杂请求的真是处理。


## websocket 不是http，没有同源策略，可以跨域
- 先用 http 协议，连接用户
- new WebSocket(ws://url) 101 切换协议，建立双工通信
- 基于消息机制通信

## postMessage html5 特性
postMessage 是浏览器提供的 API ，允许不同源的窗口或 iframe 实现跨域通信。
iframe 标签，网页里打开另一个网页，性能差，不建议用。
举例：主站页面窗口，唤起第三方支付窗口，通过 postMessage 发送订单的详情。
支付成功后，结果的回传
<iframe> 是 HTML 中的一个标签，它允许你在当前网页中嵌入并显示另一个独立的网页或文档，就像一个“画中画”的窗口。

## vite 反向代理 proxy
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```
前端全栈开发的本地开发适合使用这个配置
前端需要后端提供api
vite proxy 配置 拦截/api 请求
向后端api端口发送请求
vite 请求是后端向后端的请求，不受同源策略的影响，不跨域

## ngnix 反向代理proxy
- 相对于vite，线上跨域 proxy
- 80端口
  www.baidu.com -> dns  ip -> nginx 在80端口 
  proxy 3000

  localhost/api  domain/api  -> 代理 localhost:3000/api

```
server {
  listen 80;  # 监听端口
  server_name localhost;  # 当前服务域名

  # 前端静态资源（可选）
  location / {
    root   /usr/share/nginx/html;
    index  index.html;
  }

  # 👇 核心：代理 /api 请求
  location /api/ {

    # 👉 目标服务器地址（后端接口）
    proxy_pass https://api.example.com/;

    # 👉 修改请求头中的 Host（避免后端识别错误）
    proxy_set_header Host $host;

    # 👉 获取真实客户端 IP（生产环境常用）
    proxy_set_header X-Real-IP $remote_addr;

    # 👉 转发客户端 IP 链（多层代理时用）
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    # 👉 支持 https 场景（有些接口需要）
    proxy_set_header X-Forwarded-Proto $scheme;

    # 👉 关闭缓存（调试接口时很重要）
    proxy_cache_bypass $http_upgrade;
  }
}
```

推荐使用 ngnix proxy_pass 配置反向代理
ngnix 80 端口 / 编译后的 index.html, main.jsx, app.jsx 前端启动起来了
/api 接口请求 走 ngnix的proxy_pass api.example.com 实现跨域代理
适合部门或公司内部，对于集团的多个子公司，合作的其他公司
cors的白名单配置更适合