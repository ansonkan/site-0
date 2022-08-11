#include ../../lygia/generative/cnoise.glsl;
#include ../../lygia/color/space/hsv2rgb.glsl;

uniform float u_time;
uniform float u_seed;

varying vec2 v_uv;

void main() {
    vec3 c = vec3(0.0);

    float n = cnoise(vec3(v_uv, (u_time + u_seed) / 10.));

    if(n <= .1) {
        c = vec3(0.0941, 0.3059, 0.4667);
    } else if(n <= .2) {
        c = vec3(0.1176, 0.3765, 0.5686);
    } else if(n <= .3) {
        c = vec3(0.1020, 0.4588, 0.6235);
    } else if(n <= .4) {
        c = vec3(0.0863, 0.5412, 0.6784);
    } else if(n <= .5) {
        c = vec3(0.2039, 0.6275, 0.6431);
    } else if(n <= .6) {
        c = vec3(0.3216, 0.7137, 0.6039);
    } else if(n <= .7) {
        c = vec3(0.4627, 0.7843, 0.5765);
    } else if(n <= .8) {
        c = vec3(0.6000, 0.8510, 0.5490);
    } else if(n <= .9) {
        c = vec3(0.7098, 0.8941, 0.5490);
    } else {
        c = vec3(0.8510, 0.9294, 0.5725);
    }

    gl_FragColor = vec4(c, 1.);
}