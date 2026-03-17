<script setup lang="ts">
const props = defineProps<{
  name: string
  size?: string | number
  color?: string
}>()

const modules = import.meta.glob('@/shared/assets/icons/*.svg', { eager: true })

const icons = Object.fromEntries(
  Object.entries(modules).map(([path, component]) => {
    const name = path.split('/').pop()!.replace('.svg', '')
    return [name, component as any]
  }),
) as Record<string, any>

const IconComponent = computed(() => icons[props.name] ?? null)
</script>

<template>
  <component
    :is="IconComponent"
    v-if="IconComponent"
    v-bind="$attrs"
    :style="{
      scale: props.size,
      color: props.color || 'currentColor',
    }"
  />
</template>
