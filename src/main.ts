import { renderer, scene } from "./core/renderer";
import { camera } from "./core/camera";

import "./style.css";

const init = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(init);
};

init();
