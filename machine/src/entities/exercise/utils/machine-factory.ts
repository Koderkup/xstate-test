import { assign, emit, enqueueActions, setup } from 'xstate'

import type { ProgressStepIdExact } from '@/entities/progress/@x/exercise'
import type { SchemeMainIdExact, SchemeModalIdExact } from '@/entities/scheme/@x/exercise'
import type { ExerciseTaskIdExact } from '@/entities/task/@x/exercise'
import { useConfigs } from '@/shared/lib'

import type { SchemeIndicatorIdExact } from '../types/scheme-indicator'
import type { SchemeStateExact } from '../types/scheme-state'
import type { SchemeIndicatorState } from '../types/scheme-state'
import type { SchemeTriggerEventExact, SchemeTriggerExact } from '../types/scheme-trigger'

export const machineFactory = setup({
  types: {
    /*
    * state - состояния элементов
    * triggers - триггеры
    * taskId - id задачи
    * permittedActions - хранит шаги которые можно запретить/разрешить в какое-то время
    */
    // TODO: написать про isOk, isCriticalError, aWaiting , bWaiting
    context: {} as {
      state: SchemeStateExact
      triggers: SchemeTriggerExact
      taskId: ExerciseTaskIdExact
      permittedActions: { [key: string]: boolean }
      isOk: boolean
      isCriticalError: boolean
      aWaiting: boolean
      bWaiting: boolean
    },

    events: {} as
    | { type: SchemeTriggerEventExact }
    | { type: 'start' }
    | { type: 'reset' }
    | { type: 'stop' }
    | { type: 'close' },

    emitted: {} as
    | { type: 'notification', message: string }
    | { type: 'stage', name: string }
    | { type: 'step', id: ProgressStepIdExact }
    | { type: 'penalty', title: string, message: string, penalty?: number }
    | { type: 'reset' }
    | { type: 'finish' }
    | { type: 'early-finish' }
    | { type: 'main', id: SchemeMainIdExact }
    | { type: 'modal', id?: SchemeModalIdExact, title?: string }
    | { type: 'status', status: string }
    | { type: 'history', message: string, score?: number, data?: Record<string, any> },
  },

  actions: {
    main: enqueueActions(({ enqueue }, params: {
      id: SchemeMainIdExact
    }) => {
      enqueue(emit({ type: 'main', id: params.id }))
    }),

    modal: enqueueActions(({ enqueue }, params: any) => {
      const [id, title] = Array.isArray(params) ? params : [params?.id, params?.title]
      enqueue(emit({ type: 'modal', id, title }))
    }),

    reset: enqueueActions(({ enqueue, context }) => {
      enqueue(emit({ type: 'reset' }))

      const configs = useConfigs()
      enqueue(assign({ state: _.cloneDeep(configs.get('state')[context.taskId]) }))
    }),

    finish: enqueueActions(({ enqueue }) => {
      enqueue(emit({ type: 'finish' }))
    }),

    earlyFinish: enqueueActions(({ enqueue }) => {
      enqueue(emit({ type: 'early-finish' }))
    }),

    notify: enqueueActions(({ enqueue }, params: {
      message: string
    }) => {
      enqueue(emit({ type: 'notification', message: params.message }))
    }),

    step: enqueueActions(({ enqueue }, params: {
      id: ProgressStepIdExact
    }) => {
      enqueue(emit({ type: 'step', id: params.id }))
    }),

    penalty: enqueueActions(({ enqueue }, params: {
      title: string
      message: string
      penalty?: number
    }) => {
      enqueue(emit({ type: 'penalty', title: params.title, message: params.message, penalty: params.penalty }))
    }),

    stage: enqueueActions(({ enqueue }, params: {
      name: string
    }) => {
      enqueue(emit({ type: 'stage', name: params.name }))
    }),

    change: enqueueActions(({ enqueue, context, event }, params: {
      id: SchemeIndicatorIdExact
      state:
        | SchemeIndicatorState
        | ((state: Required<SchemeIndicatorState>) => SchemeIndicatorState)
        | ((state: Required<SchemeIndicatorState>, event: any) => SchemeIndicatorState)
    }) => {
      const current = context.state[params.id] as any

      let resolved
      if (typeof params.state === 'function') {
        resolved = params.state.length > 1
          ? (params.state as any)(current, event)
          : (params.state as any)(current)
      }
      else {
        resolved = params.state
      }

      enqueue(assign({
        state: {
          ...context.state,
          [params.id]: _.merge({}, current, resolved),
        },
      }))
    }),

    copy: enqueueActions(({ enqueue, context }, params: {
      fromId: SchemeIndicatorIdExact
      toId: SchemeIndicatorIdExact
      mapper?: (src: SchemeIndicatorState) => Partial<SchemeIndicatorState>
    }) => {
      const from = context.state[params.fromId] as any
      if (!from) {
        return
      }

      const resolved = params.mapper ? params.mapper(from) : { text: from.text }

      const currentTo = context.state[params.toId] as any

      enqueue(assign({
        state: {
          ...context.state,
          [params.toId]: _.merge({}, currentTo, resolved),
        },
      }))
    }),

    status: enqueueActions(({ enqueue, context }, params: { id: SchemeIndicatorIdExact, status: string }) => {
      const current = context.state[params.id]

      if (!current) {
        return
      }

      enqueue(assign({
        state: {
          ...context.state,
          [params.id]: {
            ...current,
            status: params.status,
          },
        },
      }))
    }),

    allowActions: enqueueActions(({ enqueue, context }, params: {
      action: string
      allow: boolean
    }) => {
      enqueue(assign({
        permittedActions: {
          ...context.permittedActions,
          [params.action]: params.allow,
        },
      }))
    }),

    history: enqueueActions(({ enqueue }, params: {
      message: string
      data?: Record<string, any>
      score?: number
    }) => {
      enqueue(emit({
        type: 'history',
        message: params.message,
        data: params.data,
        score: params.score,
      }))
    }),
  },

  guards: {
    check: ({ context }, params: {
      id: SchemeIndicatorIdExact
      assert: SchemeIndicatorState | ((state: Required<SchemeIndicatorState>) => boolean)
    }) => {
      const current = context.state[params.id] as any

      return typeof params.assert === 'function'
        ? params.assert(current)
        : _.every(params.assert, (v, k) => v === current[k])
    },

    inputMatch: ({ event }, params: {
      expected?: string | number | [number, number]
      numeric?: boolean
    }) => {
      const v = (event as any)?.value
      const expected = (event as any)?.expected ?? params?.expected

      if (expected == null)
        return false

      const toNum = (x: any) => {
        const n = Number(String(x).replace(',', '.'))
        return Number.isFinite(n) ? n : Number.NaN
      }

      if (Array.isArray(expected)) {
        const num = toNum(v)
        return Number.isFinite(num) && num >= expected[0] && num <= expected[1]
      }

      if (typeof expected === 'number' || params?.numeric) {
        const num = toNum(v)
        return Number.isFinite(num) && num === (typeof expected === 'number' ? expected : toNum(expected))
      }

      return String(v).trim() === String(expected).trim()
    },

  },
})

