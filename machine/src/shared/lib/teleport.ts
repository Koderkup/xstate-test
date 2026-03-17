import type { RendererElement } from '@vue/runtime-core'

export const useTeleport = createGlobalState(() => {
  const root = shallowRef<string | RendererElement>('body')

  return {
    root,
  }
})
