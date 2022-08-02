uniform float u_time;
uniform float x_multiplier;

varying vec2 v_uv;

const float PI = 3.14;
const float R = 100.0;

void main() {
    v_uv = uv;

    // position.x = position.x - (cos(uv.x * PI * 2.0) * x_multiplier);

    // position.z = position.z + (sin(uv.x * PI * 2.0) * R);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}