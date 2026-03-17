import { usePersister } from '@/shared/lib'

import type { HistoryEvent } from '../types/history-event'
import { MAX_RAW } from '@/features/scorm12/model/scorm12'

export const useHistoryStore = defineStore('history', () => {
  const events = usePersister<HistoryEvent[]>('history:events', [])
  const generator = usePersister<number>('history:generator', 0)

  const points = usePersister<number>('raw')

  const resultMark = computed(() => {
    if (points.value === undefined) {
      return 100
    }

    return +points.value
  })
  // const points = computed<number>(() => 100 + _.sumBy(events.value, 'score'))

  function push(event: Omit<HistoryEvent, 'id'>): void {
    events.value = [
      { ...event, id: generator.value++ } as HistoryEvent,
      ...events.value,
    ]
    const score = Number(events.value[0]?.score ?? 0)
    if (score === 0) return
    points.value = Number(points.value) + score;// /1000
  }

  function reset(): void {
    events.value = []
    generator.value = 0
    points.value = +MAX_RAW
  }

  return {
    events: readonly(events),
    points,
    resultMark,
    push,
    reset,
  }
})
