<script setup lang="ts">
import { useExerciseStore } from '@/entities/exercise'
import { useHistoryStore } from '@/entities/history'
import { useProgressStore } from '@/entities/progress'
import type { QuizAnswerId } from '@/entities/quiz'
import { useQuizStore } from '@/entities/quiz'
import { useSettingsStore } from '@/entities/settings'
import type { UIRadioOption } from '@/shared/ui'
import { UIButton, UIModal, UIRadio } from '@/shared/ui'

import { useQuizAnswersStore } from '../model/quiz-answers'
import { useQuizModalStore } from '../model/quiz-modal'

const quiz = useQuizStore()
const history = useHistoryStore()
const settings = useSettingsStore()

const { showed } = storeToRefs(useQuizModalStore())

const { answers, answer } = storeToRefs(useQuizAnswersStore())
const options = computed<UIRadioOption<QuizAnswerId>[]>(() => (answers.value ?? []).map(answer => ({
  value: answer.id,
  label: answer.label,
})))

function reply(): void {
  history.push({
    score: answer.value === quiz.question!.correct
      ? settings.get('score', 'correct-answer')
      : settings.get('score', 'incorrect-answer'),
    type: 'answer',
    data: {
      question: quiz.question!.text,
      answer: _.find(answers.value, { id: answer.value })!.label,
    },
  })

  if (!quiz.hasNext) {
    history.push({
      type: 'quiz',
      data: {
        correct: history.events.filter(e => e.type === 'answer' && e.score === 0).length,
        total: quiz.questions!.length,
      },
    })
  }

  if (quiz.hasNext) {
    quiz.next()
  }
  else {
    quiz.finish()
  }
}

const exercise = useExerciseStore()
const progress = useProgressStore()

exercise.listen('reset', () => {
  quiz.reset()

  if (!quiz.questions) {
    exercise.send('start')
  }
})

whenever(
  () => quiz.finished,
  () => {
    const id = _.find(progress.steps, { quiz: true })?.id
    if (!_.isNil(id) && !progress.passed[id]) {
      progress.pass(id)
    }

    exercise.send('start')
  },
  { immediate: true, flush: 'sync' },
)
</script>

<template>
  <UIModal
    v-model:showed="showed"
    :title="`Вопрос № ${quiz.index + 1}`"
    :subtitle="quiz.question?.text ?? ''"
  >
    <template #body>
      <TransitionFade mode="out-in" :duration="200">
        <UIRadio :key="quiz.index" v-model="answer" class="answers" :options />
      </TransitionFade>
    </template>

    <template #footer>
      <UIButton class="next" @click="reply">
        <span v-if="quiz.hasNext">Подтвердить</span>
        <span v-else>Завершить</span>
      </UIButton>
    </template>
  </UIModal>
</template>

<style scoped lang="scss">
.next {
  width: 130px;
}
</style>
