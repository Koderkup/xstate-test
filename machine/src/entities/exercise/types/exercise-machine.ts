import type { Actor } from 'xstate'

import type { createMachine, machineFactory } from '../utils/machine-factory'

export type ExerciseMachineConfig = Partial<Parameters<(typeof machineFactory)['createMachine']>[0]>

export type ExerciseMachine = ReturnType<typeof createMachine>

export type ExerciseActor = Actor<ExerciseMachine>
