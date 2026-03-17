import { createGlobalState } from '@vueuse/core'
import { ref, watch } from 'vue'

export const useFinishEarly = createGlobalState(() => {
  const signal = ref<boolean>(false)

  function emit(): void {
    signal.value = true
    setTimeout(() => {
      signal.value = false
    }, 100)
  }

  function listen(cb: () => void): void {
    watch(signal, (newVal) => {
      if (newVal) {
        cb()
      }
    }, { flush: 'sync' })
  }

  return {
    emit,
    listen,
  }
})
