import * as THREE from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

interface Props {
  time: number
  seed?: number
}

export class FakeSmokeMaterial extends THREE.ShaderMaterial {
  constructor({ time, seed = Math.random() * 50 }: Props) {
    super({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        time: { value: time },
        seed: { value: seed }
      }
    })
  }
}
