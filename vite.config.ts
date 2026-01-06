import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PerfectToast',
      formats: ['es', 'umd'],
      fileName: (format) => `perfect-toast.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
});
