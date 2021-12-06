// in Windows, run 'type input.txt | node day4.js'
const readline = require("readline")

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

;(async () => {
  const data = await (await readInput()).shift()

  const originalLanterns = data.split(",").map((n) => parseInt(n))

  const spawnTimer = 6
  const spawnTimerForNewlyLantern = 8

  let lanternsBuckets = Array(spawnTimerForNewlyLantern + 1).fill(0)
  lanternsBuckets = originalLanterns.reduce((buckets, currentTimer) => {
    buckets[currentTimer]++
    return buckets
  }, lanternsBuckets)

  const spawnDays = 256
  for (let d = 0; d < spawnDays; d++) {
    const numberShouldBeSpawn = lanternsBuckets[0]
    for (let i = 1; i < lanternsBuckets.length; i++) {
      lanternsBuckets[i - 1] = lanternsBuckets[i]
    }
    lanternsBuckets[spawnTimer] += numberShouldBeSpawn
    lanternsBuckets[spawnTimerForNewlyLantern] = numberShouldBeSpawn
  }

  const sum = lanternsBuckets.reduce((total, current) => total + current, 0)
  console.log(sum)
})()
