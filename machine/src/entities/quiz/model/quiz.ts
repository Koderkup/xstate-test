import { useConfigs, usePersister } from '@/shared/lib'

import type { QuizQuestion } from '../types/quiz-question'

export const useQuizStore = defineStore('quiz', () => {
  const configs = useConfigs()

  const questions = shallowRef<QuizQuestion[] | undefined>(configs.get('quiz'))

  const index = usePersister<number>('quiz:index', 0)
  const question = computed<QuizQuestion | undefined>(() => questions.value?.[index.value])

  const hasNext = computed<boolean>(() => Boolean(questions.value) && index.value < questions.value!.length - 1)
  function next(): void {
    if (hasNext.value) {
      index.value++
    }
  }

  const finished = computed<boolean>(() => !question.value)
  function finish(): void {
    if (!finished.value) {
      index.value = questions.value?.length ?? 0
    }
  }

  function reset(): void {
    index.value = 0
  }

  return {
    questions: readonly(questions),
    index: readonly(index),
    question: readonly(question),
    hasNext: readonly(hasNext),
    finished: readonly(finished),

    next,
    finish,
    reset,
  }
})
