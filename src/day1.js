// Part 1
const getMeasurementIncreaseTimes = (measurements) => {
    return measurements.reduce((times, _, idx) => {
        if (measurements[idx + 1] > measurements[idx]) times++
        return times
    }, 0)  
}

// getMeasurementIncreaseTimes(input)

// Part 2
const getSumOfThreeMeasurementsIncreaseTimes = (sumOfMeasurements) => {
    return sumOfMeasurements.reduce((times, _, idx) => {
        if (sumOfMeasurements[idx + 3] > sumOfMeasurements[idx]) times++
        return times
    }, 0)  
}

// getSumOfThreeMeasurementsIncreaseTimes(input)
