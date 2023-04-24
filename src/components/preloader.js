import Emitter from "../classes/emitter"
import * as THREE from "three"
import { PARK_CAROUSEL, STATE, getParkApi } from "../lib/"

export default class Preloader extends Emitter {
  constructor() {
    super()

    this.element = document.querySelector(".pl")
    this.percent = document.createElement("div")
    this.percent.classList.add("percent")
    this.percent.classList.add("oversized")
    this.percent.innerHTML = `${STATE.percent}`
    this.element.appendChild(this.percent)

    STATE.timeline.to(
      ".pl-t",
      {
        y: "100%",
        delay: 1.5,
        stagger: 0.2,
      },
      "start"
    )
    STATE.timeline.to(
      ".percent",
      {
        y: "100%",
        delay: 1.5,

        onComplete: () => this.hide(),
      },
      "start+=90%"
    )
    STATE.timeline.addLabel("endPreload", "+=.25")

    this.load()
  }

  async load() {
    const list = []
    for (const el of PARK_CAROUSEL) {
      const i = PARK_CAROUSEL.indexOf(el)
      const img = new Image()
      img.src = el.img

      await this.loadDomInfo(el, i)
      await this.loadTexture(img).then((t) => {
        this.percent.innerHTML = STATE.percent * 7
        list.push(t)
      })

      if (STATE.percent === PARK_CAROUSEL.length - 1) {
        STATE.dispatch("addTex", [list])
        this.loaded()
      }
    }
  }

  loadDomInfo(p, i) {
    const carousel = document.getElementById("park-carousel")
    let dom = []

    return new Promise((resolve) => {
      getParkApi(p.parkCode).then((data) => {
        const park = document.createElement("div")
        park.classList.add("park")

        ///////////////// PARK INFO ////////////////
        const name = document.createElement("div")
        name.innerHTML = data.fullNames

        ///////////////// ADD INFO TO PARK ////////////////
        const info = document.createElement("div")
        info.classList.add("park-info")
        info.appendChild(name)
        park.appendChild(info)

        ///////////////// LAT AND LONG ////////////////
        const lat = document.createElement("div")
        const long = document.createElement("div")
        // lat.innerHTML = data.latitude
        // HTML ADDED DURING ANIMATION
        lat.classList.add("park-pre__lat")

        // long.innerHTML = data.longitude
        // HTML ADDED DURING ANIMATION
        long.classList.add("park-pre__long")

        const latLong = document.createElement("div")
        latLong.classList.add("park-pre__latLong")
        latLong.appendChild(lat)
        latLong.appendChild(long)

        ///////////////// PRE NUM AND STATE ////////////////
        const num = document.createElement("div")
        num.innerHTML = i + 1
        num.classList.add("park-pre__num")

        const state = document.createElement("div")
        state.innerHTML = data.states

        ///////////////// ADD PRE TO PARK ////////////////
        const pre = document.createElement("div")
        pre.classList.add("park-pre")
        pre.appendChild(latLong)
        pre.appendChild(num)
        pre.appendChild(state)
        park.appendChild(pre)

        ///////////////// SET DISPLAY TO `NONE`////////////////
        park.style.display = "none"
        ///////////////// PUSH PARK TO DOM ////////////////
        dom.push(park)
        carousel.appendChild(park)

        ///////////////// ANIMATION ////////////////
        let contLat = { val: 0 }
        let contLong = { val: 0 }

        // STATE.timeline.from(name, { y: "100%", delay: 1 }, "endPreload")
        // STATE.timeline.from(state, { y: "100%", delay: 1 }, "endPreload")
        // STATE.timeline.from(num, { y: "100%", delay: 1 }, "endPreload")
        // STATE.timeline.from(lat, { y: "100%", delay: 1 }, "endPreload")
        // STATE.timeline.from(long, { y: "100%", delay: 1 }, "endPreload")
        // STATE.timeline.to(
        //   contLat,
        //   {
        //     val: data.latitude,
        //     delay: 1,
        //     onUpdate: () => (lat.innerHTML = contLat.val * 1),
        //   },
        //   "endPreload"
        // )
        // STATE.timeline.to(
        //   contLong,
        //   {
        //     val: data.longitude,
        //     delay: 1,
        //     onUpdate: () => (long.innerHTML = contLong.val * 1),
        //   },
        //   "endPreload"
        // )
      })
      STATE.dispatch("addCarousel", [dom])
      resolve()
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
    this.element.remove()
  }
}
