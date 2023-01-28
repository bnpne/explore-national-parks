const WIDTH_RATIO = 0.08

export function getImageDimensions(image, canvasWidth) {
  return {
    width: canvasWidth * WIDTH_RATIO,
    height: (canvasWidth * WIDTH_RATIO) / (300 / 350),
  }
}

/**
  This grid is based on a 12 column grid. To really make this random, I need to find the width of each column plus the position.
  I can then use the width and position to place each image when given a column span
**/

export function getColumnPos(screen, numOfColumns, el) {
  const actualStart = el.col - 1 // 0 set the start
  const colWidth = screen.width / numOfColumns // Get Column width based on how many columns on viewport
  const start = colWidth * actualStart // Get the starting position based on colStart

  return { start }
}

export function getRowPos(rowHeight, el) {
  const actualStart = el.row - 1 // 0 set the start
  const start = rowHeight * actualStart // Get the starting position based on colStart]

  return { start }
}

export function getPositionX(planeScale, viewport, screen, x) {
  return (
    -(viewport.width / 2) -
    planeScale.x / 2 +
    (x / screen.width) * viewport.width
  )
}

export function getPositionY(planeScale, viewport, screen, y) {
  return (
    viewport.height / 2 +
    planeScale.y / 2 -
    (y / screen.height) * viewport.height
  )
}
