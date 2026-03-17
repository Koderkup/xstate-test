<script setup lang="ts">
import { DownloadReportButton } from '@/features/download-report'
import { OpenManualButton } from '@/features/open-manual'
import { OpenTaskButton } from '@/features/open-task'
import { FinishExerciseButton } from '@/features/finish-exercise'
import { RestartExerciseButton } from '@/features/restart-exercise'
import { SelectTaskButton } from '@/features/select-task'
import { SolveQuizButton } from '@/features/solve-quiz'

const props = defineProps<{
  mini: boolean
}>()
</script>

<template>
  <div class="exercise-control">
<!--    <SolveQuizButton :mini="props.mini" />-->
<!--    <SelectTaskButton :mini="props.mini" />-->
    <OpenTaskButton :mini="props.mini" />
    <FinishExerciseButton :mini="props.mini" />
<!--    <RestartExerciseButton :mini="props.mini" />-->
<!--    <OpenManualButton :mini="props.mini" />-->
<!--    <DownloadReportButton :mini="props.mini" />-->

<!--    <RestartExerciseButton :mini="props.mini" />-->
<!--    <OpenManualButton :mini="props.mini" />-->
<!--    <DownloadReportButton :mini="props.mini" />-->
  </div>
</template>

<style scoped lang="scss">
.exercise-control {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
