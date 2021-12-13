// in Windows, run 'type input.txt | node day13.js'
const readline = require('readline')
const { deflateRaw } = require('zlib')

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

const parseTransparentPaper = (input) => {
  return input.reduce(
    ([dots, instructions], line) => {
      if (isCoordinate(line)) {
        dots.push(parseCoordinate(line))
      } else {
        instructions.push(parseFoldingInstruction(line))
      }
      return [dots, instructions]
    },
    [[], []]
  )
}

const isCoordinate = (input) => {
  const coordinate = input.split(',')
  return coordinate.length === 2 && coordinate.map((n) => parseInt(n)).every((n) => Number.isInteger(n))
}

const parseCoordinate = (input) => {
  const [x, y] = input.split(',').map((n) => parseInt(n))
  return { x, y }
}

const parseFoldingInstruction = (input) => {
  const [axis, number] = input.split(' ').splice(2, 1).shift().split('=')
  return { axis, number: parseInt(number) }
}

class TransparentPaper {
  constructor(dots) {
    this.dots = dots
  }

  dotsCount() {
    return this.dots.length
  }

  fold({ axis: foldingAxis, number }) {
    this.dots = this.dots
      .map((dot) => {
        if (dot[foldingAxis] < number) {
          return dot
        } else {
          return { ...dot, [foldingAxis]: -dot[foldingAxis] + 2 * number }
        }
      })
      .reduce((dots, dot) => {
        if (!this.isExisting(dots, dot)) {
          dots.push(dot)
        }
        return dots
      }, [])
  }

  isExisting(dots, dot) {
    return dots.some((d) => d.x === dot.x && d.y === dot.y)
  }

  draw() {
    const [width, height] = this.dots
      .reduce(
        ([xs, ys], { x, y }) => [
          [...xs, x],
          [...ys, y],
        ],
        [[], []]
      )
      .map((ns) => Math.max(...ns) + 1)

    const diagram = Array.from(Array(height), () => new Array(width).fill('.'))

    this.dots.forEach(({ x, y }) => {
      diagram[y][x] = '#'
    })

    console.log(diagram.map((line) => line.join('')))
  }
}

;(async () => {
  const data = await readInput()

  const [dots, instructions] = parseTransparentPaper(data)

  // Part 1
  let transparentPaper = new TransparentPaper(dots)
  transparentPaper.fold(instructions[0])
  console.log(transparentPaper.dotsCount())

  // Part 2
  transparentPaper = new TransparentPaper(dots)
  instructions.forEach((instruction) => {
    transparentPaper.fold(instruction)
  })
  console.log(transparentPaper.dotsCount())
  transparentPaper.draw()
})()
