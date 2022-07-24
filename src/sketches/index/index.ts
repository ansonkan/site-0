import { Clock, Scene, WebGLRenderer, PerspectiveCamera } from 'three'
import { Text, preloadFont } from 'troika-three-text'
import Stats from 'stats.js'
import GUI from 'lil-gui'

import NotoSansRegularUrl from '@assets/fonts/NotoSans-Regular.ttf?url'

import type { Sketch } from '@utils/types'

export async function createSketch(): Promise<Sketch> {
  await new Promise<void>((resolve, reject) => {
    try {
      preloadFont({ font: NotoSansRegularUrl, characters: 'abcdefghijklmnopqrstuvwxyz,!' }, () => {
        resolve()
      })
    } catch {
      reject()
    }
  })

  // debug
  const stats = new Stats()
  document.body.appendChild(stats.dom)

  const params = {
    start,
    pause,
    destroy
  }

  const gui = new GUI()
  gui.add(params, 'start')
  gui.add(params, 'pause')
  gui.add(params, 'destroy')

  let started = false
  let paused = false
  let width = window.innerHeight
  let height = window.innerHeight

  const clock = new Clock()

  const z = 600
  const fov = 2 * Math.atan(height / 2 / z) * (180 / Math.PI)
  const camera = new PerspectiveCamera(fov, width / height, 0.1, 1000)
  camera.position.set(0, 0, z)

  const scene = new Scene()
  scene.add(camera)

  const text = new Text()
  scene.add(text)
  text.font = NotoSansRegularUrl
  text.text = 'Hello world!'
  text.fontSize = 100
  text.position.z = -2
  text.color = 0x9966ff
  await new Promise((resolve, reject) => {
    try {
      text.sync(resolve)
    } catch {
      reject()
    }
  })

  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio || 1)
  renderer.setSize(width, height)

  document.body.appendChild(renderer.domElement)

  window.addEventListener('resize', onResize)
  window.addEventListener('wheel', onScroll)
  onResize()

  function render() {
    if (paused) return

    const delta = clock.getDelta()

    text.rotateX(delta)
    text.rotateY(delta * -0.25)

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
    text.dispose()
    renderer.dispose()
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
