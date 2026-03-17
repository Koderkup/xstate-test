<script setup lang="ts">
import { useConfigs } from '@/shared/lib'
import { UIButton, UIIcon } from '@/shared/ui'

import { useSelectTaskModalStore } from '../model/select-task-modal'

const props = defineProps<{
  mini: boolean
}>()

const configs = useConfigs()
const selectTaskModalStore = useSelectTaskModalStore()

const { showed } = storeToRefs(selectTaskModalStore)

const label = 'Выбор задания'
</script>

<template>
  <UIButton v-if="configs.get('tasks').length > 1" :tooltip="props.mini ? label : undefined" @click="showed = true">
    <UIIcon v-if="props.mini" name="choice" size="1.2" />

    <span v-else>{{ label }}</span>
  </UIButton>
</template>