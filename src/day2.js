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

// Part 1
const getNaivePosition = (instructions) => {
  return instructions.reduce(
    (position, instruction) => {
      const { command, value } = parseInstruction(instruction)
      if (command === 'forward') {
        position.x += value
      }
      if (command === 'down') {
        position.depth += value
      }
      if (command === 'up') {
        position.depth -= value
      }
      return position
    },
    { x: 0, depth: 0 }
  )
}

// Part 2
const getCorrectPosition = (instructions) => {
  return instructions.reduce(
    (position, instruction) => {
      const { command, value } = parseInstruction(instruction)
      if (command === 'forward') {
        position.x += value
        position.depth += position.aim * value
      }
      if (command === 'down') {
        position.aim += value
      }
      if (command === 'up') {
        position.aim -= value
      }
      return position
    },
    { x: 0, depth: 0, aim: 0 }
  )
}

;(async () => {
  const input = await readInput()

  const position = getNaivePosition(input)
  console.log(position, position.x * position.depth)
  const position2 = getCorrectPosition(input)
  console.log(position2, position2.x * position2.depth)
})()
