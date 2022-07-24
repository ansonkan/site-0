<script context="module">
  export const prerender = true
</script>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  // import { createSketch } from '@sketches/index'
  import type { Sketch } from '@utils/types'

  let loading = false
  let sketch: Sketch | undefined

  onMount(() => {
    run()
  })

  onDestroy(() => {
    sketch?.destroy()
  })

  async function run() {
    loading = true

    const { createSketch } = await import('@sketches/index')
    sketch = await createSketch()

    loading = false

    sketch.start()
  }
</script>

{#if loading}
  <div class="loading">Loading...</div>
{/if}

<style lang="scss">
  .loading {
    @apply text-9xl font-bold;
  }
</style>
