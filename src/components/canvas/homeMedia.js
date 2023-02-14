import Media from "../../classes/media"
import {
  getImageDimensions,
  getColumnPos,
  getRowPos,
  getPositionX,
  getPositionY,
} from "../../utils/format"
import { STATE } from "../../lib/"

export default class HomeMedia extends Media {
  constructor() {
    super()

    this.transitioned = false
  }

  init({ tex, index, viewport, screen, scene, col, row }) {
    super.init({
      tex,
      index,
      viewport,
      screen,
      scene,
    })

    this.col = col
    this.row = row

    if (STATE.imgState === 0) {
      if (this.index === 0) {
        STATE.timeline.from(this.mesh.position, { y: -4.5 }, "endPreload-=90%")
      } else {
        STATE.timeline.from(this.mesh.position, { y: -4.5 }, "<3%")
      }
    }
  }

  scale() {
    const n = 300 / 1920
    const { width, height } = getImageDimensions(
      n,
      300 / 350,
      this.viewport.width
    )

    this.defaultWidth = width
    this.defaultHeight = height

    this.mesh.scale.set(this.defaultWidth, this.defaultHeight)
    this.material.uniforms.planeDim.value = [
      this.defaultWidth,
      this.defaultHeight,
    ]
  }

  posX() {
    const { start: colPos } = getColumnPos(this.screen, 12, this.col, 16)
    const center = colPos + 7.5
    this.x = getPositionX(this.mesh.scale, this.viewport, this.screen, center)

    this.mesh.position.x = this.x
  }

  posY() {
    if (STATE.imgState === 0) {
      const a = this.screen.height - 40
      this.y = getPositionY(this.mesh.scale, this.viewport, this.screen, a)

      this.mesh.position.y = this.y
    } else if (STATE.imgState === 1) {
      const { start: rowPos } = getRowPos(this.screen, 367.5, this.row, 16)
      this.y = getPositionY(this.mesh.scale, this.viewport, this.screen, rowPos)

      // Don't set it because we need to transition
      // this.mesh.position.y = this.y
      if (!this.transitioned) {
        STATE.transition.to(this.mesh.position, { y: this.y }, "<6%")
      } else {
        this.mesh.position.y = this.y
      }
    }
  }

  transition() {
    if (this.transitioned) {
      return
    }

    this.createBounds()
    this.transitioned = true
  }
}
