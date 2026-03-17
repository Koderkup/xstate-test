<script setup lang="ts">
import { useExerciseStore } from '@/entities/exercise'
import { UIToaster, useUIToaster } from '@/shared/ui'

const exercise = useExerciseStore()
const toaster = useUIToaster()
// TODO: Сделать модалкой
exercise.listen('notification', event => toaster.create({ message: event.message }))
exercise.listen('step', () => toaster.clear())
exercise.listen('reset', () => toaster.clear())
</script>

<template>
  <UIToaster />
</template>
