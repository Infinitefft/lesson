# node 了解多少？

相比于 Java/Go ，nodejs 借助于v8 引擎在服务器端，将 js 带到了后端开发，轻量级（express/koa）高效（中间件）、生态丰富，稳居大前端全栈（BFF层 Backend For Frontend）主流。适合接口转发，实时通信，AI网关与管理后台开发。

node 特性是异步无阻塞、单线程高并发（单线程简单，I/O，网络请求等耗时性任务，不会卡在那等待，放入event loop，立刻切换处理新需求，少量线程就能抗成千上万的并发连接）服务器开销是 java 的一半。

我对 node 的核心模块比较熟悉，比如 fs 文件模块 流式处理、path 路径模块、http等模块。对node 的事件循环机制、异步模型（Promise/async-await）有比较多的实操。

在后端开发上，我是基于Restful api 思想做服务设计，熟悉 mvc 分层。最近在使用 NestJS 做后端开发，天然支持模块化和依赖注入。

数据库主要使用 MySQL 和 Postsql，使用过 prisma orm 开发

我会基于LangChain 做 AI 接口开发，比如封装 LLM 调用、构建工具调用（Tool），可以实现 Agent 开发流程。

我写了一个 RAG 项目，了解文档切分、向量化、向量数据库存储、检索、增强的细节，完成了对知识库的RAG。

我从node基础能力到nestjs 工程化及企业级开发再到ai和agent都有学习和项目经验，我相信可以较快速地加入公司的AI Agent 或 OpenClaw 相关项目中。


- readFile/writeFile  promisify thenable 不用调用回调函数
  readfileSync 阻塞式
- createReadStream pipe 流式输出


- BFF 层
mockjs/express/koa  前端自己做
基于 Go/Java的接口，针对自己的业务做调整


## nodejs event loop
- event loop 是 js 的执行机制，node 和前端的event loop 本质相同，都是基于js，都是基于事件驱动的异步模型，但实现细节不同。

- 前端（浏览器）主要分为宏任务（script、setTimeout）和微任务（Promise），每轮循环先执行宏任务，再清空微任务队列，并去渲染更新或响应用户。
宏任务（script开始） -> 清空微任务队列 —> 渲染更新界面 -> 下一轮

- nodejs（服务器，操作系统，文件系统，数据库）更复杂，事件循环分为多个阶段，timers（定时器）、poll（文件、网络）、check（poll之后都会来核查），同时也有promise，process.nextTick 微任务（属于每个阶段）。
timers（定时器）-> poll（轮询阶段：I/O，文件读取，网络，数据库）-> check（poll空闲结束后强制进入此阶段核查执行）-> microtasks 随阶段执行

node 偏 多阶段调教，前端更偏宏微任务模型。