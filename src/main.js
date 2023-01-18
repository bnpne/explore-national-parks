import * as THREE from "three";
import Media from "./core/media";
import { data } from "./lib/data.json";

import "./style.css";

class App {
  constructor() {
    this.canvas = document.getElementById("r");
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.screen.width / this.screen.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 5);
    // this.camera.fov =
    // 2 * Math.atan(this.screen.height / 2 / 600) * (180 / Math.PI);
    this.scene.add(this.camera);
    this.time = 0;
    this.scroll = {
      current: 0,
      target: 0,
      ease: 0.075,
    };

    this.createImg();
    this.resize();
    this.loop();
    this.initEvents();
  }

  // Create webGL planes
  createImg() {
    this.imgList = data.planes.map((el, i) => {
      const img = new Media({
        element: el,
        viewport: this.viewport,
        screen: this.screen,
        scene: this.scene,
      });

      return img;
    });
  }

  // listen for the resize
  resize() {
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = {
      height: height,
      width: width,
    };

    if (this.imgList) {
      this.imgList.forEach((el) => {
        el.resize({ screen: this.screen, viewport: this.viewport });
      });
    }
  }

  loop() {
    if (this.imgList) {
      this.imgList.forEach((el) => el.loop());
    }

    // Start renderer
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.loop.bind(this));
  }

  // These are event handlers
  initEvents() {
    window.addEventListener("resize", this.resize);

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
