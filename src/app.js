import Canvas from "./components/canvas"
import Preloader from "./components/preloader"
import Home from "./pages/home"
import "./style.css"

class App {
  constructor() {
    this.createCanvas()
    this.createPages()
    this.preload()

    this.resize()
    this.loop()
    this.initEvents()
  }

  createCanvas() {
    this.canvas = new Canvas(document.getElementById("r"))
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

    this.preloader.once("completed", this.loaded.bind(this))
  }

  loaded() {
    this.resize()
    this.canvas.loaded()
    this.currentPage.show()
  }

  resize() {
    if (this.canvas) {
      this.canvas.resize()
    }
  }

  loop() {
    if (this.pages && this.currentPage.loop) this.currentPage.loop()
    if (this.canvas) this.canvas.loop()

    window.requestAnimationFrame(this.loop.bind(this))
  }

  initEvents() {
    window.addEventListener("resize", this.resize.bind(this))
  }
}

new App()
