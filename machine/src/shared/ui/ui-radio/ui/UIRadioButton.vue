<script setup lang="ts" generic="V extends  UIRadioOptionValue">
import type { UIRadioOption, UIRadioOptionValue } from '../types/ui-radio-option'

const model = defineModel<V>({ required: true })

const props = defineProps<{
  option: UIRadioOption<V>
}>()

const id = useId()
</script>

<template>
  <label :for="id" class="ui-radio-button" @click.prevent="model = props.option.value">
    <button :id="id" class="button" type="button">
      <TransitionScale :scale="0.5">
        <div v-if="model === props.option.value" class="inner" />
      </TransitionScale>
    </button>

    <span class="label">{{ props.option.label }}</span>
  </label>
</template>

<style scoped lang="scss">
.ui-radio-button {
  display: flex;
  align-items: center;
  padding: 5px 0;
  text-wrap: nowrap;
  cursor: pointer;
  gap: 10px;

  .button {
    @include border();
    @include size(16px);
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    outline: none;
    background-color: white;
    cursor: pointer;

    .inner {
      display: block;
      flex-shrink: 0;
      border-radius: 50%;
      background-color: $color-gray-dark;
      @include size(10px);
    }
  }

  .label {
    line-height: 1.2;
    text-wrap: wrap;
  }
}
</style>
