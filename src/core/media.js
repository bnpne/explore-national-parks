import * as THREE from "three";

export const CreateMedia = (mediaElement, scene) => {
  const image = new Image();

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 10, 10),
    new THREE.MeshToonMaterial({ color: "#444" })
  );

  scene.add(plane);
};
