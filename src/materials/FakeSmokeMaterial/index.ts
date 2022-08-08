import * as THREE from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

interface Props {
  time: number
}

export class FakeSmokeMaterial extends THREE.ShaderMaterial {
  constructor({ time = 0 }: Props) {
    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        time: { value: time }
      }
    })
  }
}
