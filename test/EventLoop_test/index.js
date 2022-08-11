
/**
 * 说明：Node 事件循环测试
 *    - 结果：start end tick p s1 p1 s2 p2 setImmediate
 *      - tick 的优先级大于 promise，没有为什么。其他顺序正常
 */

setTimeout(() => {
  console.log('s1')
  Promise.resolve().then(() => {
    console.log('p1')
  })
})

setTimeout(() => {
  console.log('s2')
  Promise.resolve().then(() => {
    console.log('p2')
  })
})

Promise.resolve().then(() => {
  console.log('p')
})

console.log('start')

process.nextTick(() => {
  console.log('tick')
})

setImmediate(() => {
  console.log('setImmediate')
})

console.log('end')
