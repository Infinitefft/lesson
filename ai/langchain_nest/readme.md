# Nest + LangChain 实现AI接口

- 大多数 Agent 都是跑在后端服务
  Nest + LangChain 开发 api 接口
- Nest
  Node.js + TypeScript 的 最主流框架
  底层是express（轻量级）
  提供了 MVC 、DI（依赖注入 Dependencies Injection）等架构特性

- 创建项目
  - MVC
  后端的开发设计模式
  Model  Service（数据操作）
  View(前后端分离)
  Controller 控制器  参数校验和逻辑
  module 会将 Controller Service（providers）import（外部服务） 组合起来形成一个功能模块
  适合企业级开发。
  - DI（依赖注入 Dependencies Injection）
  - 装饰器模式
  面向对象设计模式之一
  函数或类快速通过装饰器 增强功力
  - RESTful
  一切皆资源
  book（名词）+ CRUD（HTTP Method 动词）

  