const getMeasurementIncreaseTimes = (measurements) => {
    return measurements.reduce((times, current, idx) => {
        if (measurements[idx + 1] > measurements[idx]) times++
        return times
    }, 0)  
}

// Part 2
const getSumOfThreeMeasurementsIncreaseTimes = (sumOfMeasurements) => {
    return sumOfMeasurements.reduce((times, current, idx) => {
        if (sumOfMeasurements[idx + 3] > sumOfMeasurements[idx]) times++
        return times
    }, 0)  
}
