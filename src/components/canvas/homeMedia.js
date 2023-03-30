import * as THREE from "three"
import Media from "../../classes/media"
import {
  getImageDimensions,
  getColumnPos,
  getRowPos,
  getPositionX,
  getPositionY,
} from "../../utils/format"
import { STATE } from "../../lib/"
import { clamp } from "../../utils/math"

export default class HomeMedia extends Media {
  constructor() {
    super()

    this.transitioned = false
  }

  init({ tex, index, viewport, screen, scene, col, row, mouse }) {
    super.init({
      tex,
      index,
      viewport,
      screen,
      scene,
      mouse,
    })

    this.col = col
    this.row = row

    this.createDataTexture()

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

    this.imageAspect = 1.5 / 1
    let a1
    let a2
    if (this.defaultHeight / this.defaultWidth > this.imageAspect) {
      a1 = (this.defaultWidth / this.defaultHeight) * this.imageAspect
      a2 = 1
    } else {
      a1 = 1
      a2 = this.defaultHeight / this.defaultWidth / this.imageAspect
    }

    this.material.uniforms.resolution.value.x = this.defaultWidth
    this.material.uniforms.resolution.value.y = this.defaultHeight
    this.material.uniforms.resolution.value.z = a1
    this.material.uniforms.resolution.value.w = a2
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

  createDataTexture() {
    this.pixelSize = 8

    const width = this.pixelSize
    const height = this.pixelSize

    const size = width * height
    const data = new Float32Array(4 * size)
    const color = new THREE.Color(0xffffff)

    const r = Math.floor(color.r * 255)
    const g = Math.floor(color.g * 255)
    const b = Math.floor(color.b * 255)

    for (let i = 0; i < size; i++) {
      let r = Math.random() * 9
      let r1 = Math.random() * 255 - 125

      const stride = i * 4

      data[stride] = r
      data[stride + 1] = r
      data[stride + 2] = r1
      data[stride + 3] = r
    }

    // used the buffer to create a DataTexture

    this.dataTexture = new THREE.DataTexture(
      data,
      width,
      height,
      THREE.RGBAFormat,
      THREE.FloatType
    )

    this.dataTexture.magFilter = this.dataTexture.minFilter =
      THREE.NearestFilter

    if (this.material) {
      this.material.uniforms.dataTex.value = this.dataTexture
      this.material.uniforms.dataTex.value.needsUpdate = true
    }
  }

  updateDataTexture() {
    let data = this.dataTexture.image.data
    // console.log(data)
    for (let i = 0; i < data.length; i += 3) {
      data[i] *= 0.9
      data[i + 1] *= 0.9
    }

    let gridMouseX = this.pixelSize * this.mouse.x
    let gridMouseY = this.pixelSize * (1 - this.mouse.y)
    let maxDist = this.pixelSize * 0.25
    let aspect = this.screen.height / this.screen.width

    for (let i = 0; i < this.pixelSize; i++) {
      for (let j = 0; j < this.pixelSize; j++) {
        let distance = (gridMouseX - i) ** 2 / aspect + (gridMouseY - j) ** 2
        let maxDistSq = maxDist ** 2

        if (distance < maxDistSq) {
          let index = 3 * (i + this.pixelSize * j)

          let power = maxDist / Math.sqrt(distance)
          power = clamp(power, 0, 10)
          // if(distance <this.size/32) power = 1;
          // power = 1;

          data[index] += 1 * 100 * this.mouse.vX * power
          data[index + 1] -= 1 * 100 * this.mouse.vY * power
        }
      }
    }

    this.mouse.vX *= 0.9
    this.mouse.vY *= 0.9
    this.dataTexture.needsUpdate = true
  }

  hover(mouse) {
    if (mouse) this.mouse = mouse
    // console.log(this.mouse)
  }

  loop() {
    this.updateDataTexture()
  }

  transition() {
    if (this.transitioned) {
      return
    }

    this.createBounds()
    this.transitioned = true
  }
}
