// in Windows, run 'type input.txt | node day12.js'
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

const START_CAVE = 'start'
const END_CAVE = 'end'

const parseConnections = (input) => {
  return input
    .map((s) => s.split('-'))
    .reduce((connections, [cave1, cave2]) => {
      addConnection(connections, cave1, cave2)
      addConnection(connections, cave2, cave1)
      return connections
    }, {})
}

const addConnection = (connections, cave1, cave2) => {
  if (cave1 !== END_CAVE) {
    if (!connections[cave1]) connections[cave1] = []
    if (cave2 !== START_CAVE) connections[cave1].push(cave2)
  }
}

const isSmallCave = (cave) => cave === cave.toLowerCase()

const composePath = (previousCaves, cave, smallCavesTimes) => ({
  caves: [...previousCaves, cave],
  smallCavesTimes,
})

const calculatePathsCount = (connections, isOverSmallCavesLimit) => {
  let paths = []
  let nextRoundPaths = []
  let completePathCount = 0

  connections[START_CAVE].forEach((cave) => {
    const smallCavesTimes = isSmallCave(cave) ? { [cave]: 1 } : {}
    const newPath = composePath([], cave, smallCavesTimes)
    paths.push(newPath)
  })

  while (paths.length > 0) {
    paths.map(({ caves, smallCavesTimes }) => {
      const lastCave = caves[caves.length - 1]
      connections[lastCave].forEach((cave) => {
        if (cave === END_CAVE) {
          completePathCount++
          return
        }

        const newSmallCavesTimes = { ...smallCavesTimes }
        if (isSmallCave(cave)) {
          if (!newSmallCavesTimes[cave]) newSmallCavesTimes[cave] = 0
          newSmallCavesTimes[cave]++

          if (isOverSmallCavesLimit(cave, newSmallCavesTimes)) return
        }
        const newPath = composePath(caves, cave, newSmallCavesTimes)
        nextRoundPaths.push(newPath)
      })
    })

    paths = nextRoundPaths
    nextRoundPaths = []
  }

  return completePathCount
}
const isSmallCavesNoMoreThanOnceLimit = (cave, smallCavesTimes) =>
  smallCavesTimes[cave] > 1

const isOnlyOneSmallCavesTwiceLimit = (cave, smallCavesTimes) =>
  smallCavesTimes[cave] === 3 ||
  Object.keys(smallCavesTimes)
    .map((cave) => smallCavesTimes[cave])
    .filter((times) => times >= 2).length >= 2

;(async () => {
  const data = await readInput()

  const connections = parseConnections(data)

  // Part 1
  const smallCavesNoMoreThanOncePathsCount = calculatePathsCount(
    connections,
    isSmallCavesNoMoreThanOnceLimit
  )
  console.log(smallCavesNoMoreThanOncePathsCount)

  // Part 2
  const onlyOneSmallCavesTwicePathsCount = calculatePathsCount(
    connections,
    isOnlyOneSmallCavesTwiceLimit
  )
  console.log(onlyOneSmallCavesTwicePathsCount)
})()
