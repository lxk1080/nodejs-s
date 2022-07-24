/**
 * 使用 axios 发送请求
 *    - 写成 .default 的形式，是为了让写代码时获得 ts 提示
 *
 */

const axios = require('axios').default

/**
 * 1、发送 GET 请求
 *    - 附带的参数可以直接写在 url 上，也可以通过 params 属性传递，这些参数最终会合并
 *
 */

// axios.get('http://127.0.0.1:3000/home?qwer=123', {
//   params: {
//     a: 1,
//     b: 2,
//   },
//   headers: {
//     Host: 'www.baidu.com',
//     Connection: 'keep-alive',
//     Cookie: 'sessionId=2731',
//   },
// }).then((res) => {
//   console.log(res.data)
// }).catch((err) => {
//   console.log(err)
// })

/**
 * 2、发送 POST 请求
 *    - 默认的 Content-Type 使用的是 application/json
 *    - 传递 query 参数和使用 get 请求一样，可以写在 url 上，也可以使用 params 属性
 *
 */

const data = {
  a: 1,
  b: 2,
}

axios.post('http://127.0.0.1:3000/home', data, {
  params: {
    user: 'droop',
    age: 23,
  },
  headers: {
    Host: 'www.baidu.com',
    Connection: 'keep-alive',
    Cookie: 'sessionId=2731',
  },
}).then((res) => {
  console.log(res.data)
}).catch((err) => {
  console.log(err)
})
