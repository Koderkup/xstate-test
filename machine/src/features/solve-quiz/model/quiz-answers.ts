import type { QuizAnswer, QuizAnswerId } from '@/entities/quiz'
import { useQuizStore } from '@/entities/quiz'
import { usePersister } from '@/shared/lib'

export const useQuizAnswersStore = defineStore('quiz-answers', () => {
  const quiz = useQuizStore()

  const answers = usePersister<QuizAnswer[]>('quiz-answers:answers')
  const answer = usePersister<QuizAnswerId>('quiz-answers:answer')

  function reset(): void {
    answers.value = undefined
    answer.value = undefined
  }

  function update(): void {
    answers.value = _.shuffle(quiz.question!.answers)
    answer.value = answers.value[0]?.id
  }

  watch(() => quiz.question, () => {
    if (!quiz.question) {
      reset()
    }
    else if (!answers.value) {
      update()
    }
  }, { immediate: true })
  watch(() => quiz.index, () => {
    if (quiz.question) {
      update()
    }
  })

  return {
    answers: readonly(answers),

    answer,
  }
})
