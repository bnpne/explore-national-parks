import { renderer, scene } from "./core/renderer";
import { camera } from "./core/camera";

import "./style.css";
import { CreateMedia } from "./core/media";

const init = () => {
  renderer.render(scene, camera);

  const list = document.querySelector(".list");
  const listElements = list.querySelectorAll(".list-el");

  if (listElements) {
    Array.from(listElements).map((el) => {
      CreateMedia(el, scene);
    });
  }

  requestAnimationFrame(init);
};

init();
