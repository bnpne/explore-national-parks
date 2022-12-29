import { createMedia } from "./core/media";
import { renderer } from "./core/renderer";
import { onResize } from "./core/helpers";
import { initCamera } from "./core/camera";
import { initScene } from "./core/scene";
import { data } from "./lib/data.json";

import "./style.css";
console.log(data);
// Main Function
// Here is where everything comes together
const init = () => {
  // Make Scene
  const scene = initScene();

  // Add Camera
  const camera = initCamera();
  scene.add(camera);

  // Create planes
  data.planes.map((el) => {
    const plane = createMedia(el);
    scene.add(plane);
  });

  // Functions to catch on resize and to loop the webGL
  onResize(camera);

  // Check for resize event
  window.addEventListener("resize", () => {
    onResize(camera);
  });

  // Render the scene, and loop with requestAnimationFrame
  renderer.render(scene, camera);
  requestAnimationFrame(init);
};

init();
