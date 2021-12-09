// in Windows, run 'type input.txt | node day5.js'
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

class Line {
  constructor(p1, p2) {
    this.p1 = p1
    this.p2 = p2
  }

  isHorizontal() {
    return this.p1.y === this.p2.y
  }

  isVertical() {
    return this.p1.x === this.p2.x
  }
}

const parseLines = (data) => {
  return data.map((line) => {
    const [p1, p2] = line
      .split('->')
      .map((s) => s.split(','))
      .map((point) => ({ x: parseInt(point[0]), y: parseInt(point[1]) }))

    return new Line(p1, p2)
  })
}

const splitLines = (lines, filter) => {
  return lines.reduce(
    (lineGroup, line) => {
      if (filter(line)) {
        lineGroup.verticalsOrHorizontals.push(line)
      } else {
        lineGroup.diagonals.push(line)
      }
      return lineGroup
    },
    { verticalsOrHorizontals: [], diagonals: [] }
  )
}

const calculateOneStep = (p1, p2) => {
  return { x: Math.sign(p1.x - p2.x), y: Math.sign(p1.y - p2.y) }
}

const plotDiagram = (diagram, start, end) => {
  const oneStep = calculateOneStep(end, start)
  const endAddOneStep = { x: end.x + oneStep.x, y: end.y + oneStep.y }

  let p = start
  while (p.x !== endAddOneStep.x || p.y !== endAddOneStep.y) {
    const key = `${p.x}_${p.y}`

    if (!diagram[key]) diagram[key] = 1
    else diagram[key]++

    p = { x: p.x + oneStep.x, y: p.y + oneStep.y }
  }
}

const countOverlappingPoints = (diagram) => {
  let count = 0
  for (const key in diagram) {
    if (diagram[key] > 1) count++
  }
  return count
}

;(async () => {
  const data = await readInput()

  const lines = parseLines(data)

  const { verticalsOrHorizontals, diagonals } = splitLines(lines, (line) => {
    return line.isHorizontal() || line.isVertical()
  })

  const ventsDiagram = {}

  // Part 1
  verticalsOrHorizontals.forEach((line) => {
    plotDiagram(ventsDiagram, line.p1, line.p2)
  })

  console.log(countOverlappingPoints(ventsDiagram))

  // Part 2
  diagonals.forEach((line) => {
    plotDiagram(ventsDiagram, line.p1, line.p2)
  })

  console.log(countOverlappingPoints(ventsDiagram))
})()
