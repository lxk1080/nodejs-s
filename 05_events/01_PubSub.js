
/**
 * 说明：使用发布订阅模式模拟事件实现
 */

/**
 * 1、新建一个 PubSub 类，相当于 EventEmitter
 *    - subscribe 相当于 on
 *    - publish 相当于 emit
 */

class PubSub {
  constructor() {
    this._events = {}
  }

  subscribe(event, callback) {
    if (this._events[event]) {
      this._events[event].push(callback)
    } else {
      this._events[event] = [callback]
    }
  }

  publish(event, ...args) {
    const subs = this._events[event]
    if (subs && subs.length) {
      // 这里用箭头函数，是为了让 this 指向实例对象
      // 用 function 的话，是匿名函数，this 是 undefined
      subs.forEach((cb) => {
        cb.call(this, ...args)
      })
    }
  }
}

/**
 * 2、测试下
 */

const pubSub = new PubSub()

pubSub.subscribe('eventName', function (...args) {
  console.log('args ==>', args)
  console.log('this ==>', this)
})

pubSub.publish('eventName', 1, 2, 3)
