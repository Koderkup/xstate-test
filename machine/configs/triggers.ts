import type { SchemeTrigger } from '@/entities/exercise'

export const TRIGGERS_CONFIG = [
  {
    id: 'button_water',
    scheme: 'Основная',
    name: 'Кнопка "Подключение охлаждающей воды"',
    actions: [
      { value: 'on', label: 'Вкл' },
      { value: 'off', label: 'Выкл' },
    ],
    effect: 'sidebar-button',
  },
  {
    id: 'button_water1', // для проверки
    scheme: 'Основная',
    name: 'Кнопка "Подключение горячей воды"',
    actions: [
      { value: 'on', label: 'Вкл' },
      { value: 'off', label: 'Выкл' },
    ],
    effect: 'sidebar-button',
  },
  {
    id: 'button_oil',
    scheme: 'Основная',
    name: 'Кнопка "Заполнение маслом"',
    // status: 'Статус', // Тот самый статус
    actions: [{ value: 'click', label: 'Нажать на кнопку' }],
    effect: 'button',
  },
  {
    id: 'button_oil_2',
    scheme: 'Основная',
    name: 'Кнопка "Заполнение маслом"',
    actions: [{ value: 'click', label: 'Нажать на кнопку' }],
    effect: 'button',
  },
  {
    id: 'turbine',
    scheme: 'Основная',
    name: 'Турбина',
    actions: [{ value: 'click', label: 'Нажать на турбину' }],
  },
  {
    id: 'valve_10',
    scheme: 'Основная',
    name: 'Кнопка 10',
    actions: [
      { value: '500', label: 'Набрать 500 об/мин' },
      { value: '3000', label: 'Набрать 2950 - 3000 об/мин' },
    ],
  },
  {
    id: 'valve_1',
    scheme: 'Основная',
    name: 'Кнопка 1',
    actions: [
      { value: 'partially', label: 'Приоткрыть' },
      { value: 'open', label: 'Открыть' },
      { value: 'close', label: 'Закрыть' },
    ],
  },
  {
    id: 'valve_2_2',
    scheme: 'Основная',
    name: 'Кнопка 2',
    actions: [
      { value: 'partially', label: 'Приоткрыть' },
      { value: 'open', label: 'Открыть' },
      { value: 'close', label: 'Закрыть' },
    ],
  },
  {
    id: 'valve_3',
    scheme: 'Основная',
    name: 'Кнопка 3',
    actions: [
      { value: 'partially', label: 'Приоткрыть' },
      { value: 'open', label: 'Открыть' },
      { value: 'close', label: 'Закрыть' },
    ],
  },
  {
    id: 'equipment_9',
    scheme: 'Основная',
    name: 'Автомат безопасности',
    actions: [{ value: 'raise', label: 'Взвести' }],
  },
  {
    id: 'button_deformation',
    scheme: 'ГТУ 8',
    name: 'Квитация нарушения ГТУ-8',
    actions: [{ value: 'click', label: 'Нажать на кнопку' }],
    effect: 'button',
  },
  {
    id: 'panel__2',
    scheme: 'Основная',
    name: 'Поле ввода',
    actions: [{ value: 'input', label: 'Ввести значение' }],
    effect: 'input',
  },
  // Кнопки для гидравлических испытаний (схема "Гидравлическая")
  {
    id: 'button_1',
    scheme: 'Гидравлическая',
    name: 'Кнопка №1 (Дренаж №1)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_2',
    scheme: 'Гидравлическая',
    name: 'Кнопка №2 (Воздушник №2)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_3',
    scheme: 'Гидравлическая',
    name: 'Кнопка №3 (Дренаж №3)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_5',
    scheme: 'Гидравлическая',
    name: 'Кнопка №5 (Дренаж №5)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_6',
    scheme: 'Гидравлическая',
    name: 'Кнопка №6 (Воздушник №6)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_7',
    scheme: 'Гидравлическая',
    name: 'Кнопка №7 (Задвижка №7)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_8',
    scheme: 'Гидравлическая',
    name: 'Кнопка №8 (Задвижка №8)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_9',
    scheme: 'Гидравлическая',
    name: 'Кнопка №9 (Задвижка №9)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_10',
    scheme: 'Гидравлическая',
    name: 'Кнопка №10 (Задвижка №10)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_11',
    scheme: 'Гидравлическая',
    name: 'Кнопка №11 (Дренаж №11)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_12',
    scheme: 'Гидравлическая',
    name: 'Кнопка №12 (Воздушник №12)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_14',
    scheme: 'Гидравлическая',
    name: 'Кнопка №14 (Воздушник №14)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_16',
    scheme: 'Гидравлическая',
    name: 'Кнопка №16 (Воздушник №16)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_17',
    scheme: 'Гидравлическая',
    name: 'Кнопка №17 (Воздушник №17)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_18',
    scheme: 'Гидравлическая',
    name: 'Кнопка №18 (Воздушник №18)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_19',
    scheme: 'Гидравлическая',
    name: 'Кнопка №19 (Воздушник №19)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_20',
    scheme: 'Гидравлическая',
    name: 'Кнопка №20 (Воздушник №20)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_21',
    scheme: 'Гидравлическая',
    name: 'Кнопка №21 (Задвижка №21)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_22',
    scheme: 'Гидравлическая',
    name: 'Кнопка №22 (Задвижка №22)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_96',
    scheme: 'Гидравлическая',
    name: 'Кнопка №96 (Свеча VP-2)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_97',
    scheme: 'Гидравлическая',
    name: 'Кнопка №97 (Свеча XV-114)',
    actions: [{ value: 'click', label: 'Нажать' }],
    effect: 'button',
  },
  {
    id: 'button_98',
    scheme: 'Гидравлическая',
    name: 'Кнопка №98 (ПЭН)',
    actions: [{ value: 'click', label: 'Пуск/Стоп' }],
    effect: 'button',
  },
  {
    id: 'button_99',
    scheme: 'Гидравлическая',
    name: 'Кнопка №99 (Клапан 00R11S001)',
    actions: [{ value: 'click', label: 'Открыть клапан' }],
    effect: 'button',
  },
  // hydraulic panel buttons
  // Кнопка "Да"
  {
    id: 'button_da',
    scheme: 'Гидропанель',
    name: 'Подтвердить (Да)',
    actions: [{ value: 'click', label: 'Да' }],
    effect: 'button',
  },

  // Кнопка "Отмена"
  {
    id: 'button_otmena',
    scheme: 'Гидропанель',
    name: 'Отмена',
    actions: [{ value: 'click', label: 'Отмена' }],
    effect: 'button',
  },

  // Кнопка -5
  {
    id: '-5',
    scheme: 'Гидропанель',
    name: 'Уменьшить на 5%',
    actions: [{ value: 'click', label: '-5' }],
    effect: 'button',
  },

  // Кнопка -1
  {
    id: '-1',
    scheme: 'Гидропанель',
    name: 'Уменьшить на 1%',
    actions: [{ value: 'click', label: '-1' }],
    effect: 'button',
  },

  // Кнопка +1
  {
    id: '1',
    scheme: 'Гидропанель',
    name: 'Увеличить на 1%',
    actions: [{ value: 'click', label: '+1' }],
    effect: 'button',
  },

  // Кнопка +5
  {
    id: '5',
    scheme: 'Гидропанель',
    name: 'Увеличить на 5%',
    actions: [{ value: 'click', label: '+5' }],
    effect: 'button',
  },

  {
    id: 'valve_OORL11S001',
    scheme: 'Гидравлическая',
    name: 'Клапан 00R11S001',
    actions: [{ value: 'click', label: 'Открыть клапан' }],
    effect: 'button',
    immediate: true,
  },
  {
    id: 'pump',
    scheme: 'Гидравлическая',
    name: 'ПЭН №1 (Питательный насос)',
    actions: [
      { value: 'start', label: 'Пуск' },
      { value: 'stop', label: 'Стоп' },
    ],
    effect: 'button',
  },
] as const satisfies SchemeTrigger[]
