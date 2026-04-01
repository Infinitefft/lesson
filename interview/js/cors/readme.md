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