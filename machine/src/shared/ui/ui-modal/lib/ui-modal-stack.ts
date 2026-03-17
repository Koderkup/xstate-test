import { v4 } from 'uuid'

const useUIModalStackState = createGlobalState(() => {
  const stack = shallowRef<Record<string, number>>({})

  const count = computed<number>(() => _.size(stack.value))

  function pop(id: string): void {
    const index = stack.value[id]
    if (_.isNil(index))
      return

    stack.value = _.mapValues(
      _.omit(stack.value, id),
      v => v >= index ? v - 1 : v,
    )
  }

  function push(id: string): void {
    pop(id)
    stack.value = { ...stack.value, [id]: count.value }
  }

  return {
    stack: readonly(stack),
    count: readonly(count),
    push,
    pop,
  }
})

export function useUIModalStack() {
  const id = ref<string>(v4())

  const stack = toReactive(useUIModalStackState())

  const index = computed<number>(() => stack.stack[id.value] ?? -1)
  const last = computed<boolean>(() => index.value === stack.count - 1)

  function push(): void {
    stack.push(id.value)
  }

  function pop(): void {
    stack.pop(id.value)
  }

  return {
    index,
    last,

    push,
    pop,
  }
}
