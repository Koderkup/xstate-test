import { confetti, type ConfettiOptions } from '@tsparticles/confetti'

import { useHistoryStore } from '@/entities/history'
import { useFlags } from '@/shared/lib'

const THRESHOLD = 80

const DEFAULTS: ConfettiOptions = {
  spread: 500,
  ticks: 100,
  gravity: 0.5,
  decay: 0.97,
  startVelocity: 20,
}

export function useConfetti(canvas: MaybeRefOrGetter<HTMLCanvasElement | undefined>) {
  const instance = asyncComputed(() => toValue(canvas) && confetti.create(toValue(canvas)!, {}))

  const flags = useFlags()
  const history = useHistoryStore()

  function show() {
    if (!flags.get('animate'))
      return
    if (history.points < THRESHOLD)
      return
    const ratio = (history.points - THRESHOLD) / (100 - THRESHOLD)
    instance.value!({ ...DEFAULTS, particleCount: 150 * ratio, scalar: 0.3 })
    instance.value!({ ...DEFAULTS, particleCount: 100 * ratio, scalar: 0.7 })
    instance.value!({ ...DEFAULTS, particleCount: 50 * ratio, scalar: 1.1 })
  }

  return {
    show,
  }
}
