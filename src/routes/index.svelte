<script lang="ts">
  import { browser } from '$app/env';
  import { onMount, onDestroy } from 'svelte';
  import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
  import { Text } from 'troika-three-text';

  let width = 0;
  let height = 0;

  let canvas: HTMLCanvasElement;
  let scene: Scene;
  let camera: PerspectiveCamera;
  let renderer: WebGLRenderer;

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

    renderer = new WebGLRenderer({ antialias: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(5, -2, 10);

    scene = new Scene();
    scene.add(camera);

    const text = new Text();
    scene.add(text);

    // Set properties to configure:
    text.text = 'Hello world!';
    text.fontSize = 2;
    text.color = 0x9966ff;

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
    renderer.render(scene, camera);
  }

  function animate() {
    window.requestAnimationFrame(animate);

    render();
  }
</script>

<canvas bind:this={canvas} />

<style lang="scss">
  canvas {
    position: fixed;
    width: 100vw;
    height: 100vh;
  }
</style>
