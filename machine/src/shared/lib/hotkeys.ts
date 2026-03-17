export interface Hotkey {
  code: string
  handler: () => unknown
  stroke?: boolean
}

export function useHotkeys(target: MaybeRefOrGetter<EventTarget | undefined>, hotkeys: Hotkey[]): void {
  for (const { code, handler, stroke } of hotkeys) {
    const register = stroke ? onKeyStroke : onKeyUp
    register(e => e.code === code, handler, { target })
  }
}
