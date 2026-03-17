import type { Settings } from '@/entities/settings'

export const SETTINGS_CONFIG = {
  storage: '2025_30_dev',
  colors: {
    red: '#fd0202',
    yellow: '#ffff02',
    green: '#87cf43',
  },
  score: {
    'incorrect-trigger': -1,
    'incorrect-action': -1,
    'incorrect-answer': -1,
    'forgotten-step': -1,
    'penalty': -1,
    'step-passed': 0,
    'correct-answer': 0,
  },
} as const satisfies Settings
