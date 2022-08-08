import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import { windi } from 'svelte-windicss-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [preprocess(), windi()],

  kit: {
    adapter: adapter(),
    prerender: {
      default: true
    },
    alias: {
      '@assets': 'src/assets',
      '@utils': 'src/utils',
      '@sketches': 'src/sketches',
      '@materials': 'src/materials'
    }
  },
}

export default config
