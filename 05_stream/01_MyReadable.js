
/**
 * 说明：自定义可读流
 *    - 自定义的方式
 *      - 继承 Stream 里的 Readable
 *      - 重写 _read 方法调用 push 产出数据
 *
 *    - 底层的数据在不断的 _read 进缓冲区（重要！）
 *      - 从测试来看，当为可读流绑定事件时，才会不断的 _read，只是实例化并不会
 *
 *    - readable：当流中存在可读取数据时触发（暂停模式 - 需要通过 read 方法拿到数据）
 *      - 当缓冲区中有数据了（从无到有），就会触发 readable 事件
 *      - read：从缓冲区中读取数据，可以设置参数指定读多少个字节，如果没有数据可供读取，则返回 null
 *        - 当使用 read 方法时，这个时候可能已经 _read 过好多次了
 *
 *    - data：当流中数据块传给消费者后触发（流动模式 - 不需要通过 read 方法就能自动获得数据）
 *      - 消费者拿数据，可能不经过缓冲区
 *      - 对于 chunk，可以理解为：每次执行 _read 缓冲的内容
 */

const { Readable } = require('stream')

/**
 * 1、定义自定义类
 */

class MyReadable extends Readable {
  constructor(source) {
    super()
    this.source = source
  }
  // 重写 _read 方法
  _read(size) {
    // super._read(size)
    console.log('-- _read --')
    const data = this.source.shift() || null
    this.push(data)
  }
}

/**
 * 2、使用如下
 */

const source = ['a1', 'b2', 'c3', 'd4', 'e5', 'f6']
const mr = new MyReadable(source)

// 1、readable 下面写了三种方式，帮助理解 readable 和 read() 都干了什么
// mr.on('readable', () => {
//   let data = null
//
//   // 1. 只要有数据就读出来（除了刚开始数据不定，后面是每 _read 一次就能读一次）
//   // while ((data = mr.read()) !== null) {
//   //   console.log(data.toString())
//   // }
//
//   // 2. 一次读 2 个字节（不管 _read 到哪了，反正这里每次从缓冲区读 2 个字节）
//   // while ((data = mr.read(2)) !== null) {
//   //   console.log(data.toString())
//   // }
//
//   // 3. 过一会在读，等待 100 ms 后数据应该被全部 _read 进缓冲区了，这样就可以一次性读取全部数据
//   setTimeout(() => {
//     while ((data = mr.read()) !== null) {
//       console.log(data.toString())
//     }
//   }, 100)
// })

// 2、data 每当流将数据块的所有权让给消费者时触发
mr.on('data', (chunk) => {
  console.log(chunk.toString())
})
