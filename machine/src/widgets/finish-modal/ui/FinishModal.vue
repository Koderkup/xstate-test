<script setup lang="ts">
import { useExerciseStore } from '@/entities/exercise'
import { useHistoryStore } from '@/entities/history'
import { useTeleport } from '@/shared/lib'
import { UIModal } from '@/shared/ui'

import { useConfetti } from '../lib/confetti'

const showed = defineModel<boolean>('showed', { required: true })

const history = useHistoryStore()

const exercise = useExerciseStore()
whenever(toRef(exercise, 'finished'), () => {
  showed.value = true
})

const { root } = useTeleport()
const canvasRef = shallowRef<HTMLCanvasElement>()
const { show } = useConfetti(canvasRef)

whenever(showed, () => setTimeout(show, 150), { immediate: true })
watch(showed, () => {
  if (showed.value === true) {
    exercise.send({ type: 'finish' })
    // сбросить задачу
    // emit()
    // if (isLMS) {
    // todo reload ?
    // window.location.reload()
    // let iframe = window.parent.document.getElementById("scorm_object")
    // let src = iframe?.src
    // if (!iframe || !src) return
    // iframe.src = src;
    // useScorm12Store().setInit()
    // useScorm12Store().resetAllData()
    // }
  }
})
</script>

<template>
  <UIModal
    v-if="showed"
    v-model:showed="showed"
    title="Задание завершено"
    :is-close="Boolean(false)"
  >
    <template #body>
      <p class="subtitle">
        Для новой попытки выйдите и начните задание заново.
      </p>
      <p class="subtitle-main">
        Вы набрали {{ history.resultMark?.toFixed(0) }} из 100 баллов
      </p>
    </template>
  </UIModal>

  <teleport :to="root">
    <canvas ref="canvasRef" class="confetti" />
  </teleport>
</template>

<style lang="scss" scoped>
.confetti {
  position: fixed;
  inset: 0;
  z-index: 25;
  pointer-events: none;
}
.subtitle {
  color: $color-gray-dark;
  line-height: 1;
  //text-align: center;
}
.subtitle-main {
  color: black;
  line-height: 2;
  text-align: center;
  padding: 15px 0;
}
</style>
