<script lang="ts">
  import { browser } from '$app/env'
  import { onMount, onDestroy } from 'svelte'
  import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Clock,
    CanvasTexture,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
  } from 'three'
  import Stats from 'stats.js'

  import { pathToContext } from '$utils/path'
  // import NotoSansTcOtf from '$assets/fonts/NotoSansTC-Regular.otf?url'
  // import paths from '$assets/paths/NotoSans-b7bed.json'
  import paths from '$assets/paths/NotoSansTC-f8c67.json'

  let width = 0
  let height = 0

  let canvas: HTMLCanvasElement
  let scene: Scene
  let camera: PerspectiveCamera
  let renderer: WebGLRenderer
  let box: Mesh
  let stats: Stats

  let clock: Clock

  let fontSize = 50

  onMount(() => {
    if (browser) {
      init()

      drawPaths()
    }
  })

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('resize', onWindowResize)
    }
  })

  function init() {
    width = window.innerWidth
    height = window.innerHeight

    clock = new Clock()

    renderer = new WebGLRenderer({ antialias: true, canvas })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    const z = 600
    const fov = 2 * Math.atan(height / 2 / z) * (180 / Math.PI)
    camera = new PerspectiveCamera(fov, width / height, 0.1, 1000)
    camera.position.set(0, 0, z)

    scene = new Scene()
    scene.add(camera)

    window.addEventListener('resize', onWindowResize)
    window.addEventListener('wheel', onScroll)

    stats = new Stats()
    document.body.appendChild(stats.dom)

    animate()
  }

  function onWindowResize() {
    width = window.innerWidth
    height = window.innerHeight

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
  }

  function onScroll(event: Event) {
    console.log(event)
  }

  function render() {
    const d = clock.getDelta()

    if (box) {
      box.rotateX(d)
      box.rotateY(d * -0.25)
      box.rotateZ(d * -1.15)
    }

    renderer.render(scene, camera)
  }

  function animate() {
    window.requestAnimationFrame(animate)

    stats.begin()
    render()
    stats.end()
  }

  function drawPaths() {
    const cnv = document.getElementById('test-paths') as HTMLCanvasElement
    const ctx = cnv.getContext('2d')

    if (!ctx) return

    const DPR = window.devicePixelRatio || 1
    const unitsPerEm = paths.unitsPerEm // `font.head.unitsPerEm`
    const hheaAscender = paths.ascender
    const hheaDescender = paths.descender
    const scale = (fontSize * DPR) / unitsPerEm

    cnv.width = Math.round(Math.abs(paths.bbox.x.max) * scale)
    cnv.height = Math.round(Math.abs(hheaAscender - hheaDescender) * scale)
    ctx.translate(0 * DPR, Math.round(hheaAscender * scale) * DPR)

    ctx.fillStyle = '#FF00FF'
    ctx.fillRect(0, 0, cnv.width, 1)
    ctx.fillRect(0, -Math.round(hheaAscender * scale), cnv.width, 1)
    ctx.fillRect(0, -Math.round(hheaDescender * scale), cnv.width, 1)

    ctx.scale(scale, -scale)

    pathToContext(paths, ctx)
    ctx.fill()

    const ct = new CanvasTexture(ctx.canvas)
    const material = new MeshBasicMaterial({ map: ct })
    const geo = new BoxGeometry(300, 300, 300)
    box = new Mesh(geo, material)

    scene.add(box)
  }
</script>

<canvas id="main" bind:this={canvas} />
<canvas id="test-paths" />

<div class="text">
  <p style="font-size: {fontSize}px;">Hello! I'm Anson Kan :D</p>
</div>

<style lang="scss">
  #main {
    position: fixed;
    width: 100vw;
    height: 100vh;
  }

  #test-paths {
    position: fixed;
    top: 400px;
    // width: 50vw;
    // height: 50vh;
    border: 1px solid red;
  }

  .text {
    position: fixed;
    width: 100vw;
    height: 100vh;
    margin: 0;
    color: white;
  }
</style>
