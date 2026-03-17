<script setup lang="ts">
import { UIButton, UIIcon } from '@/shared/ui'

import { useOpenTaskModalStore } from '../model/open-task-modal'
import { useConfigs } from '@/shared/lib'
import {useTaskStore} from "@/entities/task";


const props = defineProps<{
  mini: boolean
}>()

const { showed } = storeToRefs(useOpenTaskModalStore())
onMounted(() => {
  // показываем текст задания
  // или если всего один тип задания существует (без select - сразу показываем условие)
  // или после перезагрузки страницы, если задание уже было выбрано ранее
  const len = useConfigs().get('tasks')?.length
  if (+len === 1 || useTaskStore().id)  {
    showed.value = true
  }
})
</script>

<template>
  <UIButton :tooltip="props.mini ? 'Задание' : undefined" @click="showed = true">
    <UIIcon v-if="props.mini" name="task" size="0.9" />

    <span v-else>
      Задание
    </span>
  </UIButton>
</template>
