import { PARK_CAROUSEL } from "../lib"

const WIDTH_RATIO = 0.08

export function getImageDimensions(widthScale, widthRatio, canvasWidth) {
  return {
    width: canvasWidth * widthScale,
    height: (canvasWidth * widthScale) / widthRatio, //(300 / 350)
  }
}

export function getScrollLimitWidth(widthScale, widthRatio, canvasWidth, gap) {
  const { width } = getImageDimensions(widthScale, widthRatio, canvasWidth)
  return (PARK_CAROUSEL.length - 2) * (width + gap)
}

export function getScrollLimitHeight(widthScale, widthRatio, canvasWidth, gap) {
  const { height } = getImageDimensions(widthScale, widthRatio, canvasWidth)
  return (PARK_CAROUSEL.length - 2) * (height + gap)
}
/**
  This grid is based on a 12 column grid. To really make this random, I need to find the width of each column plus the position.
  I can then use the width and position to place each image when given a column span
**/
export function getColumnPos(screen, numOfColumns, col, padding) {
  let p = 0
  if (padding) {
    p = padding
  }
  const colWidth = (screen.width - p * 2) / numOfColumns // Get Column width based on how many columns on viewport
  const start = colWidth * (col - 1) + p // Get the starting position based on colStart

  return { start }
}

export function getRowPos(screen, rowHeight, row, padding) {
  let p = 0
  if (padding) {
    p = padding
  }

  // Bottom is the height relative to the screen size
  // Row height is always based on 1920px width
  const ratio = rowHeight / 1920
  const height = ratio * (screen.width - p * 2)
  const start = height * (row - 1) + p // Get the starting position based on colStart]

  return { start }
}

export function getPositionX(planeScale, viewport, screen, x) {
  return (
    -(viewport.width / 2) +
    planeScale.x / 2 +
    (x / screen.width) * viewport.width
  )
}

export function getPositionY(planeScale, viewport, screen, y) {
  return (
    viewport.height / 2 -
    planeScale.y / 2 -
    (y / screen.height) * viewport.height
  )
}

////// THIS ALSO REPLACES THE HTML //////
export function splitPhrase(phrase) {
  let i = phrase.innerHTML.split(" ")
  phrase.innerHTML = ""
  i = i.map(
    (w) =>
      `<span class="word__wrapper"><span class="word__el">${w}</span></span>`
  )
  i.forEach((el) => {
    phrase.innerHTML += el
  })
  return phrase
}
