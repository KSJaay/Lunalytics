import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression2';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './stats/stats.html',
    }),
    viteCompression({
      algorithm: 'gzip',
      filter: /\.(js|mjs|json|css|svg|html)$/i,
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      filter: /\.(js|mjs|json|css|svg|html)$/i,
    }),
  ],
  build: {
    commonjsOptions: { transformMixedEsModules: true },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
