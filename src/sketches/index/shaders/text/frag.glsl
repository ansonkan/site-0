uniform float u_time;

varying vec2 v_uv;

vec3 colorA = vec3(0.149, 0.141, 0.912);
vec3 colorB = vec3(1.000, 0.833, 0.224);

void main() {
  float pct = abs(sin(u_time));
  vec3 color = mix(colorA, colorB, pct);

  gl_FragColor = vec4(color, 1.0);
}