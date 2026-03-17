import type { TasksConfig } from '@/shared/lib'

export type ExerciseTaskId = string

/**
 * Задание для выполнения.
 */
export interface ExerciseTask {
  /**
   * id задания
   */
  id: ExerciseTaskId

  /**
   * Название задания
   */
  name: string

  /**
   * Описание задания
   */
  mission: string
}

export type ExerciseTaskIdExact = TasksConfig[number]['id']
