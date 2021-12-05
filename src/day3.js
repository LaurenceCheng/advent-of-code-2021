// in Windows, run 'type input.txt | node day4.js'
const readline = require('readline')

const readInput = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
  })

  const output = []
  for await (const line of rl) {
    output.push(line)
  }
  return output.filter((s) => s)
}

const getMostCommonValue = (data, bitPosition) => {
  const [numberOfZero, numberOfOne] = data.reduce(
    (stat, current) => {
      stat[current[bitPosition]]++
      return stat
    },
    [0, 0]
  )
  return numberOfZero > numberOfOne ? '0' : '1'
}

const getLeastCommonValue = (data, bitPosition) => {
  const mostCommonValue = getMostCommonValue(data, bitPosition)
  return xor(parseInt(mostCommonValue)).toString(2)
}

const calculateGamma = (data, bitCount) => {
  const gammaStr = Array(bitCount)
    .fill('')
    .map((_, i) => {
      return getMostCommonValue(data, i)
    })
    .join('')
  return parseInt(gammaStr, 2)
}

const xor = (n, bitCount = 1) => {
  const bitMask = Array(bitCount).fill('1').join('')
  return n ^ parseInt(bitMask, 2)
}

const calculateEpsilon = (gamma, bitCount) => {
  return xor(gamma, bitCount)
}

const filterBy = (data, bitCount, filterFunc) => {
  let filteredData = data
  Array(bitCount)
    .fill('')
    .some((_, i) => {
      const valueToFilter = filterFunc(filteredData, i)
      filteredData = filteredData.filter((n) => n[i] === valueToFilter)
      return filteredData.length === 1
    })
  return parseInt(filteredData[0], 2)
}

const calculateO2GeneratorRating = (data, bitCount) =>
  filterBy(data, bitCount, getMostCommonValue)

const calculateCO2ScrubberRating = (data, bitCount) =>
  filterBy(data, bitCount, getLeastCommonValue)

;(async () => {
  const data = await readInput()

  const bitCount = data[0].length

  // Part 1
  const gamma = calculateGamma(data, bitCount)
  const epsilon = calculateEpsilon(gamma, bitCount)
  const powerConsumption = gamma * epsilon

  console.log(powerConsumption)

  // Part 2
  const o2GeneratorRating = calculateO2GeneratorRating(data, bitCount)
  const co2ScrubberRating = calculateCO2ScrubberRating(data, bitCount)
  const lifeSupportRating = o2GeneratorRating * co2ScrubberRating

  console.log(lifeSupportRating)
})()
