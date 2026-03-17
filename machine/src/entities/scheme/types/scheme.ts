import type { FunctionalComponent, SVGAttributes } from 'vue'

import type { SchemesConfig } from '@/shared/lib'

export type SchemeComponent = FunctionalComponent<SVGAttributes>

export type SchemeId = string

// TODO: JSDoc
export type SchemeOptions =
  | {
    type: 'main'
    component: SchemeComponent
  }
  | {
    type: 'modal'
    component: SchemeComponent
    title: string
    size: number
  }

export type SchemeMap = Record<SchemeId, SchemeOptions>

export type SchemeMainOptions = Extract<SchemeOptions, { type: 'main' }>
export type SchemeModalOptions = Extract<SchemeOptions, { type: 'modal' }>

type FilterSchemesId<T extends SchemeOptions['type']> = keyof {
  [K in keyof SchemesConfig as SchemesConfig[K] extends { type: T } ? K : never]: any
}
export type SchemeMainIdExact = FilterSchemesId<'main'>
export type SchemeModalIdExact = FilterSchemesId<'modal'>
export type SchemeIdExact = keyof SchemesConfig
