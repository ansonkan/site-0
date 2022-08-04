import {
  Clock,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  ShaderMaterial,
  DoubleSide,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshMatcapMaterial,
  AmbientLight,
  DirectionalLight,
  TorusKnotGeometry
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { Text, preloadFont } from 'troika-three-text'

import Stats from 'stats.js'
import GUI from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import TextGlbPath from '@assets/blends/text.glb?url'
import SheenChairGlbPath from '@assets/blends/SheenChair.glb?url'
// import NotoSansRegularUrl from '@assets/fonts/NotoSans-Regular.ttf?url'
// import ScreenFrag from './shaders/text/frag.glsl?raw'
// import ScreenVert from './shaders/text/vert.glsl?raw'

import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import type { Sketch } from '@utils/types'

export async function createSketch(): Promise<Sketch> {
  // await new Promise<void>((resolve, reject) => {
  //   try {
  //     preloadFont({ font: NotoSansRegularUrl, characters: 'abcdefghijklmnopqrstuvwxyz,!' }, () => {
  //       resolve()
  //     })
  //   } catch {
  //     reject()
  //   }
  // })

  // debug
  const stats = new Stats()
  document.body.appendChild(stats.dom)

  const params = {
    start,
    pause,
    destroy,
    xMultiplier: 1.0
  }

  const gui = new GUI()
  gui.add(params, 'start')
  gui.add(params, 'pause')
  gui.add(params, 'destroy')
  gui.add(params, 'xMultiplier', -10, 10)

  let started = false
  let paused = false
  let width = window.innerHeight
  let height = window.innerHeight

  const clock = new Clock()

  const z = 600
  const fov = 2 * Math.atan(height / 2 / z) * (180 / Math.PI)
  const camera = new PerspectiveCamera(fov, width / height, 0.1, 2500)
  camera.position.set(0, 0, z)

  const scene = new Scene()
  scene.add(camera)

  // const light = new AmbientLight(0x404040)
  const directionalLight = new DirectionalLight(0xffffff, 0.5)
  scene.add(directionalLight)

  const textGLTF = await new Promise<GLTF>((resolve) => {
    const loader = new GLTFLoader()
    loader.load(TextGlbPath, (gltf) => {
      resolve(gltf)
    })
  })

  console.log({ textGLTF })
  console.log(textGLTF.scene.getObjectByName('Text001'))
  const Text001 = textGLTF.scene.getObjectByName('Text001') as Mesh
  Text001.material = new MeshMatcapMaterial()
  Text001.scale.set(50, 50, 50)
  scene.add(Text001)
  // const roundTextBanner = textGLTF.scene.ch
  // console.log({ roundTextBanner })
  // roundTextBanner && scene.add(roundTextBanner)

  // const screenMaterial = new ShaderMaterial({
  //   fragmentShader: ScreenFrag,
  //   vertexShader: ScreenVert,
  //   uniforms: { u_time: { value: 0 }, x_multiplier: { value: params.xMultiplier } },
  //   side: DoubleSide
  // })

  // const text = new Text()
  // scene.add(text)
  // text.font = NotoSansRegularUrl
  // text.text = 'Hello world!'
  // text.fontSize = 100
  // text.material = screenMaterial
  // text.anchorX = 'center'
  // text.anchorY = 'center'

  // await new Promise((resolve, reject) => {
  //   try {
  //     text.sync(resolve)
  //   } catch {
  //     reject()
  //   }
  // })

  const box = new Mesh(new TorusKnotGeometry(100, 30, 100, 16), new MeshMatcapMaterial())
  // scene.add(box)

  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio || 1)
  renderer.setSize(width, height)

  document.body.appendChild(renderer.domElement)

  window.addEventListener('resize', onResize)
  window.addEventListener('wheel', onScroll)
  onResize()

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.update()

  function render() {
    if (paused) return

    const delta = clock.getDelta()
    // const time = clock.getElapsedTime()

    // NOTE: text moves unpredictably off screens (when current tab/virtual desktop is not active)
    // text.rotateX(delta)
    // text.rotateY(delta * -0.25)

    // Text001.rotateX(delta)
    Text001.rotateY(delta * 0.25)
    Text001.rotateZ(delta * 0.5)

    // screenMaterial.uniforms.u_time.value = time
    // screenMaterial.uniforms.x_multiplier.value = params.xMultiplier

    controls.update()

    renderer.render(scene, camera)
  }

  function animate() {
    if (paused) return

    window.requestAnimationFrame(animate)

    stats.begin()
    render()
    stats.end()
  }

  function start() {
    if (!started || paused) {
      paused = false
      clock.start()
      window.requestAnimationFrame(animate)
      started = true
    }
  }

  function pause() {
    clock.stop()
    paused = true
  }

  function destroy() {
    paused = true
    window.removeEventListener('resize', onResize)
    window.removeEventListener('wheel', onScroll)
    // text.dispose()
    renderer.dispose()

    // TODO: remove those added dom elements including the canvas
  }

  function onResize() {
    width = window.innerWidth
    height = window.innerHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
  }

  function onScroll(event: Event) {
    console.log(event)
  }

  return { render, animate, start, pause, destroy }
}
