// in Windows, run 'type input.txt | node day4.js'
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

class Board {
  constructor(numbers) {
    this.side = numbers[0].length
    this.numbers = numbers.flat()
    this.marked = Array(this.numbers.length).fill(0)
    this.bingo = false
    this.lastMarkedNumber = 0
  }

  checkRow(markedIdx) {
    const first = Math.floor(markedIdx / this.side) * this.side
    const last = first + this.side
    for (let i = first; i < last; i++) {
      if (this.marked[i] === 0) return false
    }
    return true
  }

  checkColumn(markedIdx) {
    const first = markedIdx % this.side
    const last = this.side * this.side - 1 + first
    for (let i = first; i < last; i += this.side) {
      if (this.marked[i] === 0) return false
    }
    return true
  }

  checkDiagonal(markedIdx) {
    const row = Math.floor(markedIdx / this.side)
    const col = markedIdx % this.side

    if (row !== col && row + col !== this.side - 1) return false

    const firstRow = 0
    const firstCol = row === col ? 0 : this.side - 1
    const endRow = this.side - 1
    const nextCol = row === col ? 1 : -1
    for (
      let checkRow = firstRow, checkCol = firstCol;
      checkRow <= endRow;
      checkRow++, checkCol += nextCol
    ) {
      if (this.marked[checkRow * this.side + checkCol] === 0) return false
    }
    return true
  }

  isBingo(markedIdx) {
    return (
      this.checkRow(markedIdx) ||
      this.checkColumn(markedIdx) ||
      this.checkDiagonal(markedIdx)
    )
  }

  mark(number) {
    const idx = this.numbers.indexOf(number)
    if (idx < 0) return
    this.marked[idx] = 1
    this.bingo = this.isBingo(idx)
    this.lastMarkedNumber = number
  }

  score() {
    if (!this.bingo) return 0

    const sumOfUnmarked = this.numbers.reduce((sum, current, idx) => {
      return sum + (this.marked[idx] === 0 ? current : 0)
    }, 0)

    return this.lastMarkedNumber * sumOfUnmarked
  }
}

class BingoGame {
  constructor(input) {
    this.draws = this.parseDraws(input[0])

    input.shift()

    const boardsRawData = this.parseBoards(input)
    this.boards = this.generateBoards(boardsRawData)
  }

  parseDraws = (drawsStr) => {
    return drawsStr.split(',').map((n) => parseInt(n))
  }

  parseBoards = (input) => {
    const numbers = input.map((line) =>
      line
        .split(' ')
        .filter((s) => s)
        .map((n) => parseInt(n))
    )
    return this.groupNumbersBy(numbers[0].length, numbers)
  }

  groupNumbersBy = (count, items) => {
    return items.reduce(
      (groups, item) => {
        const lastGroup = groups[groups.length - 1]
        if (lastGroup.length >= count) {
          groups.push([item])
        } else {
          lastGroup.push(item)
        }
        return groups
      },
      [[]]
    )
  }

  generateBoards = (rawData) => {
    return rawData.map(this.generateBoard)
  }

  generateBoard = (numbers) => {
    return new Board(numbers)
  }

  getResult = () => {
    let firstBingoBoard = null
    let lastBingoBoard = null
    for (const n of this.draws) {
      this.boards.forEach((b) => b.mark(n))
      if (!firstBingoBoard) {
        const bingoBoard = this.boards.find((b) => b.bingo)
        if (bingoBoard) {
          firstBingoBoard = bingoBoard
        }
      }

      // Part 2
      if (this.boards.length === 1 && this.boards[0].bingo) {
        lastBingoBoard = this.boards[0]
        break
      }
      this.boards = this.boards.filter((b) => !b.bingo)
    }

    return { firstBingoBoard, lastBingoBoard }
  }
}

;(async () => {
  const data = await readInput()

  const game = new BingoGame(data)
  const { firstBingoBoard, lastBingoBoard } = game.getResult()
  console.log(firstBingoBoard.score())
  console.log(lastBingoBoard.score())
})()
