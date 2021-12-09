// in Windows, run 'type input.txt | node day9.js'
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

const MAX_HEIGHT = 9

const parseHeightMap = (input, width) => {
  const BORDER = Array(width + 2).fill(MAX_HEIGHT)

  const map = input.map((line) => [
    MAX_HEIGHT,
    ...line.split('').map((height) => parseInt(height)),
    MAX_HEIGHT,
  ])

  return [BORDER, ...map, BORDER]
}

const findLowPoints = (heightMap) => {
  return heightMap.reduce((lowPoints, currentLine, row) => {
    if (row === 0 || row === heightMap.length - 1) return lowPoints
    const lowPointsInTheLine = currentLine
      .map((height, idx) => convertToLocation(row, idx, height))
      .filter((location) =>
        isLowPoint(
          location,
          heightMap[row - 1],
          currentLine,
          heightMap[row + 1]
        )
      )
    lowPoints.push(...lowPointsInTheLine)

    return lowPoints
  }, [])
}

const convertToLocation = (row, col, height) => ({ row, col, height })

const isLowPoint = (location, previousLine, currentLine, nextLine) => {
  const currentHeight = location.height
  const col = location.col
  return (
    currentHeight < previousLine[col] &&
    currentHeight < nextLine[col] &&
    currentHeight < currentLine[col - 1] &&
    currentHeight < currentLine[col + 1]
  )
}

const calculateTotalRisks = (lowPoints) => {
  return lowPoints
    .map((location) => location.height + 1)
    .reduce((sum, risk) => sum + risk)
}

const findBasins = (heightMap, lowPoints) => {
  return lowPoints.map((point) => {
    const basin = []
    findBasin(point, heightMap, basin)
    return basin
  })
}

const findBasin = (location, heightMap, basin) => {
  const { row, col, height } = location

  markBasin(basin, row, col)

  const top = convertToLocation(row - 1, col, heightMap[row - 1][col])
  const bottom = convertToLocation(row + 1, col, heightMap[row + 1][col])
  const left = convertToLocation(row, col - 1, heightMap[row][col - 1])
  const right = convertToLocation(row, col + 1, heightMap[row][col + 1])

  const neighbors = [top, bottom, left, right]
  neighbors
    .filter((location) => isHigher(location, height))
    .forEach((location) => {
      markBasin(basin, location.row, location.col)
      findBasin(location, heightMap, basin)
    })
}

const isHigher = (location, height) => {
  const locationHeight = location.height
  return (
    locationHeight !== MAX_HEIGHT &&
    locationHeight !== MAX_HEIGHT &&
    locationHeight > height
  )
}

const markBasin = (basin, row, col) => {
  if (!basin[row]) basin[row] = []
  basin[row][col] = 1
}

const getBasinSize = (basin) => {
  return basin.reduce(
    (sum, basinMarks) => sum + basinMarks.reduce((count) => count + 1, 0),
    0
  )
}

;(async () => {
  const data = await readInput()

  const width = data[0].length
  const heightMap = parseHeightMap(data, width)

  const lowPoints = findLowPoints(heightMap)

  // Part 1
  const totalRisks = calculateTotalRisks(lowPoints)
  console.log(totalRisks)

  // Part 2
  const basins = findBasins(heightMap, lowPoints)
  const listBasinSize = basins
    .map((basin) => getBasinSize(basin))
    .sort((size1, size2) => size2 - size1)
  console.log(listBasinSize[0] * listBasinSize[1] * listBasinSize[2])
})()
