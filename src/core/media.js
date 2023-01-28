import gsap from "gsap"
import * as THREE from "three"
import {
  getColumnPos,
  getImageDimensions,
  getPositionX,
  getPositionY,
  getRowPos,
} from "../utils/format"

export default class Media {
  constructor({ image, element, viewport, screen, scene, index }) {
    this.image = image
    this.element = element
    this.viewport = viewport
    this.screen = screen
    this.scene = scene
    this.index = index

    this.tl = gsap.timeline({ paused: true })

    this.geometry = new THREE.PlaneGeometry(1, 1)
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        u_image: { value: 0 },
        planeSize: { value: [1, 1] },
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

    this.createTween()
  }

  createMesh() {
    let texture = new THREE.Texture(this.image)
    texture.generateMipmaps = false
    texture.minFilter = THREE.LinearFilter
    texture.needsUpdate = true
    this.material.uniforms.u_image.value = texture
    this.material.uniforms.imgSize.value = [
      this.image.naturalWidth,
      this.image.naturalHeight,
    ]

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
    this.material.uniforms.planeSize.value = [defaultWidth, defaultHeight]

    ///////////////// USE THIS WHEN CREATING GRID AND USING WEBGL COORDS /////////////////
    ///////////////// NOTE: This will put the image in the lower right of the column
    ///////////////// using RIGHT and BOTTOM absolute positions

    const { start: colPos } = getColumnPos(this.screen, 6, this.element, 30)
    const { start: rowPos } = getRowPos(400, this.element, 16)

    const x = getPositionX(this.mesh.scale, this.viewport, this.screen, colPos)
    const y = getPositionY(this.mesh.scale, this.viewport, this.screen, rowPos)

    this.mesh.position.set(x, y, 0)
  }

  createTween() {
    this.tl.to(this.mesh.position, { y: 0, duration: 1 }, "start")
  }

  trigger() {
    this.tl.play()
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
