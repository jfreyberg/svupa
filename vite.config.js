import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */

const config = {
  plugins: [sveltekit()],
  build: {
    minify: false,
  },
  server: {
    port: 3000,
    strictPort: true,
    https: false,
    watch: { chokidar: { usePolling: true } },
    hmr: {
      clientPort: 3000,
    },
  },
};
export default config;