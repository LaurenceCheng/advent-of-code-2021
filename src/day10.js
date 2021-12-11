// in Windows, run 'type input.txt | node day10.js'
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

const matchingCloseSymbols = {
  '(': ')',
  '<': '>',
  '{': '}',
  '[': ']',
}

const parseNavigationSubsystem = (input) => {
  return input
    .map((line) => line.split(''))
    .reduce(
      ([illegalChars, incompleteLines], line) => {
        const result = classify(line)

        if (typeof result === 'object') incompleteLines.push(result)
        else if (typeof result === 'string') illegalChars.push(result)

        return [illegalChars, incompleteLines]
      },
      [[], []]
    )
}

const classify = (line) => {
  const openSymbols = ['(', '[', '{', '<']

  const stack = []
  for (const symbol of line) {
    if (openSymbols.indexOf(symbol) >= 0) {
      stack.push(symbol)
    } else {
      const topOfStack = stack[stack.length - 1]
      if (symbol === matchingCloseSymbols[topOfStack]) {
        stack.pop()
      } else {
        return symbol
      }
    }
  }
  return stack
}

const getTotalSyntaxCheckerScore = (chars) => {
  const scoreMap = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  }
  return chars
    .map((c) => scoreMap[c])
    .reduce((total, score) => {
      return total + score
    }, 0)
}

const getAutocompleteToolScore = (line) => {
  const BASE = 5
  const scoreMap = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  }

  return line
    .map((symbol) => matchingCloseSymbols[symbol])
    .reverse()
    .reduce((score, symbol) => score * BASE + scoreMap[symbol], 0)
}

const getMiddleAutocompleteToolScore = (incompleteLines) => {
  const scores = incompleteLines
    .map((line) => getAutocompleteToolScore(line))
    .sort((score1, score2) => score1 - score2)
  return scores[Math.floor(scores.length / 2)]
}

;(async () => {
  const data = await readInput()

  const [illegalChars, incompleteLines] = parseNavigationSubsystem(data)

  // Part 1
  console.log(getTotalSyntaxCheckerScore(illegalChars))
  console.log(323613)

  // Part 2
  console.log(getMiddleAutocompleteToolScore(incompleteLines))
  console.log(3103006161)
})()
