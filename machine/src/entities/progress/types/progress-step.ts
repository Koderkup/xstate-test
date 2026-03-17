import type { SchemeTriggerEventExact } from '@/entities/exercise/@x/progress'
import type { ExerciseTaskIdExact } from '@/entities/task/@x/progress'
import type { StepsConfig } from '@/shared/lib'

export type ProgressStepId = number | string

/**
 * Шаг, который участвует в алгоритме
 */
export type ProgressStep = {

  /**
   * id шага
   */
  id: ProgressStepId
  skipHistory?: boolean
} & (

  /**
   * Свойства для описания шага взаимодействия со схемой
   */
  | {

    /**
     * Название шага, отображается в тултипе
     */
    title: string

    /**
     * Список событий, которые должны быть выполнены на текущем шаге
     */
    events: SchemeTriggerEventExact[]

    /**
     * Флаг для опционального шага
     * (дополнительный шаг за дополнительные баллы, не обязательный к выполнению)
     */
    optional?: true

    // TODO: JSDoc
    penalty?: number
  }

  /**
   * Свойства для шага выполнения теста
   */
  | {

    /**
     * Флаг для шага теста
     */
    quiz: true
  } | {

    /**
     * Флаг для автошага теста
     */
    auto: true
  }
)

export type ProgressStepQuiz = Extract<ProgressStep, { quiz: true }>
export type ProgressStepAction = Extract<ProgressStep, { title: string }>

export type ProgressStepIdExact = StepsConfig[ExerciseTaskIdExact][number]['id']
