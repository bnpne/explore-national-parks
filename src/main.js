import * as THREE from "three"
import Media from "./core/media"
import gsap from "gsap"

import { IMG_COORD } from "./lib/store"
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

    this.tl = gsap.timeline({ paused: true })

    this.loaded = 0

    this.resize()
    this.createMedia()
    this.loop()
    this.initEvents()
  }

  createMedia() {
    this.mediaList = IMG_COORD.map((el, i) => {
      const m = new Image()
      m.src = el.img
      let a = null
      m.onload = () => {
        console.log("loaded")
        a = new Media({
          image: m,
          element: el,
          viewport: this.viewport,
          screen: this.screen,
          scene: this.scene,
          index: i,
        })

        this.loaded += 1
        return a
      }
    })

    console.log(this.mediaList)
  }

  createDom() {
    // DOM.forEach((el, i) => {
    //   if (i !== 0) {
    //     const t = document.createElement("li")
    //     this.list.appendChild(t)
    //     t.classList.add("fe")
    //   }
    //
    //   // Add text
    //   if (el.text) {
    //     // Create List
    //     const t = document.createElement("li")
    //     t.classList.add("fe")
    //
    //     // Create text el
    //     const text = document.createElement("p")
    //     text.innerHTML = el.text
    //
    //     t.appendChild(text)
    //     this.list.appendChild(t)
    //
    //     // this.tl.fromTo(
    //     //   t,
    //     //   { y: "200%" },
    //     //   { y: "0%", duration: 0.4, ease: "circ.easeIn" },
    //     //   "<5%"
    //     // )
    //   }
    //
    //   // Add Media
    //   if (el.imgs.length > 0) {
    //     el.imgs.forEach((img, i) => {
    //       // Create List item
    //       const t = document.createElement("li")
    //       t.classList.add("fe")
    //       // Add item to list on dom
    //       this.list.appendChild(t)
    //
    //       // this.tl.fromTo(
    //       //   t,
    //       //   { y: "200%" },
    //       //   { y: "0%", duration: 0.4, ease: "circ.easeIn" },
    //       //   "<5%"
    //       // )
    //
    //       // Now we can get Coord using getBoundingClientRect
    //       const m = new Image()
    //       m.src = img
    //       m.onload = () => {
    //         const media = new Media({
    //           image: m,
    //           element: t,
    //           viewport: this.viewport,
    //           screen: this.screen,
    //           scene: this.scene,
    //           index: i,
    //         })
    //
    //         this.mediaList.push(media)
    //
    //         this.loaded += 1
    //       }
    //     })
    //   }
    // })
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
    if (this.loaded == 19) {
      document.documentElement.classList.remove("loading")
      document.documentElement.classList.add("loaded")

      // this.tl.play()
    }

    if (this.mediaList) {
      this.mediaList.forEach((el) => el.loop())
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
