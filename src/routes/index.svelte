<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { fade } from 'svelte/transition'
  import SmileyIcon from '~icons/ph/smiley-fill'
  import WavingHandIcon from '~icons/ic/round-waving-hand'
  import DownloadIcon from '~icons/ic/baseline-sim-card-download'
  import GitHubIcon from '~icons/mdi/github'
  import LinkedInIcon from '~icons/mdi/linkedin'
  import EmailIcon from '~icons/ic/baseline-email'
  import CloseIcon from '~icons/ic/baseline-close'
  import InfoIcon from '~icons/bi/info-lg'

  import PressStart2PUrl from '@assets/fonts/PressStart2P-Regular.ttf?url'
  import ResumeUrl from '@assets/others/anson-kan-resume-2022.pdf?url'

  import type { Sketch } from '@utils/types'

  let canvas: HTMLCanvasElement | undefined
  let loading = false
  let fontLoaded = false
  let sketch: Sketch | undefined
  let opened = true

  const transitionDuration = 100

  onMount(() => {
    run()
  })

  onDestroy(() => {
    sketch?.destroy()
  })

  async function run() {
    const pressStart2PFont = new FontFace('PressStart2P', `url(${PressStart2PUrl})`)
    pressStart2PFont.load().then((loadedFont) => {
      document.fonts.add(loadedFont)

      setTimeout(() => {
        fontLoaded = true
      }, 500)
    })

    if (!canvas) return

    loading = true

    const { createSketch } = await import('@sketches/index')
    sketch = await createSketch(canvas)
    sketch.start()

    setTimeout(() => {
      loading = false
    }, 200)
  }

  function toggleAbout() {
    opened = !opened
  }
</script>

<svelte:head>
  <title>Anson Kan</title>
</svelte:head>

{#if loading}
  <div class="loading-text" out:fade={{ duration: transitionDuration }} />
{/if}

{#if fontLoaded && opened}
  <div class="about" transition:fade={{ duration: transitionDuration }}>
    <div class="main">
      <div class="first-line">
        <div class="has-icon"><SmileyIcon />Hello and welcome<WavingHandIcon /></div>
        <button class="has-icon" on:click={toggleAbout}>[<CloseIcon />]</button>
      </div>

      <div>This is</div>
      <h1>Anson Kan</h1>
      <div>I'm a front-end developer from HK and trying to do more than just front-end.</div>

      <ul class="contact">
        <li><a class="has-icon" href={ResumeUrl} download><DownloadIcon />Resume</a></li>
        <li><a class="has-icon" href="https://github.com/ansonkan"><GitHubIcon />GitHub</a></li>
        <li>
          <a class="has-icon" href="https://www.linkedin.com/in/anson-kan-7b6091151"
            ><LinkedInIcon />LinkedIn</a
          >
        </li>
        <li><a class="has-icon" href="mailto:ansonkan31@gmail.com"><EmailIcon />Email</a></li>
      </ul>
    </div>
  </div>
{/if}

{#if !opened}
  <button
    class="open-button"
    transition:fade={{ duration: transitionDuration }}
    on:click={toggleAbout}><InfoIcon /></button
  >
{/if}

<canvas bind:this={canvas} />

<style lang="scss">
  .loading-text {
    @apply text-9xl font-bold h-full w-full fixed bg-yellow-400;
  }

  .about {
    @apply h-full w-full p-4 fixed flex flex-col justify-center items-center;

    .main {
      @apply bg-yellow-400 p-4;
    }

    h1 {
      font-family: 'PressStart2P';
      @apply text-xl md:text-6xl my-2;
    }

    .contact {
      @apply mt-2 flex gap-2;

      a {
        @apply underline;
      }
    }
  }

  .has-icon {
    @apply flex flex-row items-center gap-1;
  }

  .first-line {
    @apply flex flex-row justify-between;
  }

  .open-button {
    @apply fixed bg-yellow-400 text-xl p-2 rounded-full bottom-4 right-4;
  }
</style>
