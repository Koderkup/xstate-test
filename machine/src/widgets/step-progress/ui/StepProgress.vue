<script setup lang="ts">
import { useExerciseStore } from '@/entities/exercise'
import { useProgressStore } from '@/entities/progress'
import { UICard } from '@/shared/ui'
const progress = useProgressStore()

const steps = computed(() => progress.steps ?? [])
const passed = computed(() => progress.passed ?? {})

const percents = computed<number>(() => {
  const done = _.size(passed.value)
  const total = _.filter(steps.value, step => 'quiz' in step || !step.optional || passed.value[step.id]).length
  const res = done / total * 100
  return isNaN(res) ? 0 : res
})
const animated = usePrecision(useTransition(percents, { duration: 300 }), 0)

const exercise = useExerciseStore()
exercise.listen('step', event => progress.pass(event.id))
exercise.listen('reset', () => progress.reset())
</script>

<template>
<div class="wrapper">
  <img src="../../../../public/logo/logo.png" alt="Логотип компании" class="logo" />
  <UICard class="exercise-progress">
    <div class="progress">
      <div class="track" :style="{ width: `${percents}%` }"></div>
      <div class="label">
        <div>
          Прогресс прохождения:
        </div>
        <div>
          {{ `${animated}%` }}
        </div>
      </div>
    </div>
  </UICard>
</div>
</template>

<style scoped lang="scss">

.wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 40px;
  width: 124px;
  flex-shrink: 0;
}

.exercise-progress {
  flex: 1;
  position: relative;
  height: 40px;
  padding: 4px 4px;
  font-size: $text-md;

  .progress {
    position: relative;
    height: 100%;
  }

  .track {
    @include transition('width', $duration: 0.4s);
    border-radius: $radius-sm;
    background-color: $color-yellow;
    height: 100%;
  }

  .label {
    color: $color-black-darker;
    font-weight: 600;
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    white-space: nowrap;
    display: flex;
    gap: 4px;

    .percent {
      display: inline-block;
      width: 35px;
      text-align: right;
    }
  }
}

</style>
