<script setup lang="ts">
import { useExerciseStore } from '@/entities/exercise'
import type { SchemeMainIdExact, SchemeMainOptions } from '@/entities/scheme'
import { useSchemeStore } from '@/entities/scheme'
import { useTaskStore } from '@/entities/task'
import { useRestartExercise } from '@/features/restart-exercise'
import { useConfigs, usePersister } from '@/shared/lib'
import type { UIZoomScale, UIZoomTransform } from '@/shared/ui'
import { UIZoom } from '@/shared/ui'

import SchemeCanvas from './SchemeCanvas.vue'

const configs = useConfigs()
const scheme = useSchemeStore()
const exercise = useExerciseStore()
const task = useTaskStore()

const main = computed<SchemeMainIdExact | undefined>(() => {
  if (task.id === 'hydraulic-test') {
    return 'Гидравлическая'
  }
  const m = scheme.main ?? _.findKey(configs.get('schemes'), { type: 'main' })
  if (!m) {
    console.warn('Main scheme not found in SCHEMES_CONFIG or store.')
  }
  return m as SchemeMainIdExact | undefined
})
const options = computed<SchemeMainOptions | undefined>(() => {
  if (!main.value)
    return undefined
  const opt = (configs.get('schemes') as any)[main.value]
  if (!opt) {
    console.warn(`Options for main scheme "${main.value}" not found in SCHEMES_CONFIG.`)
  }
  return opt
})

exercise.listen('main', event => scheme.set(event.id))

const scale = usePersister<UIZoomScale>('scheme-viewport:scale', 1)
const transform = usePersister<UIZoomTransform>('scheme-viewport:transform', { x: 0, y: 0 })

function reset(): void {
  scale.value = 0
  transform.value = { x: 0, y: 0 }
}

watch(main, reset)

const restart = useRestartExercise()
restart.listen(reset)

watch(toRef(task, 'id'), reset)
</script>

<template>
  <div class="scheme-viewport">
    <TransitionFade :duration="200">
      <UIZoom
        v-if="main && options"
        v-model:scale="scale"
        v-model:transform="transform"
        class="zoom"
      >
        <TransitionFade :duration="200" mode="out-in">
          <SchemeCanvas
            :id="main"
            :key="main"
            :component="options.component"
            class="scheme"
            :class="{ finished: exercise.finished }"
          />
        </TransitionFade>
      </UIZoom>
    </TransitionFade>
  </div>
</template>

<style scoped lang="scss">
.scheme-viewport {
  display: flex;

  .zoom {
    flex: 1;
    width: 0;

    .scheme {
      @include size(100%);
      transform: scale3d(1, 1, 1);

      &.finished {
        * {
          pointer-events: none;
        }
      }
    }
  }
}
</style>
