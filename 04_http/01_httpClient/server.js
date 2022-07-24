/**
 * 1、服务端模块
 *    - GET 请求的参数直接在 req.url 上，需要自己拆分下
 *    - POST 请求的参数，需要通过 req 的 'data' 和 'end' 事件获得
 *
 * 2、测试时，需要先启动这个服务
 *    - nodemon server.js
 *
 */

const http = require('http')
const server = http.createServer()

server.on('request', (req, res) => {
  if (req.url.split('?')[0] === '/home') {
    console.log('method ==>', req.method)
    console.log('headers ==>', req.headers)
    console.log('url ==>', req.url)
    let data = ''
    req.on('data', chunk => {
      data += chunk
    })
    req.on('end', () => {
      console.log('postData ==>', data)
    })
    res.end('hello world')
  }
})

server.listen(3000, '0.0.0.0', () => {
  console.log('server is up at 3000...')
})
