const http = require('http');

const server = http.createServer((req, res) => {
  // es6 新特性
  if (req.url.startsWith('/say')) {
    // 后端支持 padding
    const url = new URL(req.url, `http://${req.headers.host}`)
    const callback = url.searchParams.get('callback');
    console.log(callback);
    // 响应头 不是json，js脚本 callback(data);
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    // json
    const data = {
      id: '1',
      username: '张三'
    }
    res.end(`${callback}(${JSON.stringify(data)})`)
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
})

server.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000');
})