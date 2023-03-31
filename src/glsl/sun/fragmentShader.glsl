#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec3 color_main;
uniform vec3 color_accent;
varying vec2 vUv;
varying vec3 vPos;
void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  float x = vPos.y;
  float osc = ceil(sin((3. - (x - u_time) / 1.5) * 5.) / 2. + 0.4 - floor((3. - x / 1.5) * 5. / TWO_PI) / 10.);
  vec3 color = mix(color_accent, color_main, smoothstep(0.2, 1., vUv.y));
  gl_FragColor = vec4(color, osc);
}
