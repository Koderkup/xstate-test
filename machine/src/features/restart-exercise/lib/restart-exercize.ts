export const useRestartExercise = createGlobalState(() => {
  const signal = ref<boolean>(false)

  function emit(): void {
    signal.value = true
    signal.value = false
  }

  function listen(cb: () => void): void {
    watch(signal, () => cb(), { flush: 'sync' })
  }

  return {
    emit,
    listen,
  }
})
