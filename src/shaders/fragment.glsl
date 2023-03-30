uniform sampler2D dataTex;
uniform sampler2D tex;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 mouseCoor;
float PI = 3.141592653589793238;

void main()	{
	vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	vec4 color = texture2D(tex,newUV);
  vec4 offset = texture2D(dataTex, vUv);
  gl_FragColor = vec4(vUv,0.0,1.);
	gl_FragColor = vec4(offset.r, 0., 0., 1.);
	gl_FragColor = color;
	/* gl_FragColor = texture2D(tex,newUV - 0.02*offset.rg); */
}

