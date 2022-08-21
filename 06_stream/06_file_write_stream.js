
/**
 * 说明：文件可写流解析
 */

const fs = require('fs')

/**
 * 1、创建可写流
 *    - 参数和文件可读流的参数基本相同，可参考可读流 05_file_read_stream.js 内参数说明
 *    - 要写入的文件如果不存在，会自动创建。注意文件夹不会自动创建
 */

const ws = fs.createWriteStream('./helper/test2.txt', {
  flags: 'w',
  encoding: 'utf-8',
  fd: null,
  mode: 438,
  autoClose: true,
  start: 0,
  highWaterMark: 3,
})

/**
 * 2、可读流的一些事件
 *    - write 可接收三个参数 (写入内容: string | buffer, 字符编码?: string, 回调函数?: function)
 *    - ws.end() 可以不传参数，仅代表写入结束。必须调用 ws.end() 才能触发 close 事件
 *    - write 不能用在 end 之后，否则会触发 error 事件，并且写不进任何内容
 */

ws.on('open', () => {
  console.log('可写流打开了')
})

ws.on('close', () => {
  console.log('可写流关闭了')
})

ws.on('error', () => {
  console.log('可写流出错了')
})

ws.write('123', 'utf-8', () => {
  console.log('写入了123')
})

ws.write('456')
ws.write('789')

// ws.end() 可以不传参数，仅代表写入结束
ws.end('abc', () => {
  console.log('写完了最后一个chunk')
})

// write 不能用在 end 之后，否则会触发 error 事件，并且写不进任何内容
// ws.write('用来验证 on("error") 事件的')
