<script setup lang="ts">
import type { Slot } from 'vue'

const props = defineProps<{
  full?: boolean
}>()

defineSlots<{
  default: Slot
}>()
</script>

<template>
  <div class="ui-card" :class="{ full: props.full }">
    <slot name="default" />
  </div>
</template>

<style scoped lang="scss">
.ui-card {
  //@include border;
  padding: 10px;
  overflow: hidden;
  border-radius: $radius-md;
  background-color: $color-white;

  &.full {
    border-radius: $radius-md;
    padding: 0;
  }
}
</style>
