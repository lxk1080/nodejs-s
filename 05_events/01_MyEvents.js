
/**
 * 说明：使用发布订阅模式模拟事件实现
 */

/**
 * 1、新建一个 MyEvents 类，实现接口：on、emit、off、once
 *    - 关于 once 的实现：
 *      - 把 callback 包装一层，执行完 off 掉。并且通过 link 把包装函数和 callback 联系起来，以便于可以直接使用 off
 */

class MyEvents {
  constructor() {
    // 纯净的对象，没有原型链
    this._events = Object.create(null)
  }

  on(event, callback) {
    if (this._events[event]) {
      this._events[event].push(callback)
    } else {
      this._events[event] = [callback]
    }
  }

  emit(event, ...args) {
    const cbs = this._events[event]
    if (cbs && cbs.length) {
      // 这里用箭头函数，是为了让 this 指向实例对象
      // 用 function 的话，是匿名函数，this 是 undefined
      cbs.forEach((cb) => {
        cb.call(this, ...args)
      })
    }
  }

  off(event, fn) {
    const cbs = this._events[event]
    if (cbs) {
      this._events[event] = cbs.filter(cb => cb !== fn && cb.link !== fn)
    }
  }

  once(event, callback) {
    const foo = (...args) => {
      callback.call(this, ...args)
      this.off(event, foo)
    }
    // 建立联系
    foo.link = callback
    this.on(event, foo)
  }
}

/**
 * 2、测试下
 *    - 只绑定了一个事件监听，一个执行完被 off 掉，一个是 once（同样执行完被 off，自动的），最后两个事件的 list 都为空
 */

const emitter = new MyEvents()

const fn = function (...args) {
  console.log('args ==>', args)
  console.log('this ==>', this)
}

// on and off
emitter.on('event_1', fn)
emitter.emit('event_1', 1, 1, 1)
emitter.off('event_1', fn)
emitter.emit('event_1', 2, 2, 2)

// once
emitter.once('event_2', fn)
emitter.emit('event_2', 3, 3, 3)
emitter.emit('event_2', 4, 4, 4)

// end
console.log('end ==>', emitter)
