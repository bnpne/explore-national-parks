import * as THREE from "three"

export default class Media {
  constructor() {}

  // Initialize functiom
  // creates mesh and material
  // sets bounds
  init({ tex, viewport, screen, scene, index, element }) {
    this.tex = tex
    this.viewport = viewport
    this.screen = screen
    this.scene = scene
    this.index = index
    this.element = element

    this.geometry = new THREE.PlaneGeometry(1, 1)

    // Basic image material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tex: { value: 0 },
        planeDim: { value: [1, 1] },
        imgSize: { value: [1, 1] },
        alpha: { value: 1 },
      },
      fragmentShader: `
              uniform sampler2D tex;
              uniform float alpha;
              uniform vec2 imgDim;
              uniform vec2 planeDim;
              varying vec2 vUv;

              void main() {
                  vec2 ratio = vec2(
                    min((planeDim.x / planeDim.y) / (imgDim.x / imgDim.y), 1.0),
                    min((planeDim.y / planeDim.x) / (imgDim.y / imgDim.x), 1.0)
                  );

                  vec2 uv = vec2(
                    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
                  );

                  gl_FragColor.rgb = texture2D(tex, uv).rgb;
                  gl_FragColor.a = alpha;
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
    this.material.transparent = true
    this.material.uniforms.tex.value = this.tex
    this.material.uniforms.imgSize.value = [
      this.tex.source.data.naturalWidth,
      this.tex.source.data.naturalHeight,
    ]
    this.material.side = THREE.DoubleSide

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.scene.add(this.mesh)
  }

  createBounds() {
    ///////////////// USE THIS WHEN CREATING GRID AND USING WEBGL COORDS /////////////////
    ///////////////// NOTE: This will put the image in the lower right of the column
    ///////////////// using RIGHT and BOTTOM absolute positions

    this.scale()
    this.posX()
    this.posY()

    this.material.uniforms.planeDim.value = [
      this.defaultWidth,
      this.defaultHeight,
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
