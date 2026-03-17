<script setup lang="ts">
import { useTaskStore } from '@/entities/task'
import { UIModal } from '@/shared/ui'

import { useOpenTaskModalStore } from '../model/open-task-modal'

const { showed } = storeToRefs(useOpenTaskModalStore())

const task = useTaskStore()

const mission = computed(() => task.task?.mission || 'Задание не выбрано')
</script>

<template>
  <UIModal v-if="task.task" v-model:showed="showed" title="Задание" :subtitle="mission" />
</template>
