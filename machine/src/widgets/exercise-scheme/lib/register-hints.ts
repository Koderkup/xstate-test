import { useFlags } from '@/shared/lib'

const NUMBER_PREFIX = 'button_'
const INDICATOR_PREFIX = 'indicator_'

export function useRegisterHints(scheme: Ref<SVGElement | undefined>) {
  const flags = useFlags()

  whenever(
    () => scheme.value && !flags.get('admin'),
    () => {
      for (const prefix of [NUMBER_PREFIX, INDICATOR_PREFIX]) {
        Array
          .from(scheme.value!.querySelectorAll(`[id^="${prefix}"]`))
          .filter(el => !_.isNaN(Number(el.id.replace(prefix, ''))))
          .forEach(el => el.remove())
      }
    },
    { immediate: true },
  )
}
