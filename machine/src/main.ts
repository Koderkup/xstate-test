import { bootstrap } from '@/app'

bootstrap()

declare module '@vue/reactivity' {
  export function readonly<T extends object>(target: T): Readonly<T>
}
