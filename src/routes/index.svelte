<script lang="ts">
  import { browser } from '$app/env';
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  // import { Text } from 'troika-three-text';
  import createTextGeometry from 'three-bmfont-text';
  import loadFont from 'load-bmfont';

  import NotoSansFnt from '$assets/fonts/NotoSans/NotoSans-Regular.fnt?url';
  import NotoSansPng from '$assets/fonts/NotoSans/NotoSans-Regular.png?url';

  let width = 0;
  let height = 0;

  let canvas: HTMLCanvasElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;

  // let text: Text;
  let clock: THREE.Clock;

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

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    const z = 600;
    const fov = 2 * Math.atan(height / 2 / z) * (180 / Math.PI);
    camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);
    camera.position.set(0, 0, z);

    scene = new THREE.Scene();
    scene.add(camera);

    // loadFont(NotoSansFnt, (err: unknown, font: any) => {
    //   const textGeo: any = createTextGeometry({
    //     font,
    //     text: 'Hello! This is Anson :D'
    //   });

    //   const textureLoader = new THREE.TextureLoader();
    //   textureLoader.load(NotoSansPng, (texture) => {
    //     const textMaterial = new THREE.MeshBasicMaterial({
    //       map: texture,
    //       transparent: true,
    //       color: 0xaaffff
    //     });

    //     const textMesh = new THREE.Mesh(textGeo, textMaterial);

    //     scene.add(textMesh);
    //   });
    // });

    // {
    //   // try `troika-three-text`
    //   text = new Text();
    //   scene.add(text);

    //   // Set properties to configure:
    //   text.text = 'Hello world!';
    //   text.fontSize = fontSize;
    //   text.color = 0x9966ff;
    //   text.position.set(width / -2, height / 2, 0);

    //   // Update the rendering:
    //   text.sync();
    // }

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
