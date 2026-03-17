<script setup lang="ts">
import { useExerciseStore } from '@/entities/exercise'
import { UIButton, UIIcon } from '@/shared/ui'

import { useRestartExercise } from '../lib/restart-exercize'

const props = defineProps<{
  mini: boolean
}>()

const exercise = useExerciseStore()
const { emit } = useRestartExercise()

function restart(): void {
  emit()
  exercise.send('reset')
}

const label = 'Начать заново'
</script>

<template>
  <UIButton
    :tooltip="props.mini ? label : undefined"
    @click="restart"
  >
    <UIIcon v-if="props.mini" name="reset" size="1.2" />

    <span v-else>{{ label }}</span>
  </UIButton>
</template>
