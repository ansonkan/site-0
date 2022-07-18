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
  import { Font } from '@fredli74/typr'

  // import NotoSansTcOtf from '$assets/fonts/NotoSansTC-Regular.otf?url'
  // import paths from '$assets/paths/NotoSans-b7bed.json'
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

  onMount(() => {
    if (browser) {
      init()
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
  }

  function animate() {
    window.requestAnimationFrame(animate)

    stats.begin()
    render()
    stats.end()
  }
</script>

<canvas id="main" bind:this={canvas} />

<div class="text">
  <p style="font-size: {fontSize}px;">Hello! I'm Anson Kan :D</p>
  <p class="hk" style="font-size: {fontSize}px;">Hello! I'm Anson Kan :D</p>
  <p class="hk" style="font-size: {fontSize}px;">你好！ 我叫Anson諱！</p>
  <p class="hk" style="font-size: {fontSize}px;">昨日すき焼きを食べました</p>
  <p class="hk" style="font-size: {fontSize}px;">
    저는 동물을 좋아하는데 가족들이 동물을 별로 안 좋아해요.
  </p>
  <p class="barcode" style="font-size: {fontSize}px;">Hello! I'm Anson Kan :D</p>
  <p class="press-start-2p" style="font-size: {fontSize}px;">Hello! I'm Anson Kan :D</p>
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
