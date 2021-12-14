// in Windows, run 'type input.txt | node day14.js'
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

const parsePolymerizationManual = (input) => {
  const template = input[0].split('')
  const rules = input
    .slice(1)
    .map((n) => n.split('->').map((s) => s.trim()))
    .reduce((rules, [pair, insertion]) => {
      rules[pair] = insertion
      return rules
    }, {})
  return [template, rules]
}

const getElementsStatistics = (startTemplate, rules, steps) => {
  const firstElement = startTemplate[0]
  const lastElement = startTemplate[startTemplate.length - 1]
  let pairStatistics = convertToPairStatistics(startTemplate)

  for (let i = 0; i < steps; i++) {
    const newPairStatistics = {}
    for (const key in pairStatistics) {
      const [firstElement, secondElement] = key
      const insertion = rules[key]
      const count = pairStatistics[key]

      increaseCount(newPairStatistics, `${firstElement}${insertion}`, count)
      increaseCount(newPairStatistics, `${insertion}${secondElement}`, count)
    }

    pairStatistics = newPairStatistics
  }

  const elementsStatistics = {}
  for (const pair in pairStatistics) {
    const [element1, element2] = pair.split('')
    const count = pairStatistics[pair]

    // Eliminate duplication counts.
    // NCNB => NC, CN, NB. Count: N = 3, C = 2, B = 1
    increaseCount(elementsStatistics, element1, count / 2)
    increaseCount(elementsStatistics, element2, count / 2)
  }

  // Only the counts of first and last element are not even
  elementsStatistics[firstElement] = Math.ceil(elementsStatistics[firstElement])
  elementsStatistics[lastElement] = Math.ceil(elementsStatistics[lastElement])

  return elementsStatistics
}

const convertToPairStatistics = (template) => {
  return template.reduce((pairStatistics, currentElement, idx) => {
    if (idx === template.length - 1) return pairStatistics

    const nextElement = template[idx + 1]
    const pair = `${currentElement}${nextElement}`
    increaseCount(pairStatistics, pair, 1)
    return pairStatistics
  }, {})
}

const increaseCount = (map, key, count) => {
  map[key] = map[key] ? map[key] + count : count
}

const getMinMax = (statistics) => {
  const counts = Object.keys(statistics).map((key) => statistics[key])
  return [Math.max(...counts), Math.min(...counts)]
}

const getDifferenceBetweenMaxAndMin = (statistics) => {
  const [max, min] = getMinMax(statistics)
  return max - min
}

;(async () => {
  const data = await readInput()

  const [startTemplate, rules] = parsePolymerizationManual(data)

  // Part 1
  const elementsStats10Steps = getElementsStatistics(startTemplate, rules, 10)
  console.log(getDifferenceBetweenMaxAndMin(elementsStats10Steps))

  // Part 2
  const elementsStats40Steps = getElementsStatistics(startTemplate, rules, 40)
  console.log(getDifferenceBetweenMaxAndMin(elementsStats40Steps))
})()
