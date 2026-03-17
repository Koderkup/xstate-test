<script setup lang="ts">
import Zoomist from 'zoomist'

import { useHotkeys, useTeleport } from '@/shared/lib'
import { UIButton, UIIcon } from '@/shared/ui'

import type { UIZoomScale, UIZoomTransform } from './types/ui-zoom-options'

const scale = defineModel<UIZoomScale>('scale', { required: true })
const transform = defineModel<UIZoomTransform>('transform', { required: true })

defineSlots<{
  default: Slot
}>()

const ZOOM_RATIO = 0.1
const MOVE_DELTA = 30

const inRef = shallowRef<ComponentPublicInstance>()
const outRef = shallowRef<ComponentPublicInstance>()
const resetRef = shallowRef<ComponentPublicInstance>()
const viewRef = shallowRef<HTMLElement>()

const zoomist = shallowRef<Zoomist>()

const { ignoreUpdates: ignoreScaleUpdates } = watchIgnorable(scale, () => zoomist.value?.zoomTo(scale.value))
const { ignoreUpdates: ignoreTransformUpdates } = watchIgnorable(transform, () => zoomist.value?.moveTo(transform.value))

onMounted(async () => {
  await nextTick()
  zoomist.value = new Zoomist(viewRef.value!, {
    zoomRatio: ZOOM_RATIO,
    zoomer: {
      el: null,
      inEl: inRef.value!.$el,
      outEl: outRef.value!.$el,
      resetEl: resetRef.value!.$el,
      disabledClass: null,
    },
    on: {
      zoom: (i, s) => ignoreScaleUpdates(() => scale.value = s),
      drag: (i, t) => ignoreTransformUpdates(() => transform.value = t),
      reset: () => {
        ignoreScaleUpdates(() => scale.value = 1)
        ignoreTransformUpdates(() => transform.value = { x: 0, y: 0 })
      },
    },
  })

  if (scale.value) {
    zoomist.value!.zoomTo(scale.value)
  }
  if (transform.value) {
    zoomist.value!.moveTo(transform.value)
  }
})

const rootRef = shallowRef<HTMLElement>()
const { isFullscreen, toggle, exit } = useFullscreen(rootRef)
const { root } = useTeleport()
watch(isFullscreen, v => root.value = v ? rootRef.value! : 'body')

const activeElement = useActiveElement()
function onClick(): void {
  if (!rootRef.value || rootRef.value.contains(activeElement.value ?? null))
    return
  rootRef.value.focus()
}

useHotkeys(rootRef, [
  {
    code: 'KeyR',
    handler: () => zoomist.value?.reset(),
  },
  {
    code: 'Equal',
    handler: () => zoomist.value?.zoom(ZOOM_RATIO),
    stroke: true,
  },
  {
    code: 'Minus',
    handler: () => zoomist.value?.zoom(-ZOOM_RATIO),
    stroke: true,
  },
  {
    code: 'ArrowUp',
    handler: () => zoomist.value?.move({ x: 0, y: MOVE_DELTA }),
    stroke: true,
  },
  {
    code: 'ArrowDown',
    handler: () => zoomist.value?.move({ x: 0, y: -MOVE_DELTA }),
    stroke: true,
  },
  {
    code: 'ArrowLeft',
    handler: () => zoomist.value?.move({ x: MOVE_DELTA, y: 0 }),
    stroke: true,
  },
  {
    code: 'ArrowRight',
    handler: () => zoomist.value?.move({ x: -MOVE_DELTA, y: 0 }),
    stroke: true,
  },
  {
    code: 'Escape',
    handler: exit,
  },
  {
    code: 'KeyF',
    handler: toggle,
  },
])
</script>

<template>
  <div
    ref="rootRef"
    class="ui-zoom"
    :class="{ fullscreen: isFullscreen }"
    tabindex="0"
    @click="onClick"
  >
      <div class="controls-anchor">
          <div class="controls">
              <UIButton ref="inRef" tooltip="Приблизить [+]">
                  <UIIcon name="increase" :size="1.3" />
              </UIButton>

              <UIButton ref="outRef" tooltip="Отдалить [-]">
                  <UIIcon name="decrease" :size="1.3" />
              </UIButton>

              <UIButton ref="resetRef" tooltip="Сбросить зум [R]">
                  <UIIcon name="not-change" :size="1.3" />
              </UIButton>

              <UIButton :tooltip="isFullscreen ? 'Свернуть [Esc, F]' : 'На весь экран [F]'" @click="toggle">
                  <UIIcon :name="isFullscreen ? 'fs-exit' : 'full-screen'" :size="1.3" />
              </UIButton>
          </div>
      </div>

    <div ref="viewRef" class="zoomist-container">
      <div class="zoomist-wrapper">
        <div class="zoomist-image">
          <slot name="default" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ui-zoom {
  display: flex;
  outline: none;
  background-color: $color-white;
  gap: 10px;
  isolation: isolate;

  .zoomist-container {
    --zoomist-wrapper-bg-color: transparent;
    flex: 1;
    width: 0;
    cursor: grab;

    .zoomist-wrapper {
      @include size(100%);

      .zoomist-image {
        @include size(100%);
      }
    }

    &:active {
      cursor: grabbing;
    }
  }

  &.fullscreen {
    padding: 10px;
  }
}

.controls-anchor {
    position: absolute;
    width: 0;
    height: 0;
    z-index: 1000;
    top: 10px;
    left: 10px;
}

.controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: max-content;
    height: max-content;
}
</style>
