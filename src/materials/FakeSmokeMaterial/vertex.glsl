#include ../../lygia/generative/cnoise.glsl;

uniform float u_time;
uniform float u_seed;

varying vec2 v_uv;

void main() {
    vec3 newPosition = position;
    float noise = cnoise(-1.5 * position + (u_time + u_seed) / 5.);

    newPosition += 0.1 * smoothstep(0.8, 0., uv.y) * noise;
    v_uv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}