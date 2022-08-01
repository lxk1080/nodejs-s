// 生成 html 的模板
const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>{{title}}</title>
    <style>
      {{style}}
    </style>
  </head>
  <body>
    {{content}}
  </body>
  </html>
`

module.exports = template
