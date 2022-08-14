
/**
 * 1、timer 和 check 队列的常规使用
 *    - 结果：有时先输出 timer，有时先输出 immerdiate
 */

// setTimeout(() => {
//   console.log('timer')
// }, 50)
//
// setImmediate(() => {
//   console.log('immerdiate')
// })

/**
 * 2、timer 和 check 在 I/O 操作中使用
 *    - 结果：固定先输出 immerdiate，后输出 timer
 */

const fs = require('fs')

fs.readFile('./index.js', () => {
  setTimeout(() => {
    console.log('timer')
  })

  setImmediate(() => {
    console.log('immerdiate')
  })
})
