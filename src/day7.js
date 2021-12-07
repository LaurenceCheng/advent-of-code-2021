// in Windows, run 'type input.txt | node day4.js'
const readline = require("readline")

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

const arithmeticSequenceCost = (steps) => steps

const costLookup = [0, 1]
const arithmeticSeriesCost = (steps) => {
  if (!costLookup[steps]) {
    costLookup[steps] = ((1 + steps) * steps) / 2
  }
  return costLookup[steps]
}

const calculateTotalCostToPosition = (crabs, position, costFunc) => {
  return crabs.reduce((sum, crab) => {
    const steps = Math.abs(crab - position)
    return sum + costFunc(steps)
  }, 0)
}

const getMinimumCost = (crabs, costFunc) => {
  const maxCrabPosition = Math.max(...crabs)

  let minimumCost = Number.MAX_SAFE_INTEGER
  for (let i = 0; i <= maxCrabPosition; i++) {
    const cost = calculateTotalCostToPosition(crabs, i, costFunc)
    minimumCost = minimumCost < cost ? minimumCost : cost
  }

  return minimumCost
}

;(async () => {
  const data = await (await readInput()).shift()

  const crabs = data.split(",").map((n) => parseInt(n))

  // Part 1
  console.log(getMinimumCost(crabs, arithmeticSequenceCost))

  // Part 2
  console.log(getMinimumCost(crabs, arithmeticSeriesCost))
})()
