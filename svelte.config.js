import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    prerender: {
      default: true
    },
    alias: {
      $assets: 'src/assets',
      $utils: 'src/utils'
    },
    vite: {
      assetsInclude: ['**/*.gltf', '**/*.fnt']
    }
  }
}

export default config
