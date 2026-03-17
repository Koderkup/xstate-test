<script setup lang="ts">
import { useExerciseStore } from '@/entities/exercise'
import { useHistoryStore } from '@/entities/history'
import type { ProgressStep } from '@/entities/progress'
import { useProgressStore } from '@/entities/progress'
import { useQuizStore } from '@/entities/quiz'
import { useSettingsStore } from '@/entities/settings'
import { UIIcon } from '@/shared/ui'

const props = defineProps<{
  step: ProgressStep
}>()

const exercise = useExerciseStore()
const quiz = useQuizStore()
const progress = useProgressStore()
const history = useHistoryStore()
const settings = useSettingsStore()

const active = computed(() => progress.passed[props.step.id])

const rootRef = shallowRef<HTMLElement>()
whenever(active, () => rootRef.value?.scrollIntoView())

const title = computed(() => {
  if ('quiz' in props.step) {
    return 'Тестирование'
  }
  else {
    return props.step.title
  }
})

const icon = computed(() => {
  if ('quiz' in props.step) {
    return 'check-circle-fill'
  }
  else if (props.step.optional) {
    return 'circle'
  }
  else {
    return 'circle-fill'
  }
})

function execute(step: ProgressStep): void {
  if ('events' in step) {
    step.events.forEach((event) => {
      exercise.send('stop')
      exercise.send(event)
    })
  }
  else {
    quiz.questions!.forEach(q => history.push({
      score: settings.get('score', 'correct-answer'),
      type: 'answer',
      data: {
        question: q.text,
        answer: _.find(q.answers, { id: q.correct })!.label,
      },
    }))
    history.push({
      type: 'quiz',
      data: {
        correct: quiz.questions!.length,
        total: quiz.questions!.length,
      },
    })
    quiz.finish()
  }
}

function activate(): void {
  exercise.send('reset')

  for (const step of progress.steps) {
    execute(step)

    if (step.id === props.step.id) {
      return
    }
  }
}
</script>

<template>
  <button
    ref="rootRef"
    v-tooltip="{
      content: title,
      delay: { show: 0 },
    }"
    type="button"
    :class="{ active }"
    class="goto-step-button"
    @click="activate"
  >
    {{ props.step.id }}

    <UIIcon class="status" :name="icon" />
  </button>
</template>

<style scoped lang="scss">
.goto-step-button {
  @include border-white();
  @include transition('background-color, color, border');
  @include size(36px);
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: $radius-md;
  outline: none;
  background-color: transparent;
  font-size: $text-lg;
  cursor: pointer;
  color: $color-white;

  &.active {
    color: $color-gray-lighter;
    border-color: $color-white;
    background-color: $color-white;
  }

  &:hover {
    background-color: $color-white-transparent;
    border: transparent;
    color: $color-gray-lighter;
  }

  &:active {
    border-color: transparent;
    background-color: $color-gray-lighter;
    color: $color-white;
    scale: 1;
  }

  .status {
    position: absolute;
    color: $color-gray-lighter;
    font-size: 8px;
    inset: auto 1px 1px auto;
  }
}
</style>
