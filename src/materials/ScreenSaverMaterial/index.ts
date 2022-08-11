import * as THREE from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

interface Props {
  u_time: number
  u_seed?: number
}

export class ScreenSaverMaterial extends THREE.ShaderMaterial {
  constructor({ u_time, u_seed = Math.random() * 50 }: Props) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: u_time },
        u_seed: { value: u_seed }
      }
    })
  }
}
