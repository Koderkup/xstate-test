import type { SchemeMap } from '@/entities/scheme'

import HydraulicScheme from './Гидравлическая.svg?component'
import HydraulicPanelScheme from './Гидропанель.svg?component'
import ModalScheme from './ГТУ-8.svg?component'
import MainScheme from './Основная.svg?component'

export const SCHEMES_CONFIG = {
  'Основная': {
    type: 'main',
    component: MainScheme,
  },
  'ГТУ 8': {
    type: 'modal',
    title: 'ГТУ-8  и технология Агрегата №8',
    size: 800,
    component: ModalScheme,
  },
  'Гидравлическая': {
    type: 'main',
    component: HydraulicScheme,
  },
  'Гидропанель': {
    type: 'modal',
    title: 'Гидропанель',
    size: 800,
    component: HydraulicPanelScheme,
  },
} as const satisfies SchemeMap
