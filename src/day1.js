const readline = require('readline')

const readInput = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
  })

  const output = []
  for await (const line of rl) {
    output.push(line)
  }
  return output.filter((s) => s).map(n => parseInt(n))
}

// Part 1
const getMeasurementIncreaseTimes = (measurements) => {
  return measurements.reduce((times, _, idx) => {
    if (measurements[idx + 1] > measurements[idx]) times++
    return times
  }, 0)
}

// Part 2
const getSumOfThreeMeasurementsIncreaseTimes = (measurements) => {
  return measurements.reduce((times, _, idx) => {
    if (measurements[idx + 3] > measurements[idx]) times++
    return times
  }, 0)
}

;(async () => {
  const data = await readInput()

  console.log(getMeasurementIncreaseTimes(data))
  console.log(getSumOfThreeMeasurementsIncreaseTimes(data))
})()
