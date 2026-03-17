<script setup lang="ts">
import { useExerciseStore } from '@/entities/exercise'
import { useFinishEarlyModalStore } from '@/features/finish-exercise/model/finish-early-modal'
import { UIButton, UIModal } from '@/shared/ui'

const { showed } = storeToRefs(useFinishEarlyModalStore())
const exercise = useExerciseStore()

function onConfirm(): void {
  console.log('LMS: неудачная попытка прохождения отправлена')
  exercise.send('early-finish')
  showed.value = false
}

function onCancel(): void {
  showed.value = false
}
</script>

<template>
  <UIModal v-model:showed="showed" title="Подтверждение">
    <template #body>
      <p>Вы действительно хотите завершить досрочно? Попытка будет считаться неудачной.</p>
    </template>

    <template #footer>
      <UIButton type="ghost" @click="onConfirm">
        Завершить
      </UIButton>
    </template>
  </UIModal>
</template>
