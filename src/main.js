import * as THREE from "three"
import Media from "./core/media"
import { IMG_ARRAY } from "./lib/store"

import "./style.css"

class App {
  constructor() {
    this.canvas = document.getElementById("r")
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    })
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth,
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
    this.time = 0
    this.scroll = {
      current: 0,
      target: 0,
      ease: 0.075,
    }

    this.resize()
    this.createImg()
    this.loop()
    this.initEvents()
  }

  // Create webGL planes
  createImg() {
    this.imgList = IMG_ARRAY.map((el, i) => {
      const img = new Media({
        element: el,
        viewport: this.viewport,
        screen: this.screen,
        scene: this.scene,
        index: i,
      })

      return img
    })
  }

  // listen for the resize
  resize() {
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth,
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

    if (this.imgList) {
      this.imgList.forEach((el) => {
        el.resize({ screen: this.screen, viewport: this.viewport })
      })
    }
  }

  loop() {
    if (this.imgList) {
      this.imgList.forEach((el) => el.loop())
    }

    // Start renderer
    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.loop.bind(this))
  }

  // These are event handlers
  initEvents() {
    window.addEventListener("resize", this.resize.bind(this))
  }
}

new App()
