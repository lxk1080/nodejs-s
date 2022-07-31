
/**
 * 说明：在 Buffer 的原型上实现一个类似字符串的 split 方法
 */

/**
 * 1、要实现以下效果
 */

const str = '我爱学习爱'
console.log(str.split('爱'))

/**
 * 2、在原型上定义一个函数
 *    - 通过 indexOf 方法判断是否存在分隔符，并且记录分隔符的位置
 *    - 然后通过 slice 方法截取
 *    - 然后改变 start 的位置，往后面继续查
 *    - 查到了再次截取
 *    - 直到找不到分隔符为止
 *    - 上面的步骤只截取了每个分隔符之前的内容
 *    - 在最后还需要把最后一个分隔符后面的内容加进去，同时，也是为了在找不到分隔符的情况下，直接返回原来的数据
 */

Buffer.prototype.split = function (seq) {
  const seqLength = Buffer.byteLength(seq) // 分隔符的字节长度
  const ret = []
  let start = 0
  let offset = 0

  while ((offset = this.indexOf(seq, start)) !== -1) {
    ret.push(this.slice(start, offset))
    start = offset + seqLength //
  }

  ret.push(this.slice(start))

  return {
    ret,
    retString: ret.map(buf => buf.toString()),
  }
}

/**
 * 3、测试一下
 */

const buf = Buffer.from('我爱学习爱')
console.log(buf.split('爱'))
