import FloatingVue from 'floating-vue'
import type { App } from 'vue'

export function setupFloating(app: App) {
  app.use(FloatingVue, {
    overflowPadding: 10,
    themes: {
      tooltip: {
        delay: {
          show: 1000,
        },
      },
    },
  })
}
