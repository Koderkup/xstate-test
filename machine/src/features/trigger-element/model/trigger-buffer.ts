import { type SchemeTriggerEventExact, useExerciseStore } from '@/entities/exercise'
import { useTriggerElementStore } from '@/features/trigger-element'
import { usePersister } from '@/shared/lib'

export const useTriggerBufferStore = defineStore('trigger-buffer', () => {
  const trigger = useTriggerElementStore()
  const exercise = useExerciseStore()

  const buffer = usePersister<SchemeTriggerEventExact>('trigger-modal:buffer')
  exercise.listen('step', () => buffer.value = undefined)
  exercise.listen('reset', () => buffer.value = undefined)

  function write(event: SchemeTriggerEventExact): void {
    buffer.value = event
  }

  whenever(() => trigger.element, ({ id }) => {
    if (!buffer.value || id !== buffer.value.split('.')?.[0])
      return

    if (exercise.can(buffer.value)) {
      exercise.send(buffer.value)
      trigger.cancel()
    }
  })

  return {
    write,
  }
})
