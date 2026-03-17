import type { Arrayable } from '@vueuse/shared'

import type { SchemeIdExact } from '@/entities/scheme/@x/exercise'
import type { IndicatorsConfig } from '@/shared/lib'

export type SchemeIndicatorTransformOrigin =
  | 'center'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | `${number}px ${number}px`

/**
 * Параметры для изменения состояния элемента схемы.
 */
export interface SchemeIndicatorParams {

  /**
   * Изменение текста
   */
  text?: {
    /**
     * id элемента с текстом для замены
     */
    textId: string
  }

  /**
   * Изменение цвета элемента
   */
  color?: {
    /**
     * CSS селектор для всех элементов, которые необходимо покрасить,
     * если элемент состоит из нескольких элементов
     */
    group?: string
  }

  /**
   * Изменение уровня элемента. Позволяет изменять значение шкалы или цвет.
   * Для корректной работы изначально элемент на схеме svg должен быть полностью заполнен.
   */
  range?: {

    /**
     * Диапазон значений переменной величины
     */
    value: number[]

    /**
     * Изменение состояния шкалы (т.е. изменение высоты или ширины)
     */
    size?: {
      /**
       * Точка, относительно которой будет происходить изменение размера
       */
      origin: SchemeIndicatorTransformOrigin

      /**
       * Ось, по которой будет происходить масштабирование
       */
      axis?: 'x' | 'y'
    }

    /**
     * Изменение цвета элемента относительно переменной величины.
     */
    color?: {
      /**
       * CSS селектор для всех элементов, которые необходимо покрасить,
       * если элемент состоит из нескольких элементов
       */
      group?: string

      /**
       * Для каждого компонента палитры HSL.
       * Если указано число, то оно будет константным.
       * Если указан кортеж, то будет выбрано значение в указанном диапазоне в зависимости от переменной величины.
       *
       * @example
       * Parameters:
       * h = [0, 100], s = 50, l = 50
       *
       * value = 0 -> h = 0, s = 50, l = 50
       * value = 0.5 -> h = 50, s = 50, l = 50
       * value = 1 -> h = 100, s = 50, l = 50
       */
      hsl: {

        /**
         * Компонент hue, определяет оттенок [0, 360]
         */
        h?: Arrayable<number>

        /**
         * Компонент saturation, определяет насыщенность [0, 100]
         */
        s?: Arrayable<number>

        /**
         * Компонент lightness, определяет яркость [0, 100]
         */
        l?: Arrayable<number>
      }
    }
  }

  /**
   * Вращение элемента вокруг определенной точки
   */
  rotate?: {

    /**
     * Точка, вокруг которой будет происходить вращение
     */
    origin: SchemeIndicatorTransformOrigin
  }

  /**
   * Масштабирование элемента по определенной оси
   */
  scale?: {

    /**
     * Точка, относительно которой будет происходить масштабирование
     */
    origin: SchemeIndicatorTransformOrigin

    /**
     * Ось, по которой будет происходить масштабирование
     */
    axis?: 'x' | 'y'
  }

  /**
   * Статус (для хинта)
   */
  status?: {

    /**
     * Сам текст
     */
    text: string
  }
}

/**
 * Тип аттрибута состояния элемента, который может быть изменен
 */
export type SchemeIndicatorAttribute = keyof SchemeIndicatorParams

/**
 * Идентификатор элемента схемы
 */
export type SchemeIndicatorId = string

/**
 * Элемент схемы, который отображает состояние элемента системы для пользователя
 */
export interface SchemeIndicator {

  /**
   * Идентификатор элемента схемы для трансформации (id в svg)
   */
  id: SchemeIndicatorId

  /**
   * Идентификатор схемы, к которой принадлежит элемент
   */
  scheme: SchemeIdExact

  /**
   * Параметры для изменения состояния элемента схемы.
   * Указываются только те поля, которые можно изменять у элемента.
   */
  params: SchemeIndicatorParams
}

export type SchemeIndicatorIdExact = IndicatorsConfig[number]['id']
