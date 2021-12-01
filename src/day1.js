const getMeasurementIncreaseTimes = (measurements) => {
	return measurements.reduce((times, current, idx) => {
    if (measurements[idx + 1] > measurements[idx]) times++
  	return times
  }, 0)  
}
