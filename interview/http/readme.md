# 讲一下http 协议

HTTP, HyperText Transfer Protocol 是基于TCP/IP 的应用层协议，是互联网数据同学新和网页传输的基石，基于请求响应的简单协议，无状态，特别适合海量用户的网页访问与高并发互联网场景。

我将从http 各个历史版本的进化来介绍

- http 0.9 是最原始的版本，仅支持GET请求，无请求头与响应头
文本互联通信设计
- HTTP 1.0
    - 支持多种方法 GET/POST/HEAD
    HEAD 只返回响应头没有正文
    - 引入Header
        Cookie 携带客户端缓存的用户会话标识
        User-Agent 标明客户端浏览器/设备信息
        pc/mobile 不同网页 @media query 适配+rem，缺点是多下载内容，不好管理
        财大气粗的国内  分PC/移动两条业务线
        Mozilla/5.0 几乎都以它开头
        (Windows NT 10.0; Win64; x64) 硬件和系统 关键
        AppleWebKit/537.36 渲染引擎
        Chrome/146.0.0.0 浏览器及版本
        Safari/537.36 兼容safari
        Content-Type 请求体数据格式  img
        Accept 可接受的响应类型
        Authorization
- 短连接（每次请求都要 TCP 建立连接）（早期并发的http 请求数不是特别多）
    每个请求都要TCP三次握手、四次挥手

## HTTP 1.1
- 长连接（Keep-Alive）
一个TCP 连接可以复用多个请求，是为了text/css, text/js, image/*... 同域加载速度，减少 HTTP 握手开销的互联网发展请求。
- 管道化（Pipelining）
基于长连接，可以连续发送多个请求
普通连接：发送一个请求 -> 等待响应回来 -> 再发下一个

就算有Keep-Alive 不用反复建立连接，但还要挨个等待请求，网速还是浪费
管道化：不用等待上一个响应，一口气连续多发好多个请求，排队发送给服务器

http 明文文本传输

但它对队头阻塞严重缺陷，实际浏览器基本都禁用了
同一个TCP连接里，响应没有编号，多个请求就好像排队的一字长蛇车队一样。
虽然可以不断发车，但前端一个堵车，后面全车排队堵死，再快也没用

- 分块传输（chunked）边传边收，响应无固定长度，用 Transfer-Encoding: chunked，服务器边生成边发，浏览器边解析，无需等待完整文件。SSE 流式输出，文件流

- Host 头
    上线，阿里云部署 IP 地址 + node 服务（租给了几百个人） + 一年 亏死
    IP 地址 + host 约束

- OPTIONS、PUT/PATCH/、DELETE，web engineer 成熟，restful

HTTP 1.1 的最大问题是应用层的队头阻塞
    - 数据包明文
    - 没有编号

### HTTP 2.0
- 二进制分帧 帧ID，车牌号 同TCP/IP 连接 多路复用，不同请求帧混传，按ID归类：
一个流阻塞不影响其他，解决了队头阻塞。
HTTP 1.1 存文本明文传输，一堆数据分不清边界，没办法插队
HTTP 2.0 改进二进制 + 帧 + 流ID 切小块混号混传，不会阻塞。
- 多路复用
    一个TCP 连接可以并发多个请求，不需要多个连接
- 服务器推送 Server push
    服务器主动推送资源给客户端。浏览器只请求HTML，服务器主动把css/js提前推送给浏览器，不用浏览器再发送请求

### HTTP 3.0
HTTP3 = HTTP 2 + QUIC (基于UDP)
Quick UDP Internet Connections

使用 QUIC 基于UDP 用户数据报协议 无连接，不重传，不管顺序，快但不可靠，不再用TCP
彻底解决队头阻塞，每个流都独立，丢包只影响当前流
更快建立连接 0-RTT
内置TLS（安全/快）把加密做成传输协议的一部分。
HTTP 3 彻底抛弃TCP，全程基于UDP + QUIC，没有三次握手，改用QUIC 自定义可靠传输逻辑。