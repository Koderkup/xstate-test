import type { SchemeTrigger } from '@/entities/exercise'
import { useExerciseStore } from '@/entities/exercise'
import { useHistoryStore } from '@/entities/history'
import { useSettingsStore } from '@/entities/settings'

export const useTriggerElementStore = defineStore('trigger-element', () => {
  const exercise = useExerciseStore()
  const history = useHistoryStore()
  const settings = useSettingsStore()

  const element = shallowRef<SchemeTrigger>()

  function interact(trigger: SchemeTrigger): void {
    const events = trigger.actions.map(action => `${trigger.id}.${action.value}`)
    if (!_.some(events, exercise.can)) {
      history.push({
        score: settings.get('score', 'incorrect-trigger'),
        type: 'trigger',
        data: { element: trigger.name },
      })
    }
    else {
      element.value = trigger
    }
  }

  function cancel(): void {
    element.value = undefined
  }

  return {
    element: readonly(element),

    interact,
    cancel,
  }
})
