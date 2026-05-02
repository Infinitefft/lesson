# Claude Code RAG 项目

- 自我表达 吴恩达的AI 系列视频
Claude Code: A higly Agentic Coding
Assistant

- 项目接收RAG
    cc
    如何了解项目
    新手如何接入项目
- 项目的重构重构

## 端到端的RAG 聊天机器人

### 用Claude code探索代码库
快速熟悉大型代码库
cc 和代码库聊天
- give me an overview of the codebase
    cc Agent
    入口、md、依赖关系、分析代码
    memory 机制
    无需查找每个文件，而是通过智能搜索找到最相关的内容，获得架构信息、关键组件...
    如果想要深入了解的内容
- 高级别的问题 
    how are these documents processed?
    不用进入文件夹搜索
    生成流程图或可视化图表
- trace the process of handling a user's query form frontend to backend
写入文档
- Multi Agent 做法
    cursor/claude code
    cc command-cli 并发

- 深入问任何细节

### 一图胜千言
- draw a diagram that illustrates this flow
- how do i run this application

### claude code 的 init 命令
初始化项目
用代码库文档初始化一个claude.md 文件
/init 项目产品说明和技术架构
每次都会加入上下文

- 不同级别的claude.md 文件
    - 项目级别
        /init
        会在代码仓库中 共享
    - 个人级别
        claude.local.md
        .gitignore 中
    - 机器上所有项目中
        ~/.claude/CLAUDE.md
        不去写项目相关
    - 企业级别

### harness
permissions

- always use uv the server do not use pip directly
    npm i dotenv   pip 
    pnpm i dotenv    uv 新生代包管理器

- /help
    所有的系统指令
    明确执行，不需要语义理解， mcp/skills tool

- /clear  清空对话历史
    开发新任务或新功能

- /compact 总结功能

- /escape 退出当前对话

- cc 和 git 联动