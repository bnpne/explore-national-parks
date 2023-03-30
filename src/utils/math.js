export function lerp(start, end, t) {
  return start * (1 - t) + end * t
}

export function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max))
}
