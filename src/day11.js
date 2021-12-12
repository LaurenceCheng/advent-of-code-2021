// in Windows, run 'type input.txt | node day11.js'
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

class OctopusesMap {
  constructor(input) {
    this.map = this.parseMap(input)
  }

  parseMap(input) {
    return input.map((line, row) =>
      line.split('').map((n, col) => ({ row, col, energy: parseInt(n) }))
    )
  }

  getAdjacentOctopuses(octopus) {
    const { row, col } = octopus
    return [
      [row - 1, col - 1],
      [row - 1, col],
      [row - 1, col + 1],
      [row, col - 1],
      [row, col + 1],
      [row + 1, col - 1],
      [row + 1, col],
      [row + 1, col + 1],
    ]
      .map(([row, col]) => (this.map[row] ? this.map[row][col] : undefined))
      .filter((o) => o)
  }

  isAllFlashed() {
    return this.map.every((line) =>
      line.every((octopus) => octopus.energy === 0)
    )
  }

  nextStep() {
    // First, increase a level for every octopus
    this.map.forEach((line) =>
      line.forEach((octopus) => {
        octopus.energy++
      })
    )

    // Second, flash and propagate
    let flashed = {}
    let newFlash
    do {
      newFlash = {}
      this.map.forEach((line) =>
        line.forEach((octopus) => {
          const { row, col, energy } = octopus
          if (energy > 9 && !flashed[`${row}_${col}`]) {
            this.getAdjacentOctopuses(octopus).forEach((octopus) => {
              octopus.energy++
            })
            newFlash[`${row}_${col}`] = true
          }
        })
      )
      flashed = { ...flashed, ...newFlash }
    } while (Object.keys(newFlash).length > 0)

    const flashCount = Object.keys(flashed).length

    // Last, set to 0 for flashed octopuses
    this.map.forEach((line) =>
      line.forEach((octopus) => {
        if (octopus.energy > 9) octopus.energy = 0
      })
    )
    return flashCount
  }

  draw = () => {
    console.log(
      '\n' +
        this.map.map((line) => line.map((o) => o.energy).join('')).join('\n') +
        '\n'
    )
  }
}

;(async () => {
  const data = await readInput()

  let octopusesMap = new OctopusesMap(data)
  octopusesMap.draw()

  // Part 1
  const steps = 100
  let totalFlashes = 0
  for (let i = 0; i < steps; i++) {
    totalFlashes += octopusesMap.nextStep()
  }
  console.log(totalFlashes)

  // Part 2
  octopusesMap = new OctopusesMap(data)
  let stepCount = 0
  while (!octopusesMap.isAllFlashed()) {
    octopusesMap.nextStep()
    stepCount++
  }
  console.log(stepCount)
})()
