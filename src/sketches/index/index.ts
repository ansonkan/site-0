import * as THREE from 'three'
import * as PP from 'postprocessing'
import { gsap } from 'gsap'
// import * as CANNON from 'cannon-es'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { Text, preloadFont } from 'troika-three-text'

// import Stats from 'stats.js'
// import GUI from 'lil-gui'

import kitchenGlbUrl from '@assets/gltf/kitchen_smoke.glb?url'
import kitchenTextureUrl from '@assets/images/baked_90.jpg?url'
import backgroundTextureUrl from '@assets/images/background.jpg?url'

import { ScreenSaverMaterial } from '@materials/ScreenSaverMaterial'
import { FakeSmokeMaterial } from '@materials/FakeSmokeMaterial'
// import NotoSansRegularUrl from '@assets/fonts/NotoSans-Regular.ttf?url'

import type { Sketch } from '@utils/types'

export async function createSketch(canvas: HTMLCanvasElement): Promise<Sketch> {
  // await new Promise<void>((resolve, reject) => {
  //   try {
  //     preloadFont({ font: NotoSansRegularUrl, characters: 'abcdefghijklmnopqrstuvwxyz,!' }, () => {
  //       resolve()
  //     })
  //   } catch {
  //     reject()
  //   }
  // })

  // Load assets
  const textureLoader = new THREE.TextureLoader()
  const gltfLoader = new GLTFLoader()

  const [kitchenGlb, kitchenTexture, backgroundTexture] = await Promise.all([
    gltfLoader.loadAsync(kitchenGlbUrl),
    textureLoader.loadAsync(kitchenTextureUrl),
    textureLoader.loadAsync(backgroundTextureUrl)
  ])

  backgroundTexture.flipY = false
  kitchenTexture.flipY = false

  // debug
  // const stats = new Stats()
  // document.body.appendChild(stats.dom)

  // const params = {
  //   start,
  //   pause,
  //   destroy,
  //   xMultiplier: 1.0
  // }

  // const gui = new GUI()
  // gui.add(params, 'start')
  // gui.add(params, 'pause')
  // gui.add(params, 'destroy')
  // gui.add(params, 'xMultiplier', -10, 10)

  let started = false
  let paused = false
  let width = window.innerHeight
  let height = window.innerHeight
  const timeline = gsap.timeline({ paused: true })

  const clock = new THREE.Clock()
  const mouse = new THREE.Vector2()
  // Look downward initially, so that camera eases to the center on start
  const target = new THREE.Vector2(0, -0.4)

  // const z = 600
  // const fov = 2 * Math.atan(height / 2 / z) * (180 / Math.PI)
  // const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 2500)
  // camera.position.set(0, 0, z)

  const scene = new THREE.Scene()

  scene.add(kitchenGlb.scene)

  const camera = kitchenGlb.cameras[0] as THREE.PerspectiveCamera

  const mainMesh = kitchenGlb.scene.getObjectByName('Main') as THREE.Mesh
  mainMesh.material = new THREE.MeshBasicMaterial({ map: kitchenTexture })

  const backgroundMesh = kitchenGlb.scene.getObjectByName('Background') as THREE.Mesh
  backgroundMesh.material = new THREE.MeshBasicMaterial({ map: backgroundTexture })

  const laptopScreenMesh = kitchenGlb.scene.getObjectByName('LaptopScreen') as THREE.Mesh
  const screenSaverMaterial = new ScreenSaverMaterial({ u_time: 0 })
  laptopScreenMesh.material = screenSaverMaterial

  const balconyDoorGlassesMesh = kitchenGlb.scene.getObjectByName(
    'BalconyDoorGlasses'
  ) as THREE.Mesh
  balconyDoorGlassesMesh.material = new THREE.MeshPhysicalMaterial({
    roughness: 0.05,
    ior: 1.5,
    transmission: 1
  })

  const fakeSmokeMaterials = [
    new FakeSmokeMaterial({ u_time: 0 }),
    new FakeSmokeMaterial({ u_time: 0 })
  ]
  const smoke001Mesh = kitchenGlb.scene.getObjectByName('Smoke001') as THREE.Mesh
  smoke001Mesh.material = fakeSmokeMaterials[0]
  const smoke002Mesh = kitchenGlb.scene.getObjectByName('Smoke002') as THREE.Mesh
  smoke002Mesh.material = fakeSmokeMaterials[1]

  const renderer = new THREE.WebGLRenderer({
    canvas,
    powerPreference: 'high-performance',
    antialias: false,
    stencil: false,
    depth: false
  })
  renderer.setPixelRatio(window.devicePixelRatio || 1)

  const composer = new PP.EffectComposer(renderer)

  const depthOfFieldEffect = new PP.DepthOfFieldEffect(camera, {
    focusDistance: 0,
    focalLength: 0.001,
    bokehScale: 25,
    height: 480
  })

  const depthEffect = new PP.DepthEffect({
    blendFunction: PP.BlendFunction.SKIP
  })

  const vignetteEffect = new PP.VignetteEffect({
    eskil: false,
    offset: 0.35,
    darkness: 0.5
  })

  const smaaEffect = new PP.SMAAEffect()

  const effectPass = new PP.EffectPass(
    camera,
    depthOfFieldEffect,
    vignetteEffect,
    depthEffect,
    smaaEffect
  )

  const onStartAnimationDuration = 2
  timeline.add('start', 0)
  timeline.to(
    depthOfFieldEffect.circleOfConfusionMaterial.uniforms.focusDistance,
    {
      duration: onStartAnimationDuration,
      value: 0.002, // 0.001 - 0.005
      ease: 'expo'
    },
    'start'
  )
  timeline.to(
    depthOfFieldEffect,
    {
      duration: onStartAnimationDuration,
      bokehScale: 2,
      ease: 'expo'
    },
    'start'
  )

  composer.addPass(new PP.RenderPass(scene, camera))
  composer.addPass(effectPass)

  window.addEventListener('resize', onResize)
  // window.addEventListener('wheel', onScroll)
  window.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerdown', onPointerMove)
  onResize()

  // const controls = new OrbitControls(camera, canvas)
  // controls.update()

  function render() {
    if (paused) return

    // const delta = clock.getDelta()
    const time = clock.getElapsedTime()

    fakeSmokeMaterials.forEach(
      (material, index) => (material.uniforms.u_time.value = time + index * 10)
    )
    screenSaverMaterial.uniforms.u_time.value = time

    target.x += (mouse.x - target.x) * 0.05
    target.y += (-mouse.y - target.y) * 0.05
    // cameraY + 1 is a workaround to set the initial camera angle higher
    camera.lookAt(target.x, target.y + 1, 0)

    composer.render()
  }

  function animate() {
    if (paused) return

    window.requestAnimationFrame(animate)

    // stats.begin()
    render()
    // stats.end()
  }

  function start() {
    if (!started || paused) {
      paused = false
      clock.start()
      window.requestAnimationFrame(animate)
      started = true

      setTimeout(() => {
        timeline.play()
      }, 1000)
    }
  }

  function pause() {
    clock.stop()
    paused = true
  }

  function destroy() {
    paused = true
    window.removeEventListener('resize', onResize)
    // window.removeEventListener('wheel', onScroll)
    window.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerdown', onPointerMove)
    renderer.dispose()

    // TODO: remove those added dom elements including the canvas
  }

  function onResize() {
    width = window.innerWidth
    height = window.innerHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    composer.setSize(width, height)
    renderer.setSize(width, height)

    renderer.setSize(width, height)
  }

  // function onScroll(event: Event) {
  //   console.log(event)
  // }

  function onPointerMove(event: PointerEvent) {
    mouse.x = (event.clientX - width / 2) / width
    mouse.y = (event.clientY - height / 2) / height
  }

  return { render, animate, start, pause, destroy }
}
