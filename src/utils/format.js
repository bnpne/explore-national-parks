const WIDTH_RATIO = 0.16

export function getImageDimensions(image, canvasWidth) {
  return {
    width: canvasWidth * WIDTH_RATIO,
    height:
      (canvasWidth * WIDTH_RATIO) / (image.naturalWidth / image.naturalHeight),
  }
}
