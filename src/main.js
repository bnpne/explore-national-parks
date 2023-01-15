import * as THREE from "three";
import data from "./lib/data.json";

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
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      this.screen.width / this.screen.height,
      100,
      2000
    );
    this.camera.position.set(600);
    this.camera.fov =
      2 * Math.atan(this.screen.height / 2 / 600) * (180 / Math.PI);
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
        src: el.src,
        top: el.top,
        left: el.left,
        width: el.width,
        height: el.height,
        screen: this.screen,
      });

      this.scene.add(img);

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

    // const fov = this.camera.fov * (Math.PI / 180);
    // const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    // const width = height * this.camera.aspect;
    //
    // this.viewport = {
    //   height: height,
    //   width: width,
    // };
  }

  loop() {
    // Update media
    // if (this.mediaList) {
    //   this.mediaList.forEach((el) => el.update());
    // }

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
