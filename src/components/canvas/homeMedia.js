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
    if (STATE.imgState === 0) {
      const n = 100 / 1920
      const { width, height } = getImageDimensions(
        n,
        1 / 1,
        this.viewport.width
      )

      this.defaultWidth = width
      this.defaultHeight = height

      this.mesh.scale.set(this.defaultWidth, this.defaultHeight, 1)
    } else if (STATE.imgState === 1) {
      const n = 150 / 1920
      const { width, height } = getImageDimensions(
        n,
        300 / 350,
        this.viewport.width
      )

      this.defaultWidth = width
      this.defaultHeight = height

      // Don't set it because we need to transition
      // this.mesh.scale.set(this.defaultWidth, this.defaultHeight, 1)
      STATE.transition.to(
        this.mesh.scale,
        { x: this.defaultWidth, y: this.defaultHeight },
        "start"
      )
    }
  }

  posX() {
    if (STATE.imgState === 0) {
      // 30 in px is padding + 100 in px for img width
      const w = 100 * (this.index + 1)
      const pos = 30 + w
      this.x = getPositionX(this.mesh.scale, this.viewport, this.screen, pos)

      this.mesh.position.x = this.x
    } else if (STATE.imgState === 1) {
      const { start: colPos } = getColumnPos(this.screen, 6, this.element, 30)
      this.x = getPositionX(this.mesh.scale, this.viewport, this.screen, colPos)

      // Don't set it because we need to transition
      // this.mesh.position.x = this.x
      STATE.transition.to(this.mesh.position, { x: this.x }, "start")
    }
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
      STATE.transition.to(this.mesh.position, { y: this.y }, "start")
    }
  }

  transition() {
    // Set new position by calling Functions
    this.scale()
    this.posX()
    this.posY()
  }
}
