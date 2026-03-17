<script setup lang="ts">
import { useTriggerElementStore } from '@/features/trigger-element'
import { useConfigs } from '@/shared/lib'
import {UIButton, UIIcon} from '@/shared/ui'

const { interact } = useTriggerElementStore()

const props = defineProps<{
  mini: boolean
}>()

const triggers = computed(() => useConfigs().get('triggers'))

const virtualTriggers = computed(() => {
  return triggers.value.filter(t => t.effect === 'sidebar-button')
})

function onClick(trigger) {
  interact({
    ...trigger,
  })
}
</script>

<template>
    <div class="operator-triggers" :class="{ mini: props.mini }">
      <template v-if="!props.mini">
        <UIButton
            v-for="t in virtualTriggers"
            :key="t.id"
            @click="onClick(t)"
            type="sidebar"
        >
          {{ t.name }}
        </UIButton>
      </template>

    </div>
</template>

<style scoped>
.operator-triggers {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;

  .collapsed-label {
    writing-mode: vertical-rl;
    text-align: center;
    font-weight: 600;
    color: black;
    transform: rotate(180deg);
  }
}


</style>
