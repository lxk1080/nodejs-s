const myCopyFile = require('../../03_文件系统/05_copyFile')

myCopyFile('./origin.txt', './target.txt', (err) => {
  if (err) return console.log(err)
  console.log('复制完成！')
})
