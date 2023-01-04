import { Mesh, Program, Texture, Plane } from "ogl";

import fragment from "../utils/fragment.glsl";
import vertex from "../utils/vertex.glsl";

const IMAGE_PATH = "../../assets/";

export default class Media {
  constructor({ mediaElement, gl, viewport, sizes, scene, src }) {
    this.mediaElement = mediaElement;
    this.gl = gl;
    this.viewport = viewport;
    this.sizes = sizes;
    this.scene = scene;
    this.src = src;

    this.isHovering = false;

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
    img.src = IMAGE_PATH + this.src;

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
        uAlpha: { value: 0 },
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
    this.bounds = this.mediaElement.getBoundingClientRect();

    this.updateScale();
    this.updatePosition();

    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
  }

  updateScale() {
    this.plane.scale.x =
      (this.viewport.width * this.bounds.width) / this.sizes.width;

    this.plane.scale.y =
      (this.viewport.height * this.bounds.height) / this.sizes.height;
  }

  updatePosition() {
    const x = 0;
    const y = 0;

    this.plane.position.x =
      -(this.viewport.width / 2) +
      this.plane.scale.x / 2 +
      ((this.bounds.left - x) / this.sizes.width) * this.viewport.width;

    this.plane.position.y =
      this.viewport.height / 2 -
      this.plane.scale.y / 2 -
      ((this.bounds.top - y) / this.sizes.height) * this.viewport.height;
  }

  hide() {
    this.isHovering = true;
  }

  show() {
    this.isHovering = false;
  }

  updateAlpha() {
    this.isHovering
      ? (this.plane.program.uniforms.uAlpha.value = 0)
      : (this.plane.program.uniforms.uAlpha.value = 1);
  }

  update() {
    // Handle scroll here

    this.updateScale();
    this.updatePosition();
    this.updateAlpha();
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
