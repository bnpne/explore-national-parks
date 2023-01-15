import * as THREE from "three";
import fragment from "../utils/fragment.glsl";
import vertex from "../utils/vertex.glsl";

const IMAGE_PATH = "../../assets/";

export default class Media {
  constructor({ src, height, width, top, left, screen }) {
    this.src = src;
    this.height = height;
    this.width = width;
    this.top = top;
    this.left = left;
    this.screen = screen;

    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        u_image: { value: 0 },
      },
      fragmentShader: `
              varying vec2 v_uv;
              uniform sampler2D u_image;
              void main(){
                  vec4 img = texture2D(u_image, v_uv);
                  gl_FragColor = img;
              }`,
      vertexShader: `
              varying vec2 v_uv;
              void main(){
                  v_uv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
              }`,
    });

    this.createMesh();
    this.createBounds();
    this.resize();
  }

  createMesh() {
    const img = new Image();
    img.src = IMAGE_PATH + this.src;
    texture;

    // Wait for image to load
    img.onload = () => {
      program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
      let texture = new THREE.Texture(img);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      this.material.uniforms.u_image.value = texture;
    };

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  // Handle scale and position of the plane
  createBounds() {
    this.mesh.scale.set(this.width, this.height);

    this.mesh.position.y = -this.top + this.screen.height / 2 - this.height / 2;
    this.mesh.position.x = this.left - this.screen.width / 2 + this.width / 2;
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
