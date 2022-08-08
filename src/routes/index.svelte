<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { fly } from 'svelte/transition'
  import { gsap } from 'gsap'

  import type { Sketch } from '@utils/types'

  let canvas: HTMLCanvasElement | undefined
  let loading = false
  let sketch: Sketch | undefined
  const timeline = gsap.timeline({ paused: false })

  onMount(() => {
    run()

    timeline.play()
  })

  onDestroy(() => {
    sketch?.destroy()
  })

  async function run() {
    if (!canvas) return

    loading = true

    const { createSketch } = await import('@sketches/index')
    sketch = await createSketch(canvas)
    sketch.start()

    setTimeout(() => {
      loading = false
    }, 200)
  }
</script>

<svelte:head>
  <title>Anson Kan</title>
</svelte:head>

{#if loading}
  <div class="loading-text" out:fly>Loading...</div>
{/if}

<div class="about">
  <div class="main">
    <span>Hello! This is</span>
    <h1>Anson Kan</h1>
  </div>
</div>

<canvas bind:this={canvas} />

<style lang="scss">
  .loading-text {
    @apply text-9xl font-bold h-full w-full fixed bg-blue-gray-700 text-white;
  }

  .about {
    @apply h-full w-full fixed flex flex-col justify-center items-center pointer-events-none;

    h1 {
      @apply text-8xl;
    }
  }
</style>
