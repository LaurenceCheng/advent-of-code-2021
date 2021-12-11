// in Windows, run 'type input.txt | node day8.js'
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

const parseNotes = (input) => {
  return input
    .map((s) => s.split('|').map((s) => s.trim().split(' ')))
    .map((note) => ({ patterns: note[0], output: note[1] }))
}

const isNumberOne = (digit) => digit.length === 2
const isNumberFour = (digit) => digit.length === 4
const isNumberSeven = (digit) => digit.length === 3
const isNumberEight = (digit) => digit.length === 7

const isNumberOneOrFourOrSevenOrEight = (digit) =>
  isNumberOne(digit) ||
  isNumberFour(digit) ||
  isNumberSeven(digit) ||
  isNumberEight(digit)

const parsePatterns = (patterns) => {
  const lengthToPatterns = patterns.reduce((result, pattern) => {
    const len = pattern.length
    if (!result[len]) result[len] = []
    result[len].push(pattern.split('').sort().join(''))

    return result
  }, {})

  const patternsMap = {
    [lengthToPatterns[2][0]]: 1,
    1: lengthToPatterns[2][0],
    [lengthToPatterns[4][0]]: 4,
    4: lengthToPatterns[4][0],
    [lengthToPatterns[3][0]]: 7,
    7: lengthToPatterns[3][0],
    [lengthToPatterns[7][0]]: 8,
    8: lengthToPatterns[7][0],
  }

  const contains = (source, target) => {
    const sourceArray = source.split('')
    return target.split('').every((c) => sourceArray.includes(c))
  }

  const distance = (source, target) => {
    const sourceArray = source.split('')
    const targetArray = target.split('')
    return (
      sourceArray.filter((c) => !targetArray.includes(c)).length +
      targetArray.filter((c) => !sourceArray.includes(c)).length
    )
  }

  // len: 6, digits: [0, 6, 9]
  lengthToPatterns[6].forEach((pattern) => {
    if (!contains(pattern, patternsMap[1])) {
      patternsMap[pattern] = 6
      patternsMap[6] = pattern
    } else if (!contains(pattern, patternsMap[4])) patternsMap[pattern] = 0
    else patternsMap[pattern] = 9
  })

  // len: 5, digits: [2, 3, 5]
  lengthToPatterns[5].forEach((pattern) => {
    if (contains(pattern, patternsMap[1])) patternsMap[pattern] = 3
    else if (distance(pattern, patternsMap[6]) === 1) patternsMap[pattern] = 5
    else patternsMap[pattern] = 2
  })

  return patternsMap
}

const decode = (cipher) => {
  const patternsMap = parsePatterns(cipher.patterns)

  const decodedNumber = cipher.output
    .map((digit) => patternsMap[digit.split('').sort().join('')])
    .reverse()
    .reduce((sum, number, idx) => {
      return sum + number * Math.pow(10, idx)
    })

  return decodedNumber
}

const decodeNotes = (notes) => notes.map((cipher) => decode(cipher))

;(async () => {
  const data = await readInput()

  const notes = parseNotes(data)

  // Part 1
  const countsFor1And4And7And8 = notes
    .map((note) => note.output)
    .flat()
    .filter((digit) => isNumberOneOrFourOrSevenOrEight(digit)).length
  console.log(countsFor1And4And7And8)

  // Part 2
  const decodes = decodeNotes(notes)
  const totalOutputs = decodes.reduce((total, current) => {
    return total + current
  })
  console.log(totalOutputs)
})()
