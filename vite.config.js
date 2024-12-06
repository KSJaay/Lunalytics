import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { compression } from 'vite-plugin-compression2';

const filter = /\.(js|mjs|json|css|svg|html)$/i;

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: 'gzip', filter }),
    compression({ algorithm: 'brotliCompress', filter }),
    visualizer({ filename: './stats/stats.html' }),
  ],
  define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version) },
  css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
});
