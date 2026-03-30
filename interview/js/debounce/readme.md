# 用agent ide 写一道debounce

## 面试官心态

- 频繁触发（搜索建议等）-> 通过重置倒计时 -> 只执行最后一次
先表达实现原理
  1. 闭包 定时器ID，执行函数，delay等自由变量
  2. 清除上一次的定时器
  3. 重新设置定时器，延迟执行目标函数
  4. 最后一次（超过delay）函数执行时apply绑定this，使用箭头函数，...reset运算符拿到相应的参数
- 进阶版本的来了
  - leading 是否立即执行
  - cancel 取消
  - 返回值处理 promise 支持
  实现细节
  - 函数对象声明，不是直接返回
  - 函数对象上添加 cancel 方法
  - 如果有leading 立即执行的需要，执行+isInvoked开关变量的设计
  - return new Promise 支持 promisify

- hooks化  ahooks 阿里的hooks库
  - 频繁触发的事件
  - 频繁修改的值

- vibe coding
你是一位具有10年开发经验的JavaScript高级工程师，熟悉函数式编程、浏览器事件模型、lodash、ahooks等工具库的实现。
现在你需要实现一个“企业级debounce函数”，要求代码具有高可读性、健壮性。
[功能需求]
1. 支持基础防抖功能：多次调用旨在最后一次执行。
2. 支持options 参数
  - leading 是否在首次触发时立即执行
  - trailing 是否在停止触发后执行
3. 支持 this 的绑定，参数的透传
4. 返回值需要正确处理
5. 提供以下附加方法：
  - cancel() 取消当前防抖
  - flush() 立即执行当前函数
6. 需要处理的边界情况
  - 连续快速触发
  - leading 和 trailing 同时存在
  - timer 清理问题
7. 使用 TypeScript 编写，保证类型安全

[代码要求]
1. 不要使用lodash 或任何三方库
2. 代码结构清晰
3. 添加必要的注释，说明关键逻辑
4. 保证没有内存泄露的风险
[输出要求]
1. 只输出最终代码，不要解释
2. 代码必须可以直接运行



- prompt 最佳实战
  - 给他一个角色  工具函数编写，10年高级
  - 对标对象 lodash js 工具函数  _.debounce(), ahooks 
  - 明确功能边界
  - 支持ts

## 你了解 node 多少