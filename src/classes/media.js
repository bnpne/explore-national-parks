import * as THREE from "three"
import vertexShader from "../shaders/vertex.glsl"
import fragmentShader from "../shaders/fragment.glsl"

export default class Media {
  constructor() {}

  // Initialize functiom
  // creates mesh and material
  // sets bounds
  init({ tex, viewport, screen, scene, index, mouse }) {
    this.tex = tex
    this.viewport = viewport
    this.screen = screen
    this.scene = scene
    this.index = index
    this.mouse = mouse

    ///////////////// IMAGE TEXTURE ///////////////////

    // Basic image material
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      uniforms: {
        resolution: { value: new THREE.Vector4() },
        tex: { value: 0 },
        dataTex: { value: 0 },
        mouseCoor: { value: this.mouse },
      },
      transparent: true,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
    })

    this.createMesh()
    this.createBounds()
    this.resize()
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1)
    this.material.transparent = true
    this.material.uniforms.tex.value = this.tex
    this.material.uniforms.tex.value.needsUpdate = true

    this.material.side = THREE.DoubleSide
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.scene.add(this.mesh)
  }

  createBounds() {
    this.scale()
    this.posX()
    this.posY()
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
