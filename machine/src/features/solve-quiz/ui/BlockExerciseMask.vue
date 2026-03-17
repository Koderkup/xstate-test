<script setup lang="ts">
import { useQuizStore } from '@/entities/quiz'
import { SolveQuizButton } from '@/features/solve-quiz'
import { UIDivider } from '@/shared/ui'

const quiz = useQuizStore()
</script>

<template>
  <div class="block-exercise-mask">
    <TransitionFade>
      <div v-if="!quiz.finished" class="mask">
        <div class="info">
          <div class="header">
            Необходимо пройти тестирование
          </div>

          <UIDivider axis="h" />

          <SolveQuizButton />
        </div>
      </div>
    </TransitionFade>
  </div>
</template>

<style scoped lang="scss">
.block-exercise-mask {
  display: flex;
  pointer-events: none;

  .mask {
    display: flex;
    flex: 1;
    background-color: rgba($color-gray-dark, 0.4);
    pointer-events: auto;

    .info {
      display: flex;
      position: relative;
      flex-direction: column;
      gap: 20px;
      margin: auto;
      padding: 30px;
      border-radius: $radius-md;
      background-color: $color-white;
      box-shadow: $shadow-md;

      .header {
        flex: 1;
        font-size: $text-lg;
        font-weight: bold;
      }
    }
  }
}
</style>
