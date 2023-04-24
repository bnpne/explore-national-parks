import Media from "../../classes/media"
import { getImageDimensions } from "../../utils/format"
import debounce from "lodash/debounce"
import { lerp } from "../../utils/math"
import { STATE } from "../../lib"
import gsap from "gsap"
import * as THREE from "three"

export default class CarouselMedia extends Media {
  constructor() {
    super()
  }

  init({ tex, index, viewport, screen, scene, mouse, material }) {
    super.init({
      tex,
      index,
      viewport,
      screen,
      scene,
      mouse,
      material,
    })

    this.defaultGap = 0.05
    this.currentX = 0
    this.targetX = 0
    this.currentY = 0
    this.targetY = 0
    // this.snap = 0
    this.clock = 0
    this.ease = 0.075
    this.bottomBoundary = 0
    this.topBoundary = 0

    this.onCheckDebounce = debounce(this.check, 50)
  }

  scale() {
    const n = 250 / 1920
    const { width, height } = getImageDimensions(
      n,
      250 / 175,
      this.viewport.width
    )

    this.defaultDim = {
      defaultWidth: width,
      defaultHeight: height,
    }

    this.mesh.scale.set(
      this.defaultDim.defaultWidth,
      this.defaultDim.defaultHeight
    )

    this.imageAspect =
      this.tex.source.data.naturalHeight / this.tex.source.data.naturalWidth

    let a1
    let a2
    if (
      this.defaultDim.defaultHeight / this.defaultDim.defaultWidth >
      this.imageAspect
    ) {
      a1 =
        (this.defaultDim.defaultWidth / this.defaultDim.defaultHeight) *
        this.imageAspect
      a2 = 1
    } else {
      a1 = 1
      a2 =
        this.defaultDim.defaultHeight /
        this.defaultDim.defaultWidth /
        this.imageAspect
    }

    this.material.uniforms.resolution.value.x = this.defaultDim.defaultWidth
    this.material.uniforms.resolution.value.y = this.defaultDim.defaultHeight
    this.material.uniforms.resolution.value.z = a1
    this.material.uniforms.resolution.value.w = a2
  }

  posX(x) {
    if (!x) this.mesh.position.x = this.currentX
    else if (x) {
      this.mesh.position.x = x
      this.currentX = x
    }
  }

  posY(y) {
    if (!y) this.mesh.position.y = this.currentY
    else if (y) {
      this.mesh.position.y = y
      this.currentY = y
    }
  }

  resize({ viewport, screen, scrollLimit }) {
    super.resize({
      viewport,
      screen,
    })

    this.currentY =
      STATE.imgState === 1
        ? -this.index * (this.defaultDim.defaultHeight + this.defaultGap)
        : this.topBoundary + this.viewport.height
    this.targetY =
      STATE.imgState === 1
        ? -this.index * (this.defaultDim.defaultHeight + this.defaultGap)
        : this.topBoundary + this.viewport.height
    this.currentX = this.viewport.width / 2 - this.defaultDim.defaultWidth
    this.targetX = this.viewport.width / 2
    this.bottomBoundary =
      -this.index * (this.defaultDim.defaultHeight + this.defaultGap)
    this.topBoundary = this.bottomBoundary + scrollLimit
  }

  expand() {
    const s = new THREE.Vector2(this.mesh.scale.y, this.mesh.scale.x)
    const m = new THREE.Vector2(s.x, s.y).multiplyScalar(1.2)
    if (this.snap === 0) {
      // this.mesh.scale.set(m.x, s.y)
      gsap.to(this.mesh.scale, {
        x: m.x,
        ease: "circ.easeOut",
        delay: 1,
        duration: 0.5,
      })
    } else {
      this.createBounds()
    }
  }

  check() {
    // this.expand()
    let nextSnap = this.snap + (this.defaultGap + this.defaultDim.defaultHeight)
    let prevSnap = this.snap - (this.defaultDim.defaultHeight + this.defaultGap)

    if (this.speed >= 1) {
      this.targetY =
        this.direction === "D"
          ? Math.min(nextSnap, this.topBoundary)
          : Math.max(prevSnap, this.bottomBoundary)
    } else {
      this.targetY = this.snap
    }
  }

  loop() {
    let newPosY = { y: lerp(this.currentY, this.targetY, this.ease) }

    this.posX()
    this.posY(newPosY.y)
  }
}
