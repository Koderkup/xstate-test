<script setup lang="ts">
import { not } from '@vueuse/math'
import interact from 'interactjs'

import { useHotkeys, useTeleport } from '@/shared/lib'
import { UIButton, UIDivider, UIIcon } from '@/shared/ui'

import { useUIModalStack } from './lib/ui-modal-stack'
import type { UIModalOffset } from './types/ui-modal-options'

const showed = defineModel<boolean>('showed', { required: true })
const offset = defineModel<UIModalOffset>('offset', { default: () => ({ x: 0, y: 0 }) })

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  size?: number
  autoSize?: boolean
  layout?: 'center' | 'stretch'
  draggable?: boolean
  force?: boolean
  isClose?: boolean
}>(), {
  autoSize: false,
  layout: 'center',
  force: false,
  isClose: true,
})

const slots = defineSlots<{
  body?: Slot
  footer?: Slot
}>()

const modalRef = shallowRef<HTMLElement>()
const activeElement = useActiveElement()
whenever(showed, async () => {
  await nextTick()
  if (!modalRef.value || modalRef.value.contains(activeElement.value ?? null))
    return
  modalRef.value.focus()
})

const footerRef = shallowRef<HTMLElement>()

const { root } = useTeleport()

const stack = toReactive(useUIModalStack())
const index = computed<number>(() => stack.last ? stack.index + 1 : stack.index)
whenever(showed, stack.push, { immediate: true })
whenever(not(showed), stack.pop)

whenever(not(showed), () => offset.value = { x: 0, y: 0 })

const headerRef = shallowRef<HTMLElement>()
whenever(headerRef, (el) => {
  if (!props.draggable)
    return

  interact(el).draggable({
    listeners: {
      move: ({ dx, dy }) => offset.value = { x: offset.value.x + dx, y: offset.value.y + dy },
    },
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: document.body,
        offset: { top: 10, right: 10, bottom: 10, left: 10 },
      }),
    ],
  })
})

useHotkeys(modalRef, [
  {
    code: 'Escape',
    handler: () => {
      if (!props.isClose) return
      if (!props.force) {
        showed.value = false
      }
    },
  },
])

const clickOnCanvas = () => {
  if (props.isClose) {
    showed.value = false
  }
  return !props.force
}
</script>

<template>
  <Teleport :to="root">
    <TransitionFade :duration="200">
      <div v-if="stack.last && showed" class="ui-mask" :style="{ zIndex: 29 + index }" @click="clickOnCanvas()" />
    </TransitionFade>

    <TransitionScale :scale="0.95" :duration="{ leave: 150, enter: 300 }">
      <div v-if="showed" class="ui-modal-wrapper" :style="{ zIndex: 30 + index }">
        <div
          ref="modalRef"
          class="ui-modal"
          :class="`size-${props.size}`"
          :style="{
            translate: `${offset.x}px ${offset.y}px`,
            ...(props.autoSize ? { width: 'auto', maxWidth: `${props.size ?? 600}px` } : props.size ? { width: `${props.size}px` } : { maxWidth: `${props.size ?? 400}px` }),
          }"
          tabindex="0"
        >
          <div ref="headerRef" class="header">
            <TransitionFade mode="out-in" :duration="200">
              <h2 v-if="props.title" :key="props.title" class="title">
                {{ props.title }}
              </h2>
            </TransitionFade>

            <UIButton v-if="isClose" class="button" type="ghost" tooltip="Закрыть [Esc]" @click="showed = false">
              <UIIcon name="cross" :size="1.4" />
            </UIButton>
          </div>

          <TransitionFade mode="out-in" :duration="200">
            <h3 v-if="props.subtitle" :key="props.subtitle" class="subtitle">
              {{ props.subtitle }}
            </h3>
          </TransitionFade>

          <div v-if="slots.body" class="body" :class="`layout-${props.layout}`">
            <slot name="body" />
          </div>

          <template v-if="slots.footer">
            <UIDivider axis="h" />

            <div ref="footerRef" class="footer">
              <slot name="footer" />
            </div>
          </template>
        </div>
      </div>
    </TransitionScale>
  </Teleport>
</template>

<style scoped lang="scss">
.ui-mask {
  position: fixed;
  inset: 0;
  background-color: rgba($color-gray-dark, 0.4);
}

.ui-modal-wrapper {
  display: flex;
  position: fixed;
  pointer-events: none;
  inset: 0;

  .ui-modal {
    @include transition('width');
    display: flex;
    flex-direction: column;
    margin: auto;
    padding: 20px;
    border-radius: $radius-md;
    outline: none;
    background-color: $color-white;
    box-shadow: $shadow-md;
    pointer-events: auto;
    gap: 20px;

    .header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin: -20px;
      padding: 20px;
      touch-action: manipulation;

      .title {
        flex: 1;
        font-size: $text-lg;
        font-weight: bold;
        color: $color-gray-lighter;
      }

      .button {
        margin-left: auto;
      }
    }

    .subtitle {
      color: $color-gray-dark;
      line-height: 1.5;
      text-align: center;
    }

    .body {
      display: flex;
      flex: 1;
      flex-direction: column;
      height: 0;
      gap: 10px;

      &.layout {
        &-center {
          margin: 0 auto;
        }
      }
    }

    .footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin: 0 auto;
      width: 100%;
    }
  }
}
</style>
