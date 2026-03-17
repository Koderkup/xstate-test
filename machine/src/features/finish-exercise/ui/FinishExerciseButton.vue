<script setup lang="ts">
import { useFinishEarlyModalStore } from '@/features/finish-exercise/model/finish-early-modal'
import { UIButton, UIIcon } from '@/shared/ui'

const props = defineProps<{
  mini: boolean
}>()

const { showed } = storeToRefs(useFinishEarlyModalStore())

const label = 'Завершить досрочно'
</script>

<template>
  <UIButton
    :tooltip="props.mini ? label : undefined"
    @click="showed = true"
  >
    <UIIcon v-if="props.mini" name="finish-early" size="0.9"/>
    <span v-else>{{ label }}</span>
  </UIButton>
</template>
