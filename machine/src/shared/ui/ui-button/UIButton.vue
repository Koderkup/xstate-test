<script setup lang="ts">
import { useTeleport } from '@/shared/lib'

import type { UIButtonType } from './types/ui-button-type'
import {Scheme} from "@/entities/scheme";

const props = withDefaults(defineProps<{
  type?: UIButtonType
  tooltip?: string
  active?: boolean
  disabled?: boolean
}>(), {
  type: 'solid',
})

const emits = defineEmits<{
  click: []
}>()

defineSlots<{
  default: Slot
}>()

const { root } = useTeleport()
</script>

<template>
  <button
    v-tooltip="{
      content: props.tooltip,
      container: root,
    }"
    type="button"
    class="ui-button"
    :disabled="props.disabled"
    :class="[`type-${props.type}`, { active: props.active }]"
    @click.stop="emits('click')"
  >
    <TransitionFade :duration="{ leave: 100, enter: 200 }" mode="out-in">
      <slot name="default" />
    </TransitionFade>
  </button>
</template>

<style scoped lang="scss">
.ui-button {
  @include transition('background-color, color, border');
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  border-radius: $radius-md;
  outline: none;
  font-size: $text-md;
  text-wrap: nowrap;
  font-weight: 600;

  &:not(.active) {
    cursor: pointer;
  }

  &.type {
    &-solid {
      text-wrap: wrap;

      &:disabled {
        background-color: $color-gray-light;
        color: $color-gray-dark;
        cursor: not-allowed;
      }

      &:not(:disabled) {
        background-color: $color-gray-lighter;
        //border: 1px solid $color-white;
        @include border-white();
        color: $color-white;

        &:hover {
          background-color: $color-blue-darker;
        }

        &.active,
        &:active {
          background-color: $color-blue-lighter;
          //border: 1px solid $color-gray-lighter;
          //color: $color-gray-lighter;
        }
      }
    }

    &-ghost {
      //scale: 1.2;
      &:not(:disabled) {
        background-color: transparent;

        &:hover {
          color: $color-gray;
          // color: $color-black-darker;
        }

        &:active {
          background-color: $color-gray-light;
        }
      }
    }

    &-sidebar {
      word-break: break-word;
      white-space: normal;
      width: 100%;
      &:not(:disabled) {
        color: $color-gray-lighter;
        background-color: transparent;
        @include border();

        &:hover {
          color: $color-white;
          background-color: $color-blue-darker;
        }

        &:active {
          background-color: $color-blue-lighter;
          color: $color-white;
        }
      }

      &:disabled {
        background-color: $color-gray-light;
        color: $color-gray-dark;
        cursor: not-allowed;
      }
    }

    &-collapsed {
      scale: 1.17;

      &:not(:disabled) {
        color: $color-white;
        background-color: transparent;

        &:hover {
          background-color: $color-blue-darker;
        }

        &:active {
          background-color: $color-blue-lighter;
        }
      }
    }
  }
}

</style>
