import { Renderer, Camera, Transform } from "ogl";
import Media from "./core/media";
import { data } from "./lib/data.json";

import "./style.css";

class App {
  constructor() {
    this.createRenderer();
    this.createCamera();
    this.createScene();

    this.resize();
    this.createMedia();
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    // Create Renderer
    this.renderer = new Renderer({
      alpha: true,
    });

    // Create canvas Node
    this.gl = this.renderer.gl;

    // Get Script node to add canvas above
    const script = document.querySelector("#script");
    document.body.insertBefore(this.gl.canvas, script);
  }

  createCamera() {
    // Create Camera
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 5;
  }

  createScene() {
    // Create Scene
    this.scene = new Transform();
  }

  createMedia() {
    this.mediaList = data.planes.map((el) => {
      const plane = new Media({
        mediaElement: el,
        gl: this.gl,
        viewport: this.viewport,
        sizes: this.sizes,
        scene: this.scene,
      });

      return plane;
    });
  }

  // listen for the resize
  resize() {
    this.sizes = {
      height: window.innerHeight,
      width: window.innerWidth,
    };

    this.renderer.setSize(this.sizes.width, this.sizes.height);

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    });

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = {
      height: height,
      width: width,
    };

    if (this.mediaList) {
      this.mediaList.forEach((el) =>
        el.resize({
          sizes: this.sizes,
          viewport: this.viewport,
        })
      );
    }
  }

  update() {
    // Update media
    if (this.mediaList) {
      this.mediaList.forEach((el) => el.update());
    }

    // Start renderer
    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
    });

    requestAnimationFrame(this.update.bind(this));
  }

  // These are event handlers
  addEventListeners() {
    window.addEventListener("resize", this.resize.bind(this));

    // window.addEventListener('mousewheel', this.onWheel.bind(this))
    // window.addEventListener('wheel', this.onWheel.bind(this))
    //
    // window.addEventListener('mousedown', this.onTouchDown.bind(this))
    // window.addEventListener('mousemove', this.onTouchMove.bind(this))
    // window.addEventListener('mouseup', this.onTouchUp.bind(this))
    //
    // window.addEventListener('touchstart', this.onTouchDown.bind(this))
    // window.addEventListener('touchmove', this.onTouchMove.bind(this))
    // window.addEventListener('touchend', this.onTouchUp.bind(this))
  }
}

new App();
