/**
 * @desc 这里使用 @inquirer/prompts 演示下命令行的交互，这个包里面包含了所有的方法，实际使用中，可以按需引用
 *  - github 地址：https://github.com/SBoudrias/Inquirer.js
 *  - 配合 chalk 包可以输出有颜色的描述！注意：需要使用 chalk@4 版本，5 版本使用的是 esm，在 node 中可能无法导入模块
 */
const { input, select, confirm, password, rawlist } = require('@inquirer/prompts')
const chalk = require('chalk')

async function inquirerUser() {
  const result = {}
  // 输入文本
  result.answer = await input({ message: 'Enter your name' })
  // 选择一个
  result.answer2 = await select({
    message: 'Select a package manager',
    choices: [
      {
        name: 'npm',
        value: 'npm',
        description: 'npm is the most popular package manager',
      },
      {
        name: 'yarn',
        value: 'yarn',
        description: 'yarn is an awesome package manager',
      },
    ],
  })
  // yes or no
  result.answer3 = await confirm({ message: 'Continue?' })
  if (result.answer3) {
    // 密码，输入无显示
    result.answer4 = await password({ message: 'Enter your password' })
    // 这个相比 select 字段更少，而且不能直接选择，需要输入对应的编号选择
    result.answer5 = await rawlist({
      message: 'Select a package manager',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'pnpm', value: 'pnpm' },
      ],
    })
    // 可以定义一个对象来接收答案
    result.otherAnsers = {
      skill: await input({ message: "What's your skill?" }),
      age: await input({ message: "How old are you?" }),
    }
  }
  return result
}

async function execCli() {
  const res = await inquirerUser()
  console.log('result ==>', res)
  console.log(chalk.yellow('And then you can do something!'))
}

execCli()
