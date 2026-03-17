import type { SchemeIdExact } from '@/entities/scheme/@x/exercise'
import type { TriggersConfig } from '@/shared/lib'

/**
 * Вид дополнительного эффекта взаимодействия
 */
export type SchemeTriggerEffect =
/**
 * Добавляет псевдосостояния кнопки
 */
  | 'button' | 'input' | 'sidebar-button' | 'range'

/**
 * Действие, которое можно выполнить на элементе
 */
export interface SchemeTriggerAction {
  /**
   * Внутреннее название действия, для отлова события его выполнения
   */
  value: string

  /**
   * Человекочитаемое название действия
   */
  label: string
}

/**
 * id элемента, с которого нужно считывать клик
 */
export type SchemeTriggerId = string

/**
 * Элемент схемы, с которым может взаимодействовать пользователь
 */
export interface SchemeTrigger {
  /**
   * id элемента, с которого нужно считывать клик (id в svg)
   */
  id: SchemeTriggerId

  /**
   * id схемы, в которой находится элемент
   */
  scheme: SchemeIdExact

  /**
   * Название элемента
   */
  name: string

  /**
   * Действия, которые можно выполнить на элементе
   */
  actions: SchemeTriggerAction[]

  /**
   * Добавляет дополнительный эффект взаимодействия
   */
  effect?: SchemeTriggerEffect

  /**
   * Включает режим мгновенного подтверждения для трригера
   */
  immediate?: boolean

  /**
   * Ожидаемое значение или ожидаемый диапазон значений из input-а
   */
  expected?: string | number | [number, number]

  /**
   * id индикатора
   */
  indicatorId?: string

  /**
   * Убрать хинт
   */
  remoteHint?: boolean
}

export type SchemeTriggerIdExact = TriggersConfig[number]['id']

export type SchemeTriggerExact = SchemeTrigger[]

export type SchemeTriggerEventExact = TriggersConfig[number] extends infer T
  ? T extends { id: infer Id, actions: Array<infer Action> }
    ? Id extends string
      ? Action extends { value: infer Value }
        ? Value extends string
          ? `${Id}.${Value}`
          : never
        : never
      : never
    : never
  : never
