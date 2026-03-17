<script setup lang="ts">
import type { UIDividerAxis } from './types/ui-divider-axis'

const props = defineProps<{
  axis: UIDividerAxis
}>()
</script>

<template>
  <div class="ui-separator" :class="`axis-${props.axis}`" />
</template>

<style scoped lang="scss">
.ui-separator {
  background-color: $color-gray-lighter;

  &.axis {

    &-h {
      width: 100%;
      height: 1px;
    }

    &-v {
      width: 1px;
      height: 100%;
    }
  }
}
</style>
