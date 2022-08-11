varying vec2 v_uv;

void main() {
    gl_FragColor = vec4(1., 1., 1., v_uv.y);
}