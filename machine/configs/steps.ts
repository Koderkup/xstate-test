import type { ProgressStep } from '@/entities/progress'
import type { ExerciseTaskIdExact } from '@/entities/task'

export const STEPS_CONFIG = {
  'engine-warm': [
    {
      id: 1,
      quiz: true,
    },
    {
      id: 2,
      title: 'Подключить охлаждающую воду',
      events: ['button_water.on'],
      penalty: -2,
    },
    {
      id: 3,
      title: 'Заполнить маслом левый узел',
      events: Array.from({ length: 8 }, () => 'button_oil.click'),
    },
    {
      id: 4,
      title: 'Заполнить маслом правый узел',
      events: Array.from({ length: 8 }, () => 'button_oil_2.click'),
    },
    {
      id: 5,
      title: 'Ввести значение в поле',
      events: ['panel__2.input'],
      skipHistory: true,
    },
    {
      id: 6,
      title: 'Набрать скорость 500 об/мин',
      events: ['valve_10.500'],
    },

    {
      id: 7,
      title: 'Набрать скорость 3000 об/мин',
      events: ['valve_10.3000'],
    },
    {
      id: 8,
      title: 'Взвести автомат безопасности',
      events: ['equipment_9.raise'],
    },
    {
      id: 9,
      title: 'Открыть клапан 1',
      events: ['valve_1.open'],
    },
    {
      id: 10,
      title: 'Приоткрыть клапан 2',
      events: ['valve_2_2.partially'],
      optional: true,
      penalty: -3,
    },
    {
      id: 11,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 12,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 13,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 14,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 15,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 16,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 17,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 18,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 19,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 20,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 21,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 22,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 23,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 24,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 25,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 26,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 27,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 28,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 29,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 30,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 31,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
    {
      id: 32,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
  ],
  'engine-start': [
    {
      id: 1,
      quiz: true,
    },
    {
      id: 2,
      title: 'Подключить охлаждающую воду',
      events: ['button_water.on'],
    },
    {
      id: 3,
      title: 'Заполнить маслом левый узел',
      events: Array.from({ length: 8 }, () => 'button_oil.click'),
    },
    {
      id: 4,
      title: 'Заполнить маслом правый узел',
      events: Array.from({ length: 8 }, () => 'button_oil_2.click'),
    },
    {
      id: 6,
      title: 'Набрать скорость 500 об/мин',
      events: ['valve_10.500'],
    },
    {
      id: 7,
      title: 'Набрать скорость 3000 об/мин',
      events: ['valve_10.3000'],
    },
    {
      id: 8,
      title: 'Взвести автомат безопасности',
      events: ['equipment_9.raise'],
    },
    {
      id: 9,
      title: 'Открыть клапан 1',
      events: ['valve_1.open'],
    },
    {
      id: 10,
      title: 'Приоткрыть клапан 2',
      events: ['valve_2_2.partially'],
      optional: true,
    },
    {
      id: 11,
      title: 'Открыть клапан 3',
      events: ['valve_3.open', 'button_deformation.click'],
    },
  ],
  'hydraulic-test': [
    // Шаг 1 - только осмотр, без событий
    { id: 1, auto: true, title: 'Осмотр оборудования', events: ['button_21.click', 'button_22.click'] },

    // Шаг 2 - параллельное закрытие 21 и 22
    { id: 2, title: 'Закрыть задвижки 21 и 22', events: ['button_21.click', 'button_22.click'] },

    // Шаг 3 - открытие клапана
    { id: 3, title: 'Открыть клапан 00R11S001 на 5-10%', events: ['button_99.click'] },

    // Подшаг 3.1 - закрытие дренажа №1
    { id: 3.1, title: 'Закрыть дренаж №1', events: ['button_1.click'] },

    // Шаг 4 - закрыть воздушник №2
    { id: 4, title: 'Закрыть воздушник №2', events: ['button_2.click'] },

    // Шаг 5 - закрыть дренаж №3 (исправлено, было "Открыть задвижку №2")
    { id: 5, title: 'Закрыть дренаж №3', events: ['button_3.click'] },

    // Шаг 6 - закрыть дренаж №5
    { id: 6, title: 'Закрыть дренаж №5', events: ['button_5.click'] },

    // Шаг 7 - пропущен в сценарии

    // Шаг 8 - закрыть воздушник №6
    { id: 8, title: 'Закрыть воздушник №6', events: ['button_6.click'] },

    // Шаг 9 - закрыть №7
    { id: 9, title: 'Закрыть №7', events: ['button_7.click'] },

    // Шаг 10 - закрыть №8
    { id: 10, title: 'Закрыть №8', events: ['button_8.click'] },

    // Шаг 11 - закрыть №9
    { id: 11, title: 'Закрыть №9', events: ['button_9.click'] },

    // Шаг 12 - закрыть №10
    { id: 12, title: 'Закрыть №10', events: ['button_10.click'] },

    // Шаг 13 - пуск ПЭН
    { id: 13, title: 'Пуск ПЭН на циркуляцию', events: ['button_98.click'] },

    // Шаг 14 - закрыть дренаж №11
    { id: 14, title: 'Закрыть дренаж №11', events: ['button_11.click'] },

    // Шаг 15 - закрыть воздушник №12
    { id: 15, title: 'Закрыть воздушник №12', events: ['button_12.click'] },

    // Шаг 16 - закрыть воздушник №14
    { id: 16, title: 'Закрыть воздушник №14', events: ['button_14.click'] },

    // Шаг 17 - закрыть воздушник №16
    { id: 17, title: 'Закрыть воздушник №16', events: ['button_16.click'] },

    // Шаг 18 - закрыть воздушник №17
    { id: 18, title: 'Закрыть воздушник №17', events: ['button_17.click'] },

    // Шаг 19 - закрыть воздушник №18
    { id: 19, title: 'Закрыть воздушник №18', events: ['button_18.click'] },

    // Шаг 20 - закрыть воздушник №19
    { id: 20, title: 'Закрыть воздушник №19', events: ['button_19.click'] },

    // Шаг 21 - закрыть воздушник №20
    { id: 21, title: 'Закрыть воздушник №20', events: ['button_20.click'] },

    // Шаг 22 - закрыть свечу XV-114
    { id: 22, title: 'Закрыть свечу XV-114', events: ['button_97.click'] },

    // Шаг 23 - закрыть свечу VP-2 (начало испытаний)
    { id: 23, title: 'Закрыть свечу VP-2', events: ['button_96.click'] },

    // Шаг 24 - остановить ПЭН
    { id: 24, title: 'Остановить ПЭН', events: ['button_98.click'] },

    // Шаг 25 - финальный осмотр (авто)
    { id: 25, auto: true, title: 'Визуальный обход' },
  ],
} as const satisfies Record<ExerciseTaskIdExact, ProgressStep[]>
