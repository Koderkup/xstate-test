<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import { useProgressStore } from '@/entities/progress'
import { GotoStepButton } from '@/features/goto-step'
import { useFlags } from '@/shared/lib'
import { UICard, UIIcon, UIScrollbar } from '@/shared/ui'

const flags = useFlags()
const progress = useProgressStore()

const scrollContainer = ref<HTMLElement | null>(null)
const scrollWrapper = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const scrollInterval = ref<NodeJS.Timeout | null>(null)

function checkScroll() {
  if (!scrollContainer.value || !scrollWrapper.value)
    return

  const container = scrollContainer.value
  const wrapper = scrollWrapper.value

  const containerWidth = container.clientWidth
  const wrapperWidth = wrapper.scrollWidth
  const scrollLeft = container.scrollLeft

  canScrollLeft.value = scrollLeft > 0
  canScrollRight.value = scrollLeft < wrapperWidth - containerWidth - 1
}

function scrollBy(pixels: number) {
  if (!scrollContainer.value)
    return

  scrollContainer.value.scrollBy({
    left: pixels,
    behavior: 'smooth',
  })
}

function startContinuousScroll(pixels: number) {
  if (scrollInterval.value) {
    clearInterval(scrollInterval.value)
  }

  scrollBy(pixels)

  scrollInterval.value = setInterval(() => {
    scrollBy(pixels)
  }, 150)
}

function stopContinuousScroll() {
  if (scrollInterval.value) {
    clearInterval(scrollInterval.value)
    scrollInterval.value = null
  }
}

function handleMouseDown(direction: 'left' | 'right') {
  const pixels = direction === 'left' ? -190 : 190
  startContinuousScroll(pixels)
}

function handleMouseUp() {
  stopContinuousScroll()
}

function handleTouchStart(direction: 'left' | 'right') {
  const pixels = direction === 'left' ? -190 : 190
  startContinuousScroll(pixels)
}

function handleTouchEnd() {
  stopContinuousScroll()
}

watch(() => progress.steps, () => {
  nextTick(() => {
    checkScroll()
  })
}, { deep: true })

function handleResize() {
  checkScroll()
}

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', handleResize)

    nextTick(() => {
      checkScroll()
    })
  }
})

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', checkScroll)
  }
  window.removeEventListener('resize', handleResize)
  stopContinuousScroll()
})
</script>

<template>
  <UICard v-if="flags.get('admin')" class="step-navigation">
    <h2 class="label">
      Перейти на шаг:
    </h2>

    <div class="navigation-content">
      <button
        v-if="canScrollLeft"
        class="scroll-button scroll-button-left"
        @click="scrollBy(-190)"
        @mousedown="handleMouseDown('left')"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @touchstart="handleTouchStart('left')"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
      >
        <UIIcon name="chevrone-left" />
      </button>

      <button
        v-else-if="canScrollRight"
        class="scroll-button scroll-button-left disabled"
        disabled
      >
        <UIIcon name="lower-scroller" class="disabled-icon" size="1.3" />
      </button>

      <div class="scroll-area">
        <UIScrollbar axis="x" outside>
          <div
            ref="scrollContainer"
            class="scroll-container"
            @scroll="checkScroll"
          >
            <div
              ref="scrollWrapper"
              class="wrapper"
            >
              <GotoStepButton v-for="step in progress.steps" :key="step.id" :step="step" />
            </div>
          </div>
        </UIScrollbar>
      </div>

      <button
        v-if="canScrollRight"
        class="scroll-button scroll-button-right"
        @click="scrollBy(190)"
        @mousedown="handleMouseDown('right')"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @touchstart="handleTouchStart('right')"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
      >
        <UIIcon name="shevrone-right" />
      </button>

      <button
        v-else-if="canScrollLeft"
        class="scroll-button scroll-button-right disabled"
        disabled
      >
        <UIIcon name="lower-scroller-right" class="disabled-icon" size="1.3" />
      </button>
    </div>
  </UICard>
</template>

<style scoped lang="scss">
.step-navigation {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: $color-gray-lighter;
  width: 100%;

  .label {
    color: $color-gray-light;
    font-weight: bold;
    margin: 0;
  }

  .navigation-content {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .scroll-area {
    flex: 1;
    min-width: 0;
  }

  .scroll-container {
    width: 100%;
    overflow-x: auto;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .wrapper {
    display: flex;
    min-width: fit-content;
    gap: 10px;
  }

  .scroll-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
    color: $color-white;
    scale: 1.3;
    border-radius: $radius-md;
    &:hover:not(:disabled) {
      //transform: scale(1.05);
      background-color: $color-blue-darker;
    }

    &:active:not(:disabled) {
      //transform: scale(0.95);
      background-color: $color-blue-lighter;
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
      display: none;
      color: $color-gray-light;
    }

    .disabled-icon {
      color: $color-gray-light;
    }
  }

  .scroll-button-left.disabled {
    display: flex;
  }

  .scroll-button-right.disabled {
    display: flex;
  }
}
</style>
