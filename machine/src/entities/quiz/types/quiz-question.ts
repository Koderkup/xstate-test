/**
 * id ответа
 */
export type QuizAnswerId = string

/**
 * Ответ на вопрос
 */
export interface QuizAnswer {

  /**
   * Уникальный id ответа
   */
  id: QuizAnswerId

  /**
   * Ответ, который отображается у пользователя
   */
  label: string
}

/**
 * Тестовый вопрос
 */
export interface QuizQuestion {

  /**
   * Текст вопроса
   */
  text: string

  /**
   * Правильный ответ на вопрос
   * Указывается значение из QuizAnswer.value
   */
  correct: string

  /**
   * Список вариантов ответов
   */
  answers: QuizAnswer[]
}
