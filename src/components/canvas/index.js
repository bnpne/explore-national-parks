import * as THREE from "three"
import { STATE } from "../../lib"
import { getScrollLimitHeight } from "../../utils/format"
import normalizeWheel from "normalize-wheel"
import CarouselMedia from "../canvas/carouselMedia"

import vertexShader from "../../shaders/vertex.glsl"
import fragmentShader from "../../shaders/fragment.glsl"

export default class Canvas {
  constructor({ el, url }) {
    this.el = el
    this.url = url

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.el,
      antialias: true,
      alpha: true,
    })
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.screen.width / this.screen.height,
      0.1,
      100
    )
    this.camera.position.set(0, 0, 5)
    this.scene.add(this.camera)
    this.raycaster = new THREE.Raycaster()
    this.mouse = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
    }

    ///////////////////////// IMAGE TEXTURE //////////////////////////
    // Basic image material
    // Use this to clone
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      uniforms: {
        resolution: { value: new THREE.Vector4() },
        tex: { value: 0 },
        dataTex: { value: 0 },
        mouseCoor: { value: this.mouse },
      },
      transparent: true,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
    })

    this.clock = new THREE.Clock()

    this.resize()
  }

  loaded(url) {
    if (url === "/") {
      this.createCarousel()
    }
    this.url = url
    this.resize()
  }

  createCarousel() {
    const temp = STATE.texList[0]

    this.carouselMedia = temp.map((tex, i) => {
      // Clone material
      let newMat = this.material.clone()

      // Create Carousel Media
      const carouselMedia = new CarouselMedia()

      // Initialize media which creates texture and positions on webpage
      carouselMedia.init({
        tex: tex,
        index: i,
        viewport: this.viewport,
        scene: this.scene,
        screen: this.screen,
        mouse: this.mouse,
        material: newMat,
      })

      return carouselMedia
    })
  }

  intersect(pointer) {
    this.raycaster.setFromCamera(pointer, this.camera)

    return this.raycaster.intersectObjects(this.scene.children)
  }

  hover(e) {
    // this.mouse.x = (e.clientX / this.screen.width) * 2 - 1
    // this.mouse.y = -(e.clientY / this.screen.height) * 2 + 1
    //
    // this.mouse.vX = this.mouse.x - this.mouse.prevX
    // this.mouse.vY = this.mouse.y - this.mouse.prevY
    //
    // this.mouse.prevX = this.mouse.x
    // this.mouse.prevY = this.mouse.y
    //
    // this.intersectedObjects = this.intersect(this.mouse)
    // if (this.intersectedObjects.length > 0 && this.intersectedObjects[0]) {
    //   if (!STATE.selected) {
    //     document.body.style.cursor = "pointer"
    //   }
    //
    //   // const a = this.homeMediaList.filter(
    //   //   (el) => el.mesh === this.intersectedObjects[0].object
    //   // )
    //   //
    //   // if (a) a[0].hover(this.mouse)
    // } else {
    //   document.body.style.cursor = "default"
    // }
    // if (this.homeMediaList)
    //   this.homeMediaList.forEach((el) => el.hover(this.mouse))
  }

  click(e) {
    if (STATE.imgState === 1) {
      this.mouse.x = (e.clientX / this.screen.width) * 2 - 1
      this.mouse.y = -(e.clientY / this.screen.height) * 2 + 1

      if (STATE.selected) {
        STATE.selected.mesh.position.set(
          STATE.selectedPos.x,
          STATE.selectedPos.y,
          0
        )
        STATE.selected.mesh.scale.set(
          STATE.selectedScale.x,
          STATE.selectedScale.y
        )

        STATE.dispatch("removeSelected")
        STATE.dispatch("removeSelectedHistory")
      } else {
        this.intersectedObjects = this.intersect(this.mouse)
        if (this.intersectedObjects.length > 0 && this.intersectedObjects[0]) {
          const a = this.homeMediaList.filter(
            (el) => el.mesh === this.intersectedObjects[0].object
          )

          const h = new THREE.Vector3(
            a[0].mesh.position.x,
            a[0].mesh.position.y
          )
          const s = new THREE.Vector2(a[0].mesh.scale.x, a[0].mesh.scale.y)
          const m = new THREE.Vector2(
            a[0].mesh.scale.x,
            a[0].mesh.scale.y
          ).multiplyScalar(1.5)

          STATE.dispatch("addSelected", [a[0]])
          STATE.dispatch("addSelectedPos", [h])
          STATE.dispatch("addSelectedScale", [s])

          a[0].mesh.position.set(0, 0, 1)
          a[0].mesh.scale.set(m.x, m.y)
        }
      }
    }
  }

  scroll(e) {
    const { pixelY, pixelX } = normalizeWheel(e)

    const relativeSpeed = Math.min(
      100,
      Math.max(Math.abs(pixelY), Math.abs(pixelY))
    )
    this.speed = relativeSpeed * 0.01

    this.direction = ""
    if (pixelY > 0) {
      this.direction = "U"
    } else {
      this.direction = "D"
    }

    if (STATE.imgState === 0 && this.direction === "U") {
      this.transition()
    } else if (STATE.imgState === 1) {
      if (
        Math.abs(Math.round(this.carouselMedia[0].currentY)) === 0 &&
        this.direction === "D"
      ) {
        STATE.dispatch("addImgState", [0])
        this.transition()
      } else {
        const w =
          this.carouselMedia[0].defaultDim.defaultHeight +
          this.carouselMedia[0].defaultGap

        if (this.carouselMedia) {
          this.carouselMedia.forEach((el) => {
            let target =
              el.targetY + (this.direction === "D" ? -this.speed : this.speed)
            target = Math.max(
              el.bottomBoundary,
              Math.min(el.topBoundary, target)
            )
            el.targetY = target

            el.snap = Math.round(target / w) * w

            el.onCheckDebounce()
          })
        }
      }
    }
  }

  transition() {
    this.carouselMedia.forEach((el) => {
      STATE.imgState === 0
        ? (el.targetY = el.bottomBoundary)
        : (el.targetY = this.topBoundary + this.viewport.height)
    })
  }

  resize() {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    this.renderer.setSize(this.screen.width, this.screen.height)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.camera.aspect = this.screen.width / this.screen.height
    this.camera.updateProjectionMatrix()

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.viewport = {
      height: height,
      width: width,
    }

    const n = 250 / 1920
    this.scrollLimit = getScrollLimitHeight(
      n,
      250 / 175,
      this.viewport.width,
      0.05
    )

    if (this.carouselMedia) {
      this.carouselMedia.forEach((el) =>
        el.resize({
          viewport: this.viewport,
          screen: this.screen,
          scrollLimit: this.scrollLimit,
        })
      )
    }
  }

  loop() {
    // Render Scene
    this.renderer.render(this.scene, this.camera)

    if (this.carouselMedia) {
      // Render rest of carousel
      this.carouselMedia.forEach((el) => el.loop())

      if (Math.abs(Math.round(this.carouselMedia[0].currentY)) === 0) {
        STATE.dispatch("addImgState", [1])
      }
    }
  }
}
