// in Windows, run 'type input.txt | node day20.js'
const readline = require('readline')

const readInput = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
  })

  const output = []
  for await (const line of rl) {
    output.push(line)
  }
  return output
}

const DARK_PIXEL = '.'
const LIGHT_PIXEL = '#'

const pixelToBinary = (pixel) => ({ [DARK_PIXEL]: '0', [LIGHT_PIXEL]: '1' }[pixel])

const convertToAlgorithmIdx = (pixels) => parseInt(pixels.map((pixel) => pixelToBinary(pixel)).join(''), 2)

const parseInput = (input) => {
  const idxEmptyLine = input.indexOf('')
  const algorithm = input.slice(0, idxEmptyLine).shift()
  const initialImage = input.slice(idxEmptyLine + 1).map((line) => line.split(''))

  return [algorithm, initialImage]
}

const processImage = (sourceImage, algorithm, passes) => {
  let image = sourceImage
  let borderPixel = DARK_PIXEL
  for (let i = 0; i < passes; i++) {
    image = enhance(expandImage(image, borderPixel), algorithm, borderPixel)

    const index = convertToAlgorithmIdx(Array(9).fill(borderPixel))
    borderPixel = algorithm[index]
  }

  return image
}

const expandImage = (sourceImage, borderPixel = DARK_PIXEL) => {
  const width = sourceImage[0].length
  const BORDER = Array(width + 2).fill(borderPixel)
  const image = sourceImage.map((line) => [borderPixel, ...line, borderPixel])

  return [BORDER, ...image, BORDER]
}

const enhance = (sourceImage, algorithm, borderPixel) =>
  sourceImage.map((line, y) =>
    line.map((_, x) => {
      const pixels = get3X3Pixels(sourceImage, x, y, borderPixel)
      const index = convertToAlgorithmIdx(pixels)

      return algorithm[index]
    })
  )

const get3X3Pixels = (image, x, y, borderPixel) =>
  [
    { x: x - 1, y: y - 1 },
    { x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y },
    { x, y },
    { x: x + 1, y },
    { x: x - 1, y: y + 1 },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ].map(({ x, y }) => getPixel(image, x, y, borderPixel))

const getPixel = (image, x, y, borderPixel) => (image[y] && image[y][x] ? image[y][x] : borderPixel)

const countLightPixel = (image) => image.map((line) => line.filter((pixel) => pixel === LIGHT_PIXEL)).reduce((count, line) => count + line.length, 0)

const drawImage = (image) => {
  image.forEach((line) => console.log(line.join('')))
}

;(async () => {
  const data = await readInput()

  const [algorithm, initialImage] = parseInput(data)

  // Part 1
  let processedImage = processImage(initialImage, algorithm, 2)
  console.log(countLightPixel(processedImage), 5663)

  // Part 2
  processedImage = processImage(initialImage, algorithm, 50)
  console.log(countLightPixel(processedImage), 19638)
})()
