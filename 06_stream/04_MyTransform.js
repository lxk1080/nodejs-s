
/**
 * 说明：自定义转换流
 *    - 继承自 Transform，并重写 _Transform 方法，既可以读，又可以写
 *    - 读和写是联接在一起的（写数据可直接被读）
 */

const { Transform } = require('stream')

/**
 * 1、定义类
 */

class MyTransform extends Transform {
  constructor() {
    super()
  }
  _transform(chunk, encoding, callback) {
    // super._transform(chunk, encoding, callback)
    this.push(chunk.toString().toUpperCase())
    callback(null)
  }
}

/**
 * 2、测试下
 */

const mt = new MyTransform()

mt.write('aaa')
mt.write('bbb')
mt.write('ccc')

mt.on('data', (chunk) => {
  console.log(chunk.toString())
})
