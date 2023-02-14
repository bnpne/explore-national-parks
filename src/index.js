import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"
import Canvas from "./components/canvas"
import Preloader from "./components/preloader"
import Home from "./pages/home"
import { STATE } from "./lib"

import "./styles/index.css"

gsap.registerPlugin(CustomEase)

class App {
  constructor() {
    // Init state
    this.initState()

    this.createCanvas()
    this.createPages()
    this.preload()

    this.resize()
    this.loop()
    this.initEvents()
  }

  initState() {
    CustomEase.create("quintIn", "0.64, 0, 0.78, 0")
    CustomEase.create("quintOut", "0.22, 1, 0.36, 1")
    STATE.texList = []
    STATE.mediaList = []

    STATE.timeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.6,
        ease: "quintIn",
      },
      autoRemoveChildren: true,
      smoothChildTiming: true,
      onComplete: () => this.preloader.hide(),
    })
    STATE.transition = gsap.timeline({
      paused: true,
      smoothChildTiming: true,
      defaults: {
        duration: 0.6,
        ease: "quintOut",
      },
    })
    STATE.percent = 0
    STATE.selected = null
    STATE.selectedPos = null
    STATE.selectedScale = null
    STATE.imgState = 0
    STATE.imgPos = []
    STATE.gallery = []

    // Functions
    STATE.addTex = function (tex) {
      this.texList.push(tex)
    }
    STATE.addMedia = function (media) {
      this.mediaList.push(media)
    }
    STATE.removeTex = function (index) {
      this.texList.splice(1, index)
    }
    STATE.removeMedia = function (index) {
      this.mediaList.splice(1, index)
    }
    STATE.addPercent = function (num) {
      this.percent += num
    }
    STATE.addImgState = function (state) {
      this.imgState = state
    }
    STATE.addImgPos = function (pos) {
      this.imgPos.push(pos)
    }
    STATE.addSelected = function (selected) {
      this.selected = selected
    }
    STATE.removeSelected = function () {
      this.selected = null
    }
    STATE.addSelectedPos = function (selected) {
      this.selectedPos = selected
    }
    STATE.addSelectedScale = function (selected) {
      this.selectedScale = selected
    }
    STATE.removeSelected = function () {
      this.selected = null
    }
    STATE.removeSelectedHistory = function () {
      this.selectedPos = null
      this.selectedScale = null
    }
    STATE.addGallery = function (gallery) {
      this.imgPos.push(gallery)
    }
  }

  createCanvas() {
    this.canvas = new Canvas({
      el: document.getElementById("r"),
      url: this.url,
    })
  }

  createPages() {
    this.url = window.location.pathname
    this.pages = {
      "/": new Home(),
    }
    this.currentPage = this.pages[this.url]

    this.currentPage.create()
  }

  preload() {
    this.preloader = new Preloader()
    this.preloader.once("completed", () => this.loaded())
  }

  loaded() {
    this.resize()
    this.canvas.loaded(this.url)
    // this.currentPage.show()
    STATE.timeline.play()
  }

  hover(e) {
    if (this.canvas) this.canvas.hover(e)
  }

  click(e) {
    if (this.canvas) this.canvas.click(e)
  }

  scroll(e) {
    if (this.canvas) this.canvas.scroll(e)
  }

  resize() {
    if (this.canvas) this.canvas.resize()
  }

  loop() {
    if (this.pages && this.currentPage.loop) this.currentPage.loop()
    if (this.canvas) this.canvas.loop()

    window.requestAnimationFrame(this.loop.bind(this))
  }

  initEvents() {
    window.addEventListener("resize", this.resize.bind(this))
    window.addEventListener("mousemove", this.hover.bind(this))
    window.addEventListener("click", this.click.bind(this))
    window.addEventListener("wheel", this.scroll.bind(this))
  }
}

new App()
