<script lang="ts">
  import { browser } from '$app/env'
  import { onMount, onDestroy } from 'svelte'
  import {
    Scene,
    PerspectiveCamera,
    OrthographicCamera,
    WebGLRenderer,
    Clock,
    CanvasTexture,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
  } from 'three'
  import Stats from 'stats.js'
  // import { Font } from '@fredli74/typr'

  // import { parse } from '$lib/CustomTypr'
  // import { shape } from '$lib/CustomTypr/U/shape'
  // import { shapeToPath } from '$lib/CustomTypr/U/shapeToPath'
  // import { pathToContext } from '$lib/CustomTypr/U/pathToContext'
  import Typr from '$lib/Typr/Typr'

  // import NotoSansTcOtf from '$assets/fonts/NotoSansTC-Regular.otf?url'
  // import paths from '$assets/paths/NotoSans-b7bed.json'
  import paths from '$assets/paths/NotoSansTC-f8c67.json'
  // import FontJson from '$assets/parsed-fonts/NotoSansTC.json'
  // import paths from '$assets/paths/Test.json'

  // import { test } from '$lib/Typr'

  let width = 0
  let height = 0

  let canvas: HTMLCanvasElement
  let scene: Scene
  let camera: PerspectiveCamera
  let orthoCamera: OrthographicCamera
  let renderer: WebGLRenderer
  let box: Mesh
  let stats: Stats

  // let text: Text
  let clock: Clock

  let fontSize = 50

  let word: string

  // $: drawPaths()

  onMount(() => {
    if (browser) {
      init()

      // drawPaths()
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

    const frustumSize = 1000
    const aspect = width / height
    orthoCamera = new OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    )
    orthoCamera.position.set(0, 0, 500)

    scene = new Scene()
    scene.add(camera)
    scene.add(orthoCamera)

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
    // renderer.render(scene, orthoCamera)

    drawPaths()
  }

  function animate() {
    window.requestAnimationFrame(animate)

    stats.begin()
    render()
    stats.end()
  }

  function drawPaths() {
    // console.log('drawPaths...', word)
    // if (!browser || !word) return
    // const dummyFont = new Font(new ArrayBuffer(1024))

    // const cnv = document.createElement('canvas')
    const cnv = document.getElementById('test-paths') as HTMLCanvasElement
    const ctx = cnv.getContext('2d')

    if (!ctx) return

    const DPR = window.devicePixelRatio || 1
    const unitsPerEm = 1000 // `font.head.unitsPerEm`
    const hheaAscender = 1069
    const hheaDescender = -293
    const scale = (fontSize * DPR) / unitsPerEm

    // cnv.width = cnv.width
    // cnv.width = 1000
    cnv.width = Math.round(Math.abs(paths.bbox.x.max) * scale)
    cnv.height = Math.round(Math.abs(hheaAscender - hheaDescender) * scale)
    // console.log(Math.round(Math.abs(hheaAscender - hheaDescender) * scale))
    // ctx.translate(0 * DPR, 100 * DPR)
    ctx.translate(0 * DPR, Math.round(hheaAscender * scale) * DPR)

    ctx.fillStyle = '#FF00FF'
    ctx.fillRect(0, 0, cnv.width, 1)
    ctx.fillRect(0, -Math.round(hheaAscender * scale), cnv.width, 1)
    ctx.fillRect(0, -Math.round(hheaDescender * scale), cnv.width, 1)

    ctx.scale(scale, -scale)

    // const font = Array.isArray(FontJson) ? FontJson[0] : FontJson
    // const paths = shapeToPath(font, shape(font, word))

    Typr.U.pathToContext(paths, ctx)
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
  <!-- <p class="hk" style="font-size: {fontSize}px;">Hello! I'm Anson Kan :D</p>
  <p class="hk" style="font-size: {fontSize}px;">你好！ 我叫Anson諱！</p>
  <p class="hk" style="font-size: {fontSize}px;">昨日すき焼きを食べました</p>
  <p class="hk" style="font-size: {fontSize}px;">
    저는 동물을 좋아하는데 가족들이 동물을 별로 안 좋아해요.
  </p>
  <p class="barcode" style="font-size: {fontSize}px;">Hello! I'm Anson Kan :D</p>
  <p class="press-start-2p" style="font-size: {fontSize}px;">Hello! I'm Anson Kan :D</p> -->
  <input bind:value={word} type="text" />
</div>

<style lang="scss">
  // @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
  @font-face {
    font-family: 'NotoSans';
    src: url('$assets/fonts/NotoSans-Regular.ttf') format('truetype');
  }

  @font-face {
    font-family: 'NotoSansHK';
    src: url('$assets/fonts/NotoSansTC-Regular.otf') format('opentype');
  }

  @font-face {
    font-family: 'LibreBarcode39';
    src: url('$assets/fonts/LibreBarcode39-Regular.ttf') format('truetype');
  }

  @font-face {
    font-family: 'PressStart2P';
    src: url('$assets/fonts/PressStart2P-Regular.ttf') format('truetype');
  }

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
    font-family: NotoSans;

    .hk {
      font-family: NotoSansHK;
    }

    .barcode {
      font-family: LibreBarcode39;
    }

    .press-start-2p {
      font-family: PressStart2P;
    }
  }
</style>
