import * as THREE from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

interface Props {
  time: number
  seed?: number
}

export class ScreenSaverMaterial extends THREE.ShaderMaterial {
  constructor({ time, seed = Math.random() * 50 }: Props) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: time },
        seed: { value: seed }
      }
    })
  }
}
