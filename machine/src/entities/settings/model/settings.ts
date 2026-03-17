import type { SettingsConfig } from '@/shared/lib'
import { useConfigs } from '@/shared/lib'

export const useSettingsStore = defineStore('settings', () => {
  const configs = useConfigs()

  const settings = shallowRef(configs.get('settings'))

  function get<K1 extends keyof SettingsConfig>(...keys: [K1]): SettingsConfig[K1]
  function get<K1 extends keyof SettingsConfig, K2 extends keyof SettingsConfig[K1]>(...keys: [K1, K2]): SettingsConfig[K1][K2]
  function get(...keys: any[]): any {
    return _.get(settings.value, keys.join('.'))
  }

  return {
    settings: shallowReadonly(settings),

    get,
  }
})
