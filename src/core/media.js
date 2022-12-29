import * as THREE from "three";
import { sizes, viewport } from "./helpers";

import fragment from "../utils/fragment.glsl";
import vertex from "../utils/vertex.glsl";

export const createMedia = (mediaElement) => {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const texture = new THREE.TextureLoader().load(
    "../../assets/frankie-cordoba-CYKUI8JyEZ4-unsplash (1).jpg"
  );

  // Get texture
  const material = new THREE.RawShaderMaterial({
    fragmentShader: fragment,
    vertexShader: vertex,
    uniforms: {
      tMap: { value: texture },
      uPlaneSizes: { value: new THREE.Vector2(0, 0) },
      uImageSizes: { value: new THREE.Vector2(0, 0) },
      uViewportSizes: { value: new THREE.Vector2(sizes.width, sizes.height) },
      uStrength: { value: 0 },
    },
    transparent: true,
  });

  const planeTwo = new THREE.Mesh(geometry, material);
  // test plane
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: "#ff0000" })
  );

  const x = 0;
  const y = 0;

  // Checks whether media element exists. This is if we want the webgl element taken from the DOM
  if (mediaElement) {
    plane.scale.set(
      (viewport.width * mediaElement.width) / sizes.width,
      (viewport.height * mediaElement.height) / sizes.height
    );

    plane.position.set(
      -(viewport.width / 2) +
        plane.scale.x / 2 +
        ((mediaElement.left - x) / sizes.width) * viewport.width,
      viewport.height / 2 -
        plane.scale.y / 2 -
        ((mediaElement.top - y) / sizes.height) * viewport.height
    );
  } else {
    // Default if no mediaElement
    plane.scale.set(
      (viewport.width * 120) / sizes.width,
      (viewport.height * 144) / sizes.height
    );

    plane.position.set(
      -(viewport.width / 2) +
        plane.scale.x / 2 +
        ((30 - x) / sizes.width) * viewport.width,
      viewport.height / 2 -
        plane.scale.y / 2 -
        ((30 - y) / sizes.height) * viewport.height
    );
  }

  return plane;
};
