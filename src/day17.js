// in Windows, run 'type input.txt | node day17.js'
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

const parseArea = (input) => {
  const [[near, far], [bottom, top]] = input
    .substring(input.indexOf(':') + 1)
    .split(',')
    .map((s) => s.substring(s.indexOf('=') + 1))
    .map((s) => s.split('..').map((n) => parseInt(n)))
    .map((values) => values.sort())

  return { near, far, top, bottom }
}

const calculateInitialVelocityPairs = (area) => {
  const stepsToVelocitiesInY = getStepsToVelocitiesInYMap(area)
  const initialVelocityPairs = {}
  for (const steps in stepsToVelocitiesInY) {
    const velocitiesInY = stepsToVelocitiesInY[steps]

    const velocitiesInX = []
    for (let v0InX = area.far; v0InX > 0; v0InX--) {
      const displacement = calculateDisplacement(v0InX, steps, true)

      if (displacement > area.far) {
        continue
      } else if (area.near <= displacement && displacement <= area.far) {
        velocitiesInX.push(v0InX)
      }
    }

    velocitiesInY.forEach((v0InY) => {
      velocitiesInX.forEach((v0InX) => {
        initialVelocityPairs[`${v0InX}_${v0InY}`] = 1
      })
    })
  }

  return Object.keys(initialVelocityPairs)
}

const getStepsToVelocitiesInYMap = (area) => {
  const v0sInY = getPossibleVelocitiesInY(area)
  return transformToStepsMapVelocities(v0sInY)
}

const getPossibleVelocitiesInY = (area) => {
  const velocities = {}
  for (let v = area.bottom; v <= -area.bottom; v++) {
    let steps = 1
    while (true) {
      const displacement = calculateDisplacement(v, steps)

      if (displacement < area.bottom) {
        break
      } else if (area.bottom <= displacement && displacement <= area.top) {
        velocities[`${steps}_${v}`] = 1
      }
      steps++
    }
  }
  return velocities
}

const calculateDisplacement = (v0, steps, stopWhenZero = false) => {
  let s = 0
  let v = v0
  for (let i = 0; i < steps; i++) {
    if (stopWhenZero && v === 0) break
    s += v
    v--
  }
  return s
}

const transformToStepsMapVelocities = (velocitiesMap) => {
  return Object.keys(velocitiesMap).reduce((result, steps_velocity) => {
    const [steps, velocity] = steps_velocity.split('_').map((n) => parseInt(n))
    if (!result[steps]) result[steps] = []
    result[steps].push(velocity)
    return result
  }, {})
}

;(async () => {
  const data = await readInput()

  const area = parseArea(data[0])

  // Part 1
  const maxV0InY = Math.abs(area.bottom)
  console.log(((maxV0InY - 1) * maxV0InY) / 2)

  // Part 2
  const initialVelocityPairs = calculateInitialVelocityPairs(area)
  console.log(initialVelocityPairs.length)
})()
