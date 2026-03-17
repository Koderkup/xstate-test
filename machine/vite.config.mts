import vitePluginVue from '@vitejs/plugin-vue'
import path from 'node:path'
import vitePluginAutoImport from 'unplugin-auto-import/vite'
import vitePluginVueDevTools from 'vite-plugin-vue-devtools'
import vitePluginSvgLoader from 'vite-svg-loader'
import { defineConfig } from 'vitest/config'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  base: './',

  server: {
    port: 8080,
  },

  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@configs': path.resolve(import.meta.dirname, 'configs'),
    },
  },

  plugins: [
    vitePluginVue(),
    vitePluginVueDevTools(),
    vitePluginSvgLoader({
      svgo: false,
    }),
    vitePluginAutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        '@vueuse/math',
        'pinia',
        {
          '@vueuse/core': [
            'onKeyUp',
          ],
        },
        {
          from: 'lodash-es',
          imports: [
            { name: '*', as: '_', from: 'lodash-es' },
          ],
        },
      ],
      dts: true,
    }),
  ],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/shared/styles/theme.scss" as *;
          @use "@/shared/styles/mixins.scss" as *;
        `,
      },
    },
  },
})