/**
 * permittedActions - объект для хранения флагов действий, доступных в текущий момент.
 * Используется для:
 * 1. Динамического управления разрешенными действиями в ходе выполнения алгоритма
 * 2. Запрета определенных действий в зависимости от состояния
 *
 * Метод allowActions позволяет манипулировать состоянием
 */
export function createMachine(taskId: ExerciseTaskIdExact) {
  const configs = useConfigs()

  return machineFactory.createMachine({
    id: 'exercise',
    context: {
      taskId,
      state: _.cloneDeep(configs.get('state')[taskId]),
      permittedActions: {},
      triggers: configs.get('triggers'),
      isOk: true,
      isCriticalError: false,
      aWaiting: false,
      bWaiting: false,
    },
    initial: 'Начало упражнения',
    states: {
      'Начало упражнения': {
        on: {
          start: 'Выполнение упражнения',
        },
      },
      'Выполнение упражнения': {
        ...(() => {
          const config = configs.get('machine')[taskId]
          if (!config) {
            console.warn(`createMachine: MACHINE_CONFIG for task "${taskId}" is missing.`)
          }
          return config ?? {}
        })(),
        onDone: { target: 'Окончание упражнения' },
      },
      'Окончание упражнения': {
        entry: { type: 'finish' },
      },
    },
    on: {
      'reset': {
        target: '.Начало упражнения',
        reenter: true,
        actions: { type: 'reset' },
      },
      'early-finish': {
        onDone: { target: '#exercise.Окончание упражнения' },
        actions: { type: 'earlyFinish' },
      },
    },
  })
}
