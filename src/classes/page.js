import Emitter from "./emitter"

export default class Page extends Emitter {
  constructor() {
    super()
  }

  create() {
    console.log("page created")
  }

  show() {
    return new Promise((resolve) => {
      console.log("page showing")
      resolve()
    })
  }

  hide() {
    return new Promise((resolve) => {
      console.log("page hidden")
      resolve()
    })
  }

  resize() {}

  loop() {
    // This is for handling scroll
  }
}
