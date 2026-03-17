import { useTaskStore } from '@/entities/task/@x/progress'
import { useConfigs, usePersister } from '@/shared/lib'

import type { ProgressStep, ProgressStepId } from '../types/progress-step'

export const useProgressStore = defineStore('progress', () => {
  const configs = useConfigs()
  const task = useTaskStore()

  const steps = computed<ProgressStep[]>(() => configs.get('steps')[task.id])

  const passed = usePersister<Record<ProgressStepId, true>>('progress:passed', {})
  function pass(id: ProgressStepId): void {
    passed.value = { ...passed.value, [id]: true }
  }

  function reset(): void {
    passed.value = {}
  }

  return {
    steps: readonly(steps),
    passed: readonly(passed),

    reset,
    pass,
  }
})
