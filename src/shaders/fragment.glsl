precision highp float;

uniform vec2 imgDim;
uniform vec2 planeDim;
uniform sampler2D tex;

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
  gl_FragColor.a = 1.0;
}
