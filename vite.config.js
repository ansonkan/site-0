import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import glsl from 'vite-plugin-glsl'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [sveltekit(), glsl(), Icons({ compiler: 'svelte' })],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('/three/')) {
              return 'vendor_three'
            }

            return 'vendor' // all other package goes here
          }
        }
      }
    }
  }
})
