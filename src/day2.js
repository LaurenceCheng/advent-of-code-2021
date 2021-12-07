// in Windows, run 'type input.txt | node day2.js'
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

const parseInstruction = (instruction) => {
  const [command, valueStr] = instruction.split(' ')
  return { command, value: parseInt(valueStr) }
}

class NaiveSubmarine {
  constructor() {
    this.x = 0
    this.depth = 0
  }

  forward(n) {
    this.x += n
  }

  down(n) {
    this.depth += n
  }

  up(n) {
    this.depth -= n
  }

  getPosition() {
    return { x: this.x, depth: this.depth }
  }
}

class RealSubmarine extends NaiveSubmarine {
  constructor() {
    super()
    this.aim = 0
  }

  forward(n) {
    this.x += n
    this.depth += this.aim * n
  }

  down(n) {
    this.aim += n
  }

  up(n) {
    this.aim -= n
  }
}
const runInstructions = (submarine, instructions) => {
  instructions.forEach((instruction) => {
    const { command, value } = parseInstruction(instruction)
    submarine[command](value)
  })
  return submarine.getPosition()
}

;(async () => {
  const input = await readInput()

  // Part 1
  const naiveSubmarine = new NaiveSubmarine()
  runInstructions(naiveSubmarine, input)
  const position = naiveSubmarine.getPosition()
  console.log(position, position.x * position.depth)

  // Part 2
  const realSubmarine = new RealSubmarine()
  runInstructions(realSubmarine, input)
  const position2 = realSubmarine.getPosition()
  console.log(position2, position2.x * position2.depth)
})()
