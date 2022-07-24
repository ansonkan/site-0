/// <reference types="@sveltejs/kit" />
/// <reference types="three" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  // interface Locals {}
  // interface Platform {}
  // interface Session {}
  // interface Stuff {}
}

declare module 'troika-three-text' {
  export class Text extends THREE.Mesh {
    text: string
    anchorX: number | string
    anchorY: number | string
    curveRadius: number
    direction: 'auto' | 'ltr' | 'rtl'
    font: string | null
    fontSize: number
    letterSpacing: number
    lineHeight: number | string
    maxWidth: number
    overflowWrap: 'normal' | 'break-word'
    textAlign: 'left' | 'right' | 'center' | 'justify'
    textIndent: number
    whiteSpace: 'normal' | 'nowrap'
    material: THREE.Material | null
    color: string | number | THREE.Color | null
    outlineWidth: number | string
    outlineColor: string | number | THREE.Color
    outlineOpacity: number
    outlineBlur: number | string
    outlineOffsetX: number | string
    outlineOffsetY: number | string
    strokeWidth: number | string
    strokeColor: string | number | THREE.Color
    strokeOpacity: number
    fillOpacity: number
    depthOffset: number
    clipRect: [number, number, number, number] | null
    orientation: string
    glyphGeometryDetail: number
    sdfGlyphSize: number | null
    gpuAccelerateSDF: boolean
    debugSDF: boolean

    sync: (callback?: (param: unknown) => void) => void
    dispose: () => void
  }

  export function preloadFont(
    option: {
      font: string
      characters: string
    },
    callback: () => void
  )
}
