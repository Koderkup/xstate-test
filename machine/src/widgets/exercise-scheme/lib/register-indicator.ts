import type { SchemeIndicator, SchemeIndicatorAttribute } from '@/entities/exercise'
import { useExerciseStore } from '@/entities/exercise'

import { updater } from '../utils/updater'

export function useRegisterIndicator(scheme: Ref<SVGElement | undefined>, indicator: SchemeIndicator): void {
  const element = computed(() => (scheme.value as unknown as Document)?.getElementById(indicator.id))

  whenever(element, (el) => {
    el.classList.add('indicator')
  })

  const exercise = useExerciseStore()
  const state = computed(() => {
    return exercise?.state?.[indicator.id]
  })

  function update() {
    _.forEach(state.value, (value, attr) => updater[attr as SchemeIndicatorAttribute](
      scheme.value!,
      indicator.id,
      (indicator.params as any)[attr],
      value as never,
    ))
  }
  whenever(element, update)
  watch(state, update)
}
