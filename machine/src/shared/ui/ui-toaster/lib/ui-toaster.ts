import { v4 } from 'uuid'

import { usePersister } from '@/shared/lib'

import type { UIToastData, UIToastId } from '../types/ui-toast'

export const useUIToaster = createGlobalState (() => {
  const toasts = usePersister<UIToastData[]>('toaster:toasts', [])

  function create(toast: Omit<UIToastData, 'id'>): void {
    toasts.value = [{ id: v4(), ...toast }, ...toasts.value]
  }

  function close(id: UIToastId): void {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function clear(): void {
    toasts.value = []
  }

  return {
    toasts: readonly(toasts),

    create,
    close,
    clear,
  }
})
