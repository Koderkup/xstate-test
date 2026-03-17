<script setup lang="ts">
import { UIButton, UIIcon } from '@/shared/ui'

const props = defineProps<{
  mini: boolean
}>()

const label = 'Инструкция'
</script>

<template>
  <UIButton disabled :tooltip="props.mini ? label : undefined">
    <UIIcon v-if="props.mini" name="training" size="1.2" />

    <span v-else>{{ label }}</span>
  </UIButton>
</template>
