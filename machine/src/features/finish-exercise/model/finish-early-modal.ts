import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFinishEarlyModalStore = defineStore('finishEarlyModal', () => {
  const showed = ref(false)
  return { showed }
})
