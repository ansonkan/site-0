#include ../../lygia/generative/cnoise.glsl;

uniform float time;
uniform float seed;

varying vec2 vUv;

void main() {
    vec3 newPosition = position;
    float noise = cnoise(-1.5 * position + (time + seed) / 5.);

    newPosition += 0.1 * smoothstep(0.8, 0., uv.y) * noise;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}