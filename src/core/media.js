import * as THREE from "three"
import { getImageDimensions } from "../utils/format"

export default class Media {
  constructor({ element, viewport, screen, scene, index }) {
    this.element = element
    this.viewport = viewport
    this.screen = screen
    this.scene = scene
    this.index = index

    this.geometry = new THREE.PlaneGeometry(1, 1)
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
    })

    this.createMesh()
    this.createBounds()
    this.resize()
  }

  createMesh() {
    this.img = new Image()
    this.img.src = this.element
    this.img.onload = () => {
      let texture = new THREE.Texture(this.img)
      texture.generateMipmaps = false
      texture.minFilter = THREE.LinearFilter
      texture.needsUpdate = true
      this.material.uniforms.u_image.value = texture
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.scene.add(this.mesh)
  }

  // Handle scale and position of the plane
  createBounds() {
    const { width: defaultWidth, height: defaultHeight } = getImageDimensions(
      this.img,
      this.viewport.width
    )

    this.mesh.scale.set(defaultWidth, defaultHeight, 1)
    // this.mesh.position.set(0, 0, 0)
  }

  loop() {
    this.createBounds()
  }

  resize(s) {
    // if (s) {
    //   const { screen, viewport } = s
    //   // if (height) this.height = height;
    //   if (screen) this.screen = screen
    //   if (viewport) {
    //     this.viewport = viewport
    //   }
    // }
    // this.createBounds()
  }
}
