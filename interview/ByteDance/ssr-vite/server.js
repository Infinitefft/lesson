import fs from 'fs';
import path from 'path';
// mvc server 
import express from 'express';
// 脚手架 SSR
import { createServer as createViteServer } from 'vite';
// commonjs 超级变量  脚本执行的当前目录物理路径
// esm 不支持__dirname  
// 参数为空， 当前目录
const __dirname = path.resolve();
const app = express();

async function start() {
  console.log('server starting...');
  const vite = await createViteServer({
    // 中间件， vite 好多的中间件
    server: { middlewareMode: true },
    appType: 'custom'
  });
  // 使用 vite 的中间件
  app.use(vite.middlewares);
  // 中间件 是express/koa 极简框架，在基于请求响应（http），利用一堆的中间件函数
  // 添加各种服务的开发模式。鉴权、请求体解析、日志，一个中间件函数提供一项服务
  // 洋葱模型
  // 中间件函数 ctx = req + res
  app.use(async (req, res) => {
    // 启用中间件， 手写ssr
    // html + react component -> html str 返回给用户 
    console.log('-------')
    try {
      //sync 同步 async 异步  node 特点异步无阻塞
      // 同步读取模板文件 java  控制流程
      let template = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8'
      );
      const { render } = await vite.transformIndexHtml(req.url, template);
      console.log(template, '/////');
      res.status(200).set({'Content-Type': 'text/html'}).end(template);
    } catch (err) {

    }
  })
}

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
start();