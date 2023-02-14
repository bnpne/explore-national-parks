import * as THREE from "three"
import vertexShader from "../shaders/vertex.glsl"
import fragmentShader from "../shaders/fragment.glsl"

export default class Media {
  constructor() {}

  // Initialize functiom
  // creates mesh and material
  // sets bounds
  init({ tex, viewport, screen, scene, index }) {
    this.tex = tex
    this.viewport = viewport
    this.screen = screen
    this.scene = scene
    this.index = index

    this.geometry = new THREE.PlaneGeometry(1, 1)

    // Basic image material
    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        tex: { value: 0 },
        planeDim: { value: [1, 1] },
        imgDim: { value: [1, 1] },
      },
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
    })

    this.createMesh()
    this.createBounds()
    this.resize()
  }

  createMesh() {
    this.material.transparent = true
    this.material.uniforms.tex.value = this.tex
    this.material.uniforms.imgDim.value = [
      this.tex.source.data.naturalWidth,
      this.tex.source.data.naturalHeight,
    ]
    this.material.side = THREE.DoubleSide

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.scene.add(this.mesh)
  }

  createBounds() {
    this.scale()
    this.posX()
    this.posY()

    this.material.uniforms.planeDim.value = [
      this.mesh.scale.x,
      this.mesh.scale.y,
    ]
  }

  scale() {
    this.mesh.scale.set(1, 1, 1)
  }

  posX() {
    this.mesh.position.x = 0
  }

  posY() {
    this.mesh.position.y = 0
  }

  loop() {
    // this.scale()
    // this.posX()
    // this.posY()
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
