import { INDICATORS_CONFIG } from '@configs/indicators'
import { MACHINE_CONFIG } from '@configs/machine'
import { QUIZ_CONFIG } from '@configs/quiz'
import { SCHEMES_CONFIG } from '@configs/schemes'
import { SETTINGS_CONFIG } from '@configs/settings'
import { STATE_CONFIG } from '@configs/state'
import { STEPS_CONFIG } from '@configs/steps'
import { TASKS_CONFIG } from '@configs/tasks'
import { TRIGGERS_CONFIG } from '@configs/triggers'

export function isMoodle(win: Window = window, iteration = 0) {
  if (typeof win?.API !== 'undefined') {
    window.API = win.API
    return true
  }
  if (iteration > 500)
    return false
  iteration += 1
  return isMoodle(win.parent, iteration)
}
export const isLMS = isMoodle()
export type SettingsConfig = typeof SETTINGS_CONFIG
export type QuizConfig = typeof QUIZ_CONFIG
export type TasksConfig = typeof TASKS_CONFIG
export type SchemesConfig = typeof SCHEMES_CONFIG
export type IndicatorsConfig = typeof INDICATORS_CONFIG
export type TriggersConfig = typeof TRIGGERS_CONFIG
export type StateConfig = typeof STATE_CONFIG
export type StepsConfig = typeof STEPS_CONFIG
export type MachineConfig = typeof MACHINE_CONFIG

const CONFIGS = {
  settings: SETTINGS_CONFIG,
  quiz: QUIZ_CONFIG,
  tasks: TASKS_CONFIG,
  schemes: SCHEMES_CONFIG,
  indicators: INDICATORS_CONFIG,
  triggers: TRIGGERS_CONFIG,
  state: STATE_CONFIG,
  steps: STEPS_CONFIG,
  machine: MACHINE_CONFIG,
} as const

export const useConfigs = createGlobalState(() => {
  const configs = shallowRef(CONFIGS)

  function get<K extends keyof typeof CONFIGS>(key: K): typeof CONFIGS[K] {
    return configs.value[key]
  }

  return {
    configs: readonly(configs),

    get,
  }
})
