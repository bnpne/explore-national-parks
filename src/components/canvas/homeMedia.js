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

  init({ tex, element, index, viewport, screen, scene }) {
    super.init({
      tex,
      element,
      index,
      viewport,
      screen,
      scene,
    })

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
  }

  posX() {
    const { start: colPos } = getColumnPos(this.screen, 6, this.element, 0)
    this.x = getPositionX(this.mesh.scale, this.viewport, this.screen, colPos)

    this.mesh.position.x = this.x
  }

  posY() {
    if (STATE.imgState === 0) {
      const a = this.screen.height - 40
      this.y = getPositionY(this.mesh.scale, this.viewport, this.screen, a)

      this.mesh.position.y = this.y
    } else if (STATE.imgState === 1) {
      const { start: rowPos } = getRowPos(this.screen, 400, this.element, 16)
      this.y = getPositionY(this.mesh.scale, this.viewport, this.screen, rowPos)

      // Don't set it because we need to transition
      // this.mesh.position.y = this.y
      if (!this.transitioned) {
        STATE.transition.to(this.mesh.position, { y: this.y }, "start")
      } else {
        this.mesh.position.y = this.y
      }
    }
  }

  transition() {
    if (this.transitioned) {
      return
    }

    this.scale()
    this.posX()
    this.posY()
    this.transitioned = true
  }
}
