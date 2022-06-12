<script lang="ts">
  import { browser } from '$app/env';
  import { onMount, onDestroy } from 'svelte';
  import { Scene, PerspectiveCamera, WebGLRenderer, Clock } from 'three';
  import { Text } from 'troika-three-text';

  let width = 0;
  let height = 0;

  let canvas: HTMLCanvasElement;
  let scene: Scene;
  let camera: PerspectiveCamera;
  let renderer: WebGLRenderer;

  let text: Text;
  let clock: Clock;

  let fontSize = 50;

  onMount(() => {
    if (browser) {
      init();
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('resize', onWindowResize);
    }
  });

  function init() {
    width = window.innerWidth;
    height = window.innerHeight;

    clock = new Clock();

    renderer = new WebGLRenderer({ antialias: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    const z = 600;
    const fov = 2 * Math.atan(height / 2 / z) * (180 / Math.PI);
    camera = new PerspectiveCamera(fov, width / height, 0.1, 1000);
    camera.position.set(0, 0, z);

    scene = new Scene();
    scene.add(camera);

    text = new Text();
    scene.add(text);

    // Set properties to configure:
    text.text = 'Hello world!';
    text.fontSize = fontSize;
    text.color = 0x9966ff;
    text.position.set(width / -2, height / 2, 0);
    // text.outlineWidth = 0.1;
    // text.outlineColor = 0x808080;
    // text.debugSDF = true
    // text.lineHeight = 0.5;
    // text.fillOpacity = 0.5;

    // Update the rendering:
    text.sync();

    window.addEventListener('resize', onWindowResize);

    // render();
    animate();
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

    // render();
  }

  function render() {
    // const d = clock.getDelta();

    // text.rotateX(d);
    // text.rotateY(d * 0.25);
    // text.rotateZ(d * 0.15);

    renderer.render(scene, camera);
  }

  function animate() {
    window.requestAnimationFrame(animate);

    render();
  }
</script>

<canvas bind:this={canvas} />

<!-- <p class="test" style="font-size: {fontSize}px;">Hello world!</p> -->
<style lang="scss">
  // @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

  canvas {
    position: fixed;
    width: 100vw;
    height: 100vh;
  }

  // .test {
  //   position: fixed;
  //   width: 100vw;
  //   height: 100vh;
  //   margin: 0;
  //   color: purple;
  //   font-family: Roboto;
  // }
</style>
