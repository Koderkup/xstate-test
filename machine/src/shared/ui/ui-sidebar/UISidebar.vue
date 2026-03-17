<script setup lang="ts">
import { UIButton, UICard, UIDivider, UIIcon } from '@/shared/ui'
import UIButtonCollapser from "@/shared/ui/UIButtonCollapser.vue";

const collapsed = defineModel<boolean>('collapsed', { required: true })

const props = defineProps<{
  title: string
  icon: string
  theme?: 'light' | 'dark'
  collapseDirection?: 'left' | 'right'
}>()

defineSlots<{
  default: Slot
  footer: Slot
  actions: Slot
}>()

const verticalRef = shallowRef<HTMLElement>()
const { width } = useElementSize(verticalRef, undefined, {})
const mini = computed(() => {
  if (collapsed.value) return false
  return width.value < 350
})
</script>

<template>
    <!--    TODO убрать всё лишнее. Теперь это только правый сайдбар-->
  <div class="ui-sidebar" :class="[props.theme, { collapsed }]">
    <div class="main-header">
      <div class="header">
        <TransitionFade :duration="200">
          <h2 v-if="!collapsed" class="title">
            <UIIcon :name="props.icon" size="1" />
            {{ props.title }}
          </h2>
        </TransitionFade>

        <UIButtonCollapser @click="collapsed = !collapsed"
                           :collapsed="collapsed"/>
      </div>
    </div>

    <UICard full class="main">
      <UIDivider axis="h" />

      <TransitionFade :duration="{ leave: 100, enter: 200 }" mode="out-in">
        <div v-if="!collapsed" class="content">
          <div class="body">
            <slot name="default" />
          </div>
          <UIDivider axis="h" />
        </div>

        <div v-else ref="verticalRef" @click="collapsed = !collapsed" class="vertical">
          <h2 class="title">
            <UIIcon :name="props.icon" />

            <TransitionFade :duration="150">
              <span v-if="!mini">{{ props.title }}</span>
            </TransitionFade>
          </h2>

          <div class="footer">
            <slot name="footer" />
          </div>
        </div>
      </TransitionFade>
    </UICard>

    <div class="main-footer">
      <div v-if="!collapsed" class="footer">
        <slot name="footer" />
      </div>

      <div v-else ref="verticalRef" class="none">

      </div>
    </div>

    <UICard class="main-actions">
      <slot name="actions" />
    </UICard>
  </div>
</template>

<style scoped lang="scss">
.ui-sidebar {
  @include transition('width');
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 320px;

  .main-header {
    :deep(.ui-card){
      background-color: transparent;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
        height: 40px;
      background-color: $color-gray-lighter;
      transition: background-color 0.3s ease;

      .title {
        display: flex;
        flex: 1;
        align-items: center;
        width: 0;
        overflow: hidden;
        font-weight: bold;
        text-wrap: nowrap;
        gap: 10px;
        color: $color-gray-light;
      }
      :deep(.ui-button) {
        aspect-ratio: 1 / 1;
        width: 28px;
        padding: 0;
        border-radius: $radius-md;
      }

    }
  }

  .main {
    display: flex;
    flex: 1;
    flex-direction: column;

    .content {
      display: flex;
      flex: 1;
      flex-direction: column;
      height: 0;

      .body {
        display: flex;
        flex: 1;
        height: 0;
      }

      .footer {
        padding: 10px;
      }
    }

    .vertical {
      cursor: pointer;
      display: flex;
      flex: 1;
      align-items: center;
      height: 0;
      padding: 15px 0;
      letter-spacing: 1.5px;
      writing-mode: tb-rl;
      gap: 10px;
      background-color: $color-gray-lighter;
      color: $color-gray-light;
      font-weight: 500;
      transition: 0.3s ease all;



      .title {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .footer {
        margin-top: auto;
      }

    }
  }

  .main-footer{
    .footer {
      padding: 10px;
      background-color: $color-gray-lighter;
    }
  }

  &.collapsed {
    width: 28px;
    .main-header {

      .header {
        padding: 0;
        justify-content: center;
      }
      :deep(.ui-button) {
        aspect-ratio: 1 / 1;
        width: 28px;
        //padding: 0;
        border-radius: $radius-md;
      }
    }
    :deep(.ui-card){
      background-color: transparent;
    }


    .main-actions{
      :deep(.ui-button) {
        aspect-ratio: 1 / 1;
        width: 28px;
        padding: 0;
        border-radius: $radius-md;
      }
    }
    :deep(.ui-card){
      background-color: transparent;
    }
  }

  .main-actions {
    padding: 0;
    background-color: $color-gray-lighter;

  }

    .vertical:hover {
        background-color: $color-blue-darker;
    }

    .vertical:active {
        background-color: $color-blue-lighter;
    }
}
</style>
