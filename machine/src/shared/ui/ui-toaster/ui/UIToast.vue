<script setup lang="ts">
import { UIButton, UIIcon } from '@/shared/ui'
import { useUIToaster } from '@/shared/ui/ui-toaster/lib/ui-toaster'

import type { UIToastData } from '../types/ui-toast'

const props = defineProps<{
  toast: UIToastData
}>()

const { close } = useUIToaster()
const lines = computed<string[]>(
  () => props.toast.message
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean),
)
</script>

<template>
  <div class="ui-toast">
    <!--
      <div class="header">
        <h3 class="title">
          Уведомление
        </h3>

        <UIButton type="ghost" class="button" @click="close(props.toast.id)">
          <UIIcon name="cross" size="0.8" />
        </UIButton>
       </div>
      -->

    <div class="message">
      <div class="message_body">
        <p v-for="line in lines" :key="line">
          {{ line }}
        </p>
      </div>
      <UIButton type="ghost" class="button" @click="close(props.toast.id)">
        <UIIcon name="cross" size="1.0" />
      </UIButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ui-toast {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: $radius-md;
  background-color: $color-notification-bg;
  box-shadow: $shadow-notification;
  gap: 10px;

  .header {
    display: flex;
    align-items: center;

    .title {
      flex: 1;
      width: 0;
      font-weight: bold;
    }
  }

  .message {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 5px;
  }

  .message_body {
    color: $color-notification-text;
    line-height: 1.5;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
