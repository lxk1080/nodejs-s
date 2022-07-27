/**
 * 指定睡眠时间
 * @param time 时间
 * @returns {number} 循环的次数
 */
function sleepTime(time) {
  let count = 0
  const sleep = Date.now() + time
  while (Date.now() < sleep) { count++ }
  return count
}

module.exports = {
  sleepTime,
}
