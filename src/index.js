import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"
import Canvas from "./components/canvas"
import Preloader from "./components/preloader"
import Home from "./pages/home"
import { STATE } from "./lib"

import "./styles/index.scss"
import { splitPhrase } from "./utils/format"

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
    CustomEase.create("quintInOut", "0.64, 0, 0.78, 0")
    CustomEase.create("cubicOut", "0.33, 1, 0.68, 1")
    STATE.texList = []
    STATE.mediaList = []

    STATE.timeline = gsap.timeline({
      paused: true,
      defaults: {
        duration: 0.6,
        ease: "cubicOut",
      },
      autoRemoveChildren: true,
      smoothChildTiming: true,
    })
    STATE.transition = gsap.timeline({
      paused: true,
      smoothChildTiming: true,
      defaults: {
        duration: 0.5,
        ease: "quintOut",
      },
    })
    STATE.percent = 0
    STATE.selected = null
    STATE.selectedPos = null
    STATE.selectedScale = null
    STATE.imgState = 0
    STATE.imgPos = []
    STATE.carousel = []
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
    STATE.addCarousel = function (carousel) {
      this.carousel.push(carousel)
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

  initAnimations() {
    let n = document.querySelector(".n")
    for (const c of n.children) {
      STATE.timeline.from(c, { y: "100%" }, "endPreload")
    }

    if (this.canvas) {
      STATE.timeline.addLabel("endGL", "<70%")

      let h = document.querySelector(".hero")
      h = splitPhrase(h)

      Array.from(h.children).forEach((el, i) => {
        let w = el.querySelector(".word__el")

        i == 0
          ? STATE.timeline.from(w, { y: "100%" }, "endGL")
          : STATE.timeline.from(w, { y: "100%" }, "<10%")
      })
    }
  }

  preload() {
    this.preloader = new Preloader()
    this.preloader.once("completed", () => this.loaded())
  }

  loaded() {
    this.resize()
    this.canvas.loaded(this.url)
    // console.log(STATE.carousel)
    // STATE.carousel[0][0].style.display = "flex"
    this.initAnimations()
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
