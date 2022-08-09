
/**
 * 说明：事件模块
 *    - 1、参数传递方式
 *    - 2、this 指向的是 emitter 对象，其中包含所有的监听事件
 */

const eventEmitter = require('events')
const emitter = new eventEmitter()

emitter.on('event_1', function () {})
emitter.on('event_2', function () {})
emitter.on('event_3', function () {})

emitter.on('event_3', function (...args) {
  console.log('args ==>', args)
  console.log('this ==>', this)
})

emitter.emit('event_3', 1, 2, 3)
