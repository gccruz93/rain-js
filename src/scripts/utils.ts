export const map = (
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
  withinBounds: boolean
): number => {
  const newval =
    ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2
  if (!withinBounds) {
    return newval
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2)
  } else {
    return constrain(newval, stop2, start2)
  }
}

export const constrain = (n: number, low: number, high: number): number => {
  return Math.max(Math.min(n, high), low)
}

export const random = (min: number, max: number): number => {
  const rand = Math.random()
  if (typeof min === 'undefined') {
    return rand
  } else if (typeof max === 'undefined') {
    return rand * min
  } else {
    if (min > max) {
      const tmp = min
      min = max
      max = tmp
    }
    return rand * (max - min) + min
  }
}
