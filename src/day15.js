// in Windows, run 'type input.txt | node day15.js'
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

const parseChitonsMap = (input) =>
  input.map((line) => line.split('').map((n) => parseInt(n)))

const updateRisk = (riskMap, position, risk) => {
  riskMap[position.y][position.x] = risk
}

const getRisk = (riskMap, position) => riskMap[position.y][position.x]

const getNeighbors = ({ x, y }, side) => {
  const top = y > 0 ? { x, y: y - 1 } : undefined
  const bottom = y < side - 1 ? { x, y: y + 1 } : undefined
  const left = x > 0 ? { x: x - 1, y } : undefined
  const right = x < side - 1 ? { x: x + 1, y } : undefined
  return [top, bottom, left, right]
}

const calculateRealRisk = (risksTable, { x, y }) => {
  const tileSide = risksTable.length
  const extra = Math.floor(x / tileSide) + Math.floor(y / tileSide)
  return ((risksTable[y % tileSide][x % tileSide] + extra - 1) % 9) + 1
}

const getLowestRisk = (from, to, risksTable, side) => {
  const minTotalRisksMap = Array.from(Array(side), () =>
    new Array(side).fill(Number.MAX_SAFE_INTEGER)
  )

  updateRisk(minTotalRisksMap, from, 0)

  const queue = [from]
  while (queue.length > 0) {
    const position = queue.shift()

    const neighbors = getNeighbors(position, side)
    neighbors
      .filter((n) => n)
      .forEach((neighbor) => {
        const risk = getRisk(minTotalRisksMap, position)
        const newRisk = risk + calculateRealRisk(risksTable, neighbor)
        if (newRisk < getRisk(minTotalRisksMap, neighbor)) {
          updateRisk(minTotalRisksMap, neighbor, newRisk)
          if (
            queue.findIndex(
              ({ x, y }) => neighbor.x === x && neighbor.y === y
            ) === -1
          )
            queue.push(neighbor)
        }
      })
  }
  return minTotalRisksMap[to.y][to.x]
}

;(async () => {
  const data = await readInput()

  const risksTile = parseChitonsMap(data)
  const tileSide = risksTile.length

  // Part 1
  let side = tileSide
  const start = { x: 0, y: 0 }
  let end = { x: side - 1, y: side - 1 }

  console.log(getLowestRisk(start, end, risksTile, side))

  // Part 2
  side = tileSide * 5
  end = { x: side - 1, y: side - 1 }
  console.log(getLowestRisk(start, end, risksTile, side))
})()
