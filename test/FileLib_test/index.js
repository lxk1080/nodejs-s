const FileLib = require('../../03_文件系统/06_FileLib')

// 1、同步创建目录
// FileLib.makeDirSync('./a/b/c')

// 2、异步创建目录（回调实现）
// FileLib.cbMakeDir('./a/b/c', () => {
//   console.log('创建完成！')
// })

// 3、异步创建目录（Promise实现）
// FileLib.makeDir('./a/b/c', () => {
//   console.log('创建完成！')
// })

// 4、删除文件
// FileLib.removePath('./a/b/c/d.js', () => {
//   if (err) return console.log(err)
//   console.log('删除成功！')
// })

// 5、删除目录（包括非空目录）
FileLib.removePath('./a', (err) => {
  if (err) return console.log(err)
  console.log('删除成功！')
})
