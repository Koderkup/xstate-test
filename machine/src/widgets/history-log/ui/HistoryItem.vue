<script setup lang="ts">
import type { HistoryEvent } from '@/entities/history'

const props = defineProps<{
  event: HistoryEvent
  order: number
  initialized: boolean
}>()

const description = computed<{ label: string, value: string }>(() => {
  const { type, data } = props.event
  switch (type) {
    case 'answer':
      return {
        label: data.question,
        value: data.answer,
      }
    case 'quiz':
      return {
        label: 'Тест завершен',
        value: `Правильных ответов ${data.correct} из ${data.total}`,
      }
    case 'trigger':
      return {
        label: data.element,
        value: data.action ?? 'Выбрано неверно',
      }
    case 'stage':
      return {
        label: 'Этап завершен',
        value: data.name,
      }
    case 'penalty':
      return {
        label: data.title,
        value: data.message,
      }
    case 'optional':
      return {
        label: 'Дополнительный шаг пропущен',
        value: data.step,
      }
    case 'custom':
      return {
        label: data.message || 'Событие',
        value: data.details || '',
      }
    default:
      console.warn('Unknown event type:', type)
      return {
        label: 'Неизвестное событие',
        value: JSON.stringify(data || {}),
      }
  }
})

const colorize = ref(false)
onMounted(() => props.initialized && (colorize.value = true))
const { start } = useTimeoutFn(() => colorize.value = false, 1_000, { immediate: false })
whenever(colorize, () => start())
const score = computed(() => props.event.score)
</script>

<template>
  <div
      class="history-item"
      :class="{
      error: colorize && score !== undefined && score < 0,
      success: colorize && score !== undefined && score >= 0,
      custom: event.type === 'custom'
    }"
  >
    <div class="description">
      <div class="label">
        <span class="order">{{ props.order }}.</span> {{ description.label }}
      </div>

      <div v-if="description.value" class="value">
        {{ description.value }}
      </div>
    </div>

    <div v-if="props.event.score !== undefined && props.event.score !== 0" class="score">
      {{ props.event.score > 0 ? '+' : '' }}{{ props.event.score }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.history-item {
  display: flex;

  .description {
    display: flex;
    flex-direction: column;
    width: 230px;
    gap: 4px;

    .label {
      @include transition('color', $duration: 0.5s);
      color: var(--color, $color-gray-lighter);
      font-weight: bold;
      line-height: 1.1;

      .order {
        font-weight: bold;
      }
    }

    .value {
      @include transition('color', $duration: 0.5s);
      color: var(--color, inherit);
    }
  }

  .score {
    @include transition('color', $duration: 0.5s);
    align-self: end;
    margin-left: auto;
    color: var(--color, $color-gray-lighter);
    font-weight: bold;
    text-align: right;
  }

  &.error {
    --color: #{$color-red};
  }

  &.success {
    --color: #{$color-green};
  }
}
</style>
