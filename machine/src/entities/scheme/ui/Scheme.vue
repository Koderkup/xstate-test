<script setup lang="ts">
import type { SchemeComponent } from '../types/scheme'

const props = defineProps<{
  component: SchemeComponent
}>()
</script>

<template>
  <component :is="props.component" />
</template>
