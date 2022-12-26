import { renderer, scene } from "./core/renderer";

import "./style.css";

console.log("hello world");

const init = () => {
  renderer.render(scene);
  requestAnimationFrame(init);
};

init();
