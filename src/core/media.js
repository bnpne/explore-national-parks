import { Mesh, Program, Texture, Plane } from "ogl";
import image from "../../assets/frankie-cordoba-cykui8jyez4-unsplash (1).jpg";

import fragment from "../utils/fragment.glsl";
import vertex from "../utils/vertex.glsl";

export default class Media {
  constructor({ mediaElement, gl, viewport, sizes, scene }) {
    this.mediaElement = mediaElement;
    this.gl = gl;
    this.viewport = viewport;
    this.sizes = sizes;
    this.scene = scene;

    this.createMesh();
    this.createBounds();

    this.resize();
  }

  createMesh() {
    const texture = new Texture(this.gl, {
      generateMipmaps: false,
    });

    // Get image
    const img = new Image();
    img.src = image;

    // Wait for image to load
    img.onload = () => {
      program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
      texture.image = img;
    };

    // Create geometry
    const planeGeometry = new Plane(this.gl, {
      heightSegments: 10,
    });

    // Create program
    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uViewportSizes: { value: [this.viewport.width, this.viewport.height] },
        uStrength: { value: 0 },
      },
      transparent: true,
    });

    // Create plane with geometry and program we created
    this.plane = new Mesh(this.gl, {
      geometry: planeGeometry,
      program,
    });

    // Add plane to scene
    this.plane.setParent(this.scene);
  }

  // Handle scale and position of the plane
  createBounds() {
    this.updateScale();
    this.updatePosition();

    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
  }

  updateScale() {
    this.plane.scale.x =
      (this.viewport.width * this.mediaElement.width) / this.sizes.width;

    this.plane.scale.y =
      (this.viewport.height * this.mediaElement.height) / this.sizes.height;
  }

  updatePosition() {
    const x = 0;
    const y = 0;

    this.plane.position.x =
      -(this.viewport.width / 2) +
      this.plane.scale.x / 2 +
      ((this.mediaElement.left - x) / this.sizes.width) * this.viewport.width;

    this.plane.position.y =
      this.viewport.height / 2 -
      this.plane.scale.y / 2 -
      ((this.mediaElement.top - y) / this.sizes.height) * this.viewport.height;
  }

  update() {
    // Handle scroll here

    this.updateScale();
    this.updatePosition();
  }

  resize(s) {
    if (s) {
      const { sizes, viewport } = s;
      // if (height) this.height = height;
      if (sizes) this.sizes = sizes;
      if (viewport) {
        this.viewport = viewport;

        this.plane.program.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }

    this.createBounds();
  }
}
