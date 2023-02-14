import Emitter from "../classes/emitter"
import * as THREE from "three"
import { getGallery, STATE } from "../lib/"
import img1 from "../../assets/tyler-nix-d1E3WP-ANRo-unsplash.jpg"

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

  load() {
    getGallery().then(async (e) => {
      const list = []
      const gal = []
      for (const el of e) {
        // console.log(el.src)
        gal.push(el)

        // TEST
        const test = new Image()
        test.src = img1
        await this.loadTexture(test).then((t) => {
          this.percent.innerHTML = `${STATE.percent * 3}`
          list.push(t)
        })
        if (STATE.percent === e.length - 1) {
          STATE.dispatch("addGallery", [gal])
          STATE.dispatch("addTex", [list])
          this.loaded()
        }
      }
    })
  }

  loadTexture(el) {
    const l = new THREE.TextureLoader()
    return new Promise((resolve, reject) => {
      l.load(
        el.src,
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
