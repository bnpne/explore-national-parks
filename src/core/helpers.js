import { updateRenderer } from "./renderer";
import { FOV } from "./camera";

// Variables needed throughout project
export let viewport = { height: 0, width: 0 }; // For using pixels when changing plane size

export let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// This is an important function to always get the size of the camera and viewport
export const onResize = (camera) => {
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  updateRenderer();

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Transform pixels in 3D environment
  const pixelFov = FOV * (Math.PI / 180);
  const pixelHeight = 2 * Math.tan(pixelFov / 2) * camera.position.z;
  const pixelWidth = pixelHeight * camera.aspect;

  viewport = {
    width: pixelWidth,
    height: pixelHeight,
  };
};
