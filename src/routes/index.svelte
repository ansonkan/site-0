<script lang="ts">
  import { onMount } from 'svelte';
  import { Scene, OrthographicCamera, WebGLRenderer } from 'three';
  import { Text } from 'troika-three-text';

  let width = 0;
  let height = 0;

  let canvas: HTMLCanvasElement;
  let scene: Scene;
  let camera: OrthographicCamera;
  let renderer: WebGLRenderer;

  onMount(() => {
    init();
  });

  function init() {
    width = window.innerWidth;
    height = window.innerHeight;

    camera = new OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
    camera.position.set(0, 0, 100);

    scene = new Scene();
    scene.add(camera);

    const text = new Text();
    scene.add(text);

    // Set properties to configure:
    text.text = 'Hello world!';
    text.fontSize = 0.2;
    text.position.z = -2;
    text.color = 0x9966ff;

    // Update the rendering:
    text.sync();
  }
</script>

/// <reference paths="../../types/troika-three-text/index.d.ts" />

<canvas bind:this={canvas} />

<style lang="scss">
  canvas {
    position: fixed;
    width: 100vw;
    height: 100vh;
  }
</style>
