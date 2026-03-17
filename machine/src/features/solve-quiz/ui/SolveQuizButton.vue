<script setup lang="ts">
import { useQuizStore } from '@/entities/quiz'
import { UIButton, UIIcon } from '@/shared/ui'

import { useQuizModalStore } from '../model/quiz-modal'

const props = defineProps<{
  mini?: boolean
}>()

const { showed } = storeToRefs(useQuizModalStore())
const quiz = useQuizStore()

const label = 'Тестирование'
</script>

<template>
  <UIButton
    v-if="quiz.questions"
    :disabled="quiz.finished"
    :tooltip="props.mini ? label : undefined"
    @click="showed = true"
  >
    <UIIcon v-if="props.mini" name="card-checklist" />

    <span v-else>{{ label }}</span>
  </UIButton>
</template>
