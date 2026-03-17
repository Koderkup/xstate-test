<script setup lang="ts">
import { useHistoryStore } from '@/entities/history'
import {UIIcon} from "@/shared/ui";

const props = defineProps<{
  mini: boolean
}>()

const history = useHistoryStore()
</script>

<template>
  <div class="exercise-score" :class="{ mini: props.mini }">
    <UIIcon :name="'trophy'" class="icon" />
    <span class="label">
      {{ props.mini ? 'Баллы:' : 'Набранные баллы:' }}
    </span>

    <span class="score">
      <span class="points">{{ history.resultMark?.toFixed(0) }}</span> из 100
    </span>
  </div>
</template>

<style scoped lang="scss">
.exercise-score {
  display: flex;
  gap: 10px;
  font-weight: 600;
  color: $color-white;


  .label {
    color: $color-white;
    text-wrap: nowrap;
  }

  .score {
    margin-left: auto;
    color: $color-gray;
    text-wrap: nowrap;

    .points {
      color: $color-white;
    }
  }

  &.mini {
    color: $color-gray-dark;
    font-weight: bold;

    .label {
      color: $color-white;
    }
    .score {
      margin-left: auto;
      color: $color-gray-dark;

      .points {
        color: $color-white;
      }
    }

    .icon{
      color: $color-white;
      scale: 1.3;
    }
  }
}
</style>
