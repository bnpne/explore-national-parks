import { WebGLRenderer, Scene, Color } from "three";

export const scene = new Scene();
scene.background = new Color("#fff");

const canvas = document.querySelector("#webgl");

export const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});

export const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function updateRenderer() {
  renderer.setSize(sizes.width, sizes.height);
}

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  updateRenderer();
});

updateRenderer();

export default {
  renderer,
};
