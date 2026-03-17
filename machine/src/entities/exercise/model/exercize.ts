import { createBrowserInspector } from '@statelyai/inspect'
import { useMachine } from '@xstate/vue'
import type { Snapshot, Subscription } from 'xstate'

import { useHistoryStore } from '@/entities/history'
import type { ExerciseTaskIdExact } from '@/entities/task/@x/exercise'
import { useTaskStore } from '@/entities/task/@x/exercise'
import { useScorm12Store } from '@/features/scorm12/model/scorm12'
import { isLMS, useConfigs, useFlags, usePersister } from '@/shared/lib'

import type { ExerciseActor, ExerciseMachine } from '../types/exercise-machine'
import type { SchemeState } from '../types/scheme-state'
import type { SchemeTriggerEventExact } from '../types/scheme-trigger'
import { createMachine } from '../utils/machine-factory'

export const useExerciseStore = defineStore('exercise', () => {
  const configs = useConfigs()
  const flags = useFlags()
  const task = useTaskStore()

  const { inspect } = flags.get('debug')
    ? createBrowserInspector()
    : { inspect: undefined }

  // todo отдебажить для лмс
  const backup = usePersister<Snapshot<unknown>>('exercise:snapshot', {})
  const hasBackup = backup && Object.keys(backup.value ?? {}).length > 0
  const machineMap = toReactive(_.fromPairs(_.map(configs.get('tasks'), ({ id }) => {
    const isActive = id === task.id
    return [
      id,
      useMachine(
        createMachine(id),
        {
          id,
          inspect,
          // машина = бэкапу из хранилища, если он существует и актуален по выбранному алгоритму или  =undefined
          snapshot: isActive && hasBackup ? backup.value : undefined,
        },
      ),
    ]
  })) as Record<ExerciseTaskIdExact, ReturnType<typeof useMachine<ExerciseMachine>>>)

  // сохраняем состояние машины в хранилище(в бэкап)
  syncRefs(
    () => machineMap[task?.id]?.snapshot,
    backup,
  )

  const state = computed<SchemeState | null>(() => {
    if (!task.id) {
      console.warn('ExerciseStore: task.id is missing while computing state.')
      return {}
    }
    const machine = machineMap[task.id]
    if (!machine) {
      console.warn(`ExerciseStore: machine for task "${task.id}" not found in machineMap.`)
      return {}
    }
    return machine.snapshot.context.state ?? {}
  })

  const listen: ExerciseActor['on'] = (type, handler) => {
    const subscriptions: Subscription[] = _.compact(_.map(
      configs.get('tasks'),
      ({ id }) => machineMap[id]?.actorRef?.on(
        type,
        event => id === task.id && handler(event),
      ),
    ))

    return {
      unsubscribe: () => _.forEach(subscriptions, s => s.unsubscribe()),
    }
  }

  function can(event: SchemeTriggerEventExact): boolean {
    if (!task.id) {
      console.warn('ExerciseStore.can: task.id is missing.')
      return false
    }
    const machine = machineMap[task.id]
    if (!machine) {
      console.warn(`ExerciseStore.can: machine for task "${task.id}" not found.`)
      return false
    }
    return machine.snapshot.can({ type: event }) ?? false
  }

  function send(event: SchemeTriggerEventExact): void
  function send(event: 'start' | 'reset' | 'stop' | 'close' | 'early-finish'): void
  function send(event: { type: string, [key: string]: any }): void
  function send(event: any): void {
    if (!task.id) {
      console.warn('ExerciseStore.send: task.id is missing.')
      return
    }
    if (!machineMap[task.id]) {
      console.warn(`ExerciseStore.send: machine for task "${task.id}" not found.`)
      return
    }
    if (typeof event === 'string') {
      machineMap[task.id].actorRef.send({ type: event })
    }
    else {
      machineMap[task.id].actorRef.send(event)
    }
  }

  const finished = usePersister<boolean>('exercise:finished', false)
  // const raw = usePersister<string>('raw')
  const history = useHistoryStore()
  listen('finish', () => {
    if (finished.value === true)
      return
    if (isLMS) {
      useScorm12Store().setStatus('completed')
    }
    finished.value = true
  })
  listen('early-finish', () => {
    if (isLMS) {
      useScorm12Store().setStatus('failed')
    }
    if (history.points !== undefined) {
      history.points = 0
    }
    finished.value = true
  })
  listen('reset', () => finished.value = false)
  return {
    state: readonly(state),
    finished: readonly(finished),

    backup,

    listen,
    can,
    send,
  }
})
