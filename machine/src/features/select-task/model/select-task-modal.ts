import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useTaskStore } from '@/entities/task'
import { useConfigs } from '@/shared/lib'

export const useSelectTaskModalStore = defineStore('selectTaskModal', () => {
  const showed = ref(false)
  const configs = useConfigs()
  const countTasks = configs.get('tasks').length === 1

  function open(): void {
    const taskStore = useTaskStore()
    if (countTasks) {
      taskStore.select(configs.get('tasks')[0]?.id)
      return
    }
    showed.value = true
  }

  function close(): void {
    showed.value = false
  }

  return {
    showed,
    open,
    close,
  }
})
