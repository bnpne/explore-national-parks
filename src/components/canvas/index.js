import * as THREE from "three"
import { IMG_COORD, STATE } from "../../lib"
import HomeMedia from "./homeMedia"
import gsap from "gsap"

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
    this.mouse = new THREE.Vector2()

    this.resize()
  }

  loaded(url) {
    if (url === "/") {
      this.createHomeMedia()
    }
    this.url = url
  }

  createHomeMedia() {
    const temp = STATE.texList[0]
    this.homeMediaList = temp.map((tex, i) => {
      const homeMedia = new HomeMedia()
      homeMedia.init({
        tex: tex,
        element: IMG_COORD[i],
        index: i,
        viewport: this.viewport,
        scene: this.scene,
        screen: this.screen,
      })

      return homeMedia
    })
  }

  intersect(pointer) {
    this.raycaster.setFromCamera(pointer, this.camera)

    return this.raycaster.intersectObjects(this.scene.children)
  }

  hover(e) {
    this.mouse.x = (e.clientX / this.screen.width) * 2 - 1
    this.mouse.y = -(e.clientY / this.screen.height) * 2 + 1

    this.intersectedObjects = this.intersect(this.mouse)
    if (this.intersectedObjects.length > 0 && this.intersectedObjects[0]) {
      document.body.style.cursor = "pointer"
    } else {
      document.body.style.cursor = "default"
    }
  }

  click(e) {
    if (STATE.imgState === 0) {
      this.mouse.x = (e.clientX / this.screen.width) * 2 - 1
      this.mouse.y = -(e.clientY / this.screen.height) * 2 + 1

      this.intersectedObjects = this.intersect(this.mouse)
      if (this.intersectedObjects.length > 0 && this.intersectedObjects[0]) {
        // Go to next state
        STATE.dispatch("addImgState", [1])
        // Update the coor and sizes
        this.transition()
        // Play transition
        STATE.transition.play()
      }
    } else if (STATE.imgState === 1) {
      this.mouse.x = (e.clientX / this.screen.width) * 2 - 1
      this.mouse.y = -(e.clientY / this.screen.height) * 2 + 1

      if (STATE.selected) {
        STATE.selected.mesh.position.set(STATE.selectedHistory)
        STATE.dispatch("removeSelected")
        STATE.dispatch("removeSelectedHistory")
      } else {
        this.intersectedObjects = this.intersect(this.mouse)
        if (this.intersectedObjects.length > 0 && this.intersectedObjects[0]) {
          const a = this.homeMediaList.filter(
            (el) => el.mesh === this.intersectedObjects[0].object
          )

          STATE.dispatch("addSelected", [a[0]])
          STATE.dispatch("addSelectedHistory", [a[0].mesh.position])
          STATE.selected.mesh.position.set(0, 0, 1)
        }
      }
    }
  }

  transition() {
    // add a tween to go to new position and size
    if (this.homeMediaList) this.homeMediaList.forEach((el) => el.transition())
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

    if (this.homeMediaList) {
      this.homeMediaList.forEach((el) =>
        el.resize({ viewport: this.viewport, screen: this.screen })
      )
    }
  }

  loop() {
    if (this.homeMediaList) this.homeMediaList.forEach((el) => el.loop())
    this.renderer.render(this.scene, this.camera)
  }
}
