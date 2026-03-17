<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { useExerciseStore } from '@/entities/exercise'
import { useTaskStore } from '@/entities/task'
import { FinishExerciseModal, useFinishEarly } from '@/features/finish-exercise'
import { OpenTaskModal } from '@/features/open-task'
import { useRestartExercise } from '@/features/restart-exercise'
import { useScorm12Store } from '@/features/scorm12/model/scorm12'
import { SelectTaskModal, useSelectTaskModalStore } from '@/features/select-task'
import { SolveQuizModal } from '@/features/solve-quiz'
import { TriggerElementModal } from '@/features/trigger-element'
import { isLMS, useFlags, usePersister } from '@/shared/lib'
import { useConfigs } from '@/shared/lib'
import { UISidebar } from '@/shared/ui'
import UISidebarLeft from '@/shared/ui/ui-sidebar-left/UISidebarLeft.vue'
import { ExerciseControl } from '@/widgets/exercise-control'
import { ExerciseScheme } from '@/widgets/exercise-scheme'
import { ExerciseToaster } from '@/widgets/exercise-toaster'
import { FinishModal } from '@/widgets/finish-modal'
import { HistoryLog } from '@/widgets/history-log'
import { HistoryScore } from '@/widgets/history-score'
import { StepNavigation } from '@/widgets/step-navigation'
import { StepProgress } from '@/widgets/step-progress'
import { OperatorTriggers } from '@/widgets/virtual-triggers-log'

const configs = useConfigs()
const hasOperatorTriggers = computed(() =>
  configs.get('triggers').some(t => t.effect === 'sidebar-button'),
)

const flags = useFlags()
const selectTaskModalStore = useSelectTaskModalStore()
// const taskId = usePersister<string|null>('task:id', null)
const isFirstLaunch = ref(true)

const showed = usePersister<boolean>('finish-modal:showed', false)

const taskStore = useTaskStore()
const taskId = computed({
  get: () => taskStore.id,
  set: val => taskStore.select(val),
})

// условия для переключения на "новую попытку"(начать заново)
// 1 в ЛМС
// - закончили прохождение алгоритама(в том числе досрочно)
// - перезашли в курс заново - заново инициализируем сессию с лмс, сброс данных(так как новая попытка)
// 2 В браузере
// - закончили прохождение алгоритама(в том числе досрочно)
// - перезапистили страницу - сбрасываем данные
onBeforeMount(() => {
  if (!isLMS) {
    // начать попытку заново для браузера
    const finished = usePersister<boolean>('exercise:finished', false)
    if (finished.value === true) {
      const exercise = useExerciseStore()
      const { emit } = useRestartExercise()
      taskId.value = null
      finished.value = false
      showed.value = false
      emit()
      exercise.send('reset')
    }
    return
  }
  useScorm12Store().setInit()
  useScorm12Store().setData()
})

onMounted(() => {
  const hasSelectedTask = taskId.value

  if (isFirstLaunch.value && !hasSelectedTask) {
    selectTaskModalStore.open()
    isFirstLaunch.value = false
  }
})

// todo добавила ключи 'history-sidebar' - сайдбар для истории, 'actions-sidebar'- сайдбар для действий оператора
const historyCollapsed = usePersister<boolean>('history-sidebar:collapsed', false)
const actionsCollapsed = usePersister<boolean>('actions-sidebar:collapsed', false)
if (actionsCollapsed.value === null || actionsCollapsed.value === undefined) {
  actionsCollapsed.value = false
}
const { listen } = useFinishEarly()
listen(() => {
  taskId.value = null
  selectTaskModalStore.open()
})

useStyleTag(computed(() => flags.get('animate') ? '' : '* { transition: none !important; }'))
</script>

<template>
  <div class="app">
    <SolveQuizModal />
    <SelectTaskModal />
    <OpenTaskModal />
    <TriggerElementModal />
    <FinishModal v-model:showed="showed" />
    <FinishExerciseModal />
    <ExerciseToaster />

    <div class="exercise">
      <StepProgress />

      <div class="wrap">
        <UISidebarLeft
          v-if="hasOperatorTriggers"
          v-model:collapsed="actionsCollapsed"
          class="operator-sidebar"
          title="Действия по установке"
          icon="params"
          theme="light"
          collapse-direction="left"
        >
          <template #default>
            <OperatorTriggers :mini="actionsCollapsed" />
          </template>
        </UISidebarLeft>

        <ExerciseScheme class="scheme" />
      </div>

      <StepNavigation />
    </div>

    <UISidebar
      v-model:collapsed="historyCollapsed"
      class="overview"
      title="История"
      icon="clock"
      theme="dark"
      collapse-direction="right"
    >
      <template #default>
        <HistoryLog class="history" />
      </template>

      <template #footer>
        <HistoryScore :mini="historyCollapsed" />
      </template>

      <template #actions>
        <ExerciseControl :mini="historyCollapsed" />
      </template>
    </UISidebar>
  </div>
</template>

<style scoped lang="scss">
.app {
  @include size(100%);
  display: flex;
  gap: 10px;
  padding: 10px;
  overflow: hidden;
  background-color: $color-gray-lighter;

  .exercise {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 0;
    gap: 10px;

    .wrap {
      display: flex;
      flex: 1;
      gap: 10px;
      height: 0;

      .collapsed-label {
        font-weight: 800;
        color: $color-gray-lighter;
        white-space: nowrap;
      }

      :deep(.ui-sidebar) {
        gap: 0;

        &.collapsed {
          //width: 34px;
          .main-header {
            .header {
              justify-content: center;
            }
          }

          &:hover {
            .main-header .header,
            .main .vertical {
              background-color: $color-gray-light;
            }
          }

          &:active {
            .main-header .header,
            .main .vertical {
              background-color: $color-gray-light;
            }
          }
        }
      }

      .operator-sidebar {
        background-color: $color-white;
        border-radius: $radius-md;

        :deep(.main .ui-separator) {
          display: none;
        }
        :deep(.main) {
          .content {
            .body {
              display: block;
            }
          }
        }
        :deep(.ui-button.type-collapsed) {
          &:hover {
            background-color: $color-gray-light;
          }
          &:active {
            background-color: $color-gray-light;
          }
        }

        :deep(.main-header) {
          .header {
            padding: 10px;
            background-color: $color-white;

            .title {
              color: $color-gray-lighter;
            }

            .icon {
              color: $color-gray-lighter !important;
              //transform: scaleX(-1)
            }
          }
        }

        :deep(.vertical) {
          background-color: $color-white;
          color: $color-gray-lighter;

          .title {
            display: flex;
            flex-direction: row-reverse;
            height: 100%;
            justify-content: space-between;
            font-weight: 700;

            & svg {
              scale: 1.1;
              rotate: 90deg;
            }
          }

          .footer {
            display: none;
          }
        }

        :deep(.main-footer) {
          display: none;
        }
      }

      .scheme {
        flex: 1;
      }
    }
  }

  .overview {
    .history {
      flex: 1;
    }

    :deep(.vertical) {
      border-radius: 0;
    }
  }
}
</style>
