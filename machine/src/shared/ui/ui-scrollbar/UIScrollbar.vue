<script setup lang="ts">
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import type { ComponentProps } from 'vue-component-type-helpers'

const props = defineProps<{
  axis: 'x' | 'y'
  outside?: boolean
}>()

defineSlots<{
  default: Slot
}>()

const options: ComponentProps<typeof OverlayScrollbarsComponent>['options'] = {
  overflow: {
    x: props.axis === 'x' ? 'scroll' : 'visible',
    y: props.axis === 'y' ? 'scroll' : 'visible',
  },
  scrollbars: {
    autoHide: 'leave',
    autoHideDelay: 300,
    autoHideSuspend: false,
  },
}
</script>

<template>
  <OverlayScrollbarsComponent
    class="ui-scrollbar"
    :class="[`axis-${props.axis}`, { outside: props.outside }]"
    :options
    defer
  >
    <slot name="default" />
  </OverlayScrollbarsComponent>
</template>

<style scoped lang="scss">
.ui-scrollbar {
  overflow: hidden;

  :deep(.os-scrollbar) {
    --os-handle-bg: #{$color-gray-lighter};
    --os-handle-bg-hover: #{$color-gray-light};
    --os-handle-bg-active: #{$color-gray};
  }

  &.outside {
    &.axis {
      $offset: 10px;

      &-x {
        margin-bottom: -$offset;
        padding-bottom: $offset;
      }

      &-y {
        margin-right: -$offset;
        padding-right: $offset;
      }
    }
  }
}
</style>
