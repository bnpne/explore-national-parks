import Emitter from "../classes/emitter"
import * as THREE from "three"
import { IMG_COORD, STATE } from "../lib/"

export default class Preloader extends Emitter {
  constructor() {
    super()

    this.element = document.querySelector(".pl")
    this.percent = document.createElement("div")
    this.percent.classList.add("percent")
    this.percent.innerHTML = `${STATE.percent}`
    this.element.appendChild(this.percent)

    STATE.timeline.to(this.element, { y: "-100%", duration: 0.45 }, "start")
    STATE.timeline.addLabel("endPreload")

    this.load()
  }

  async load() {
    const list = []
    for (const el of IMG_COORD) {
      await this.loadTexture(el).then((t) => {
        this.percent.innerHTML = `${STATE.percent * 3}`
        list.push(t)
      })
      if (STATE.percent === IMG_COORD.length - 1) {
        STATE.dispatch("addTex", [list])
        this.loaded()
      }
    }
  }

  loadTexture(el) {
    const l = new THREE.TextureLoader()
    return new Promise((resolve, reject) => {
      l.load(
        el.img,
        function (tex) {
          STATE.dispatch("addPercent", [1])

          resolve(tex)
        },
        undefined,
        (err) => reject(err)
      )
    })
  }

  loaded() {
    this.emit("completed")
  }

  hide() {
    this.percent.remove()
    this.element.remove()
  }
}
