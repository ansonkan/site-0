import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    prerender: {
      default: false
    },
    alias: {
      $assets: 'assets'
    },
    vite: {
      optimizeDeps: {
        esbuildOptions: {
          plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })]
        }
      }
    }
  }
};

export default config;
