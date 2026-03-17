<script setup lang="ts">
import { useExerciseStore } from '@/entities/exercise'
import { useSchemeStore } from '@/entities/scheme'
import { BlockExerciseMask } from '@/features/solve-quiz'
import { UICard } from '@/shared/ui'

import SchemeMain from './SchemeMain.vue'
import SchemeModal from './SchemeModal.vue'

const scheme = useSchemeStore()
const exercise = useExerciseStore()
exercise.listen('reset', () => scheme.reset())
</script>

<template>
  <div class="exercise-scheme">
<!--    <BlockExerciseMask class="mask" />-->

    <SchemeMain class="main" />

    <SchemeModal />
  </div>
</template>

<style scoped lang="scss">
.exercise-scheme {
  display: flex;
  position: relative;
  isolation: isolate;
    border-radius: 5px;
    overflow: hidden;


  .mask {
    position: absolute;
    z-index: 10;
    inset: 0;
  }

  .main {
    flex: 1;
    width: 0;
  }
}
</style>
