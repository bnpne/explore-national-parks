import * as THREE from "three"
import Media from "./core/media"
import gsap from "gsap"

import { IMG_ARRAY, IMG_COORD } from "./lib/store"
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

    this.loadedImgs = 0

    this.resize()
    this.createMedia()
    this.loop()
    this.initEvents()
  }

  createMedia() {
    this.mediaList = []

    IMG_COORD.map((el, i) => {
      const m = new Image()
      m.src = el.img
      m.onload = () => {
        const media = new Media({
          image: m,
          element: el,
          viewport: this.viewport,
          screen: this.screen,
          scene: this.scene,
          index: i,
        })

        this.loadedImgs += 1
        if (this.loadedImgs == IMG_COORD.length) {
          this.loaded()
        }

        this.mediaList.push(media)
      }
    })
  }

  loaded() {
    document.documentElement.classList.remove("loading")
    document.documentElement.classList.add("loaded")
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

    if (this.mediaList) {
      this.mediaList.forEach((el) => {
        el.resize({ screen: this.screen, viewport: this.viewport })
      })
    }
  }

  loop() {
    if (this.mediaList) {
      this.mediaList.forEach((el) => {
        el.loop()
      })
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
