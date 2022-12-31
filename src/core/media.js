import { Mesh, Program, Texture, Plane } from "ogl";

import fragment from "../utils/fragment.glsl";
import vertex from "../utils/vertex.glsl";
import image from "../../assets/frankie-cordoba-CYKUI8JyEZ4-unsplash (1).jpg";

function CreateMedia({ mediaElement, gl, viewport, sizes }) {
  const texture = new Texture(gl, {
    generateMipmaps: false,
  });

  const img = new Image();

  img.src = "../../assets/frankie-cordoba-CYKUI8JyEZ4-unsplash (1).jpg";

  img.onload = (_) => {
    plane.program.uniforms.uImageSizes.value = [
      img.naturalWidth,
      img.naturalHeight,
    ];
    texture.image = img;
  };

  const planeGeometry = new Plane(gl, {
    heightSegments: 10,
  });

  const program = new Program(gl, {
    fragment,
    vertex,
    uniforms: {
      tMap: { value: texture },
      uPlaneSizes: { value: [0, 0] },
      uImageSizes: { value: [0, 0] },
      uViewportSizes: { value: [viewport.width, viewport.height] },
      uStrength: { value: 0 },
    },
    transparent: true,
  });

  const plane = new Mesh(gl, {
    geometry: planeGeometry,
    program,
  });

  const x = 0;
  const y = 0;

  // Checks whether media element exists. This is if we want the webgl element taken from the DOM
  plane.scale.x = (viewport.width * mediaElement.width) / sizes.width;
  plane.scale.y = (viewport.height * mediaElement.height) / sizes.height;

  plane.position.x =
    -(viewport.width / 2) +
    plane.scale.x / 2 +
    ((mediaElement.left - x) / sizes.width) * viewport.width;
  plane.position.y =
    viewport.height / 2 -
    plane.scale.y / 2 -
    ((mediaElement.top - y) / sizes.height) * viewport.height;

  plane.program.uniforms.uPlaneSizes.value = [plane.scale.x, plane.scale.y];

  return plane;
}

export default CreateMedia;
