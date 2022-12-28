import * as THREE from "three";
import { sizes } from "./helpers";

import fragment from "../lib/fragment.glsl";
import vertex from "../lib/vertex.glsl";

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
  const testPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: "#ff0000" })
  );

  const bounds = mediaElement.getBoundingClientRect();
  const x = 0;
  const y = 0;

  // plane.scale.set(
  //   (sizes.width * bounds.width) / screen.width,
  //   (sizes.height * bounds.height) / screen.height
  // );
  // plane.position.set(
  //   -(sizes.width / 2) +
  //     plane.scale.x / 2 +
  //     ((bounds.left - x) / screen.width) * sizes.width,
  //   sizes.height / 2 -
  //     plane.scale.y / 2 -
  //     ((bounds.top - y) / screen.height) * sizes.height
  // );
  return testPlane;
};
