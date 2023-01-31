import Emitter from "../classes/emitter"

export default class Preloader extends Emitter {
  constructor() {
    super()
    this.create()
  }

  create() {
    console.log("preloader created")

    this.load()
  }

  load() {
    // Do loading stuff i.e. Image texture loading
    this.loaded()
  }

  loaded() {
    return new Promise((resolve) => {
      console.log("done loading")
      this.emit("completed")
    })
  }
}
