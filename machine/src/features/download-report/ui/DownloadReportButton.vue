<script setup lang="ts">
import { downloadReport } from '@/features/download-report'
import { UIButton, UIIcon } from '@/shared/ui'

const props = defineProps<{
  mini: boolean
}>()

function report(): void {
  downloadReport()
}

const label = 'Отчет'
</script>

<template>
  <UIButton :tooltip="props.mini ? label : undefined" @click="report">
    <UIIcon v-if="props.mini" name="report" size="1.2"/>

    <span v-else>{{ label }}</span>
  </UIButton>
</template>
