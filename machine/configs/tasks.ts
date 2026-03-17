import type { ExerciseTask } from '@/entities/task'

export const TASKS_CONFIG = [
  {
    id: 'engine-warm',
    name: 'Прогрев дымососов',
    mission: 'Прогрев дымососов поз.101-BJA/BJB',
  },
  {
    id: 'engine-start',
    name: 'Пуск дымососов',
    mission: 'Пуск дымососов поз.101-BJA/BJB',
  },
  {
    id: 'hydraulic-test',
    name: 'Гидравлические испытания',
    mission: 'Запитать КУ поз.94, провести гидравлические испытания паропровода до ГПЗ, слить паропровод',
  },
] as const satisfies ExerciseTask[]
