<script setup lang="ts">
import { useFlags, useTeleport } from '@/shared/lib'

import { useUIToaster } from './lib/ui-toaster'
import UIToast from './ui/UIToast.vue'

const flags = useFlags()

const { toasts } = useUIToaster()

const { root } = useTeleport()

const initialized = ref(false)
onMounted(() => initialized.value = true)
</script>

<template>
  <teleport :to="root">
    <div v-auto-animate="{ duration: flags.get('animate') ? 200 : 0 }" class="ui-toaster">
      <template v-if="initialized">
        <UIToast v-for="toast in toasts" :key="toast.id" class="toast" :toast />
      </template>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.ui-toaster {
  display: flex;
  position: fixed;
  z-index: 10;
  top: 70px;
  right: 350px;
  flex-direction: column;
  width: 305px;
  height: 100%;
  pointer-events: none;
  gap: 10px;

  .button {
    pointer-events: auto;
  }

  .toast {
    pointer-events: auto;
  }
}
</style>
