<script setup lang="ts">
import type { SchemeTrigger, SchemeTriggerAction } from '@/entities/exercise'
import { useExerciseStore } from '@/entities/exercise'
import { useHistoryStore } from '@/entities/history'
import type { ProgressStepAction } from '@/entities/progress'
import { useProgressStore } from '@/entities/progress'
import { useSettingsStore } from '@/entities/settings'
import { useConfigs, useFlags } from '@/shared/lib'
import { UIDivider, UIScrollbar } from '@/shared/ui'

import HistoryItem from './HistoryItem.vue'

const flags = useFlags()
const configs = useConfigs()
const history = useHistoryStore()
const exercise = useExerciseStore()
const progress = useProgressStore()
const settings = useSettingsStore()

exercise.listen('stage', event => history.push({
  type: 'stage',
  data: { name: event.name },
}))
exercise.listen('penalty', event => history.push({
  type: 'penalty',
  data: { title: event.title, message: event.message },
  score: _.get(event, 'penalty', settings.get('score', 'penalty')),
}))

exercise.listen('step', (event) => {
  const steps = progress.steps ?? []
  if (steps.length === 0) {
    console.warn('HistoryLog: progress.steps is empty while handling "step" event.')
  }
  const step = _.find(steps, { id: event.id }) as ProgressStepAction | undefined

  if (!step) {
    console.warn(`HistoryLog: step "${event.id}" not found in progress.steps.`)
    return
  }
  if (step.skipHistory) {
    return
  }

  const triggers = configs.get('triggers') ?? []
  const triggerId = step.events.at(-1)!.split('.')[0]
  const trigger = _.find(triggers, { id: triggerId }) as SchemeTrigger | undefined

  if (!trigger) {
    console.warn(`HistoryLog: trigger "${triggerId}" for step "${event.id}" not found in TRIGGERS_CONFIG.`)
    return
  }

  const actionValue = step.events.at(-1)!.split('.')[1]
  const action = _.find(trigger.actions, { value: actionValue }) as SchemeTriggerAction | undefined

  if (!action) {
    console.warn(`HistoryLog: action "${actionValue}" for trigger "${triggerId}" not found.`)
    return
  }

  history.push({
    type: 'trigger',
    data: { element: trigger.name, action: action.label },
    score: settings.get('score', 'step-passed'),
  })
})

exercise.listen('finish', () => {
  const steps = progress.steps ?? []
  const passed = progress.passed ?? {}

  steps
    .filter(step =>
      !('quiz' in step)
      && step.optional
      && !passed[step.id],
    )
    .forEach(step => history.push({
      score: _.get(step, 'penalty', settings.get('score', 'forgotten-step'))!,
      type: 'optional',
      data: { step: _.get(step, 'title')! },
    }))
})
exercise.listen('reset', () => history.reset())
exercise.listen('history', (event) => {
  history.push({
    type: 'custom',
    data: {
      message: event.message,
      ...event.data,
    },
    score: event.score || 0,
  })
})

const initialized = ref(false)
onMounted(() => initialized.value = true)
</script>

<template>
  <div class="history-log">
    <UIDivider class="divider" axis="v" />

    <UIScrollbar class="scrollbar" axis="y">
      <div v-auto-animate="{ duration: flags.get('animate') ? 200 : 0 }" class="wrapper">
        <HistoryItem
          v-for="(event, index) in history.events"
          :key="event.id"
          :order="history.events.length - index"
          :event
          :initialized
        />
      </div>
    </UIScrollbar>
  </div>
</template>

<style scoped lang="scss">
.history-log {
  display: flex;
  position: relative;
  flex-direction: column;
  border-radius: 10px;
  //border: 1px solid black;

  .divider {
    position: absolute;
    inset: 0 32px 0 auto;
  }

  .scrollbar {
    flex: 1;
    height: 0;

    .wrapper {
      display: flex;
      flex-direction: column;
      padding: 10px 12px 10px 10px;
      gap: 20px;
    }
  }
}
</style>
