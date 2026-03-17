import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import type { App } from 'vue'

export function setupAnimate(app: App) {
  app.use(autoAnimatePlugin)
}
