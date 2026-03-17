import type { IndicatorsConfig, SettingsConfig } from '@/shared/lib'

export type SchemeIndicatorColor = keyof SettingsConfig['colors']

/**
 * Состояние элемента схемы
 */
export interface SchemeIndicatorState {

  /**
   * Текст в элементе
   */
  text?: string | number

  /**
   * Цвет элемента
   */
  color?: SchemeIndicatorColor | `#${string}`

  /**
   * Непрерывная величина влияющая на цвет или уровень заполнения элемента
   */
  range?: number

  /**
   * Угол поворота элемента
   */
  rotate?: number

  /**
   * Масштаб элемента
   */
  scale?: number

  /**
   * Состояние элемента (Для хинта)
   */
  status?: string
}

/**
 * Маппинг состояний элементов схемы
 */
export type SchemeState = Record<string, SchemeIndicatorState>

export type SchemeStateExact = {
  [T in IndicatorsConfig[number] as T['id']]: Required<Pick<
    SchemeIndicatorState,
    {
      [K in keyof T['params']]: K extends keyof SchemeIndicatorState ? K : never
    }[keyof T['params']]
  >>
}
