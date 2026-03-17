import './styles/global.scss'
import './styles/fonts.scss'
import './styles/library.scss'

import { createApp } from 'vue'

import { setupAnimate } from './lib/setup-animate'
import { setupFloating } from './lib/setup-floating'
import { setupPinia } from './lib/setup-pinia'
import { setupTransitions } from './lib/setup-transitions'
import App from './ui/App.vue'

export function bootstrap() {
  const app = createApp(App)

  setupPinia(app)
  setupTransitions(app)
  setupFloating(app)
  setupAnimate(app)

  app.mount('#app')
}
