import { Scene, Color } from "three";

export const initScene = () => {
  const scene = new Scene();
  scene.background = new Color("#fff");

  return scene;
};
