import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'

export default defineConfig({
  plugins: [sveltekit()],
  assetsInclude: ['**/*.gltf', '**/*.fnt'],
  resolve: {
    alias: {
      '@': 'src'
    }
  }
})