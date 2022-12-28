import { WebGLRenderer } from "three";
import { sizes } from "./helpers";

const canvas = document.querySelector("#webgl");

export const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});

export const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
};
