const parseInstruction = (instruction) => {
  const [command, valueStr] = instruction.split(' ')
  return { command, value: parseInt(valueStr) }
}

const getNaivePosition = (instructions) => {
  return instructions.reduce(
    (position, instruction) => {
      const { command, value } = parseInstruction(instruction)
      if (command === 'forward') { position.x += value }
      if (command === 'down') { position.depth += value }
      if (command === 'up') { position.depth -= value }
      return position
    }, { x: 0, depth: 0 })
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
      if (command === 'down') { position.aim += value }
      if (command === 'up') { position.aim -= value }
      return position
    }, { x: 0, depth: 0, aim: 0 })
}
