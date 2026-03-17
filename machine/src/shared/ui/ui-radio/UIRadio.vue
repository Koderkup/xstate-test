<script setup lang="ts" generic="V extends  UIRadioOptionValue">
import type { UIRadioOption, UIRadioOptionValue } from './types/ui-radio-option'
import UIRadioButton from './ui/UIRadioButton.vue'

const model = defineModel<V>({ required: true })

const props = defineProps<{
  options: UIRadioOption<V>[]
}>()
</script>

<template>
  <div class="ui-radio">
    <UIRadioButton
      v-for="option in props.options"
      :key="option.value"
      v-model="model"
      :option
    />
  </div>
</template>

<style scoped lang="scss">
.ui-radio {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
