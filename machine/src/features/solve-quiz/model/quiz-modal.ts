import { useQuizStore } from '@/entities/quiz'
import { usePersister } from '@/shared/lib'

export const useQuizModalStore = defineStore('quiz-modal', () => {
  const showed = usePersister<boolean>('quiz-modal:showed', false)

  const quiz = useQuizStore()
  whenever(() => quiz.finished, () => showed.value = false)

  return {
    showed,
  }
})
