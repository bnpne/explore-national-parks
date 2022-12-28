import { PerspectiveCamera } from "three";
import { sizes } from "./helpers";

export const FOV = 45;

export const initCamera = () => {
  const camera = new PerspectiveCamera(FOV, sizes.width / sizes.height);
  camera.position.set(0, 0, 5);

  return camera;
};
