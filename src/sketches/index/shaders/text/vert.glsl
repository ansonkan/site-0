uniform float u_time;

varying vec2 v_uv;

void main() {
    v_uv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x - (cos(uv.y) * 100.0), position.y, position.z - (sin(uv.x) * 100.0), 1.0);
}