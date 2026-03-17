import type { Action } from 'xstate'

import type { SchemeTriggerIdExact } from '@/entities/exercise'
import type { ProgressStepIdExact } from '@/entities/progress'
import type { SchemeMainIdExact, SchemeModalIdExact } from '@/entities/scheme'

import type { SchemeIndicatorIdExact } from '../types/scheme-indicator'
import type { SchemeIndicatorState } from '../types/scheme-state'
import type { SchemeStateExact } from '../types/scheme-state'

type GenericAction = Action<any, any, any, any, any, any, any, any, any>

/**
 * Посылает событие для создания уведомления с указанным текстом
 *
 * @param message - текст уведомления
 */
export function notify(
  message: string,
): GenericAction {
  return { type: 'notify', params: { message } }
}

/**
 * Посылает событие для записи выполнения шага
 *
 * @param id - id шага для перехода
 */
export function step(
  id: ProgressStepIdExact,
): GenericAction {
  return { type: 'step', params: { id } }
}

/**
 * Посылает событие для создания сообщения в истории о завершении этапа
 *
 * @param name - название этапа
 */
export function stage(
  name: string,
): GenericAction {
  return { type: 'stage', params: { name } }
}

// TODO: JSDoc
export function penalty(
  title: string,
  message: string,
  penalty?: number,
): GenericAction {
  return { type: 'penalty', params: { title, message, penalty } }
}

/**
 * Устанавливает svg схему для отображения
 *
 * @param id - id схемы
 */
export function main(
  id: SchemeMainIdExact,
): GenericAction {
  return { type: 'main', params: { id } }
}

/**
 * Посылает событие для открытия/закрытия модального окна со схемой.
 * При указании id открывается модалка с указанной схемой и добавляется в стек.
 * Без указания id закрывается последняя открытая модалка в стеке
 *
 * @param id - id схемы
 * @param title
 */
export function modal(
  id?: SchemeModalIdExact,
  title?: string
): GenericAction {
  return { type: 'modal', params: { id, title } }
}

/**
 * Меняет значения атрибутов по указанному индикатору
 *
 * @param id - id индикатора
 * @param state - изменяемые значения
 */
export function change<I extends SchemeIndicatorIdExact>(
  id: I,
  state: Partial<SchemeStateExact[I]> | ((state: SchemeStateExact[I]) => SchemeStateExact[I]),
): GenericAction {
  return { type: 'change', params: { id, state } }
}

/**
 * Проверяет значения атрибутов по указанному индикатору
 *
 * @param id - id индикатора
 * @param assert - проверяемые значения
 */
export function check<I extends SchemeIndicatorIdExact>(
  id: I,
  assert: Partial<SchemeStateExact[I]> | ((state: SchemeStateExact[I]) => boolean),
): GenericAction {
  return { type: 'check', params: { id, assert } }
}

/**
 * Копирует значение атрибутов из одного индикатора в другой
 *
 * @param fromId - id источника
 * @param toId - id приёмника
 * @param mapper - опционально: как преобразовать состояние источника в состояние приёмника
 */
export function copy(
  fromId: SchemeIndicatorIdExact,
  toId: SchemeIndicatorIdExact,
  mapper?: (src: SchemeIndicatorState) => Partial<SchemeIndicatorState>,
) {
  return { type: 'copy', params: { fromId, toId, mapper } }
}

/**
 * Проверяет менять статус триггера
 *
 * @param id - id индикатора
 * @param status - проверяемые значения
 */
export function status<I extends SchemeIndicatorIdExact>(
  id: I,
  status: string,
): GenericAction {
  return { type: 'status', params: { id, status } }
}

/**
 * Проверяет менять запрещать/разрешать действие
 *
 * @param action - действие
 * @param allow - статус
 */
export function allowActions(
  action: string,
  allow: boolean,
): GenericAction {
  return { type: 'allowActions', params: { action, allow } }
}

/**
 * Добавляет произвольную запись в историю
 *
 * @param message - сообщение для записи в историю
 * @param score - количество баллов
 * @param data - дополнительные данные для записи
 */
export function history(
  message: string,
  data?: Record<string, any>,
  score?: number,
): GenericAction {
  return { type: 'history', params: { message, data, score } }
}