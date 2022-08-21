
/**
 * 说明：自定义可写流
 *    - 继承自 Writable，并重写 _write 方法
 *    - 使用 process.nextTick 将 done 回调函数放入异步队列，所有同步代码执行完成后执行
 */

const { Writable }  = require('stream')

/**
 * 1、定义类
 */

class MyWritable extends Writable {
  constructor() {
    super()
  }
  _write(chunk, encoding, done) {
    // super._write(chunk, encoding, callback)
    console.log('-- _write --')
    process.stdout.write(chunk.toString())
    process.nextTick(done)
  }
}

/**
 * 2、测试下
 */

const mw = new MyWritable()

mw.write('112233 \n', 'utf-8', () => {
  console.log('end')
})
