
/**
 * 说明：http-client，让当前模块作为客户端，向其他系统发送请求
 *    - 使用原生 http 模块发请求，包括 GET 和 POST
 *    - 使用 POST 请求需要 req.write 传递数据
 *    - 不要忘记写 req.end()，否则请求发不出去
 *
 */

const http = require('http')
const qs = require('querystring')

/**
 * 1、使用 get 请求
 *
 */

// const req = http.request({
//   hostname: '127.0.0.1',
//   port: 3000,
//   method: 'GET',
//   path: '/home?a=1&b=2',
//   headers: {
//     Host: 'www.baidu.com',
//     Connection: 'keep-alive',
//     Cookie: 'sessionId=123',
//   },
// }, (res) => {
//   let dataStr = ''
//   res.on('data', (chunk) => {
//     dataStr += chunk
//   })
//   res.on('end', () => {
//     console.log(dataStr)
//   })
// })
//
// req.end()

/**
 * 2、使用 post 请求
 *    - 注意：headers 里面的 Content-Length 属性，是个 Number，要不就不传，要不一定要传对（传过去估计性能会好点，不需要服务器自己判断传递数据的大小）
 *      - 传对了：服务端刚好拿到传过去的完整的数据
 *      - 传短了：服务端拿到不完整的数据
 *      - 传长了：服务器会卡住无响应，因为传过去的数据不够长，服务器会一直等待客户端传过去
 *
 */

const originData = {
  user: 'dioop',
  age: 25,
}

// 使用 application/x-www-form-urlencoded 方式
// const data = qs.stringify(originData)

// 使用 application/json 方式
const data = JSON.stringify(originData)

const req = http.request({
  hostname: '127.0.0.1',
  port: 3000,
  method: 'POST',
  path: '/home?a=1&b=2',
  headers: {
    Host: 'www.baidu.com',
    Connection: 'keep-alive',
    Cookie: 'sessionId=123',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
}, (res) => {
  let dataStr = ''
  res.on('data', (chunk) => {
    dataStr += chunk
  })
  res.on('end', () => {
    console.log(dataStr)
  })
})

req.on('error', (err) => {
  console.log(err)
})

req.write(data)
req.end()
