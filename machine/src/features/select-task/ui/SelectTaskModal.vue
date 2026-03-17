<script setup lang="ts">
import { useExerciseStore } from '@/entities/exercise'
import type { ExerciseTaskIdExact } from '@/entities/task'
import { useTaskStore } from '@/entities/task'
import { useConfigs, usePersister } from '@/shared/lib'
import { UIButton, UIModal, UIRadio, type UIRadioOption } from '@/shared/ui'

import { useSelectTaskModalStore } from '../model/select-task-modal'
import {useOpenTaskModalStore} from "@/features/open-task/model/open-task-modal";

const configs = useConfigs()
const taskStore = useTaskStore()
const selectTaskModalStore = useSelectTaskModalStore()

const taskId = usePersister<string | null>('task:id', null)
const { showed } = storeToRefs(selectTaskModalStore)

const selectedId = ref<ExerciseTaskIdExact>(
  taskId.value ? (taskId.value as ExerciseTaskIdExact) : configs.get('tasks')[0]?.id || 'start',
)

const options = computed<UIRadioOption<ExerciseTaskIdExact>[]>(() =>
  configs.get('tasks').map(task => ({
    value: task.id,
    label: task.name,
  })),
)

const exercise = useExerciseStore()

function apply(): void {
  if (!selectedId.value)
    return

  exercise.send('reset')
  taskStore.select(selectedId.value)
  taskId.value = selectedId.value
  selectTaskModalStore.close()
  // показываем текст задания после выбора task среди select
  useOpenTaskModalStore().showed = true
}
</script>

<template>
  <UIModal
    v-model:showed="showed"
    title="Выбор задания"
    subtitle="Выберите задание для выполнения"
    :force="true"
    :closeable="false"
    :is-close="Boolean(false)"
  >
    <template #body>
      <TransitionFade mode="out-in" :duration="200">
        <UIRadio v-model="selectedId" class="answers" :options />
      </TransitionFade>
    </template>

    <template #footer>
      <UIButton
        class="confirm"
        :disabled="!selectedId"
        @click="apply"
      >
        Подтвердить
      </UIButton>
    </template>
  </UIModal>
</template>

<style scoped lang="scss">
.confirm {
  width: 150px;
}
</style>
