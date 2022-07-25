let count = 0

function sleepTime(time) {
  const sleep = Date.now() + time
  while (Date.now() < sleep) { count++ }
}

sleepTime(16)

// 一帧的时间的执行次数
console.log(count)
