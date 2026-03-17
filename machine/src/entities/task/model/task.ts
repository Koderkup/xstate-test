import { useConfigs, usePersister } from '@/shared/lib'

import type { ExerciseTask, ExerciseTaskIdExact } from '../types/exercise-task'
import { useExerciseStore } from '@/entities/exercise'

export const useTaskStore = defineStore('task', () => {
  const configs = useConfigs()
  const exercise = useExerciseStore()

  //configs.get('tasks')[0]?.id
  const id = usePersister<ExerciseTaskIdExact|null>('task:id', null)

  const task = computed<ExerciseTask>(() => _.find(configs.get('tasks'), { id: id.value })!)

  function select(taskId: ExerciseTaskIdExact|null) {
    id.value = taskId
    exercise.send({ type: 'reset' })
  }

  return {
    id: readonly(id),
    task: readonly(task),

    select,
  }
})
