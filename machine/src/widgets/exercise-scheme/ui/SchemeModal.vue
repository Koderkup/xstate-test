<script setup lang="ts">
import { useExerciseStore } from '@/entities/exercise'
import type { SchemeModalIdExact, SchemeModalOptions } from '@/entities/scheme'
import { useSchemeStore } from '@/entities/scheme'
import { useTaskStore } from '@/entities/task'
import { useRestartExercise } from '@/features/restart-exercise'
import { useConfigs, usePersister } from '@/shared/lib'
import type { UIModalOffset } from '@/shared/ui'
import { UIModal } from '@/shared/ui'

import SchemeCanvas from './SchemeCanvas.vue'

const configs = useConfigs()
const scheme = useSchemeStore()
const exercise = useExerciseStore()
const task = useTaskStore()

const modal = computed<SchemeModalIdExact | undefined>(() => scheme.modals.at(-1))
const options = computed<SchemeModalOptions | undefined>(() => {
  if (!modal.value)
    return undefined
  const opt = configs.get('schemes')[modal.value]
  if (!opt) {
    console.warn(`Options for modal scheme "${modal.value}" not found in SCHEMES_CONFIG.`)
  }
  return opt
})

exercise.listen('modal', ({ id, title }) => {
  if (id) {
    if (title)
      scheme.setCustomTitle(id, title)
    scheme.open(id)
  }
  else {
    scheme.close()
  }
})

const offset = usePersister<UIModalOffset>('scheme-modal:offset', { x: 0, y: 0 })

function reset(): void {
  offset.value = { x: 0, y: 0 }
}

watch(modal, reset)

const restart = useRestartExercise()
restart.listen(reset)

watch(toRef(task, 'id'), reset)

function close(): void {
  reset()
  scheme.close()
  exercise.send('close')
}
</script>

<template>
  <UIModal
    v-model:offset="offset"
    :showed="Boolean(modal && options)"
    :title="scheme.getCustomTitle(modal!) ?? options?.title ?? modal"
    :size="options?.size"
    layout="stretch"
    draggable
    @update:showed="!$event && close()"
  >
    <template #body>
      <TransitionFade :duration="200" mode="out-in">
        <SchemeCanvas
          v-if="modal && options"
          :id="modal"
          :key="modal"
          :component="options.component"
          class="modal"
        />
      </TransitionFade>
    </template>
  </UIModal>
</template>

<style scoped lang="scss">
.modal {
  @include size(100%);
}
</style>
