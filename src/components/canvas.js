import * as THREE from "three"
import { Pane } from "tweakpane"

export default class Canvas {
  constructor(el) {
    this.el = el
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

    // Tweakpane for dev
    this.pane = new Pane()

    this.resize()
  }

  loaded() {
    // Load home canvas
    console.log("loaded")
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
  }

  loop() {
    this.renderer.render(this.scene, this.camera)
  }
}

// createMedia() {
//   this.mediaList = []

//   IMG_COORD.map((el, i) => {
//     const m = new Image()
//     m.src = el.img
//     m.onload = () => {
//       const media = new Media({
//         image: m,
//         element: el,
//         viewport: this.viewport,
//         screen: this.screen,
//         scene: this.scene,
//         index: i,
//       })

//       this.loadedImgs += 1
//       if (this.loadedImgs == IMG_COORD.length) {
//         this.loaded()
//       }

//       this.mediaList.push(media)
//     }
//   })
// }
