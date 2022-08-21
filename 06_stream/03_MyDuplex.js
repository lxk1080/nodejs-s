
/**
 * 说明：自定义双工流
 *    - 继承自 Duplex，并重写 _read 和 _write 方法，既可以读，又可以写
 *    - 虽然读写都可以，但是，读和写的操作是独立的（写数据不会触发可读流的事件）
 */

const { Duplex } = require('stream')

/**
 * 1、定义类
 */

class MyDuplex extends Duplex {
  constructor(source) {
    super()
    this.source = source
  }
  _read(size) {
    // super._read(size);
    console.log('-- _read --')
    const data = this.source.shift() || null
    this.push(data)
  }
  _write(chunk, encoding, callback) {
    // super._write(chunk, encoding, callback)
    console.log('-- _write --')
    process.stdout.write(chunk.toString())
    process.nextTick(callback)
  }
}

/**
 * 2、测试下
 */

const source = ['a', 'b', 'c']
const md = new MyDuplex(source)

// 1、可读流
// md.on('data', (chunk) => {
//   console.log(chunk.toString())
// })

// 2、可写流
md.write('123456 \n', 'utf-8', () => {
  console.log('end')
})
