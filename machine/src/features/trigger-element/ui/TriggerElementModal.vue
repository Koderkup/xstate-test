<script setup lang="ts">
import type {
  SchemeTriggerAction,
  SchemeTriggerEventExact,
} from '@/entities/exercise'
import { useExerciseStore } from '@/entities/exercise'
import { useHistoryStore } from '@/entities/history'
import { useProgressStore } from '@/entities/progress'
import { useSettingsStore } from '@/entities/settings'
import { UIButton, UIModal } from '@/shared/ui'

import { useTriggerBufferStore } from '../model/trigger-buffer'
import { useTriggerElementStore } from '../model/trigger-element'

const exercise = useExerciseStore()
const buffer = useTriggerBufferStore()
const history = useHistoryStore()
const progress = useProgressStore()
const settings = useSettingsStore()

const trigger = useTriggerElementStore()
const showed = computed<boolean>({
  get: () => Boolean(trigger.element),
  set: value => !value && trigger.cancel(),
})

function getEvent(action: SchemeTriggerAction): SchemeTriggerEventExact {
  return `${trigger.element!.id}.${action.value}` as SchemeTriggerEventExact
}

function getPenalty(): number {
  const all = trigger.element!.actions.map(getEvent)
  const correct = all.find(exercise.can)!

  const step = progress.steps.find(step =>
    !progress.passed[step.id]
    && !('quiz' in step)
    && !step.optional
    && step.events.includes(correct),
  )

  return _.get(step, 'penalty', settings.get('score', 'incorrect-action'))
}

function apply(action: SchemeTriggerAction): void {
  if (!trigger.element)
    return

  const event = getEvent(action)

  if (exercise.can(event)) {
    buffer.write(event)
    exercise.send(event)
  }
  else {
    history.push({
      score: getPenalty(),
      type: 'trigger',
      data: { element: trigger.element.name, action: action.label },
    })
  }

  showed.value = false
}

whenever(toRef(trigger, 'element'), (element) => {
  if (!element.immediate)
    return

  const event = element.actions.map(getEvent).find(exercise.can)

  if (!event)
    return

  const [, actionValue] = event.split('.')
  const rightAction = element.actions.find(action => action.value === actionValue)

  if (rightAction)
    apply(rightAction)
})
</script>

<template>
  <UIModal
    v-model:showed="showed"
    title="Выбрать действие"
    :subtitle="trigger.element?.name"
    :auto-size="true"
  >
    <template #footer>
      <UIButton
        v-for="action in trigger.element!.actions"
        :key="action.value"
        class="button"
        @click="apply(action)"
      >
        {{ action.label }}
      </UIButton>
    </template>
  </UIModal>
</template>

<style scoped lang="scss">
.button {
  min-width: 150px;
}
</style>
