<script setup lang="ts">
import type { SchemeComponent, SchemeIdExact } from '@/entities/scheme'
import { Scheme } from '@/entities/scheme'
import { useConfigs } from '@/shared/lib'

import { useRegisterHints } from '../lib/register-hints'
import { useRegisterIndicator } from '../lib/register-indicator'
import { useRegisterTrigger } from '../lib/register-trigger'

const props = defineProps<{
  id: SchemeIdExact
  component: SchemeComponent
}>()

const configs = useConfigs()

const schemeSvg = shallowRef<SVGElement>()
function schemeRef(el: Element | ComponentPublicInstance | null) {
  schemeSvg.value = unrefElement(el as any) as SVGElement
}

useRegisterHints(schemeSvg)

const triggers = _.filter(configs.get('triggers'), { scheme: props.id })
for (const trigger of triggers) {
  try {
    useRegisterTrigger(schemeSvg, trigger)
  }
  catch (e) {
    console.error(`Failed to register trigger ${trigger.id}:`, e)
  }
}

const indicators = _.filter(configs.get('indicators'), { scheme: props.id })
for (const indicator of indicators) {
  try {
    useRegisterIndicator(schemeSvg, indicator)
  }
  catch (e) {
    console.error(`Failed to register indicator ${indicator.id}:`, e)
  }
}
</script>

<template>
  <Scheme
    :ref="schemeRef"
    :component="props.component"
    class="scheme-canvas"
  />
</template>

<style scoped lang="scss">
.scheme-canvas {
  :deep(.trigger),
  :deep(.indicator) {
    transform-box: border-box;
    transform-origin: center;

    &,
    rect,
    text,
    path {
      @include transition('scale, rotate, filter, stroke, fill');
    }
  }

  :deep(.trigger) {
    cursor: pointer;
    pointer-events: all;

    &.effect {
      &-default {
        &:hover {
          scale: 1.05;
          filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.4));
        }

        &:active {
          scale: 0.95;
        }
      }

      &-button {
        &:hover {
          rect {
            stroke: $color-blue;
          }
        }

        &:active {
          rect {
            stroke: $color-black;
            fill: $color-black;
          }

          text {
            fill: $color-white;
          }
        }
      }
    }
  }
}
</style>
