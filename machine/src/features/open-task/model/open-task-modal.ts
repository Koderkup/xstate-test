import { usePersister } from '@/shared/lib'

export const useOpenTaskModalStore = defineStore('open-task-modal', () => {
  const showed = usePersister<boolean>('open-task-modal:showed', false)

  return {
    showed,
  }
})
