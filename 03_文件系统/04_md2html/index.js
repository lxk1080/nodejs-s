const fs = require('fs')
const path = require('path')
const { marked } = require('marked') // 将 md 语法转化为 html
const browserSync = require('browser-sync')
const template = require('./template')

const mdPath = path.resolve(process.argv[2]) // 接收要转换的文件（这里的文件路径是设置成了相对于 node 执行时的路径）
const cssPath = path.join(__dirname, './style.css') // 自定义显示样式（ marked 只转换语法，不负责样式 ），由此可以扩展使用不同的主题
const htmlPath = mdPath.replace(path.extname(mdPath), '.html') // 让目标文件和源文件同目录

// 主要转换方法。嵌套可以用 Promise 方式优化
function convert () {
  fs.readFile(mdPath, 'utf-8', (err, data) => {
    if (err) return console.log(err)
    const htmlStr = marked(data)
    fs.readFile(cssPath, 'utf-8', (err, data) => {
      if (err) return console.log(err)
      const retHtml = template
        .replace('{{title}}', path.basename(mdPath, '.md'))
        .replace('{{style}}', data)
        .replace('{{content}}', htmlStr)
      fs.writeFile(htmlPath, retHtml, (err) => {
        if (err) return console.log(err)
        console.log('转换完成！')
      })
    })
  })
}

// 监听 md 文件的变化
fs.watchFile(mdPath, { interval: 100 }, (cur, prev) => {
  if (cur.mtime !== prev.mtime) {
    convert()
  }
})

// 打开浏览器显示转换后的效果
browserSync.init({
  browser: '', // 默认浏览器
  server: path.dirname(htmlPath), // 服务器根目录
  watch: true, // 监听 html 变化
  index: path.basename(htmlPath), // 入口文件
})

// 执行转换
convert()
