import { Renderer, Camera, Transform } from "ogl";
import CreateMedia from "./core/media";
import { data } from "./lib/data.json";

import "./style.css";

// Create Renderer
const renderer = new Renderer({
  alpha: true,
});

// Create canvas Node
const gl = renderer.gl;

// Get Script node to add canvas above
const script = document.querySelector("#script");
document.body.insertBefore(gl.canvas, script);

// Create Camera
const camera = new Camera(gl);
camera.position.z = 5;

// Create Scene
const scene = new Transform();

// Size of viewport the camera sees
let viewport = { height: 0, width: 0 }; // For using pixels when changing plane size

// Size of Screen
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// listen for the resize
function resize() {
  sizes = {
    height: window.innerHeight,
    width: window.innerWidth,
  };

  renderer.setSize(sizes.width, sizes.height);

  camera.perspective({
    aspect: gl.canvas.width / gl.canvas.height,
  });

  const fov = camera.fov * (Math.PI / 180);
  const height = 2 * Math.tan(fov / 2) * camera.position.z;
  const width = height * camera.aspect;

  viewport = {
    height: height,
    width: width,
  };
}

// Main Function
// Here is where everything comes together
function init() {
  requestAnimationFrame(init);
  // Create planes and add to scene
  data.planes.map((el) => {
    const plane = CreateMedia({
      mediaElement: el,
      gl: gl,
      viewport: viewport,
      sizes: sizes,
    });
    plane.setParent(scene);
  });

  resize();
  window.addEventListener("resize", resize());

  renderer.render({ scene: scene, camera: camera });
}

init();
