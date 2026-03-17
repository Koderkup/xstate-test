import { usePersister } from '@/shared/lib'

import type { SchemeMainIdExact, SchemeModalIdExact } from '../types/scheme'

export const useSchemeStore = defineStore('scheme', () => {
  const main = usePersister<SchemeMainIdExact>('scheme:main')
  const modals = usePersister<SchemeModalIdExact[]>('modal:modals', [])
  const customTitles = reactive<Partial<Record<SchemeModalIdExact, string>>>({})

  function set(id: SchemeMainIdExact): void {
    main.value = id
  }

  function setCustomTitle(id: SchemeModalIdExact, title: string) {
    customTitles[id] = title
  }

  function getCustomTitle(id: SchemeModalIdExact) {
    return customTitles[id]
  }


  function open(id: SchemeModalIdExact): void {
    modals.value = [...modals.value, id]
  }

  function close(): void {
    modals.value = modals.value.slice(0, -1)
  }

  function reset(): void {
    main.value = undefined
    modals.value = []
  }

  return {
    main: shallowReadonly(main),
    modals: shallowReadonly(modals),

    set,
    open,
    close,
    reset,

    setCustomTitle,
    getCustomTitle,

  }
})
