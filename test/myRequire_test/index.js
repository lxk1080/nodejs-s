const myRequire = require('../../01_nodejs_模块化/01_myRequire')

const obj = myRequire('./test')
const obj2 = myRequire('./test')
console.log(obj)
console.log(obj2)
