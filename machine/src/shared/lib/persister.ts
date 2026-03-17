import type { Serializer } from '@vueuse/core'

import { useConfigs } from '../lib/configs'
import { useScorm12Store } from '@/features/scorm12/model/scorm12'
import { isLMS } from './configs'
export type StorageKey = string

export function usePersister<T>(key: StorageKey): Ref<T | undefined>
export function usePersister<T>(key: StorageKey, initial: T): Ref<T>
export function usePersister<T>(key: StorageKey, initial: {}): Ref<T>
export function usePersister<T>(key: StorageKey, initial?: T): Ref<T | undefined> {
  //todo
  // if (import.meta.env.DEV) {
  //   return shallowRef(initial)
  // }

  // console.log("isMoodle", isLMS)
  if (isLMS) {
    return useScorm12Store().getByKey(key, initial)
  }

  const configs = useConfigs()
  const path = computed<string>(() => `${configs.get('settings').storage}:${key}`)

  const serializer: Serializer<T | undefined> = {
    read: (v: string) => (v === '') ? undefined : JSON.parse(v),
    write: (v: T | undefined) => v === undefined ? '' : JSON.stringify(v),
  }

  return useLocalStorage(
    path,
    () => initial ?? serializer.read(localStorage.getItem(path.value) ?? ''),
    {
      writeDefaults: false,
      shallow: true,
      deep: false,
      listenToStorageChanges: false,
      serializer,
    },
  )
}
