/**
 * Данные по типу события в истории
 */
export interface HistoryEventDataMap {

  /**
   * Ответ на тестовый вопрос
   */
  answer: {

    /**
     * Вопрос теста
     */
    question: string

    /**
     * Ответ данный пользователем
     */
    answer: string
  }

  /**
   * Завершение теста
   */
  quiz: {

    /**
     * Количество правильных ответов
     */
    correct: number

    /**
     * Общее количество вопросов в тесте
     */
    total: number
  }

  /**
   * Взаимодействие с элементом схемы
   */
  trigger: {

    /**
     * Название элемента схемы
     */
    element: string

    /**
     * Название выбранного действия
     */
    action?: string
  }

  /**
   * Окончание этапа
   */
  stage: {

    /**
     * Название этапа
     */
    name: string
  }

  // TODO: JSDoc
  penalty: {
    title: string
    message: string
  }

  /**
   * Пропущен опциональный шаг
   */
  optional: {

    /**
     * Название опционального шага
     */
    step: string
  }

  custom: {

    /**
     * Название опционального шага
     */
    message: string
    details: string
  }
}

export interface HistoryEventInfo<T extends keyof HistoryEventDataMap> {
  type: T
  data: HistoryEventDataMap[T]
}

export type HistoryEventId = number

/**
 * Событие в истории
 */
export type HistoryEvent = {
  /**
   * Уникальный идентификатор
   */
  id: HistoryEventId

  /**
   * Списание за действие.
   * undefined    - не подразумевает влияние на баллы
   * 0            - корректное действие
   * -1, -2, ...  - некорректное действие
   */
  score?: number
} & (
  | HistoryEventInfo<'answer'>
  | HistoryEventInfo<'quiz'>
  | HistoryEventInfo<'trigger'>
  | HistoryEventInfo<'stage'>
  | HistoryEventInfo<'penalty'>
  | HistoryEventInfo<'optional'>
  | HistoryEventInfo<'custom'>
  )
