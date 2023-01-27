import * as THREE from "three"
import {
  getColumnPos,
  getImageDimensions,
  getPositionX,
  getPositionY,
  getRowPos,
} from "../utils/format"

import { IMG_COORD } from "../lib/store"

export default class Media {
  constructor({ element, viewport, screen, scene, index }) {
    this.element = element
    this.viewport = viewport
    this.screen = screen
    this.scene = scene
    this.index = index

    this.coord = IMG_COORD

    this.geometry = new THREE.PlaneGeometry(1, 1)
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        u_image: { value: 0 },
        planeSize: { value: [1.1] },
        imgSize: { value: [1, 1] },
      },
      fragmentShader: `
              varying vec2 vUv;
              uniform sampler2D u_image;
              uniform vec2 planeSize;
              uniform vec2 imgSize;
              void main(){
              vec2 ratio = vec2(
                min((planeSize.x / planeSize.y) / (imgSize.x / imgSize.y), 1.0),
                min((planeSize.y / planeSize.x) / (imgSize.y / imgSize.x), 1.0)
               );

                vec2 uv = vec2(
                  vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                  vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
                );
                  vec4 img = texture2D(u_image,uv);
                  gl_FragColor = img;
              }`,
      vertexShader: `
              varying vec2 vUv;
              void main(){
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
              }`,
    })

    this.createMesh()
    this.createBounds()
    this.resize()
  }

  createMesh() {
    this.loader = new THREE.ImageLoader()
    this.loader.load(this.element, function (image) {})

    this.img.onload = () => {
      let texture = new THREE.Texture(this.img)
      texture.generateMipmaps = false
      texture.minFilter = THREE.LinearFilter
      texture.needsUpdate = true
      this.material.uniforms.u_image.value = texture
      this.material.uniforms.imgSize.value = [
        this.img.naturalWidth,
        this.img.naturalHeight,
      ]
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

    // Coordinates on the grid for each plane
    this.mesh.scale.set(defaultWidth, defaultHeight, 1)

    this.material.uniforms.planeSize.value = [defaultWidth, defaultHeight]

    const { start: colStart } = getColumnPos(
      this.screen,
      12,
      this.coord[this.index]
    )
    const { start: rowStart } = getRowPos(
      this.screen,
      12,
      this.coord[this.index]
    )

    const x = getPositionX(
      this.mesh.scale,
      this.viewport,
      this.screen,
      colStart
    )
    const y = getPositionY(
      this.mesh.scale,
      this.viewport,
      this.screen,
      rowStart
    )
    this.mesh.position.set(x, y, 0)
  }

  loop() {
    this.createBounds()
  }

  resize(s) {
    if (s) {
      const { screen, viewport } = s
      // if (height) this.height = height;
      if (screen) this.screen = screen
      if (viewport) {
        this.viewport = viewport
      }
    }
    this.createBounds()
  }
}
