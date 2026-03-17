import { plugin as VueTransitions } from '@morev/vue-transitions'
import type { App } from 'vue'

export function setupTransitions(app: App) {
  app.use(VueTransitions())
}
